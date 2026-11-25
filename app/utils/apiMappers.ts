/**
 * Единственное место преобразования данных API → доменные модели.
 * Компоненты и страницы работают только с доменными моделями;
 * устойчивость к необязательным полям (null) обеспечивается здесь.
 */
import type {
  RequestComment,
  RequestPriority,
  RequestStatus,
  SupportRequest,
  TimelineEvent,
  TimelineEventType,
  UserProfile,
} from '~/types'
import type {
  ApiComment,
  ApiCategory,
  ApiCustomer,
  ApiRequest,
  ApiRequestDetailResponse,
  ApiRequestPriority,
  ApiRequestStatus,
  ApiTimelineEvent,
  ApiUser,
} from '~~/shared/types/api'
import { isApiPriority, isApiStatus } from '~~/shared/types/api'

export const FALLBACK_TITLE = 'Без названия'

const EVENT_TYPES: TimelineEventType[] = [
  'created',
  'assigned',
  'status',
  'resolved',
  'comment',
  'priority',
  'closed',
]

function toStatus(value: ApiRequestStatus): RequestStatus {
  return isApiStatus(value) ? value : 'new'
}

function toPriority(value: ApiRequestPriority): RequestPriority {
  return isApiPriority(value) ? value : 'normal'
}

function toEventType(value: string): TimelineEventType {
  return (EVENT_TYPES as string[]).includes(value) ? (value as TimelineEventType) : 'status'
}

export function mapUser(user: ApiUser): UserProfile {
  return {
    name: user.name,
    email: '',
    role: user.role,
    initials: '',
  }
}

export interface RequestLookup {
  users: Map<string, ApiUser>
  customers: Map<string, ApiCustomer>
  categories: Map<string, ApiCategory>
}

export function createLookup(
  users: ApiUser[],
  customers: ApiCustomer[],
  categories: ApiCategory[],
): RequestLookup {
  return {
    users: new Map(users.map(user => [user.id, user])),
    customers: new Map(customers.map(customer => [customer.id, customer])),
    categories: new Map(categories.map(category => [category.id, category])),
  }
}

export function mapRequest(request: ApiRequest, lookup: RequestLookup): SupportRequest {
  return {
    id: request.id,
    number: request.number,
    title: request.title ?? FALLBACK_TITLE,
    client: lookup.customers.get(request.customerId)?.name ?? 'Клиент неизвестен',
    assignee: request.assigneeId
      ? (lookup.users.get(request.assigneeId)?.name ?? null)
      : null,
    assigneeId: request.assigneeId,
    status: toStatus(request.status),
    priority: toPriority(request.priority),
    category: lookup.categories.get(request.categoryId)?.name ?? 'Без категории',
    description: request.description ?? '',
    createdAt: request.createdAt,
    updatedAt: request.updatedAt,
    dueAt: request.dueAt,
    comments: [],
    timeline: [],
  }
}

export function mapComment(comment: ApiComment): RequestComment {
  return { ...comment }
}

export function mapTimelineEvent(event: ApiTimelineEvent): TimelineEvent {
  return {
    id: event.id,
    type: toEventType(event.type),
    title: event.title,
    description: event.description,
    author: event.author,
    createdAt: event.createdAt,
  }
}

/** Собирает доменную модель карточки из ответа /api/requests/:id. */
export function mapRequestDetail(response: ApiRequestDetailResponse): SupportRequest {
  const lookup = createLookup(response.users, response.customers, response.categories)
  return {
    ...mapRequest(response.request, lookup),
    comments: response.comments.map(mapComment),
    timeline: response.timeline.map(mapTimelineEvent),
  }
}
