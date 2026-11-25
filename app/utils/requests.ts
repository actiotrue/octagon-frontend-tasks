import type {
  RequestFilters,
  RequestPriority,
  RequestSort,
  RequestStatus,
  SelectOption,
  SupportRequest,
} from '~/types'

export const REQUEST_STATUSES: RequestStatus[] = [
  'new',
  'assigned',
  'in-progress',
  'waiting',
  'escalated',
  'resolved',
  'closed',
]

export const REQUEST_PRIORITIES: RequestPriority[] = ['critical', 'high', 'normal', 'low']

export const REQUEST_SORTS: RequestSort[] = ['newest', 'oldest', 'priority']

export const STATUS_META: Record<
  RequestStatus,
  { label: string; dotClass: string; textClass: string; description: string }
> = {
  new: {
    label: 'Новая',
    dotClass: 'bg-[var(--octagon-status-new-fg)]',
    textClass: 'text-[var(--octagon-status-new-fg)]',
    description: 'Ожидает назначения',
  },
  assigned: {
    label: 'Назначена',
    dotClass: 'bg-[var(--octagon-status-assigned-fg)]',
    textClass: 'text-[var(--octagon-status-assigned-fg)]',
    description: 'Назначена исполнителем',
  },
  'in-progress': {
    label: 'В работе',
    dotClass: 'bg-[var(--octagon-status-in-progress-fg)]',
    textClass: 'text-[var(--octagon-status-in-progress-fg)]',
    description: 'Взята в работу',
  },
  waiting: {
    label: 'Ожидание',
    dotClass: 'bg-[var(--octagon-status-waiting-fg)]',
    textClass: 'text-[var(--octagon-status-waiting-fg)]',
    description: 'Нужна информация',
  },
  escalated: {
    label: 'Эскалирована',
    dotClass: 'bg-[var(--octagon-status-escalated-fg)]',
    textClass: 'text-[var(--octagon-status-escalated-fg)]',
    description: 'Передана старшему специалисту',
  },
  resolved: {
    label: 'Решена',
    dotClass: 'bg-[var(--octagon-status-resolved-fg)]',
    textClass: 'text-[var(--octagon-status-resolved-fg)]',
    description: 'Решение подтверждено',
  },
  closed: {
    label: 'Закрыта',
    dotClass: 'bg-[var(--octagon-status-closed-fg)]',
    textClass: 'text-[var(--octagon-status-closed-fg)]',
    description: 'Заявка закрыта',
  },
}

export const STATUS_BG: Record<RequestStatus, string> = {
  new: 'bg-[var(--octagon-status-new-bg)]',
  assigned: 'bg-[var(--octagon-status-assigned-bg)]',
  'in-progress': 'bg-[var(--octagon-status-in-progress-bg)]',
  waiting: 'bg-[var(--octagon-status-waiting-bg)]',
  escalated: 'bg-[var(--octagon-status-escalated-bg)]',
  resolved: 'bg-[var(--octagon-status-resolved-bg)]',
  closed: 'bg-[var(--octagon-status-closed-bg)]',
}

export const PRIORITY_META: Record<
  RequestPriority,
  { label: string; icon: string; textClass: string; rank: number }
> = {
  critical: {
    label: 'Критический',
    icon: 'alert-triangle',
    textClass: 'text-[var(--octagon-priority-critical)]',
    rank: 0,
  },
  high: {
    label: 'Высокий',
    icon: 'arrow-up',
    textClass: 'text-[var(--octagon-priority-high)]',
    rank: 1,
  },
  normal: {
    label: 'Обычный',
    icon: 'equals',
    textClass: 'text-[var(--octagon-priority-normal)]',
    rank: 2,
  },
  low: {
    label: 'Низкий',
    icon: 'arrow-down',
    textClass: 'text-[var(--octagon-priority-low)]',
    rank: 3,
  },
}

export const STATUS_FILTER_OPTIONS: SelectOption[] = [
  { value: 'all', label: 'Все статусы' },
  ...REQUEST_STATUSES.map((status) => ({
    value: status,
    label: STATUS_META[status].label,
  })),
]

export const PRIORITY_FILTER_OPTIONS: SelectOption[] = [
  { value: 'all', label: 'Все приоритеты' },
  ...REQUEST_PRIORITIES.map((priority) => ({
    value: priority,
    label: PRIORITY_META[priority].label,
  })),
]

export const SORT_OPTIONS: SelectOption[] = [
  { value: 'newest', label: 'Сначала новые' },
  { value: 'oldest', label: 'Сначала старые' },
  { value: 'priority', label: 'По приоритету' },
]

export const TEAM = ['Брунгильда Б.', 'Олег С.', 'Анна Ковалёва']

export const CLIENTS = ['АО «Вектор»', 'ООО «Сфера»', 'ООО «Пульс»']

export const DEFAULT_FILTERS: RequestFilters = {
  q: '',
  status: 'all',
  priority: 'all',
  assignee: 'all',
  sort: 'newest',
}

const STATUS_SET = new Set<string>(REQUEST_STATUSES)
const PRIORITY_SET = new Set<string>(REQUEST_PRIORITIES)
const SORT_SET = new Set<string>(REQUEST_SORTS)

export function isRequestStatus(value: unknown): value is RequestStatus {
  return typeof value === 'string' && STATUS_SET.has(value)
}

export function isRequestPriority(value: unknown): value is RequestPriority {
  return typeof value === 'string' && PRIORITY_SET.has(value)
}

export function isRequestSort(value: unknown): value is RequestSort {
  return typeof value === 'string' && SORT_SET.has(value)
}

export function parseStatusFilter(value: unknown): RequestStatus | 'all' {
  return isRequestStatus(value) ? value : 'all'
}

export function parsePriorityFilter(value: unknown): RequestPriority | 'all' {
  return isRequestPriority(value) ? value : 'all'
}

export function parseSort(value: unknown): RequestSort {
  return isRequestSort(value) ? value : 'newest'
}

export function parseAssigneeFilter(value: unknown): string {
  if (typeof value !== 'string') return 'all'
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : 'all'
}

export function hasActiveFilters(filters: RequestFilters): boolean {
  return (
    filters.q.trim().length > 0 ||
    filters.status !== 'all' ||
    filters.priority !== 'all' ||
    filters.assignee !== 'all' ||
    filters.sort !== 'newest'
  )
}

export function filterRequests(
  requests: SupportRequest[],
  filters: RequestFilters,
): SupportRequest[] {
  const query = filters.q.trim().toLowerCase().replace(/^#/, '')

  const filtered = requests.filter((request) => {
    if (filters.status !== 'all' && request.status !== filters.status) return false
    if (filters.priority !== 'all' && request.priority !== filters.priority) return false

    if (filters.assignee === 'none' && request.assignee !== null) return false
    if (
      filters.assignee !== 'all' &&
      filters.assignee !== 'none' &&
      request.assignee !== filters.assignee
    ) {
      return false
    }

    if (!query) return true

    return (
      String(request.number).includes(query) ||
      request.title.toLowerCase().includes(query) ||
      request.client.toLowerCase().includes(query) ||
      (request.assignee?.toLowerCase().includes(query) ?? false)
    )
  })

  return sortRequests(filtered, filters.sort)
}

export function sortRequests(requests: SupportRequest[], sort: RequestSort): SupportRequest[] {
  const copy = [...requests]

  switch (sort) {
    case 'oldest':
      return copy.sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      )
    case 'priority':
      return copy.sort((a, b) => {
        const rank = PRIORITY_META[a.priority].rank - PRIORITY_META[b.priority].rank
        if (rank !== 0) return rank
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      })
    case 'newest':
    default:
      return copy.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
  }
}

export function paginate<T>(items: T[], page: number, perPage: number): T[] {
  const start = Math.max(0, (page - 1) * perPage)
  return items.slice(start, start + perPage)
}

export interface RequestStats {
  new: number
  active: number
  waiting: number
  resolved: number
}

export function getRequestStats(requests: SupportRequest[]): RequestStats {
  return {
    new: requests.filter((request) => request.status === 'new').length,
    active: requests.filter(
      (request) =>
        request.status === 'assigned' || request.status === 'in-progress',
    ).length,
    waiting: requests.filter((request) => request.status === 'waiting').length,
    resolved: requests.filter((request) => request.status === 'resolved').length,
  }
}

export function calculateDueAt(createdAt: string, priority: RequestPriority): string {
  const slaHours: Record<RequestPriority, number> = {
    critical: 4,
    high: 8,
    normal: 24,
    low: 48,
  }

  return new Date(new Date(createdAt).getTime() + slaHours[priority] * 60 * 60 * 1000).toISOString()
}

export function isOverdue(dueAt: string, status: RequestStatus): boolean {
  if (status === 'resolved' || status === 'closed') return false
  return new Date(dueAt).getTime() < Date.now()
}

export function requestStatusEventTitle(status: RequestStatus): string {
  switch (status) {
    case 'new':
      return 'Заявка создана'
    case 'assigned':
      return 'Назначен исполнитель'
    case 'in-progress':
      return 'Заявка взята в работу'
    case 'waiting':
      return 'Ожидание ответа'
    case 'escalated':
      return 'Заявка эскалирована'
    case 'resolved':
      return 'Заявка решена'
    case 'closed':
      return 'Заявка закрыта'
  }
}
