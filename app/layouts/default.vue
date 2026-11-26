<script setup lang="ts">
import type { NavLink } from '~/types'

const { user } = useAuth()

const links: NavLink[] = [
  { label: 'Обзор', to: '/dashboard' },
  { label: 'Заявки', to: '/requests' }
]
</script>

<template>
  <div class="flex min-h-dvh flex-col">
    <a href="#main" class="skip-link">Перейти к содержимому</a>

    <header class="sticky top-0 z-40 border-b border-white/[0.05] bg-canvas/85 backdrop-blur-xl">
      <div class="container-page flex h-16 items-center justify-between gap-4">
        <SiteLogo />

        <div class="flex items-center gap-2">
          <nav class="hidden items-center gap-1 sm:flex" aria-label="Основная навигация">
            <NuxtLink
              v-for="link in links"
              :key="link.to"
              :to="link.to"
              class="rounded-lg px-3 py-2 text-xs font-medium text-[var(--octagon-color-text-secondary)] transition hover:bg-white/[0.05] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--octagon-color-focus-ring)]"
              active-class="bg-white/[0.07] text-white"
              exact-active-class="bg-white/[0.07] text-white"
            >
              {{ link.label }}
            </NuxtLink>
          </nav>

          <button
            type="button"
            class="inline-flex size-9 shrink-0 items-center justify-center rounded-[var(--octagon-radius-md)] text-[var(--octagon-color-text-secondary)] transition hover:bg-white/[0.06] hover:text-white focus-ring"
            aria-label="Уведомления"
          >
            <BaseIcon name="bell" :size="19" />
          </button>

          <UserMenu v-if="user" :user="user" />

          <BaseButton
            to="/dashboard"
            size="sm"
            class="sm:hidden"
          >
            Войти
          </BaseButton>
        </div>
      </div>
    </header>

    <main id="main" class="container-page w-full flex-1 py-8 sm:py-10">
      <RequestBanner />
      <slot />
    </main>

    <footer class="border-t border-white/[0.05] py-5">
      <div class="container-page flex flex-wrap items-center justify-between gap-2 text-xs text-subtle">
        <p>WorkFlow — поддержка без потерь</p>
      </div>
    </footer>
  </div>
</template>
