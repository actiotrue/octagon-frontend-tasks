<script setup lang="ts">
import type { TimelineEvent, TimelineEventType } from '~/types'
import { formatDateTime } from '~/utils/format'

const props = defineProps<{ events: TimelineEvent[] }>()

const iconByType: Record<TimelineEventType, string> = {
  created: 'plus',
  assigned: 'user',
  status: 'refresh',
  resolved: 'check-circle',
  comment: 'message',
  priority: 'arrow-up',
  closed: 'check',
}

const formatTime = (iso: string): string => formatDateTime(iso).split(',').pop()?.trim() ?? ''
</script>

<template>
  <ol v-if="props.events.length" class="space-y-4">
    <li v-for="event in props.events" :key="event.id" class="flex gap-3">
      <span class="w-12 shrink-0 text-xs tabular-nums text-[var(--octagon-color-text-secondary)]">
        {{ formatTime(event.createdAt) }}
      </span>
      <p class="min-w-0 flex-1 text-sm leading-relaxed text-[var(--octagon-color-text-primary)]">
        {{ event.description || event.title }}
        <span v-if="event.author" class="text-[var(--octagon-color-text-secondary)]"> — {{ event.author }}</span>
      </p>
    </li>
  </ol>

  <p v-else class="text-sm text-subtle">Событий пока нет.</p>
</template>
