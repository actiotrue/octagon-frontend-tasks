/** GET /api/stats — сводка по заявкам для дашборда. */
interface ApiStats {
  new: number
  active: number
  waiting: number
  resolved: number
}

export default defineEventHandler((): ApiStats => {
  const count = (status: string) =>
    apiRequests.filter(request => request.status === status).length

  return {
    new: count('new'),
    active: count('assigned') + count('in-progress'),
    waiting: count('waiting'),
    resolved: count('resolved'),
  }
})
