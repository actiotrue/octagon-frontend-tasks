<script setup lang="ts">
import type { ApiRequestListResponse } from '~~/shared/types/api'
import { createLookup, mapRequest } from '~/utils/apiMappers'

definePageMeta({
  layout: 'default',
  title: 'Обзор',
})

const RECENT_LIMIT = 3

// Сводка по всем заявкам — с сервера.
const { data: stats, pending: statsPending } = useFetch('/api/stats')

// Последние заявки.
const {
  data,
  pending,
  error,
  refresh,
} = useFetch<ApiRequestListResponse>('/api/requests', {
  query: { sort: 'newest', limit: RECENT_LIMIT },
})

const recent = computed(() => {
  const payload = data.value
  if (!payload) return []
  const lookup = createLookup(payload.users, payload.customers, payload.categories)
  return payload.items.map(request => mapRequest(request, lookup))
})

const statusCode = computed(() =>
  typeof error.value?.statusCode === 'number' ? error.value.statusCode : 500,
)

const emptyStats = { new: 0, active: 0, waiting: 0, resolved: 0 }
</script>

<template>
  <div class="space-y-6">
    <PageHeader
      title="Обзор"
      description="Обзор работы поддержки"
    />

    <div :aria-busy="statsPending">
      <StatsGrid :stats="stats ?? emptyStats" />
    </div>

    <section aria-labelledby="recent-title" class="space-y-4">
      <h2 id="recent-title" class="text-xl font-bold tracking-[-0.01em] text-white">
        Последние заявки
      </h2>

      <BaseButton to="/requests" size="md">
        Все заявки
      </BaseButton>

      <RequestList
        :requests="recent"
        :pending="pending"
        :error="!!error"
        :status-code="statusCode"
        @retry="() => refresh()"
        @reset="() => {}"
      />
    </section>
  </div>
</template>
