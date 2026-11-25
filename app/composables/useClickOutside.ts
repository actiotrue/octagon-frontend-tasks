import type { Ref } from 'vue'

export function useClickOutside(
  target: Ref<HTMLElement | null>,
  handler: (event: PointerEvent) => void,
): void {
  if (!import.meta.client) return

  const listener = (event: PointerEvent) => {
    const element = target.value
    if (!element) return
    if (event.target instanceof Node && element.contains(event.target)) return
    handler(event)
  }

  onMounted(() => document.addEventListener('pointerdown', listener, true))
  onBeforeUnmount(() => document.removeEventListener('pointerdown', listener, true))
}
