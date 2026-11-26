/** Порядок приоритетов для серверной сортировки и подписи для истории. */
import type { ApiRequestPriority, ApiRequestStatus } from '~~/shared/types/api'

export const PRIORITY_RANK: Record<ApiRequestPriority, number> = {
  critical: 0,
  high: 1,
  normal: 2,
  low: 3,
}

export const PRIORITY_LABELS: Record<ApiRequestPriority, string> = {
  critical: 'Критический',
  high: 'Высокий',
  normal: 'Обычный',
  low: 'Низкий',
}

export const STATUS_LABELS: Record<ApiRequestStatus, string> = {
  new: 'Новая',
  assigned: 'Назначена',
  'in-progress': 'В работе',
  waiting: 'Ожидание',
  escalated: 'Эскалирована',
  resolved: 'Решена',
  closed: 'Закрыта',
}
