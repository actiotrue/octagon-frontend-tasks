<script setup lang="ts">
import type { UserProfile } from '~/types'

const props = defineProps<{
  user: UserProfile
}>()

const { logout } = useAuth()
const open = ref(false)
const wrapper = ref<HTMLElement | null>(null)
const trigger = ref<HTMLButtonElement | null>(null)
const menu = ref<HTMLElement | null>(null)
const triggerId = useId()

function getItems(): HTMLElement[] {
  return Array.from(menu.value?.querySelectorAll<HTMLElement>('[role="menuitem"]') ?? [])
}

function openMenu(focusFirst = true): void {
  open.value = true
  if (focusFirst) {
    void nextTick(() => getItems()[0]?.focus())
  }
}

function closeMenu(returnFocus = true): void {
  open.value = false
  if (returnFocus) {
    void nextTick(() => trigger.value?.focus())
  }
}

function toggleMenu(): void {
  if (open.value) closeMenu()
  else openMenu(true)
}

function onTriggerKeydown(event: KeyboardEvent): void {
  if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    openMenu(true)
  } else if (event.key === 'ArrowUp') {
    event.preventDefault()
    open.value = true
    void nextTick(() => {
      const items = getItems()
      items[items.length - 1]?.focus()
    })
  }
}

function onMenuKeydown(event: KeyboardEvent): void {
  if (event.key === 'Escape') {
    event.preventDefault()
    closeMenu()
    return
  }

  if (event.key === 'Tab') {
    closeMenu(false)
    return
  }

  if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return

  const items = getItems()
  if (items.length === 0) return
  event.preventDefault()

  if (event.key === 'Home') {
    items[0]?.focus()
    return
  }
  if (event.key === 'End') {
    items[items.length - 1]?.focus()
    return
  }

  const currentIndex = items.findIndex((item) => item === document.activeElement)
  const delta = event.key === 'ArrowDown' ? 1 : -1
  const nextIndex =
    currentIndex < 0 ? 0 : (currentIndex + delta + items.length) % items.length
  items[nextIndex]?.focus()
}

async function handleLogout(): Promise<void> {
  closeMenu(false)
  logout()
  await navigateTo('/login')
}

useClickOutside(wrapper, () => {
  if (open.value) closeMenu(false)
})

watch(
  () => props.user,
  () => closeMenu(false),
)
</script>

<template>
  <div ref="wrapper" class="relative">
    <button
      ref="trigger"
      :id="triggerId"
      type="button"
      class="flex items-center gap-2 rounded-full border border-transparent p-0.5 pr-1.5 text-xs text-[var(--octagon-color-text-secondary)] transition hover:border-line hover:bg-white/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--octagon-color-focus-ring)] sm:pr-2"
      aria-haspopup="menu"
      :aria-expanded="open"
      :aria-controls="open ? `${triggerId}-menu` : undefined"
      @click="toggleMenu"
      @keydown="onTriggerKeydown"
    >
      <span
        class="grid size-8 place-items-center rounded-full bg-[var(--octagon-color-bg-accent-soft)] text-[11px] font-semibold text-[var(--octagon-color-text-accent)]"
        aria-hidden="true"
      >
        {{ user.initials }}
      </span>
      <span class="hidden sm:inline">{{ user.role }}</span>
      <BaseIcon
        name="chevron-down"
        :size="13"
        class="hidden text-subtle transition-transform sm:block"
        :class="open && 'rotate-180'"
      />
    </button>

    <Transition
      enter-active-class="transition duration-100 ease-out"
      enter-from-class="opacity-0 -translate-y-1"
      leave-active-class="transition duration-100 ease-in"
      leave-to-class="opacity-0 -translate-y-1"
    >
      <div
        v-if="open"
        :id="`${triggerId}-menu`"
        ref="menu"
        role="menu"
        :aria-labelledby="triggerId"
        class="absolute right-0 top-full z-50 mt-2 w-60 overflow-hidden rounded-xl border border-line bg-[var(--octagon-color-bg-surface)] p-1.5 shadow-[0_18px_50px_-12px_rgba(5,3,25,0.9)]"
        @keydown="onMenuKeydown"
      >
        <div class="border-b border-white/[0.06] px-3 py-2.5">
          <p class="truncate text-sm font-medium text-ink">{{ user.name }}</p>
          <p class="mt-0.5 truncate text-[11px] text-subtle">{{ user.email }}</p>
        </div>

        <NuxtLink
          to="/profile"
          role="menuitem"
          class="mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-[var(--octagon-color-text-secondary)] transition hover:bg-white/[0.07] hover:text-white focus-visible:bg-white/[0.07] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--octagon-color-focus-ring)]"
          @click="closeMenu(false)"
        >
          <BaseIcon name="user" :size="15" />
          Профиль
        </NuxtLink>

        <NuxtLink
          to="/profile#notifications"
          role="menuitem"
          class="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-[var(--octagon-color-text-secondary)] transition hover:bg-white/[0.07] hover:text-white focus-visible:bg-white/[0.07] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--octagon-color-focus-ring)]"
          @click="closeMenu(false)"
        >
          <BaseIcon name="settings" :size="15" />
          Настройки
        </NuxtLink>

        <button
          type="button"
          role="menuitem"
          class="mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-[var(--octagon-priority-critical)] transition hover:bg-[var(--octagon-status-escalated-bg)] focus-visible:bg-[var(--octagon-status-escalated-bg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--octagon-color-focus-ring)]"
          @click="handleLogout"
        >
          <BaseIcon name="logout" :size="15" />
          Выйти
        </button>
      </div>
    </Transition>
  </div>
</template>
