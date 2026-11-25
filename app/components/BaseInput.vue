<script setup lang="ts">
import { cn } from '~/utils/cn'

const props = withDefaults(
  defineProps<{
    id?: string
    label?: string
    type?: string
    placeholder?: string
    hint?: string
    error?: string
    disabled?: boolean
    readonly?: boolean
    autocomplete?: string
    name?: string
    maxlength?: number
    inputmode?: 'text' | 'email' | 'numeric' | 'search' | 'tel' | 'url'
  }>(),
  {
    type: 'text',
    disabled: false,
    readonly: false,
  },
)

const model = defineModel<string>({ default: '' })
const generatedId = useId()
const inputId = computed(() => props.id || `input-${generatedId}`)
const hintId = computed(() => `${inputId.value}-hint`)
const inputElement = ref<HTMLInputElement | null>(null)

const describedBy = computed(() => {
  if (props.error || props.hint) return hintId.value
  return undefined
})

function focus(): void {
  inputElement.value?.focus()
}

function select(): void {
  inputElement.value?.select()
}

defineExpose({ focus, select })
</script>

<template>
  <div class="w-full">
    <label
      v-if="label"
      :for="inputId"
      class="mb-2 block text-xs font-semibold text-[var(--octagon-color-text-primary)]"
    >
      {{ label }}
    </label>

    <div class="relative">
      <span
        v-if="$slots.leading"
        class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-subtle"
      >
        <slot name="leading" />
      </span>

      <input
        :id="inputId"
        ref="inputElement"
        v-model="model"
        :type="type"
        :name="name"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :autocomplete="autocomplete"
        :maxlength="maxlength"
        :inputmode="inputmode"
        :aria-invalid="error ? 'true' : undefined"
        :aria-describedby="describedBy"
        :class="
          cn(
            'h-11 w-full rounded-[var(--octagon-radius-md)] border bg-[var(--octagon-color-bg-surface)] p-3.5 text-sm text-ink outline-none transition placeholder:text-[var(--octagon-color-text-muted)]',
            'border-[var(--octagon-color-border-field)] hover:border-[var(--octagon-color-border-field-hover)]',
            'focus:border-[var(--octagon-color-focus-ring)] focus:ring-2 focus:ring-[var(--octagon-color-focus-ring)]/40',
            'disabled:cursor-not-allowed disabled:border-[var(--octagon-color-border-field-disabled)] disabled:opacity-45',
            $slots.leading && 'pl-9',
            $slots.trailing && 'pr-11',
            error && 'border-[var(--octagon-priority-critical)] focus:border-[var(--octagon-priority-critical)] focus:ring-[var(--octagon-priority-critical)]/30',
          )
        "
      />

      <span
        v-if="$slots.trailing"
        class="absolute right-1.5 top-1/2 -translate-y-1/2"
      >
        <slot name="trailing" />
      </span>
    </div>

    <p
      v-if="error"
      :id="hintId"
      class="mt-2 text-xs text-[var(--octagon-priority-critical)]"
      role="alert"
    >
      {{ error }}
    </p>
    <p v-else-if="hint" :id="hintId" class="mt-2 text-xs text-subtle">
      {{ hint }}
    </p>
  </div>
</template>
