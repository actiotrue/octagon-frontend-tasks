<script setup lang="ts">
import type { RequestComment } from '~/types'
import { formatDateTime } from '~/utils/format'

/**
 * Комментарии заявки с inline-формой отправки (макеты 3.06–3.09):
 * pending — «Отправляю…», ошибка — текст сохранён + повтор.
 */
const props = withDefaults(
  defineProps<{
    comments: RequestComment[]
    pending?: boolean
    error?: boolean
  }>(),
  { pending: false, error: false },
)

const emit = defineEmits<{
  add: [text: string]
  retry: []
  dismissError: []
}>()

const draft = ref('')
const textarea = ref<HTMLTextAreaElement | null>(null)

const canSubmit = computed(() => draft.value.trim().length > 0 && !props.pending)

function submit(): void {
  if (!canSubmit.value) return
  emit('add', draft.value.trim())
}

/** Вызывается родителем после успешной отправки: форма очищается. При ошибке текст остаётся (3.09). */
function clear(): void {
  draft.value = ''
}

defineExpose({ draft, clear })
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
      <label for="comment-draft" class="text-xs font-medium text-[var(--octagon-color-text-secondary)]">
        Ваш комментарий
      </label>
      <textarea
        id="comment-draft"
        v-model="draft"
        ref="textarea"
        class="mt-2 w-full rounded-[var(--octagon-radius-md)] border border-line bg-[var(--octagon-color-bg-subtle)] px-4 py-3 text-sm leading-relaxed text-ink placeholder:text-subtle focus-ring"
        :class="{ 'border-[var(--octagon-status-escalated-bg)]': error }"
        placeholder="Напишите сообщение…"
        :rows="4"
        :maxlength="500"
        :disabled="pending"
      />

      <p v-if="error" class="mt-2 text-xs text-[var(--octagon-priority-critical)]" role="alert">
        Не удалось отправить комментарий. Текст сохранён — попробуйте ещё раз.
      </p>
      <p v-else-if="pending" class="mt-2 text-xs text-subtle" aria-live="polite">
        Отправляем комментарий…
      </p>

      <div class="mt-3 flex items-center gap-2">
        <BaseButton
          size="md"
          :disabled="!canSubmit"
          @click="submit"
        >
          {{ pending ? 'Отправляю…' : (error ? 'Повторить отправку' : 'Отправить комментарий') }}
        </BaseButton>
        <BaseButton
          v-if="error && !pending"
          variant="secondary"
          size="md"
          @click="emit('dismissError')"
        >
          Закрыть
        </BaseButton>
      </div>
    </div>
  </section>
</template>
