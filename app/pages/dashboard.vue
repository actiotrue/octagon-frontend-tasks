<script setup lang="ts">
import type { NewRequestInput } from '~/types'
import { getRequestStats } from '~/utils/requests'

definePageMeta({
  layout: 'default',
  title: 'Обзор',
})

const { requests, createRequest } = useRequestStore()
const { scenario, setScenario } = useMockScenario()

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
        :scenario="scenario"
        @retry="setScenario('normal')"
        @reset="setScenario('normal')"
      />
    </section>

    <section class="flex flex-col gap-4 rounded-[var(--octagon-radius-md)] border border-line bg-panel/50 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div class="min-w-0">
        <p class="text-sm font-medium text-ink">Демо-состояния данных</p>
        <p class="mt-1 text-xs text-subtle">
          Переключите сценарий, чтобы проверить загрузку, пустой список и ошибку.
        </p>
      </div>
      <MockStateSwitcher
        :model-value="scenario"
        @update:model-value="value => setScenario(value)"
      />
    </section>

    <NewRequestModal v-model:open="createModalOpen" @create="handleCreate" />
  </div>
</template>
