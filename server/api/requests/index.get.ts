/**
 * GET /api/requests — постраничный список заявок с фильтрацией и сортировкой.
 * Query: q, status, priority, assignee, sort, page, limit.
 */
import type { ApiRequestListResponse } from '~~/shared/types/api'
import { isApiPriority, isApiSort, isApiStatus } from '~~/shared/types/api'

const DEFAULT_LIMIT = 12
const MAX_LIMIT = 50

function readString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : ''
}

export default defineEventHandler((event): ApiRequestListResponse => {
  const query = getQuery(event)

  const q = readString(query.q).toLowerCase().replace(/^#/, '')
  const status = readString(query.status)
  const priority = readString(query.priority)
  const assignee = readString(query.assignee)
  const sort = isApiSort(query.sort) ? query.sort : 'newest'
  const page = Math.max(1, Number.parseInt(readString(query.page), 10) || 1)
  const limitRaw = Number.parseInt(readString(query.limit), 10)
  const limit = Math.min(MAX_LIMIT, limitRaw > 0 ? limitRaw : DEFAULT_LIMIT)

  const statusFilter = isApiStatus(status) ? status : null
  const priorityFilter = isApiPriority(priority) ? priority : null

  let items = apiRequests.filter((request) => {
    if (statusFilter && request.status !== statusFilter) return false
    if (priorityFilter && request.priority !== priorityFilter) return false

    if (assignee === 'none') {
      if (request.assigneeId !== null) return false
    }
    else if (assignee && assignee !== 'all') {
      const user = apiUsers.find(candidate => candidate.id === assignee)
      if (!user || request.assigneeId !== assignee) return false
    }

    if (q) {
      const customer = apiCustomers.find(candidate => candidate.id === request.customerId)
      const assigneeUser = request.assigneeId
        ? apiUsers.find(candidate => candidate.id === request.assigneeId)
        : undefined
      const haystack = [
        String(request.number),
        request.title ?? '',
        customer?.name ?? '',
        assigneeUser?.name ?? '',
      ]
        .join(' ')
        .toLowerCase()
      if (!haystack.includes(q)) return false
    }

    return true
  })

  const byCreatedDesc = (a: { createdAt: string }, b: { createdAt: string }) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()

  items = [...items].sort((a, b) => {
    if (sort === 'oldest') return -byCreatedDesc(a, b)
    if (sort === 'priority') {
      const rank = PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority]
      if (rank !== 0) return rank
      return byCreatedDesc(a, b)
    }
    return byCreatedDesc(a, b)
  })

  const total = items.length
  const pageCount = Math.max(1, Math.ceil(total / limit))
  const safePage = Math.min(page, pageCount)
  const start = (safePage - 1) * limit

  return {
    items: items.slice(start, start + limit),
    total,
    page: safePage,
    pageCount,
    users: apiUsers,
    customers: apiCustomers,
    categories: apiCategories,
  }
})
