/**
 * POST /api/requests — создание заявки. Тело: { title, customerId, priority, categoryId, description }.
 */
import type { ApiRequest } from '~~/shared/types/api'
import { isApiPriority } from '~~/shared/types/api'
import { calculateDueAt } from '~~/shared/utils/due'

interface CreateRequestBody {
  title?: unknown
  customerId?: unknown
  priority?: unknown
  categoryId?: unknown
  description?: unknown
}

export default defineEventHandler(async (event): Promise<ApiRequest> => {
  const body = await readBody<CreateRequestBody>(event) ?? {}

  const title = typeof body.title === 'string' ? body.title.trim() : ''
  const customerId = typeof body.customerId === 'string' ? body.customerId : ''
  const categoryId = typeof body.categoryId === 'string' ? body.categoryId : ''
  const description = typeof body.description === 'string' ? body.description.trim() : ''
  const priority = isApiPriority(body.priority) ? body.priority : 'normal'

  if (title.length < 3) {
    throw createError({ statusCode: 422, statusMessage: 'Title must be at least 3 characters' })
  }
  if (!apiCustomers.some(customer => customer.id === customerId)) {
    throw createError({ statusCode: 422, statusMessage: 'Unknown customer' })
  }

  const now = new Date().toISOString()
  const number = nextRequestNumber()

  const request: ApiRequest = {
    id: String(number),
    number,
    title,
    customerId,
    assigneeId: null,
    status: 'new',
    priority,
    categoryId,
    description: description || null,
    createdAt: now,
    updatedAt: now,
    dueAt: calculateDueAt(now, priority),
  }

  apiRequests.unshift(request)
  apiEvents.push({
    requestId: request.id,
    id: `${request.id}-event-1`,
    type: 'created',
    title: 'Заявка создана',
    description: 'Обращение зарегистрировано',
    createdAt: now,
  })

  return request
})
