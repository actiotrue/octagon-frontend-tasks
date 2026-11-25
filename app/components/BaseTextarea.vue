<script setup lang="ts">
import { cn } from '~/utils/cn'

const props = withDefaults(
  defineProps<{
    id?: string
    label?: string
    placeholder?: string
    hint?: string
    error?: string
    rows?: number
    disabled?: boolean
    maxlength?: number
  }>(),
  {
    rows: 4,
    disabled: false,
  },
)

const model = defineModel<string>({ default: '' })
const generatedId = useId()
const textareaId = computed(() => props.id || `textarea-${generatedId}`)
const hintId = computed(() => `${textareaId.value}-hint`)
const textareaElement = ref<HTMLTextAreaElement | null>(null)

function focus(): void {
  textareaElement.value?.focus()
}

defineExpose({ focus })
</script>

<template>
  <div class="w-full">
    <label
      v-if="label"
      :for="textareaId"
      class="mb-2 block text-xs font-semibold text-[var(--octagon-color-text-primary)]"
    >
      {{ label }}
    </label>

    <textarea
      :id="textareaId"
      ref="textareaElement"
      v-model="model"
      :rows="rows"
      :placeholder="placeholder"
      :disabled="disabled"
      :maxlength="maxlength"
      :aria-invalid="error ? 'true' : undefined"
      :aria-describedby="error || hint ? hintId : undefined"
      :class="
        cn(
          'w-full resize-y rounded-[var(--octagon-radius-md)] border bg-[var(--octagon-color-bg-surface)] p-3.5 text-sm leading-relaxed text-ink outline-none transition placeholder:text-[var(--octagon-color-text-muted)]',
          'border-[var(--octagon-color-border-field)] hover:border-[var(--octagon-color-border-field-hover)]',
          'focus:border-[var(--octagon-color-focus-ring)] focus:ring-2 focus:ring-[var(--octagon-color-focus-ring)]/40',
          'disabled:cursor-not-allowed disabled:border-[var(--octagon-color-border-field-disabled)] disabled:opacity-45',
          error && 'border-[var(--octagon-priority-critical)] focus:border-[var(--octagon-priority-critical)] focus:ring-[var(--octagon-priority-critical)]/30',
        )
      "
    />

    <div v-if="error || hint" class="mt-2 flex items-start justify-between gap-3">
      <p v-if="error" :id="hintId" class="text-xs text-[var(--octagon-priority-critical)]" role="alert">
        {{ error }}
      </p>
      <p v-else :id="hintId" class="text-xs text-subtle">{{ hint }}</p>
      <span v-if="maxlength" class="shrink-0 text-xs tabular-nums text-subtle">
        {{ model.length }}/{{ maxlength }}
      </span>
    </div>
  </div>
</template>
