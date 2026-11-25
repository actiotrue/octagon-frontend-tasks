<script setup lang="ts">
defineProps<{
  withHeader?: boolean
}>()
</script>

<template>
  <div
    class="animate-pulse space-y-6"
    role="status"
    aria-label="Загрузка карточки заявки"
  >
    <div v-if="withHeader" class="h-9 w-24 rounded-[var(--octagon-radius-md)] border border-line bg-panel" />

    <div class="space-y-2">
      <div class="h-8 w-2/3 max-w-md rounded bg-white/10" />
      <div class="h-3 w-48 rounded bg-white/10" />
      <div class="flex gap-3 pt-1">
        <div class="h-6 w-20 rounded-full bg-white/10" />
        <div class="h-6 w-24 rounded-full bg-white/10" />
      </div>
    </div>

    <div class="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
      <div class="space-y-6">
        <div class="rounded-[var(--octagon-radius-md)] border border-line bg-panel p-6">
          <div class="h-5 w-48 rounded bg-white/10" />
          <div class="mt-5 space-y-2.5">
            <div class="h-3 w-full rounded bg-white/10" />
            <div class="h-3 w-11/12 rounded bg-white/10" />
            <div class="h-3 w-4/5 rounded bg-white/10" />
          </div>
        </div>

        <div class="rounded-[var(--octagon-radius-md)] border border-line bg-panel p-6">
          <div class="h-5 w-36 rounded bg-white/10" />
          <div class="mt-5 space-y-4">
            <div class="flex gap-3">
              <div class="size-8 shrink-0 rounded-full bg-white/10" />
              <div class="min-w-0 flex-1 space-y-2 pt-1">
                <div class="h-3 w-40 rounded bg-white/10" />
                <div class="h-3 w-full rounded bg-white/10" />
              </div>
            </div>
            <div class="flex gap-3">
              <div class="size-8 shrink-0 rounded-full bg-white/10" />
              <div class="min-w-0 flex-1 space-y-2 pt-1">
                <div class="h-3 w-32 rounded bg-white/10" />
                <div class="h-3 w-10/12 rounded bg-white/10" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="rounded-[var(--octagon-radius-md)] border border-line bg-panel p-6">
        <div class="h-5 w-28 rounded bg-white/10" />
        <div class="mt-5 space-y-4">
          <div class="h-3 w-16 rounded bg-white/10" />
          <div class="h-3 w-32 rounded bg-white/10" />
          <div class="h-3 w-20 rounded bg-white/10" />
          <div class="h-3 w-28 rounded bg-white/10" />
          <div class="h-11 w-full rounded-[var(--octagon-radius-md)] bg-white/10" />
          <div class="h-11 w-full rounded-[var(--octagon-radius-md)] bg-white/10" />
        </div>
      </div>
    </div>
  </div>
</template>
