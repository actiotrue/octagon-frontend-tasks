/**
 * POST /api/requests/:id/comments — добавление комментария к заявке.
 * Тело: { text }. Комментарий попадает в список и в историю (событие comment).
 */
import type { ApiComment } from '~~/shared/types/api'

interface CommentRequestBody {
  text?: unknown
}

export default defineEventHandler(async (event): Promise<ApiComment> => {
  const id = getRouterParam(event, 'id') ?? ''

  const request = apiRequests.find(candidate => candidate.id === id)
  if (!request) {
    throw createError({ statusCode: 404, statusMessage: 'Request Not Found' })
  }

  const body = await readBody<CommentRequestBody>(event) ?? {}
  const text = typeof body.text === 'string' ? body.text.trim() : ''
  if (!text) {
    throw createError({ statusCode: 422, statusMessage: 'Comment text is required' })
  }

  const now = new Date().toISOString()
  const comment: ApiComment = {
    id: `${id}-comment-${apiComments.length + 1}`,
    author: 'Анна Ковалёва',
    role: 'Оператор',
    createdAt: now,
    text,
  }

  apiComments.push({ requestId: id, ...comment })
  apiEvents.push({
    requestId: id,
    id: `${id}-event-${apiEvents.length + 1}`,
    type: 'comment',
    title: 'Добавлен комментарий',
    author: comment.author,
    createdAt: now,
  })

  return comment
})
