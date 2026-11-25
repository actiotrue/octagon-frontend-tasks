<script setup lang="ts">
import type { SupportRequest } from '~/types'
import { formatShortDate } from '~/utils/format'

defineProps<{
  request: SupportRequest
}>()
</script>

<template>
  <NuxtLink
    :to="`/requests/${request.id}`"
    class="group block rounded-[var(--octagon-radius-md)] border border-line bg-panel p-4 transition duration-150 hover:border-[var(--octagon-color-border-strong)] hover:bg-[var(--octagon-color-bg-accent-soft)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--octagon-color-focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
  >
    <div class="flex items-center justify-between gap-3">
      <span class="text-xs tabular-nums text-subtle">#{{ request.number }}</span>
      <StatusBadge :status="request.status" size="sm" />
    </div>

    <h3 class="mt-2 text-[15px] font-medium leading-snug text-ink group-hover:text-white">
      {{ request.title }}
    </h3>

    <dl class="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 text-xs">
      <div class="min-w-0">
        <dt class="text-subtle">Клиент</dt>
        <dd class="mt-0.5 truncate text-[var(--octagon-color-text-secondary)]">{{ request.client }}</dd>
      </div>
      <div class="min-w-0">
        <dt class="text-subtle">Исполнитель</dt>
        <dd class="mt-0.5 truncate" :class="request.assignee ? 'text-[var(--octagon-color-text-secondary)]' : 'text-subtle'">
          {{ request.assignee ?? 'Не назначен' }}
        </dd>
      </div>
    </dl>

    <div class="mt-3 flex items-center justify-between gap-3 border-t border-white/[0.06] pt-3">
      <PriorityBadge :priority="request.priority" />
      <span class="flex items-center gap-1.5 text-[11px] text-subtle">
        {{ formatShortDate(request.createdAt) }}
        <BaseIcon name="chevron-right" :size="13" class="transition-transform group-hover:translate-x-0.5" />
      </span>
    </div>
  </NuxtLink>
</template>
