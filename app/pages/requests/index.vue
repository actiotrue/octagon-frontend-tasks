<script setup lang="ts">
import type { NewRequestInput, RequestFilters as RequestFiltersModel } from '~/types'
import {
  DEFAULT_FILTERS,
  filterRequests,
  hasActiveFilters,
  paginate,
  parseAssigneeFilter,
  parsePriorityFilter,
  parseSort,
  parseStatusFilter,
} from '~/utils/requests'

definePageMeta({
  layout: 'default',
  title: 'Заявки',
})

const route = useRoute()
const router = useRouter()
const { requests, createRequest } = useRequestStore()
const { scenario, setScenario } = useMockScenario()

const PER_PAGE = 12

function readString(value: unknown): string {
  return typeof value === 'string' ? value : ''
}

const filters = ref<RequestFiltersModel>({
  q: readString(route.query.q),
  status: parseStatusFilter(route.query.status),
  priority: parsePriorityFilter(route.query.priority),
  assignee: parseAssigneeFilter(route.query.assignee),
  sort: parseSort(route.query.sort),
})

const page = ref(Math.max(1, Number.parseInt(readString(route.query.page), 10) || 1))
const createModalOpen = ref(false)

const filtered = computed(() => filterRequests(requests.value, filters.value))
const pageCount = computed(() => Math.max(1, Math.ceil(filtered.value.length / PER_PAGE)))
const safePage = computed(() => Math.min(page.value, pageCount.value))
const visibleRequests = computed(() => paginate(filtered.value, safePage.value, PER_PAGE))
const from = computed(() => (safePage.value - 1) * PER_PAGE + 1)
const to = computed(() => Math.min(safePage.value * PER_PAGE, filtered.value.length))
const activeFilters = computed(() => hasActiveFilters(filters.value))
const sortLabel = computed(() => {
  if (filters.value.sort === 'oldest') return 'Сначала старые'
  if (filters.value.sort === 'priority') return 'По приоритету'
  return 'Сначала новые'
})

function buildQuery(): Record<string, string | null> {
  return {
    q: filters.value.q.trim() || null,
    status: filters.value.status === 'all' ? null : filters.value.status,
    priority: filters.value.priority === 'all' ? null : filters.value.priority,
    assignee: filters.value.assignee === 'all' ? null : filters.value.assignee,
    sort: filters.value.sort === 'newest' ? null : filters.value.sort,
    page: page.value > 1 ? String(page.value) : null,
    state: typeof route.query.state === 'string' ? route.query.state : null,
  }
}

watch(filters, () => { page.value = 1 }, { deep: true })

watch(pageCount, (count) => {
  if (page.value > count) page.value = count
})

watch(
  () => [
    filters.value.q,
    filters.value.status,
    filters.value.priority,
    filters.value.assignee,
    filters.value.sort,
    page.value,
  ],
  () => {
    void router.replace({ path: route.path, query: buildQuery() })
  },
)

function resetFilters(): void {
  filters.value = { ...DEFAULT_FILTERS }
}

async function handleCreate(input: NewRequestInput): Promise<void> {
  const created = createRequest(input)
  await navigateTo(`/requests/${created.id}`)
}
</script>

<template>
  <div class="space-y-6">
    <PageHeader
      title="Заявки"
      description="Все обращения в одном месте"
    >
      <template #actions>
        <BaseButton size="sm" @click="createModalOpen = true">
          <template #leading>
            <BaseIcon name="plus" :size="15" />
          </template>
          Новая заявка
        </BaseButton>
      </template>
    </PageHeader>

    <RequestFilters v-model="filters" @reset="resetFilters" />

    <div class="flex flex-wrap items-center justify-between gap-2 text-xs text-subtle">
      <p aria-live="polite">
        Найдено:
        <span class="font-medium text-ink tabular-nums">{{ filtered.length }}</span>
      </p>
      <p>{{ sortLabel }}</p>
    </div>

    <RequestList
      :requests="visibleRequests"
      :scenario="scenario"
      :has-active-filters="activeFilters"
      @retry="setScenario('normal')"
      @reset="resetFilters"
    />

    <PaginationBar
      v-if="scenario === 'normal' && filtered.length > 0"
      :page="safePage"
      :page-count="pageCount"
      :total="filtered.length"
      :from="from"
      :to="to"
      @update:page="value => page = value"
    />

    <section class="flex flex-col gap-4 rounded-xl border border-line bg-panel/50 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div class="min-w-0">
        <p class="text-sm font-medium text-ink">Демо-состояния списка</p>
        <p class="mt-1 text-xs text-subtle">
          Проверьте загрузку, пустой реестр и ошибку — состояние добавляется в URL.
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
