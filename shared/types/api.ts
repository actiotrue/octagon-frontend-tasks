/**
 * Контракт API. Используется и на клиенте (app/), и на сервере (server/).
 * Названия полей — «проволочный формат»: ссылки на справочники по id,
 * необязательные поля допускают null — клиент обязан это учитывать.
 */

export const API_STATUSES = [
  'new',
  'assigned',
  'in-progress',
  'waiting',
  'escalated',
  'resolved',
  'closed',
] as const
export type ApiRequestStatus = (typeof API_STATUSES)[number]

export const API_PRIORITIES = ['critical', 'high', 'normal', 'low'] as const
export type ApiRequestPriority = (typeof API_PRIORITIES)[number]

export const API_SORTS = ['newest', 'oldest', 'priority'] as const
export type ApiRequestSort = (typeof API_SORTS)[number]

export function isApiStatus(value: unknown): value is ApiRequestStatus {
  return typeof value === 'string' && (API_STATUSES as readonly string[]).includes(value)
}

export function isApiPriority(value: unknown): value is ApiRequestPriority {
  return typeof value === 'string' && (API_PRIORITIES as readonly string[]).includes(value)
}

export function isApiSort(value: unknown): value is ApiRequestSort {
  return typeof value === 'string' && (API_SORTS as readonly string[]).includes(value)
}

export interface ApiUser {
  id: string
  name: string
  role: string
}

export interface ApiCustomer {
  id: string
  name: string
}

export interface ApiCategory {
  id: string
  name: string
}

export interface ApiRequest {
  id: string
  number: number
  /** Название может отсутствовать — клиент показывает fallback. */
  title: string | null
  customerId: string
  assigneeId: string | null
  status: ApiRequestStatus
  priority: ApiRequestPriority
  categoryId: string
  /** Описание может отсутствовать. */
  description: string | null
  createdAt: string
  updatedAt: string
  dueAt: string
}

export interface ApiComment {
  id: string
  author: string
  role: string
  createdAt: string
  text: string
}

export interface ApiTimelineEvent {
  id: string
  type: string
  title: string
  description?: string
  author?: string
  createdAt: string
}

export interface ApiRequestListResponse {
  items: ApiRequest[]
  total: number
  page: number
  pageCount: number
  /** Справочники для отображения имён вместо id. */
  users: ApiUser[]
  customers: ApiCustomer[]
  categories: ApiCategory[]
}

export interface ApiRequestDetailResponse {
  request: ApiRequest
  comments: ApiComment[]
  timeline: ApiTimelineEvent[]
  /** Справочники для отображения имён вместо id. */
  users: ApiUser[]
  customers: ApiCustomer[]
  categories: ApiCategory[]
}
