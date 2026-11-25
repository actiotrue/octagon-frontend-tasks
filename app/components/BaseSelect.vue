<script setup lang="ts">
import type { SelectOption } from '~/types'
import { cn } from '~/utils/cn'

const props = withDefaults(
  defineProps<{
    options: SelectOption[]
    label?: string
    placeholder?: string
    ariaLabel?: string
    disabled?: boolean
    size?: 'sm' | 'md'
  }>(),
  {
    placeholder: 'Выберите значение',
    disabled: false,
    size: 'md',
  },
)

const model = defineModel<string>({ default: '' })
const emit = defineEmits<{ change: [value: string] }>()

const open = ref(false)
const openUp = ref(false)
const activeIndex = ref(-1)
const wrapper = ref<HTMLElement | null>(null)
const trigger = ref<HTMLButtonElement | null>(null)
const listbox = ref<HTMLElement | null>(null)
const generatedId = useId()
const labelId = `${generatedId}-label`
const listboxId = `${generatedId}-listbox`

const selected = computed(() =>
  props.options.find((option) => option.value === model.value),
)
const selectedIndex = computed(() =>
  props.options.findIndex((option) => option.value === model.value),
)

function optionId(index: number): string {
  return `${generatedId}-option-${index}`
}

function scrollActive(): void {
  const node = listbox.value?.querySelector<HTMLElement>(
    `[data-index="${activeIndex.value}"]`,
  )
  node?.scrollIntoView({ block: 'nearest' })
}

function openMenu(direction: 1 | -1 = 1): void {
  if (props.disabled || props.options.length === 0) return

  const rect = trigger.value?.getBoundingClientRect()
  openUp.value = rect
    ? rect.bottom > window.innerHeight - 260 && rect.top > 260
    : false
  open.value = true

  if (selectedIndex.value >= 0) {
    activeIndex.value = selectedIndex.value
  } else {
    activeIndex.value = direction === 1 ? 0 : props.options.length - 1
  }

  void nextTick(scrollActive)
}

function closeMenu(focusTrigger = true): void {
  open.value = false
  activeIndex.value = -1
  if (focusTrigger) {
    void nextTick(() => trigger.value?.focus())
  }
}

function select(index: number): void {
  const option = props.options[index]
  if (!option) return
  model.value = option.value
  emit('change', option.value)
  closeMenu()
}

function move(delta: 1 | -1): void {
  if (!open.value) {
    openMenu(delta)
    return
  }
  const count = props.options.length
  if (count === 0) return
  activeIndex.value = (activeIndex.value + delta + count) % count
  void nextTick(scrollActive)
}

function onTriggerKeydown(event: KeyboardEvent): void {
  if (props.disabled) return

  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault()
      move(1)
      break
    case 'ArrowUp':
      event.preventDefault()
      move(-1)
      break
    case 'Home':
      if (!open.value) return
      event.preventDefault()
      activeIndex.value = 0
      void nextTick(scrollActive)
      break
    case 'End':
      if (!open.value) return
      event.preventDefault()
      activeIndex.value = props.options.length - 1
      void nextTick(scrollActive)
      break
    case 'Enter':
    case ' ':
      event.preventDefault()
      if (!open.value) {
        openMenu()
      } else {
        select(activeIndex.value >= 0 ? activeIndex.value : selectedIndex.value)
      }
      break
    case 'Escape':
      if (open.value) {
        event.preventDefault()
        closeMenu()
      }
      break
    case 'Tab':
      if (open.value) closeMenu(false)
      break
  }
}

useClickOutside(wrapper, () => {
  if (open.value) closeMenu(false)
})

watch(
  () => props.disabled,
  (disabled) => {
    if (disabled) closeMenu(false)
  },
)
</script>

<template>
  <div ref="wrapper" class="relative w-full">
    <label
      v-if="label"
      :id="labelId"
      class="mb-2 block text-xs font-semibold text-[var(--octagon-color-text-primary)]"
    >
      {{ label }}
    </label>

    <button
      ref="trigger"
      type="button"
      role="combobox"
      :aria-expanded="open"
      :aria-controls="listboxId"
      :aria-labelledby="label ? labelId : undefined"
      :aria-label="!label ? ariaLabel : undefined"
      :aria-activedescendant="
        open && activeIndex >= 0 ? optionId(activeIndex) : undefined
      "
      :disabled="disabled"
      :class="
        cn(
          'flex w-full items-center justify-between gap-2 rounded-[var(--octagon-radius-md)] border bg-[var(--octagon-color-bg-surface)] text-left text-ink outline-none transition',
          'border-[var(--octagon-color-border-field)] hover:border-[var(--octagon-color-border-field-hover)]',
          'focus-visible:border-[var(--octagon-color-focus-ring)] focus-visible:ring-2 focus-visible:ring-[var(--octagon-color-focus-ring)]/40',
          'disabled:cursor-not-allowed disabled:border-[var(--octagon-color-border-field-disabled)] disabled:opacity-45',
          size === 'md' ? 'h-11 px-3 text-sm' : 'h-9 px-2.5 text-xs',
        )
      "
      @click="open ? closeMenu() : openMenu()"
      @keydown="onTriggerKeydown"
    >
      <span
        class="truncate"
        :class="!selected && 'text-[var(--octagon-color-text-muted)]'"
      >
        {{ selected?.label ?? placeholder }}
      </span>
      <BaseIcon
        name="chevron-down"
        :size="16"
        class="text-subtle transition-transform duration-150"
        :class="open && 'rotate-180'"
      />
    </button>

    <Transition
      enter-active-class="transition duration-100 ease-out"
      enter-from-class="opacity-0 -translate-y-1"
      leave-active-class="transition duration-100 ease-in"
      leave-to-class="opacity-0 -translate-y-1"
    >
      <ul
        v-if="open"
        :id="listboxId"
        ref="listbox"
        role="listbox"
        :aria-labelledby="label ? labelId : undefined"
        :aria-label="!label ? ariaLabel : undefined"
        :class="
          cn(
            'absolute z-50 max-h-64 w-full overflow-y-auto rounded-[var(--octagon-radius-lg)] border border-line bg-[var(--octagon-color-bg-surface)] p-1.5 shadow-[0_18px_50px_-12px_rgba(5,3,25,0.9)]',
            openUp ? 'bottom-full mb-2' : 'top-full mt-2',
          )
        "
      >
        <li
          v-for="(option, index) in options"
          :id="optionId(index)"
          :key="option.value"
          role="option"
          :aria-selected="option.value === model"
          :data-index="index"
          class="flex cursor-pointer items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm transition-colors"
          :class="
            cn(
              index === activeIndex
                ? 'bg-[var(--octagon-color-bg-accent-soft)] text-ink'
                : 'text-[var(--octagon-color-text-secondary)]',
              option.value === model && 'font-medium text-ink',
            )
          "
          @click="select(index)"
          @mousemove="activeIndex = index"
        >
          <span class="truncate">{{ option.label }}</span>
          <BaseIcon
            v-if="option.value === model"
            name="check"
            :size="14"
            class="text-[var(--octagon-status-new-fg)]"
          />
        </li>
      </ul>
    </Transition>
  </div>
</template>
