<script setup lang="ts">
import type { SupportRequest } from '~/types'

const props = withDefaults(
  defineProps<{
    requests: SupportRequest[]
    pending?: boolean
    error?: boolean
    statusCode?: number
    hasActiveFilters?: boolean
  }>(),
  { pending: false, error: false, statusCode: 0, hasActiveFilters: false },
)

const emit = defineEmits<{
  retry: []
  reset: []
}>()
</script>

<template>
  <section aria-label="Список заявок" :aria-busy="props.pending">
    <RequestListSkeleton v-if="props.pending" />

    <ErrorState
      v-else-if="props.error"
      :status-code="props.statusCode"
      @retry="emit('retry')"
    />

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
