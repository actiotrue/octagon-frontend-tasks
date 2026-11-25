<script setup lang="ts">
import type { MockScenario, SupportRequest } from '~/types'

const props = withDefaults(
  defineProps<{
    requests: SupportRequest[]
    scenario?: MockScenario
    hasActiveFilters?: boolean
  }>(),
  { scenario: 'normal', hasActiveFilters: false },
)

const emit = defineEmits<{
  retry: []
  reset: []
}>()
</script>

<template>
  <section aria-label="Список заявок" :aria-busy="props.scenario === 'loading'">
    <RequestListSkeleton v-if="props.scenario === 'loading'" />

    <ErrorState
      v-else-if="props.scenario === 'error'"
      description="Демо-сценарий ошибки активен. Повторите попытку или переключите состояние на «Обычный»."
      @retry="emit('retry')"
    />

    <EmptyState
      v-else-if="props.scenario === 'empty'"
      title="Заявок пока нет"
      description="В демо-сценарии «Пусто» данные намеренно скрыты. Переключите состояние, чтобы увидеть реестр."
    >
      <BaseButton variant="secondary" size="sm" @click="emit('retry')">
        Показать заявки
      </BaseButton>
    </EmptyState>

    <EmptyState
      v-else-if="props.requests.length === 0"
      title="Ничего не найдено"
      :description="props.hasActiveFilters
        ? 'Попробуйте изменить поисковый запрос или сбросить фильтры.'
        : 'В реестре пока нет заявок.'"
    >
      <BaseButton
        v-if="props.hasActiveFilters"
        variant="secondary"
        size="sm"
        @click="emit('reset')"
      >
        Сбросить фильтры
      </BaseButton>
    </EmptyState>

    <RequestTable v-else :requests="props.requests" />
  </section>
</template>
