/** GET /api/categories — категории заявок. */
import type { ApiCategory } from '~~/shared/types/api'

export default defineEventHandler((): ApiCategory[] => apiCategories)
