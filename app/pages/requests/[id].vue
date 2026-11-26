<script setup lang="ts">
import type { RequestPriority, RequestStatus, SelectOption } from '~/types'
import type { ApiRequestDetailResponse } from '~~/shared/types/api'
import { formatDate, formatDateTime } from '~/utils/format'
import {
  PRIORITY_META,
  REQUEST_STATUSES,
  STATUS_META,
  isOverdue,
} from '~/utils/requests'
import { mapRequestDetail } from '~/utils/apiMappers'
import { useRequestsStore } from '~/stores/requests'
import { useRequestUiStore } from '~/stores/requestUi'

definePageMeta({
  layout: 'default',
  title: 'Заявка',
})

const route = useRoute()
const router = useRouter()

const requestsStore = useRequestsStore()
const ui = useRequestUiStore()

const requestId = computed(() => String(route.params.id ?? ''))

const {
  data,
  pending,
  error,
  refresh,
} = useFetch<ApiRequestDetailResponse>(() => `/api/requests/${requestId.value}`, {
  key: `request-${requestId.value}`,
})

// Данные уходят в store — единый источник состояния для мутаций.
// На сервере watchEffect не срабатывает до рендера, поэтому на клиенте
// заполняем store, а в рендере используем fallback-маппинг из data.
const mappedDetail = computed(() => (data.value ? mapRequestDetail(data.value) : null))

watchEffect(() => {
  if (data.value && import.meta.client) requestsStore.setDetail(data.value)
})

const request = computed(() => requestsStore.get(requestId.value) ?? mappedDetail.value)

const statusCode = computed(() =>
  typeof error.value?.statusCode === 'number' ? error.value.statusCode : 500,
)

// Кнопка «Изменить статус» открывает дропдаун со списком статусов.
const statusMenuOpen = ref(false)
const statusMenuRef = ref<HTMLElement | null>(null)
useClickOutside(statusMenuRef, () => {
  statusMenuOpen.value = false
})
const statusOptions: SelectOption[] = REQUEST_STATUSES.map(status => ({
  value: status,
  label: STATUS_META[status].label,
}))

const assigneeOptions = computed<SelectOption[]>(() => [
  { value: 'none', label: 'Не назначена' },
  ...requestsStore.users.map(user => ({ value: user.id, label: user.name })),
])

const commentPending = ref(false)
const commentError = ref(false)
const commentsRef = ref<InstanceType<typeof import('~/components/RequestComments.vue').default> | null>(null)

function closeStatusMenu(): void {
  statusMenuOpen.value = false
}

async function onStatusSelect(status: string): Promise<void> {
  closeStatusMenu()
  if (!request.value) return

  const undo = await requestsStore.updateStatus(request.value.id, status as RequestStatus)
  if (undo) {
    ui.clearFailure()
    ui.showBanner({
      tone: 'success',
      title: `Статус изменён на «${STATUS_META[status as RequestStatus].label}»`,
      undoable: true,
    })
  }
  else if (requestsStore.lastFailure) {
    showRollbackBanner()
  }
}

async function onPriorityChange(value: string): Promise<void> {
  if (!request.value) return

  const undo = await requestsStore.updatePriority(request.value.id, value as RequestPriority)
  if (undo) {
    ui.clearFailure()
    ui.showBanner({
      tone: 'success',
      title: `Приоритет изменён на «${PRIORITY_META[value as RequestPriority].label}»`,
      undoable: true,
    })
  }
  else if (requestsStore.lastFailure) {
    showRollbackBanner()
  }
}

async function onAssigneeChange(value: string): Promise<void> {
  if (!request.value) return

  const ok = await requestsStore.updateAssignee(request.value.id, value)
  if (!ok && requestsStore.lastFailure) {
    showRollbackBanner()
  }
}

function showRollbackBanner(): void {
  const failure = requestsStore.lastFailure
  if (!failure) return

  const reason = failure.kind === 'conflict'
    ? 'Заявка была изменена другим сотрудником. Предыдущее значение восстановлено. Обновите данные и попробуйте снова.'
    : failure.kind === 'rate-limit'
      ? 'Слишком много запросов. Предыдущее значение восстановлено — попробуйте через минуту.'
      : 'Сервер временно недоступен. Предыдущее значение восстановлено, изменение не сохранено.'

  ui.showBanner({
    tone: 'error',
    title: 'Изменение не сохранено',
    description: reason,
    statusCode: failure.statusCode,
  })
  ui.setFailure(failure)
  requestsStore.clearFailure()
}

async function onAddComment(text: string): Promise<void> {
  if (!request.value) return

  commentPending.value = true
  commentError.value = false

  const ok = await requestsStore.addComment(request.value.id, text)

  commentPending.value = false
  if (ok) {
    commentsRef.value?.clear()
    ui.showBanner({ tone: 'success', title: 'Комментарий отправлен' })
  }
  else {
    commentError.value = true
    if (requestsStore.lastFailure) {
      ui.setFailure(requestsStore.lastFailure)
      requestsStore.clearFailure()
    }
  }
}

function retryComment(): void {
  const text = commentsRef.value?.draft.trim()
  if (!text) return
  void onAddComment(text)
}

function dismissCommentError(): void {
  commentError.value = false
}

function goBack(): void {
  void router.back()
}
</script>

<template>
  <RequestDetailSkeleton v-if="pending" with-header />

  <ErrorState
    v-else-if="error"
    :status-code="statusCode"
    @retry="() => refresh()"
  />

  <EmptyState
    v-else-if="!request"
    icon="alert-circle"
    title="Заявка не найдена"
    description="Проверьте адрес страницы или вернитесь в реестр — возможно, заявка была удалена."
  >
    <BaseButton to="/requests" variant="secondary" size="sm">
      Вернуться к заявкам
    </BaseButton>
  </EmptyState>

  <div v-else class="space-y-6">
    <BaseButton variant="secondary" size="md" class="w-fit" @click="goBack">
      <template #leading>
        <BaseIcon name="arrow-left" :size="15" />
      </template>
      К списку заявок
    </BaseButton>

    <div class="flex flex-col gap-2">
      <PageHeader :title="request.title" />
      <p class="text-sm text-[var(--octagon-color-text-secondary)]">
        #{{ request.number }} · Создана {{ formatDate(request.createdAt) }}
      </p>
      <div class="flex flex-wrap items-center gap-3 pt-1">
        <StatusBadge :status="request.status" />
        <PriorityBadge :priority="request.priority" />
        <span
          v-if="isOverdue(request.dueAt, request.status)"
          class="inline-flex items-center gap-1.5 rounded-full border border-[var(--octagon-status-escalated-bg)] bg-[var(--octagon-status-escalated-bg)] px-2.5 py-1 text-xs text-[var(--octagon-priority-critical)]"
        >
          <BaseIcon name="alert-triangle" :size="12" />
          Просрочена
        </span>
      </div>
    </div>

    <div class="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
      <!-- История обращения -->
      <div class="space-y-6">
        <section class="panel p-6" aria-labelledby="request-description-title">
          <h2 id="request-description-title" class="text-lg font-bold tracking-[-0.01em] text-white">
            Описание проблемы
          </h2>
          <p class="mt-4 text-sm leading-relaxed text-[var(--octagon-color-text-secondary)]">
            {{ request.description || 'Описание не добавлено.' }}
          </p>
        </section>

        <RequestComments
          ref="commentsRef"
          :comments="request.comments"
          :pending="commentPending"
          :error="commentError"
          @add="onAddComment"
          @retry="retryComment"
          @dismiss-error="dismissCommentError"
        />

        <section class="panel p-6" aria-labelledby="request-history-title">
          <h2 id="request-history-title" class="text-lg font-bold tracking-[-0.01em] text-white">
            История заявки
          </h2>
          <div class="mt-5">
            <RequestTimeline :events="request.timeline" />
          </div>
        </section>
      </div>

      <!-- Параметры заявки -->
      <aside class="space-y-6" aria-labelledby="request-params-title">
        <section class="panel p-6 xl:sticky xl:top-24">
          <h2 id="request-params-title" class="text-lg font-bold tracking-[-0.01em] text-white">
            Параметры
          </h2>

          <dl class="mt-5 space-y-4">
            <div>
              <dt class="text-xs font-medium text-[var(--octagon-color-text-secondary)]">Клиент</dt>
              <dd class="mt-1 text-sm text-ink">{{ request.client }}</dd>
            </div>
            <div>
              <dt class="text-xs font-medium text-[var(--octagon-color-text-secondary)]">Категория</dt>
              <dd class="mt-1 text-sm text-ink">{{ request.category }}</dd>
            </div>
          </dl>

          <div class="mt-5 space-y-4 border-t border-white/[0.06] pt-5">
            <!-- Статус: кнопка + дропдаун (макет 3.01) -->
            <div ref="statusMenuRef" class="relative">
              <BaseButton size="md" class="w-full" @click="statusMenuOpen = !statusMenuOpen">
                Изменить статус
              </BaseButton>
              <div
                v-if="statusMenuOpen"
                class="absolute inset-x-0 top-full z-10 mt-2 overflow-hidden rounded-[var(--octagon-radius-lg)] border border-line bg-[var(--octagon-color-bg-surface)] p-1.5 shadow-[0_18px_50px_-12px_rgba(5,3,25,0.9)]"
                role="menu"
                aria-label="Выбор статуса"
              >
                <button
                  v-for="option in statusOptions"
                  :key="option.value"
                  type="button"
                  class="block w-full px-4 py-2.5 text-left text-sm transition hover:bg-white/[0.06]"
                  :class="option.value === request.status ? 'text-[var(--octagon-color-text-accent)]' : 'text-ink'"
                  role="menuitem"
                  @click="onStatusSelect(option.value)"
                >
                  {{ option.label }}
                </button>
              </div>
            </div>

            <BaseSelect
              :model-value="request.assigneeId ?? 'none'"
              label="Исполнитель"
              :options="assigneeOptions"
              aria-label="Назначить исполнителя"
              @change="onAssigneeChange"
            />
            <BaseSelect
              :model-value="request.priority"
              label="Приоритет"
              :options="(Object.keys(PRIORITY_META) as RequestPriority[]).map(priority => ({
                value: priority,
                label: PRIORITY_META[priority].label,
              }))"
              aria-label="Изменить приоритет"
              @change="onPriorityChange"
            />
          </div>

          <dl class="mt-5 border-t border-white/[0.06] pt-5">
            <dt class="text-xs font-medium text-[var(--octagon-color-text-secondary)]">Срок решения</dt>
            <dd class="mt-1 text-sm text-ink">{{ formatDateTime(request.dueAt) }}</dd>
          </dl>
        </section>
      </aside>
    </div>
  </div>
</template>
