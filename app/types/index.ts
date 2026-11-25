export type RequestStatus =
  | 'new'
  | 'assigned'
  | 'in-progress'
  | 'waiting'
  | 'escalated'
  | 'resolved'
  | 'closed'

export type RequestPriority = 'critical' | 'high' | 'normal' | 'low'

export type RequestSort = 'newest' | 'oldest' | 'priority'

export interface RequestComment {
  id: string
  author: string
  role: string
  createdAt: string
  text: string
}

export type TimelineEventType =
  | 'created'
  | 'assigned'
  | 'status'
  | 'resolved'
  | 'comment'
  | 'priority'
  | 'closed'

export interface TimelineEvent {
  id: string
  type: TimelineEventType
  title: string
  description?: string
  author?: string
  createdAt: string
}

export interface SupportRequest {
  id: string
  number: number
  title: string
  client: string
  assignee: string | null
  status: RequestStatus
  priority: RequestPriority
  category: string
  description: string
  createdAt: string
  updatedAt: string
  dueAt: string
  comments: RequestComment[]
  timeline: TimelineEvent[]
}

export interface RequestFilters {
  q: string
  status: RequestStatus | 'all'
  priority: RequestPriority | 'all'
  assignee: string
  sort: RequestSort
}

export interface SelectOption {
  value: string
  label: string
  description?: string
}

export interface NavLink {
  label: string
  to: string
}

export interface UserProfile {
  name: string
  email: string
  role: string
  initials: string
}

export interface NewRequestInput {
  title: string
  client: string
  priority: RequestPriority
  category: string
  description: string
}
