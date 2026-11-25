<script setup lang="ts">
withDefaults(
  defineProps<{
    title?: string
    description?: string
    retryLabel?: string
  }>(),
  {
    title: 'Не удалось загрузить данные',
    description: 'Что-то пошло не так. Попробуйте обновить список ещё раз.',
    retryLabel: 'Повторить',
  },
)

const emit = defineEmits<{
  retry: []
}>()
</script>

<template>
  <div
    class="rounded-xl border border-[var(--octagon-status-escalated-bg)] bg-[var(--octagon-status-escalated-bg)] px-5 py-10 text-center sm:px-8"
    role="alert"
  >
    <div class="mx-auto grid size-12 place-items-center rounded-full border border-[var(--octagon-status-escalated-bg)] bg-[var(--octagon-status-escalated-bg)] text-[var(--octagon-priority-critical)]">
      <BaseIcon name="alert-triangle" :size="22" />
    </div>
    <h2 class="mt-4 text-base font-medium text-white">{{ title }}</h2>
    <p class="mx-auto mt-2 max-w-md text-sm leading-relaxed text-[var(--octagon-color-text-secondary)]">
      {{ description }}
    </p>
    <div class="mt-5 flex flex-wrap items-center justify-center gap-2">
      <BaseButton variant="secondary" size="sm" @click="emit('retry')">
        <template #leading>
          <BaseIcon name="refresh" :size="14" />
        </template>
        {{ retryLabel }}
      </BaseButton>
      <slot />
    </div>
  </div>
</template>
