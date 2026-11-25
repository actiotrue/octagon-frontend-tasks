<script setup lang="ts">
import type { SupportRequest } from '~/types'

const props = withDefaults(
  defineProps<{
    requests: SupportRequest[]
    hasActiveFilters?: boolean
  }>(),
  { hasActiveFilters: false },
)

const emit = defineEmits<{
  reset: []
}>()
</script>

<template>
  <section aria-label="Список заявок">
    <EmptyState
      v-if="props.requests.length === 0"
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
