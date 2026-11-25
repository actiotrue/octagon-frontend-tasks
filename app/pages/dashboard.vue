<script setup lang="ts">
import type { NewRequestInput } from '~/types'
import { getRequestStats } from '~/utils/requests'

definePageMeta({
  layout: 'default',
  title: 'Обзор',
})

const { requests, createRequest } = useRequestStore()

const stats = computed(() => getRequestStats(requests.value))
const recent = computed(() =>
  [...requests.value]
    .sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt))
    .slice(0, 3),
)

const createModalOpen = ref(false)

async function handleCreate(input: NewRequestInput): Promise<void> {
  const created = createRequest(input)
  await navigateTo(`/requests/${created.id}`)
}
</script>

<template>
  <div class="space-y-6">
    <PageHeader
      title="Обзор"
      description="Обзор работы поддержки"
    />

    <StatsGrid :stats="stats" />

    <section aria-labelledby="recent-title" class="space-y-4">
      <h2 id="recent-title" class="text-xl font-bold tracking-[-0.01em] text-white">
        Последние заявки
      </h2>

      <BaseButton to="/requests" size="md">
        Все заявки
      </BaseButton>

      <RequestList
        :requests="recent"
        @reset="() => {}"
      />
    </section>

    <NewRequestModal v-model:open="createModalOpen" @create="handleCreate" />
  </div>
</template>
