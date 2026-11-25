<script setup lang="ts">
import type { RequestFilters, RequestPriority, RequestStatus, RequestSort, SelectOption } from '~/types'
import {
  DEFAULT_FILTERS,
  PRIORITY_FILTER_OPTIONS,
  SORT_OPTIONS,
  STATUS_FILTER_OPTIONS,
  TEAM,
  hasActiveFilters,
} from '~/utils/requests'

const model = defineModel<RequestFilters>({ required: true })
const emit = defineEmits<{ reset: [] }>()

const assigneeOptions: SelectOption[] = [
  { value: 'all', label: 'Все исполнители' },
  { value: 'none', label: 'Не назначена' },
  ...TEAM.map(name => ({ value: name, label: name })),
]

const active = computed(() => hasActiveFilters(model.value))

function patch<K extends keyof RequestFilters>(key: K, value: RequestFilters[K]): void {
  model.value = { ...model.value, [key]: value }
}

function reset(): void {
  model.value = { ...DEFAULT_FILTERS }
  emit('reset')
}
</script>

<template>
  <section class="panel p-4 sm:p-5" aria-label="Фильтры заявок">
    <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <BaseInput
        :model-value="model.q"
        label="Поиск"
        placeholder="Номер, тема или клиент"
        inputmode="search"
        aria-label="Поиск заявок"
        @update:model-value="value => patch('q', value)"
      >
        <template #leading>
          <BaseIcon name="search" :size="15" />
        </template>
      </BaseInput>

      <BaseSelect
        :model-value="model.status"
        label="Статус"
        :options="STATUS_FILTER_OPTIONS"
        aria-label="Фильтр по статусу"
        @change="value => patch('status', value as RequestStatus | 'all')"
      />

      <BaseSelect
        :model-value="model.priority"
        label="Приоритет"
        :options="PRIORITY_FILTER_OPTIONS"
        aria-label="Фильтр по приоритету"
        @change="value => patch('priority', value as RequestPriority | 'all')"
      />

      <BaseSelect
        :model-value="model.assignee"
        label="Исполнитель"
        :options="assigneeOptions"
        aria-label="Фильтр по исполнителю"
        @change="value => patch('assignee', value)"
      />
    </div>

    <div class="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
      <p class="text-xs text-subtle">
        Фильтры сохраняются в адресе страницы · стрелки и Enter работают в выпадающих списках
      </p>
      <div class="flex items-center gap-3">
        <BaseSelect
          :model-value="model.sort"
          size="sm"
          :options="SORT_OPTIONS"
          aria-label="Сортировка заявок"
          class="w-44"
          @change="value => patch('sort', value as RequestSort)"
        />
        <BaseButton variant="ghost" size="sm" :disabled="!active" @click="reset">
          <template #leading>
            <BaseIcon name="refresh" :size="14" />
          </template>
          Сбросить
        </BaseButton>
      </div>
    </div>
  </section>
</template>
