<script setup lang="ts">
defineProps<{
  title: string
  description?: string
}>()
</script>

<template>
  <div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
    <div class="min-w-0">
      <h1 class="text-[28px] font-bold leading-9 tracking-[-0.01em] text-white">
        {{ title }}
      </h1>
      <p v-if="description" class="mt-2 text-sm leading-relaxed text-[var(--octagon-color-text-secondary)]">
        {{ description }}
      </p>
    </div>
    <div v-if="$slots.actions" class="flex shrink-0 flex-wrap items-center gap-2">
      <slot name="actions" />
    </div>
  </div>
</template>
