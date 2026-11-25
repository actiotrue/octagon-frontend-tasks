<script setup lang="ts">
import { cn } from '~/utils/cn'

const props = withDefaults(
  defineProps<{
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
    size?: 'sm' | 'md' | 'lg'
    type?: 'button' | 'submit' | 'reset'
    to?: string
    disabled?: boolean
    loading?: boolean
    block?: boolean
  }>(),
  {
    variant: 'primary',
    size: 'md',
    type: 'button',
    disabled: false,
    loading: false,
    block: false,
  },
)

const classes = computed(() =>
  cn(
    'inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-[var(--octagon-radius-md)] font-medium transition duration-150',
    'focus-ring focus-visible:outline-none',
    props.block && 'w-full',
    props.size === 'sm' && 'h-9 px-3 text-xs',
    props.size === 'md' && 'h-10 px-4 text-sm',
    props.size === 'lg' && 'h-11 px-5 text-sm',
    props.variant === 'primary' &&
      'bg-[linear-gradient(90deg,var(--octagon-color-action-from)_0%,var(--octagon-color-action-to)_100%)] text-[var(--octagon-color-text-inverse)] hover:brightness-110 active:brightness-95',
    props.variant === 'secondary' &&
      'border border-[var(--octagon-color-border-strong)] bg-[var(--octagon-color-bg-surface)] text-[var(--octagon-color-text-primary)] hover:bg-[var(--octagon-color-bg-subtle)]',
    props.variant === 'ghost' &&
      'text-[var(--octagon-color-text-accent)] hover:bg-[var(--octagon-color-bg-accent-soft)]',
    props.variant === 'danger' &&
      'border border-[var(--octagon-status-escalated-bg)] bg-[var(--octagon-status-escalated-bg)] text-[var(--octagon-priority-critical)] hover:brightness-110',
    (props.disabled || props.loading) &&
      'pointer-events-none opacity-45 text-[var(--octagon-color-text-disabled)]',
  ),
)
</script>

<template>
  <NuxtLink v-if="to && !disabled" :to="to" :class="classes">
    <slot name="leading" />
    <slot />
    <slot name="trailing" />
  </NuxtLink>

  <span v-else-if="to" :class="classes" aria-disabled="true" role="link" tabindex="-1">
    <slot name="leading" />
    <slot />
    <slot name="trailing" />
  </span>

  <button
    v-else
    :type="type"
    :class="classes"
    :disabled="disabled || loading"
    :aria-busy="loading || undefined"
  >
    <span
      v-if="loading"
      class="size-4 animate-spin rounded-full border-2 border-white/35 border-t-white"
      aria-hidden="true"
    />
    <slot v-else name="leading" />
    <slot />
    <slot name="trailing" />
  </button>
</template>
