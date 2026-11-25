<script setup lang="ts">
import type { RequestComment } from '~/types'
import { formatDateTime, getInitials } from '~/utils/format'

withDefaults(
  defineProps<{
    comments: RequestComment[]
    requestTitle?: string
  }>(),
  { requestTitle: '' },
)

const emit = defineEmits<{ add: [text: string] }>()
const modalOpen = ref(false)
</script>

<template>
  <section aria-labelledby="comments-title" class="panel p-6">
    <h2 id="comments-title" class="text-lg font-bold tracking-[-0.01em] text-white">
      Комментарии
      <span class="ml-1 text-sm font-normal text-subtle">{{ comments.length }}</span>
    </h2>

    <div v-if="comments.length" class="mt-5 space-y-4">
      <article
        v-for="comment in comments"
        :key="comment.id"
        class="border-b border-white/[0.06] pb-4 last:border-b-0 last:pb-0"
      >
        <p class="text-xs font-medium text-[var(--octagon-color-text-secondary)]">
          {{ comment.author }} ·
          <time :datetime="comment.createdAt">{{ formatDateTime(comment.createdAt) }}</time>
        </p>
        <p class="mt-1.5 whitespace-pre-line text-sm leading-relaxed text-[var(--octagon-color-text-primary)]">
          {{ comment.text }}
        </p>
      </article>
    </div>

    <p
      v-else
      class="mt-5 rounded-[var(--octagon-radius-md)] border border-dashed border-line px-4 py-8 text-center text-sm text-subtle"
    >
      Комментариев пока нет. Добавьте первый, чтобы зафиксировать ход работы.
    </p>

    <div class="mt-5 border-t border-white/[0.06] pt-5">
      <BaseTextarea
        label="Новый комментарий"
        placeholder="Напишите комментарий для команды…"
        :rows="4"
        :maxlength="500"
      />
      <BaseButton size="md" class="mt-3 w-fit" @click="modalOpen = true">
        Добавить комментарий
      </BaseButton>
    </div>

    <CommentModal
      v-model:open="modalOpen"
      :request-title="requestTitle || undefined"
      @submit="emit('add', $event)"
    />
  </section>
</template>
