interface RovingFocusOptions {
  selector?: string
  orientation?: 'horizontal' | 'vertical'
  loop?: boolean
}

/** Навигация стрелками внутри группы элементов (меню, фильтры, сегменты). */
export function useRovingFocus(options: RovingFocusOptions = {}) {
  const container = ref<HTMLElement | null>(null)
  const selector = options.selector ?? '[data-roving-item]'
  const orientation = options.orientation ?? 'vertical'
  const loop = options.loop ?? true

  function getItems(): HTMLElement[] {
    return Array.from(container.value?.querySelectorAll<HTMLElement>(selector) ?? [])
      .filter(element => !element.hasAttribute('disabled') && element.getAttribute('aria-disabled') !== 'true')
  }

  function focusAt(index: number): void {
    getItems()[index]?.focus()
  }

  function onKeydown(event: KeyboardEvent): void {
    const items = getItems()
    if (!items.length) return

    const nextKeys = orientation === 'horizontal' ? ['ArrowRight', 'ArrowDown'] : ['ArrowDown', 'ArrowRight']
    const prevKeys = orientation === 'horizontal' ? ['ArrowLeft', 'ArrowUp'] : ['ArrowUp', 'ArrowLeft']
    const current = items.findIndex(item => item === document.activeElement)
    if (current === -1) return

    let target = current

    if (nextKeys.includes(event.key)) target = current + 1
    else if (prevKeys.includes(event.key)) target = current - 1
    else if (event.key === 'Home') target = 0
    else if (event.key === 'End') target = items.length - 1
    else return

    event.preventDefault()

    if (target < 0) target = loop ? items.length - 1 : 0
    if (target > items.length - 1) target = loop ? 0 : items.length - 1

    items[target]?.focus()
  }

  return { container, getItems, focusAt, onKeydown }
}
