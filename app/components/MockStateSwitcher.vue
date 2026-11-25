<script setup lang="ts">
import type { MockScenario } from '~/types'

const props = defineProps<{ modelValue: MockScenario }>()
const emit = defineEmits<{ 'update:modelValue': [value: MockScenario] }>()

const options: { value: MockScenario, label: string }[] = [
  { value: 'normal', label: 'Обычный' },
  { value: 'loading', label: 'Загрузка' },
  { value: 'empty', label: 'Пусто' },
  { value: 'error', label: 'Ошибка' },
]

const { container, onKeydown } = useRovingFocus({ orientation: 'horizontal' })
</script>

<template>
  <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
    <span class="text-xs font-medium uppercase tracking-wide text-subtle">Данные</span>
    <div
      ref="container"
      role="group"
      aria-label="Состояние mock-данных"
      class="inline-flex w-full flex-wrap gap-1 rounded-xl border border-line bg-panel-strong/50 p-1 sm:w-auto"
      @keydown="onKeydown"
    >
      <button
        v-for="option in options"
        :key="option.value"
        type="button"
        data-roving-item
        :aria-pressed="props.modelValue === option.value"
        class="min-w-20 flex-1 rounded-lg px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--octagon-color-focus-ring)] disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none"
        :class="props.modelValue === option.value ? 'bg-violet-500/25 text-ink shadow-sm' : ''"
        @click="emit('update:modelValue', option.value)"
      >
        {{ option.label }}
      </button>
    </div>
  </div>
</template>
