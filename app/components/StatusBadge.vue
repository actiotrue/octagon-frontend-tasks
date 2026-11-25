<script setup lang="ts">
import type { RequestStatus } from '~/types'
import { STATUS_BG, STATUS_META } from '~/utils/requests'

const props = withDefaults(defineProps<{
  status: RequestStatus
  size?: 'sm' | 'md'
}>(), { size: 'md' })

const meta = computed(() => STATUS_META[props.status])
</script>

<template>
  <span
    class="inline-flex items-center gap-1.5 whitespace-nowrap rounded-[var(--octagon-radius-full)]"
    :class="[
      STATUS_BG[status],
      meta.textClass,
      size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs font-semibold',
    ]"
  >
    <span class="size-1.5 shrink-0 rounded-full" :class="meta.dotClass" aria-hidden="true" />
    {{ meta.label }}
  </span>
</template>
