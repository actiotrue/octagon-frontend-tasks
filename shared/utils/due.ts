/**
 * SLA-сроки реакции. Общая утилита для сервера (server/) и клиента (app/).
 */
import type { ApiRequestPriority } from '~~/shared/types/api'

const SLA_HOURS: Record<ApiRequestPriority, number> = {
  critical: 4,
  high: 8,
  normal: 24,
  low: 48,
}

export function calculateDueAt(createdAt: string, priority: ApiRequestPriority): string {
  return new Date(
    new Date(createdAt).getTime() + SLA_HOURS[priority] * 60 * 60 * 1000,
  ).toISOString()
}
