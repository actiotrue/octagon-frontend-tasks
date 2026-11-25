/** Порядок приоритетов для серверной сортировки. */
import type { ApiRequestPriority } from '~~/shared/types/api'

export const PRIORITY_RANK: Record<ApiRequestPriority, number> = {
  critical: 0,
  high: 1,
  normal: 2,
  low: 3,
}
