<script setup lang="ts">
import type { NavLink } from '~/types'

const route = useRoute()
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

        <div class="ml-auto flex items-center gap-2 md:ml-0">
          <BaseButton
            to="/login"
            variant="secondary"
            size="sm"
          >
            Войти
          </BaseButton>
        </div>
      </template>
    </div>
  </header>
</template>
