<script setup lang="ts">
import type { SupportRequest } from '~/types'

defineProps<{
  requests: SupportRequest[]
}>()
</script>

<template>
  <div>
    <div class="hidden overflow-hidden rounded-[var(--octagon-radius-md)] border border-line bg-panel md:block">
      <table class="w-full table-fixed border-collapse text-left">
        <caption class="sr-only">
          Список заявок службы поддержки
        </caption>
        <thead class="bg-[var(--octagon-color-bg-subtle)]">
          <tr class="text-xs font-medium text-[var(--octagon-color-text-secondary)]">
            <th scope="col" class="w-[76px] px-4 py-3 font-medium">Номер</th>
            <th scope="col" class="px-4 py-3 font-medium">Заявка</th>
            <th scope="col" class="hidden w-[138px] px-4 py-3 font-medium lg:table-cell">Клиент</th>
            <th scope="col" class="hidden w-[152px] px-4 py-3 font-medium xl:table-cell">Исполнитель</th>
            <th scope="col" class="w-[116px] px-4 py-3 font-medium">Статус</th>
            <th scope="col" class="w-[106px] px-4 py-3 font-medium">Приоритет</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="request in requests"
            :key="request.id"
            class="border-t border-white/[0.06] transition-colors hover:bg-[var(--octagon-color-bg-accent-soft)]"
          >
            <td class="px-4 py-3.5 align-middle">
              <NuxtLink
                :to="`/requests/${request.id}`"
                class="rounded text-xs tabular-nums text-[var(--octagon-color-text-secondary)] transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--octagon-color-focus-ring)]"
                :aria-label="`Открыть заявку ${request.number}`"
              >
                #{{ request.number }}
              </NuxtLink>
            </td>
            <td class="min-w-0 px-4 py-3.5 align-middle">
              <NuxtLink
                :to="`/requests/${request.id}`"
                class="line-clamp-2 rounded text-sm font-medium text-ink transition hover:text-white hover:underline hover:underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--octagon-color-focus-ring)]"
              >
                {{ request.title }}
              </NuxtLink>
            </td>
            <td class="hidden truncate px-4 py-3.5 align-middle text-xs text-[var(--octagon-color-text-secondary)] lg:table-cell">
              {{ request.client }}
            </td>
            <td
              class="hidden truncate px-4 py-3.5 align-middle text-xs xl:table-cell"
              :class="request.assignee ? 'text-[var(--octagon-color-text-secondary)]' : 'text-subtle'"
            >
              {{ request.assignee ?? 'Не назначен' }}
            </td>
            <td class="px-4 py-3.5 align-middle">
              <StatusBadge :status="request.status" size="sm" />
            </td>
            <td class="px-4 py-3.5 align-middle">
              <PriorityBadge :priority="request.priority" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="grid gap-3 md:hidden">
      <RequestMobileCard
        v-for="request in requests"
        :key="request.id"
        :request="request"
      />
    </div>
  </div>
</template>
