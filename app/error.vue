<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{
  error: NuxtError
}>()

useHead({
  title: props.error.statusCode === 404 ? 'Страница не найдена' : 'Ошибка',
})

const isNotFound = computed(() => props.error.statusCode === 404)

function goHome(): void {
  void clearError({ redirect: '/' })
}

function goToRequests(): void {
  void clearError({ redirect: '/requests' })
}
</script>

<template>
  <div class="flex min-h-dvh items-center justify-center px-4 py-12 sm:px-6">
    <section
      class="w-full max-w-[720px] rounded-[var(--octagon-radius-md)] border border-line bg-panel p-8 sm:p-16"
      aria-labelledby="error-title"
    >
      <p class="text-[40px] font-bold leading-none text-white" aria-hidden="true">
        {{ error.statusCode }}
      </p>

      <h1 id="error-title" class="mt-6 text-3xl font-bold tracking-[-0.01em] text-white sm:text-4xl">
        {{ isNotFound ? 'Страница не найдена' : 'Что-то пошло не так' }}
      </h1>

      <p class="mt-4 text-sm leading-relaxed text-[var(--octagon-color-text-secondary)]">
        {{
          isNotFound
            ? 'Проверьте адрес или вернитесь к заявкам.'
            : 'Не удалось обработать запрос. Попробуйте вернуться к заявкам.'
        }}
      </p>

      <p
        v-if="!isNotFound && error.message"
        class="mt-4 break-words rounded-[var(--octagon-radius-md)] border border-line bg-[var(--octagon-color-bg-surface)] px-4 py-3 text-xs leading-relaxed text-subtle"
      >
        {{ error.message }}
      </p>

      <div class="mt-8 flex flex-wrap items-center gap-2">
        <BaseButton v-if="isNotFound" @click="goToRequests">К заявкам</BaseButton>
        <BaseButton v-else @click="goHome">На главную</BaseButton>
      </div>
    </section>
  </div>
</template>
