/**
 * Server state заявок: карта заявок и справочники + действия-мутации.
 * Все изменения применяются оптимистично: сначала в store (мгновенный UI),
 * затем запрос к API; при ошибке — rollback к снимку предыдущего значения.
 */
import { defineStore } from 'pinia'
import type {
  RequestComment,
  RequestPriority,
  RequestStatus,
  SupportRequest,
} from '~/types'
import type {
  ApiCategory,
  ApiCustomer,
  ApiRequest,
  ApiRequestDetailResponse,
  ApiRequestListResponse,
  ApiUser,
} from '~~/shared/types/api'
import { createLookup, mapComment, mapRequest, mapRequestDetail } from '~/utils/apiMappers'

/** Причина отката мутации — для сообщения в баннере. */
export interface MutationFailure {
  kind: 'conflict' | 'server' | 'rate-limit' | 'network' | 'unknown'
  statusCode: number
}

export interface UndoSnapshot {
  requestId: string
  field: 'status' | 'priority'
  previousValue: string
  newValue: string
}

function classifyError(error: unknown): MutationFailure {
  const statusCode =
    typeof error === 'object' && error !== null && 'statusCode' in error
      ? Number((error as { statusCode?: unknown }).statusCode)
      : 0

  if (statusCode === 409) return { kind: 'conflict', statusCode }
  if (statusCode === 429) return { kind: 'rate-limit', statusCode }
  if (statusCode >= 500) return { kind: 'server', statusCode }
  if (statusCode === 0) return { kind: 'network', statusCode }
  return { kind: 'unknown', statusCode }
}

export interface RequestsPatchPayload {
  status?: RequestStatus
  priority?: RequestPriority
  assigneeId?: string | null
}

export const useRequestsStore = defineStore('requests', () => {
  // server state — единственный источник заявок на клиенте.
  const byId = ref(new Map<string, SupportRequest>())
  const users = ref<ApiUser[]>([])
  const customers = ref<ApiCustomer[]>([])
  const categories = ref<ApiCategory[]>([])

  // Последнее изменение статуса/приоритета — для Undo.
  const undoSnapshot = ref<UndoSnapshot | null>(null)

  function clearUndo(): void {
    undoSnapshot.value = null
  }

  /** Загружает список (GET /api/requests) в карту. */
  function setList(response: ApiRequestListResponse): void {
    const lookup = createLookup(response.users, response.customers, response.categories)
    users.value = response.users
    customers.value = response.customers
    categories.value = response.categories
    for (const apiRequest of response.items) {
      byId.value.set(apiRequest.id, mapRequest(apiRequest, lookup))
    }
  }

  /** Загружает карточку (GET /api/requests/:id) в карту. */
  function setDetail(response: ApiRequestDetailResponse): SupportRequest {
    users.value = response.users
    customers.value = response.customers
    categories.value = response.categories
    const mapped = mapRequestDetail(response)
    byId.value.set(mapped.id, mapped)
    return mapped
  }

  function get(id: string): SupportRequest | null {
    return byId.value.get(id) ?? null
  }

  /** Применяет поля ответа PATCH к доменной модели в карте. */
  function applyApiRequest(apiRequest: ApiRequest): void {
    const existing = byId.value.get(apiRequest.id)
    if (!existing) return
    const lookup = createLookup(users.value, customers.value, categories.value)
    byId.value.set(apiRequest.id, { ...mapRequest(apiRequest, lookup), comments: existing.comments, timeline: existing.timeline })
  }

  /**
   * Общий optimistic-механизм: snapshot → мгновенный патч → запрос → rollback.
   * Возвращает false при ошибке (значение уже восстановлено).
   */
  async function mutate(
    id: string,
    optimisticPatch: (request: SupportRequest) => SupportRequest,
    applyServerResponse: (request: SupportRequest, apiRequest: ApiRequest) => SupportRequest,
    apiCall: () => Promise<ApiRequest>,
    undoField?: 'status' | 'priority',
  ): Promise<boolean> {
    const before = byId.value.get(id)
    if (!before) return false

    const snapshot: SupportRequest = {
      ...before,
      comments: [...before.comments],
      timeline: [...before.timeline],
    }

    // 1. Мгновенно применяем изменение — UI обновляется без ожидания.
    byId.value.set(id, optimisticPatch({ ...snapshot }))

    // 2. Запрос к API.
    try {
      const apiRequest = await apiCall()
      applyApiRequest(apiRequest)
      return true
    }
    catch (error) {
      // 3. Откат к предыдущему значению.
      byId.value.set(id, snapshot)
      lastFailure.value = classifyError(error)
      if (undoField && undoSnapshot.value?.requestId === id && undoSnapshot.value.field === undoField) {
        undoSnapshot.value = null
      }
      return false
    }
  }

  const lastFailure = ref<MutationFailure | null>(null)
  function clearFailure(): void {
    lastFailure.value = null
  }

  /** Смена статуса. Возвращает Undo-снимок для баннера или null при ошибке. */
  async function updateStatus(id: string, status: RequestStatus): Promise<UndoSnapshot | null> {
    const current = byId.value.get(id)
    if (!current || current.status === status) return null

    const previousStatus = current.status
    undoSnapshot.value = { requestId: id, field: 'status', previousValue: previousStatus, newValue: status }

    const ok = await mutate(
      id,
      request => ({ ...request, status }),
      (request, apiRequest) => ({ ...request, status: apiRequest.status, updatedAt: apiRequest.updatedAt }),
      () => $fetch<ApiRequest>(`/api/requests/${id}`, { method: 'PATCH', body: { status } }),
      'status',
    )

    return ok ? undoSnapshot.value : null
  }

  /** Смена приоритета (optimistic update — обязательное требование уровня). */
  async function updatePriority(id: string, priority: RequestPriority): Promise<UndoSnapshot | null> {
    const current = byId.value.get(id)
    if (!current || current.priority === priority) return null

    const previousPriority = current.priority
    undoSnapshot.value = { requestId: id, field: 'priority', previousValue: previousPriority, newValue: priority }

    const ok = await mutate(
      id,
      request => ({ ...request, priority }),
      (request, apiRequest) => ({ ...request, priority: apiRequest.priority, dueAt: apiRequest.dueAt, updatedAt: apiRequest.updatedAt }),
      () => $fetch<ApiRequest>(`/api/requests/${id}`, { method: 'PATCH', body: { priority } }),
      'priority',
    )

    return ok ? undoSnapshot.value : null
  }

  /** Смена исполнителя. */
  async function updateAssignee(id: string, assigneeId: string | null): Promise<boolean> {
    const current = byId.value.get(id)
    if (!current) return false

    const resolvedId = assigneeId === 'none' ? null : assigneeId
    if (current.assigneeId === resolvedId) return true

    const name = resolvedId
      ? (users.value.find(user => user.id === resolvedId)?.name ?? null)
      : null

    return mutate(
      id,
      request => ({ ...request, assigneeId: resolvedId, assignee: name }),
      (request, apiRequest) => ({ ...request, assigneeId: apiRequest.assigneeId, updatedAt: apiRequest.updatedAt }),
      () => $fetch<ApiRequest>(`/api/requests/${id}`, { method: 'PATCH', body: { assigneeId: resolvedId } }),
    )
  }

  /** Undo последнего изменения статуса/приоритета. */
  async function undoLastChange(): Promise<boolean> {
    const snapshot = undoSnapshot.value
    if (!snapshot) return false
    undoSnapshot.value = null

    if (snapshot.field === 'status') {
      return updateStatus(snapshot.requestId, snapshot.previousValue as RequestStatus) !== null
    }
    return updatePriority(snapshot.requestId, snapshot.previousValue as RequestPriority) !== null
  }

  /** Добавление комментария: мгновенно в список, при ошибке — удаление. */
  async function addComment(id: string, text: string): Promise<boolean> {
    const before = byId.value.get(id)
    if (!before) return false

    const optimisticComment: RequestComment = {
      id: `temp-${Date.now()}`,
      author: 'Анна Ковалёва',
      role: 'Оператор',
      createdAt: new Date().toISOString(),
      text,
    }

    byId.value.set(id, {
      ...before,
      comments: [...before.comments, optimisticComment],
    })

    try {
      const saved = await $fetch<ApiComment>(`/api/requests/${id}/comments`, {
        method: 'POST',
        body: { text },
      })
      const current = byId.value.get(id)
      if (current) {
        byId.value.set(id, {
          ...current,
          comments: current.comments.map(comment =>
            comment.id === optimisticComment.id ? mapComment(saved) : comment,
          ),
        })
      }
      lastFailure.value = null
      return true
    }
    catch (error) {
      // Rollback: убираем оптимистичный комментарий, текст в форме сохраняет компонент.
      const current = byId.value.get(id)
      if (current) {
        byId.value.set(id, {
          ...current,
          comments: current.comments.filter(comment => comment.id !== optimisticComment.id),
        })
      }
      lastFailure.value = classifyError(error)
      return false
    }
  }

  return {
    byId,
    users,
    customers,
    categories,
    undoSnapshot,
    lastFailure,
    clearUndo,
    clearFailure,
    setList,
    setDetail,
    get,
    updateStatus,
    updatePriority,
    updateAssignee,
    undoLastChange,
    addComment,
  }
})
