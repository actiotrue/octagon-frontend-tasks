/** GET /api/customers — клиенты. */
import type { ApiCustomer } from '~~/shared/types/api'

export default defineEventHandler((): ApiCustomer[] => apiCustomers)
