<script setup lang="ts">
import type { NavLink } from '~/types'

const route = useRoute()
const { user } = useAuth()
const menuOpen = ref(false)

const links: NavLink[] = [
  { label: 'Обзор', to: '/dashboard' },
  { label: 'Заявки', to: '/requests' }
]

const currentTitle = computed(() => {
  const match = links.find(link => link.to !== '/' && route.path.startsWith(link.to))
  return match?.label ?? 'WorkFlow'
})

watch(
  () => route.fullPath,
  () => { menuOpen.value = false },
)
</script>

<template>
  <div class="flex min-h-dvh flex-col">
    <a href="#main" class="skip-link">Перейти к содержимому</a>

    <header class="sticky top-0 z-40 border-b border-white/[0.05] bg-canvas/85 backdrop-blur-xl">
      <div class="container-page flex h-16 items-center justify-between gap-4">
        <div class="flex min-w-0 items-center gap-3">
          <button
            type="button"
            class="inline-flex size-9 shrink-0 items-center justify-center rounded-lg border border-line text-[var(--octagon-color-text-secondary)] transition hover:border-[var(--octagon-color-border-strong)] hover:bg-white/[0.06] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--octagon-color-focus-ring)] lg:hidden"
            aria-label="Открыть меню"
            aria-haspopup="dialog"
            :aria-expanded="menuOpen"
            @click="menuOpen = true"
          >
            <BaseIcon name="menu" :size="19" />
          </button>

          <SiteLogo />

        </div>

        <nav class="hidden items-center gap-1 lg:flex" aria-label="Основная навигация">
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

        <UserMenu v-if="user" :user="user" />
      </div>
    </header>

    <AppDrawer v-model:open="menuOpen" :links="links">
      <template #footer>
        <p class="text-xs leading-relaxed text-subtle">
          WorkFlow · демоверсия на локальных данных. Изменения живут до перезагрузки страницы.
        </p>
      </template>
    </AppDrawer>

    <main id="main" class="container-page w-full flex-1 py-8 sm:py-10">
      <slot />
    </main>

    <footer class="border-t border-white/[0.05] py-5">
      <div class="container-page flex flex-wrap items-center justify-between gap-2 text-xs text-subtle">
        <p>WorkFlow — поддержка без потерь</p>
        <p>Демо-интерфейс · без бэкенда</p>
      </div>
    </footer>
  </div>
</template>
