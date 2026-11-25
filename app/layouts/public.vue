<template>
  <div class="flex min-h-dvh flex-col">
    <a href="#main" class="skip-link">Перейти к содержимому</a>

    <PublicHeader />

    <main id="main" class="flex-1">
      <slot />
    </main>

    <footer id="help" class="border-t border-white/[0.05] py-8">
      <div class="container-page flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p class="text-xs text-[var(--octagon-color-text-secondary)]">WorkFlow © 2026</p>
        <nav class="flex items-center gap-4 text-xs" aria-label="Ссылки внизу страницы">
          <NuxtLink to="/#faq" class="text-[var(--octagon-color-text-accent)] transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--octagon-color-focus-ring)]">
            Помощь · FAQ
          </NuxtLink>
        </nav>
      </div>
    </footer>
  </div>
</template>
