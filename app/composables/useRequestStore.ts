import type {
  NewRequestInput,
  RequestStatus,
  SupportRequest,
  TimelineEventType,
} from '~/types'
import { mockRequests } from '~/utils/mockRequests'
import {
  STATUS_META,
  calculateDueAt,
  requestStatusEventTitle,
} from '~/utils/requests'

function cloneRequests(requests: SupportRequest[]): SupportRequest[] {
  return JSON.parse(JSON.stringify(requests)) as SupportRequest[]
}

export function useRequestStore() {
  const { user } = useAuth()
  const requests = useState<SupportRequest[]>('wf_requests', () =>
    cloneRequests(mockRequests),
  )

  const currentUserName = computed(() => user.value?.name || 'Анна Ковалёва')

  function findById(id: string): SupportRequest | null {
    return requests.value.find((request) => request.id === id) ?? null
  }

  function appendEvent(
    request: SupportRequest,
    type: TimelineEventType,
    title: string,
    description?: string,
    author?: string,
    createdAt = new Date().toISOString(),
  ): void {
    request.timeline.push({
      id: `${request.number}-event-${Date.now()}-${request.timeline.length + 1}`,
      type,
      title,
      description,
      author,
      createdAt,
    })
    request.updatedAt = createdAt
  }

  function addComment(id: string, text: string): boolean {
    const request = findById(id)
    const trimmed = text.trim()
    if (!request || !trimmed) return false

    const createdAt = new Date().toISOString()
    request.comments.push({
      id: `${request.number}-comment-${Date.now()}`,
      author: currentUserName.value,
      role: 'Оператор',
      createdAt,
      text: trimmed,
    })
    appendEvent(
      request,
      'comment',
      'Комментарий',
      trimmed,
      currentUserName.value,
      createdAt,
    )
    return true
  }

  function changeStatus(id: string, status: RequestStatus): void {
    const request = findById(id)
    if (!request || request.status === status) return

    request.status = status

    if (
      (status === 'assigned' || status === 'in-progress') &&
      !request.assignee
    ) {
      request.assignee = currentUserName.value
    }

    const type: TimelineEventType =
      status === 'resolved' ? 'resolved' : status === 'closed' ? 'closed' : 'status'

    appendEvent(
      request,
      type,
      status === 'new' ? 'Заявка переоткрыта' : requestStatusEventTitle(status),
      STATUS_META[status].description,
      currentUserName.value,
    )
  }

  function assign(id: string, assignee: string | null): void {
    const request = findById(id)
    if (!request || request.assignee === assignee) return

    request.assignee = assignee
    if (assignee && request.status === 'new') {
      request.status = 'assigned'
    }

    appendEvent(
      request,
      'assigned',
      assignee ? 'Назначен исполнитель' : 'Исполнитель снят',
      assignee ?? 'Назначение снято',
      currentUserName.value,
    )
  }

  function createRequest(input: NewRequestInput): SupportRequest {
    const nextNumber =
      Math.max(1042, ...requests.value.map((request) => request.number)) + 1
    const createdAt = new Date().toISOString()
    const category = input.category.trim() || 'Обращение'

    const request: SupportRequest = {
      id: String(nextNumber),
      number: nextNumber,
      title: input.title.trim(),
      client: input.client,
      assignee: null,
      status: 'new',
      priority: input.priority,
      category,
      description: input.description.trim(),
      createdAt,
      updatedAt: createdAt,
      dueAt: calculateDueAt(createdAt, input.priority),
      comments: [],
      timeline: [
        {
          id: `${nextNumber}-event-1`,
          type: 'created',
          title: 'Заявка создана',
          description: `${input.client} · ${category}`,
          author: currentUserName.value,
          createdAt,
        },
      ],
    }

    requests.value = [request, ...requests.value]
    return request
  }

  return {
    requests,
    currentUserName,
    findById,
    addComment,
    changeStatus,
    assign,
    createRequest,
  }
}
