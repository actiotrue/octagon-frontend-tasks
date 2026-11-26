/**
 * App state: пользовательские настройки интерфейса.
 * Сохраняются в cookie — переживают обновление страницы (F5) и сессии.
 */
import { defineStore } from 'pinia'

export type ListDensity = 'comfortable' | 'compact'

export const usePreferencesStore = defineStore('preferences', () => {
  const cookie = useCookie<{ listDensity?: ListDensity }>('wf_prefs', {
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30,
    default: () => ({}),
  })

  const listDensity = ref<ListDensity>(cookie.value.listDensity ?? 'comfortable')

  function setListDensity(value: ListDensity): void {
    listDensity.value = value
    cookie.value = { ...cookie.value, listDensity: value }
  }

  return { listDensity, setListDensity }
})
