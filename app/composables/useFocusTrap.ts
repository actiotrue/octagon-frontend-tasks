import type { Ref } from 'vue'

interface FocusTrapOptions {
  onEscape?: () => void
  initialFocus?: () => HTMLElement | null | undefined
}

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

function isVisible(element: HTMLElement): boolean {
  return element.getClientRects().length > 0 && !element.hasAttribute('hidden')
}

export function useFocusTrap(
  container: Ref<HTMLElement | null>,
  active: Ref<boolean>,
  options: FocusTrapOptions = {},
): void {
  let previousActive: HTMLElement | null = null
  let listening = false

  function getFocusable(): HTMLElement[] {
    const root = container.value
    if (!root) return []
    return Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(isVisible)
  }

  function onKeydown(event: KeyboardEvent): void {
    if (!active.value) return

    if (event.key === 'Escape') {
      if (!options.onEscape) return
      event.preventDefault()
      event.stopPropagation()
      options.onEscape()
      return
    }

    if (event.key !== 'Tab') return

    const focusable = getFocusable()
    const root = container.value
    if (!root) return

    if (focusable.length === 0) {
      event.preventDefault()
      root.focus()
      return
    }

    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    const current = document.activeElement instanceof HTMLElement ? document.activeElement : null

    if (!current || !root.contains(current)) {
      event.preventDefault()
      ;(event.shiftKey ? last : first)?.focus()
      return
    }

    if (!event.shiftKey && current === last) {
      event.preventDefault()
      first?.focus()
    } else if (event.shiftKey && current === first) {
      event.preventDefault()
      last?.focus()
    }
  }

  function start(): void {
    if (!import.meta.client || listening) return
    previousActive = document.activeElement instanceof HTMLElement ? document.activeElement : null
    document.addEventListener('keydown', onKeydown, true)
    listening = true

    void nextTick(() => {
      const target = options.initialFocus?.() ?? getFocusable()[0] ?? container.value
      target?.focus()
    })
  }

  function stop(restoreFocus = true): void {
    if (!import.meta.client || !listening) return
    document.removeEventListener('keydown', onKeydown, true)
    listening = false
    if (restoreFocus && previousActive?.isConnected) {
      previousActive.focus()
    }
    previousActive = null
  }

  watch(
    active,
    (value) => {
      if (value) start()
      else stop()
    },
    { immediate: true, flush: 'post' },
  )

  onBeforeUnmount(() => stop(false))
}
