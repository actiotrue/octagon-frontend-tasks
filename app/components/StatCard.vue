<script setup lang="ts">
withDefaults(
  defineProps<{
    label: string
    value: number | string
    hint?: string
    icon?: string
  }>(),
  { hint: '' },
)
</script>

<template>
  <div class="rounded-[var(--octagon-radius-md)] border border-line bg-panel px-6 py-6">
    <p class="text-xs font-medium text-[var(--octagon-color-text-secondary)]">{{ label }}</p>
    <p class="mt-4 text-[32px] font-bold leading-10 text-[var(--octagon-color-text-primary)] tabular-nums">
      {{ value }}
    </p>
    <p v-if="hint" class="mt-4 text-xs font-medium text-[var(--octagon-color-text-secondary)]">{{ hint }}</p>
  </div>
</template>
