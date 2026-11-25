<script setup lang="ts">
import type { RequestPriority } from '~/types'
import { PRIORITY_META } from '~/utils/requests'

const props = defineProps<{ priority: RequestPriority }>()
const meta = computed(() => PRIORITY_META[props.priority])
</script>

<template>
  <span
    class="inline-flex items-center gap-1.5 whitespace-nowrap text-xs font-medium"
    :class="meta.textClass"
  >
    <BaseIcon :name="meta.icon" :size="14" />
    {{ meta.label }}
  </span>
</template>
