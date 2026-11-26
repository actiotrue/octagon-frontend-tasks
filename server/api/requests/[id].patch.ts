/**
 * PATCH /api/requests/:id — изменение статуса, приоритета и/или исполнителя.
 * Тело: { status?, priority?, assigneeId? } — все поля необязательные.
 * При смене приоритета пересчитывается SLA-срок (dueAt).
 */
import type { ApiRequest } from '~~/shared/types/api'
import { isApiPriority, isApiStatus } from '~~/shared/types/api'
import { calculateDueAt } from '~~/shared/utils/due'

interface PatchRequestBody {
  status?: unknown
  priority?: unknown
  assigneeId?: unknown
}

function readString(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() ? value.trim() : undefined
}

export default defineEventHandler(async (event): Promise<ApiRequest> => {
  const id = getRouterParam(event, 'id') ?? ''
  const request = apiRequests.find(candidate => candidate.id === id)
  if (!request) {
    throw createError({ statusCode: 404, statusMessage: 'Request Not Found' })
  }

  const body = await readBody<PatchRequestBody>(event) ?? {}
  const now = new Date().toISOString()

  // Статус.
  if (body.status !== undefined) {
    if (!isApiStatus(body.status)) {
      throw createError({ statusCode: 422, statusMessage: 'Invalid status' })
    }
    if (body.status !== request.status) {
      request.status = body.status
      apiEvents.push({
        requestId: request.id,
        id: `${request.id}-event-${apiEvents.length + 1}`,
        type: 'status',
        title: 'Статус изменён',
        description: `Новый статус: ${STATUS_LABELS[body.status]}`,
        author: 'Оператор',
        createdAt: now,
      })
    }
  }

  // Приоритет — с пересчётом SLA-срока.
  if (body.priority !== undefined) {
    if (!isApiPriority(body.priority)) {
      throw createError({ statusCode: 422, statusMessage: 'Invalid priority' })
    }
    if (body.priority !== request.priority) {
      request.priority = body.priority
      request.dueAt = calculateDueAt(request.createdAt, request.priority)
      apiEvents.push({
        requestId: request.id,
        id: `${request.id}-event-${apiEvents.length + 1}`,
        type: 'priority',
        title: 'Приоритет изменён',
        description: `Новый приоритет: ${PRIORITY_LABELS[body.priority]}`,
        author: 'Оператор',
        createdAt: now,
      })
    }
  }

  // Исполнитель: строка-id или null («Не назначена»).
  if (body.assigneeId !== undefined) {
    if (body.assigneeId === null || body.assigneeId === 'none') {
      request.assigneeId = null
      apiEvents.push({
        requestId: request.id,
        id: `${request.id}-event-${apiEvents.length + 1}`,
        type: 'assigned',
        title: 'Исполнитель снят',
        author: 'Оператор',
        createdAt: now,
      })
    }
    else {
      const assigneeId = readString(body.assigneeId)
      const user = apiUsers.find(candidate => candidate.id === assigneeId)
      if (!user) {
        throw createError({ statusCode: 422, statusMessage: 'Unknown assignee' })
      }
      if (request.assigneeId !== user.id) {
        request.assigneeId = user.id
        apiEvents.push({
          requestId: request.id,
          id: `${request.id}-event-${apiEvents.length + 1}`,
          type: 'assigned',
          title: 'Изменён исполнитель',
          description: user.name,
          author: 'Оператор',
          createdAt: now,
        })
      }
    }
  }

  request.updatedAt = now
  return request
})
