<script setup lang="ts">
import type { NewRequestInput, RequestFilters as RequestFiltersModel } from '~/types'
import type { ApiRequestListResponse } from '~~/shared/types/api'
import {
  DEFAULT_FILTERS,
  hasActiveFilters,
  parseAssigneeFilter,
  parsePriorityFilter,
  parseSort,
  parseStatusFilter,
} from '~/utils/requests'
import { createLookup, mapRequest } from '~/utils/apiMappers'
import { useRequestsStore } from '~/stores/requests'

definePageMeta({
  layout: 'default',
  title: 'Заявки',
})

const route = useRoute()
const router = useRouter()

const PER_PAGE = 12
const SEARCH_DEBOUNCE_MS = 300

function readString(value: unknown): string {
  return typeof value === 'string' ? value : ''
}

// Состояние фильтров восстанавливается из URL при прямой ссылке.
const filters = ref<RequestFiltersModel>({
  q: readString(route.query.q),
  status: parseStatusFilter(route.query.status),
  priority: parsePriorityFilter(route.query.priority),
  assignee: parseAssigneeFilter(route.query.assignee),
  sort: parseSort(route.query.sort),
})

const page = ref(Math.max(1, Number.parseInt(readString(route.query.page), 10) || 1))
const createModalOpen = ref(false)

// Debounced-копия поискового запроса: запрос к API не выполняется на каждый символ.
const debouncedQ = useDebouncedRef(computed(() => filters.value.q), SEARCH_DEBOUNCE_MS)

// Единый источник параметров запроса к API.
const apiQuery = computed(() => ({
  q: debouncedQ.value.trim() || undefined,
  status: filters.value.status === 'all' ? undefined : filters.value.status,
  priority: filters.value.priority === 'all' ? undefined : filters.value.priority,
  assignee: filters.value.assignee === 'all' ? undefined : filters.value.assignee,
  sort: filters.value.sort === 'newest' ? undefined : filters.value.sort,
  page: page.value > 1 ? page.value : undefined,
  limit: PER_PAGE,
}))

const {
  data,
  pending,
  error,
  refresh,
} = useFetch<ApiRequestListResponse>('/api/requests', {
  query: apiQuery,
  watch: [apiQuery],
  key: 'requests-list',
})

const directories = useDirectories()
const requestsStore = useRequestsStore()

// Список уходит в store — единый источник заявок для мутаций и Undo-баннера.
watchEffect(() => {
  if (data.value) requestsStore.setList(data.value)
})

const requests = computed(() => {
  const payload = data.value
  if (!payload) return []
  const lookup = createLookup(payload.users, payload.customers, payload.categories)
  return payload.items.map(request => mapRequest(request, lookup))
})

const total = computed(() => data.value?.total ?? 0)
const pageCount = computed(() => data.value?.pageCount ?? 1)
const safePage = computed(() => data.value?.page ?? page.value)
const from = computed(() => (total.value === 0 ? 0 : (safePage.value - 1) * PER_PAGE + 1))
const to = computed(() => Math.min(safePage.value * PER_PAGE, total.value))
const activeFilters = computed(() => hasActiveFilters(filters.value))
const sortLabel = computed(() => {
  if (filters.value.sort === 'oldest') return 'Сначала старые'
  if (filters.value.sort === 'priority') return 'По приоритету'
  return 'Сначала новые'
})

const statusCode = computed(() =>
  typeof error.value?.statusCode === 'number' ? error.value.statusCode : 500,
)

function buildQuery(): Record<string, string | null> {
  return {
    q: filters.value.q.trim() || null,
    status: filters.value.status === 'all' ? null : filters.value.status,
    priority: filters.value.priority === 'all' ? null : filters.value.priority,
    assignee: filters.value.assignee === 'all' ? null : filters.value.assignee,
    sort: filters.value.sort === 'newest' ? null : filters.value.sort,
    page: page.value > 1 ? String(page.value) : null,
  }
}

// Изменение фильтров сбрасывает страницу и синхронизирует URL.
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
  page.value = 1
}

async function handleCreate(input: NewRequestInput): Promise<void> {
  const customerId = directories.data.value?.customers.find(
    customer => customer.name === input.client,
  )?.id
  const categoryId = directories.data.value?.categories.find(
    category => category.name === input.category,
  )?.id

  await $fetch('/api/requests', {
    method: 'POST',
    body: {
      title: input.title,
      customerId,
      priority: input.priority,
      categoryId,
      description: input.description,
    },
  })

  createModalOpen.value = false
  await refresh()
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

    <RequestFilters v-model="filters" :users="directories.data.value?.users ?? []" />

    <div class="flex flex-wrap items-center justify-between gap-2 text-xs text-subtle">
      <p aria-live="polite">
        Найдено:
        <span class="font-medium text-ink tabular-nums">{{ total }}</span>
      </p>
      <p>{{ sortLabel }}</p>
    </div>

    <RequestList
      :requests="requests"
      :pending="pending"
      :error="!!error"
      :status-code="statusCode"
      :has-active-filters="activeFilters"
      @retry="() => refresh()"
      @reset="resetFilters"
    />

    <PaginationBar
      v-if="!pending && !error && total > 0"
      :page="safePage"
      :page-count="pageCount"
      :total="total"
      :from="from"
      :to="to"
      @update:page="value => page = value"
    />

    <NewRequestModal
      v-model:open="createModalOpen"
      :customers="directories.data.value?.customers ?? []"
      :categories="directories.data.value?.categories ?? []"
      @create="handleCreate"
    />
  </div>
</template>
