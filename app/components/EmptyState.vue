<script setup lang="ts">
withDefaults(
  defineProps<{
    title: string
    description?: string
    icon?: string
  }>(),
  {
    icon: 'inbox',
  },
)
</script>

<template>
  <div class="rounded-xl border border-dashed border-[var(--octagon-color-border-default)] bg-panel/50 px-5 py-12 text-center sm:px-8">
    <div class="mx-auto grid size-12 place-items-center rounded-full border border-line bg-[var(--octagon-color-bg-accent-soft)] text-[var(--octagon-color-text-secondary)]">
      <BaseIcon :name="icon" :size="22" />
    </div>
    <h2 class="mt-4 text-base font-medium text-ink">{{ title }}</h2>
    <p v-if="description" class="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted">
      {{ description }}
    </p>
    <div v-if="$slots.default" class="mt-5 flex flex-wrap items-center justify-center gap-2">
      <slot />
    </div>
  </div>
</template>
