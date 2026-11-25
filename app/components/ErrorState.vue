<script setup lang="ts">
const props = defineProps<{
  statusCode: number
}>()

const emit = defineEmits<{
  retry: []
}>()

const title = computed(() => {
  if (props.statusCode === 429) return 'Слишком много запросов'
  if (props.statusCode === 404) return 'Заявка не найдена'
  return 'Не удалось загрузить данные'
})

const description = computed(() => {
  if (props.statusCode === 429) {
    return 'Сервер перегружен запросами. Подождите немного и повторите попытку.'
  }
  if (props.statusCode === 404) {
    return 'Данные недоступны: запись не найдена или была удалена.'
  }
  return 'Сервер временно недоступен. Проверьте соединение и повторите попытку.'
})
</script>

<template>
  <div
    class="rounded-[var(--octagon-radius-md)] border border-line bg-panel px-5 py-12 text-center sm:px-8"
    role="alert"
  >
    <div class="mx-auto grid size-12 place-items-center rounded-full border border-[var(--octagon-status-escalated-bg)] bg-[var(--octagon-status-escalated-bg)] text-[var(--octagon-priority-critical)]">
      <BaseIcon name="alert-triangle" :size="22" />
    </div>
    <h2 class="mt-4 text-base font-medium text-ink">{{ title }}</h2>
    <p class="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted">
      {{ description }}
      <span class="mt-1 block text-xs text-subtle">Код ответа: {{ statusCode }}</span>
    </p>
    <div class="mt-5 flex flex-wrap items-center justify-center gap-2">
      <BaseButton size="sm" @click="emit('retry')">
        <template #leading>
          <BaseIcon name="refresh" :size="14" />
        </template>
        Повторить
      </BaseButton>
    </div>
  </div>
</template>
