/** GET /api/users — исполнители и операторы. */
import type { ApiUser } from '~~/shared/types/api'

export default defineEventHandler((): ApiUser[] => apiUsers)
