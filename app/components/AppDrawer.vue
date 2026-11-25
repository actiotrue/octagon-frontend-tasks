<script setup lang="ts">
import type { NavLink } from '~/types'

const open = defineModel<boolean>('open', { default: false })

defineProps<{
  links: NavLink[]
}>()

const panel = ref<HTMLElement | null>(null)
const closeButton = ref<HTMLButtonElement | null>(null)
let previousOverflow = ''

function close(): void {
  open.value = false
}

useFocusTrap(panel, computed(() => open.value), {
  onEscape: close,
  initialFocus: () => closeButton.value,
})

watch(
  () => open.value,
  (isOpen) => {
    if (!import.meta.client) return
    if (isOpen) {
      previousOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = previousOverflow
      previousOverflow = ''
    }
  },
)

onBeforeUnmount(() => {
  if (import.meta.client) document.body.style.overflow = previousOverflow
})

function onKeydown(event: KeyboardEvent): void {
  if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return

  const items = Array.from(
    panel.value?.querySelectorAll<HTMLElement>('[data-nav-link]') ?? [],
  )
  if (items.length === 0) return

  event.preventDefault()
  const currentIndex = items.findIndex((item) => item === document.activeElement)

  if (event.key === 'Home') {
    items[0]?.focus()
    return
  }
  if (event.key === 'End') {
    items[items.length - 1]?.focus()
    return
  }

  const delta = event.key === 'ArrowDown' ? 1 : -1
  const nextIndex =
    currentIndex < 0
      ? 0
      : (currentIndex + delta + items.length) % items.length
  items[nextIndex]?.focus()
}
</script>

<template>
  <Teleport to="body">
    <Transition name="drawer">
      <div v-if="open" class="fixed inset-0 z-[90] lg:hidden">
        <div
          class="absolute inset-0 bg-[var(--octagon-color-overlay)]/70 backdrop-blur-sm"
          aria-hidden="true"
          @click="close"
        />

        <aside
          ref="panel"
          role="dialog"
          aria-modal="true"
          aria-label="Мобильное меню"
          class="drawer-panel absolute right-0 top-0 flex h-full w-[min(88vw,360px)] flex-col border-l border-line bg-[var(--octagon-color-bg-canvas)] p-5 shadow-[0_0_80px_rgba(2,1,15,0.8)]"
          @keydown="onKeydown"
        >
          <div class="flex items-center justify-between gap-4">
            <SiteLogo />
            <button
              ref="closeButton"
              type="button"
              class="inline-flex size-9 items-center justify-center rounded-lg text-muted transition hover:bg-white/[0.06] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--octagon-color-focus-ring)]"
              aria-label="Закрыть меню"
              @click="close"
            >
              <BaseIcon name="x" :size="19" />
            </button>
          </div>

          <nav class="mt-8 flex flex-col gap-1" aria-label="Основная навигация">
            <NuxtLink
              v-for="link in links"
              :key="link.to"
              :to="link.to"
              data-nav-link
              class="rounded-lg px-3 py-2.5 text-sm font-medium text-[var(--octagon-color-text-secondary)] transition hover:bg-white/[0.06] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--octagon-color-focus-ring)]"
              active-class="bg-white/[0.07] text-white"
              @click="close"
            >
              {{ link.label }}
            </NuxtLink>
          </nav>

          <div v-if="$slots.footer" class="mt-auto border-t border-white/[0.06] pt-5">
            <slot name="footer" />
          </div>
        </aside>
      </div>
    </Transition>
  </Teleport>
</template>
