<script setup lang="ts">
const props = defineProps<{
  page: number
  pageCount: number
  total: number
  from: number
  to: number
}>()

const emit = defineEmits<{
  'update:page': [page: number]
}>()

const pages = computed(() => {
  if (props.pageCount <= 7) {
    return Array.from({ length: props.pageCount }, (_, index) => index + 1)
  }

  const start = Math.max(1, Math.min(props.page - 2, props.pageCount - 4))
  return Array.from({ length: 5 }, (_, index) => start + index)
})

function go(page: number): void {
  if (page < 1 || page > props.pageCount || page === props.page) return
  emit('update:page', page)
}
</script>

<template>
  <div class="flex flex-col gap-3 border-t border-white/[0.06] pt-4 sm:flex-row sm:items-center sm:justify-between">
    <p class="text-xs text-subtle" aria-live="polite">
      Показано
      <span class="text-[var(--octagon-color-text-secondary)]">{{ total === 0 ? 0 : from }}–{{ to }}</span>
      из {{ total }}
    </p>

    <nav class="flex flex-wrap items-center gap-2" aria-label="Пагинация заявок">
      <BaseButton
        variant="secondary"
        size="sm"
        :disabled="page <= 1"
        @click="go(page - 1)"
      >
        Назад
      </BaseButton>

      <button
        v-for="pageNumber in pages"
        :key="pageNumber"
        type="button"
        class="inline-flex size-9 items-center justify-center rounded-lg border text-xs font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--octagon-color-focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
        :class="
          pageNumber === page
            ? 'border-white bg-white text-[var(--octagon-color-bg-surface)]'
            : 'border-line bg-transparent text-[var(--octagon-color-text-secondary)] hover:border-[var(--octagon-color-border-strong)] hover:bg-white/[0.06] hover:text-white'
        "
        :aria-current="pageNumber === page ? 'page' : undefined"
        :aria-label="`Страница ${pageNumber}`"
        @click="go(pageNumber)"
      >
        {{ pageNumber }}
      </button>

      <BaseButton
        variant="secondary"
        size="sm"
        :disabled="page >= pageCount"
        @click="go(page + 1)"
      >
        Далее
      </BaseButton>
    </nav>
  </div>
</template>
