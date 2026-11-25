<script setup lang="ts">
withDefaults(
  defineProps<{
    rows?: number
  }>(),
  { rows: 6 },
)
</script>

<template>
  <div
    class="animate-pulse space-y-3"
    role="status"
    aria-label="Загрузка списка заявок"
  >
    <div class="hidden overflow-hidden rounded-[var(--octagon-radius-md)] border border-line bg-panel md:block">
      <div class="space-y-3 bg-[var(--octagon-color-bg-subtle)] px-4 py-3">
        <div class="h-3 w-40 rounded bg-white/10" />
      </div>
      <div
        v-for="row in rows"
        :key="row"
        class="flex items-center gap-4 border-t border-white/[0.06] px-4 py-4"
      >
        <div class="h-3 w-10 shrink-0 rounded bg-white/10" />
        <div class="h-3 min-w-0 flex-1 rounded bg-white/10" />
        <div class="hidden h-3 w-24 shrink-0 rounded bg-white/10 lg:block" />
        <div class="hidden h-3 w-28 shrink-0 rounded bg-white/10 xl:block" />
        <div class="h-5 w-20 shrink-0 rounded-full bg-white/10" />
        <div class="h-3 w-20 shrink-0 rounded bg-white/10" />
      </div>
    </div>

    <div class="space-y-3 md:hidden">
      <div
        v-for="card in rows"
        :key="card"
        class="rounded-[var(--octagon-radius-md)] border border-line bg-panel p-4"
      >
        <div class="flex items-center justify-between gap-3">
          <div class="h-3 w-12 rounded bg-white/10" />
          <div class="h-5 w-16 rounded-full bg-white/10" />
        </div>
        <div class="mt-3 h-3 w-3/4 rounded bg-white/10" />
        <div class="mt-3 grid grid-cols-2 gap-3">
          <div class="h-3 w-20 rounded bg-white/10" />
          <div class="h-3 w-20 rounded bg-white/10" />
        </div>
      </div>
    </div>
  </div>
</template>
