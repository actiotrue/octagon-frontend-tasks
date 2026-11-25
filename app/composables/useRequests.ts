/**
 * Композабл справочников (исполнители, клиенты, категории) —
 * единый кэшируемый запрос к API для фильтров и модальных форм.
 */
import type { ApiCategory, ApiCustomer, ApiUser } from '~~/shared/types/api'

export interface DirectoryData {
  users: ApiUser[]
  customers: ApiCustomer[]
  categories: ApiCategory[]
}

export function useDirectories() {
  return useAsyncData<DirectoryData>(
    async () => {
      const [users, customers, categories] = await Promise.all([
        $fetch<ApiUser[]>('/api/users'),
        $fetch<ApiCustomer[]>('/api/customers'),
        $fetch<ApiCategory[]>('/api/categories'),
      ])
      return { users, customers, categories }
    },
    { dedupe: 'defer' },
  )
}
