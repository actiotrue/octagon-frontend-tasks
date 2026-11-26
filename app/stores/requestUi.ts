/**
 * App/UI state: временные баннеры (успех, ошибка, rollback) и локальные
 * флаги интерфейса. Не переживает обновление страницы — это не server state.
 */
import { defineStore } from 'pinia'
import type { MutationFailure } from '~/stores/requests'

export type BannerTone = 'success' | 'error'

export interface AppBanner {
  tone: BannerTone
  /** Заголовок, например «Приоритет изменён на "Критический"». */
  title: string
  /** Причина отката при ошибке. */
  description?: string
  /** Может ли баннер быть отменён (Undo). */
  undoable?: boolean
  /** Код ошибки для сообщений о rollback. */
  statusCode?: number
}

const AUTO_DISMISS_MS = 8000

export const useRequestUiStore = defineStore('requestUi', () => {
  const banner = ref<AppBanner | null>(null)
  const failure = ref<MutationFailure | null>(null)

  let timer: ReturnType<typeof setTimeout> | null = null

  function dismissBanner(): void {
    banner.value = null
    if (timer !== null) {
      clearTimeout(timer)
      timer = null
    }
  }

  function showBanner(value: AppBanner): void {
    banner.value = value
    if (timer !== null) clearTimeout(timer)
    if (value.tone === 'success') {
      timer = setTimeout(dismissBanner, AUTO_DISMISS_MS)
    }
  }

  function setFailure(value: MutationFailure): void {
    failure.value = value
  }

  function clearFailure(): void {
    failure.value = null
  }

  onScopeDispose(() => {
    if (timer !== null) clearTimeout(timer)
  })

  return { banner, failure, showBanner, dismissBanner, setFailure, clearFailure }
})
