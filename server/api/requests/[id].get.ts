/**
 * GET /api/requests/:id — карточка заявки: данные, комментарии, история
 * и справочники для отображения имён вместо id.
 */
import type { ApiRequestDetailResponse } from '~~/shared/types/api'

export default defineEventHandler((event): ApiRequestDetailResponse => {
  const id = getRouterParam(event, 'id') ?? ''

  const request = apiRequests.find(candidate => candidate.id === id)
  if (!request) {
    throw createError({ statusCode: 404, statusMessage: 'Request Not Found' })
  }

  const comments = apiComments
    .filter(comment => comment.requestId === id)
    .map(({ requestId: _requestId, ...comment }) => comment)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())

  const timeline = apiEvents
    .filter(eventItem => eventItem.requestId === id)
    .map(({ requestId: _requestId, ...eventItem }) => eventItem)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())

  return {
    request,
    comments,
    timeline,
    users: apiUsers,
    customers: apiCustomers,
    categories: apiCategories,
  }
})
