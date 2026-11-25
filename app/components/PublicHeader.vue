<script setup lang="ts">
import type { NavLink } from '~/types'

const route = useRoute()
const menuOpen = ref(false)
const isLogin = computed(() => route.path === '/login')

const links: NavLink[] = [
  { label: 'Главная', to: '/' },
  { label: 'Статьи', to: '/#features' },
  { label: 'Помощь', to: '/#help' },
  { label: 'FAQ', to: '/#faq' },
]
</script>

<template>
  <header class="sticky top-0 z-40 border-b border-white/[0.04] bg-canvas/80 backdrop-blur-xl">
    <div class="container-page flex h-16 items-center justify-between gap-4">
      <SiteLogo />

      <template v-if="!isLogin">
        <nav
          class="ml-auto hidden items-center gap-6 md:flex"
          aria-label="Публичная навигация"
        >
          <NuxtLink
            v-for="link in links"
            :key="link.to"
            :to="link.to"
            class="rounded-md text-sm text-[var(--octagon-color-text-primary)] transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--octagon-color-focus-ring)] focus-visible:ring-offset-4 focus-visible:ring-offset-canvas"
            :class="link.to === '/' && route.path === '/' ? 'text-white' : undefined"
          >
            {{ link.label }}
          </NuxtLink>
        </nav>

        <div class="flex items-center gap-2">
          <BaseButton
            to="/login"
            variant="secondary"
            size="sm"
            class="hidden sm:inline-flex"
          >
            Войти
          </BaseButton>

          <button
            type="button"
            class="inline-flex size-9 items-center justify-center rounded-lg border border-line text-[var(--octagon-color-text-secondary)] transition hover:border-[var(--octagon-color-border-strong)] hover:bg-white/[0.06] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--octagon-color-focus-ring)] md:hidden"
            aria-label="Открыть меню"
            aria-haspopup="dialog"
            :aria-expanded="menuOpen"
            @click="menuOpen = true"
          >
            <BaseIcon name="menu" :size="19" />
          </button>
        </div>
      </template>
    </div>

    <AppDrawer v-model:open="menuOpen" :links="links">
      <template #footer>
        <BaseButton to="/login" block @click="menuOpen = false">
          Войти
        </BaseButton>
      </template>
    </AppDrawer>
  </header>
</template>
