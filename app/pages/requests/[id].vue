<script setup lang="ts">
import type { RequestStatus, SelectOption } from '~/types'
import { formatDate, formatDateTime } from '~/utils/format'
import {
  REQUEST_STATUSES,
  STATUS_META,
  TEAM,
  isOverdue,
} from '~/utils/requests'

definePageMeta({
  layout: 'default',
  title: 'Заявка',
})

const route = useRoute()
const { findById, addComment, changeStatus, assign } = useRequestStore()
const { scenario, setScenario } = useMockScenario()

const request = computed(() => findById(String(route.params.id ?? '')))

const statusOptions: SelectOption[] = REQUEST_STATUSES.map(status => ({
  value: status,
  label: STATUS_META[status].label,
}))

const assigneeOptions: SelectOption[] = [
  { value: 'none', label: 'Не назначена' },
  ...TEAM.map(name => ({ value: name, label: name })),
]

function onStatusChange(value: string): void {
  if (!request.value) return
  changeStatus(request.value.id, value as RequestStatus)
}

function onAssigneeChange(value: string): void {
  if (!request.value) return
  assign(request.value.id, value === 'none' ? null : value)
}

function onAddComment(text: string): void {
  if (request.value) addComment(request.value.id, text)
}
</script>

<template>
  <RequestDetailSkeleton v-if="scenario === 'loading'" />

  <ErrorState
    v-else-if="scenario === 'error'"
    title="Не удалось загрузить заявку"
    description="Демо-сценарий ошибки активен. Повторите попытку или вернитесь к обычным данным."
    @retry="setScenario('normal')"
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
    <BaseButton to="/requests" variant="secondary" size="md" class="w-fit">
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
          :comments="request.comments"
          :request-title="request.title"
          @add="onAddComment"
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
            <BaseSelect
              :model-value="request.status"
              label="Статус"
              :options="statusOptions"
              aria-label="Сменить статус заявки"
              @change="onStatusChange"
            />
            <BaseSelect
              :model-value="request.assignee ?? 'none'"
              label="Исполнитель"
              :options="assigneeOptions"
              aria-label="Назначить исполнителя"
              @change="onAssigneeChange"
            />
          </div>

          <dl class="mt-5 border-t border-white/[0.06] pt-5">
            <dt class="text-xs font-medium text-[var(--octagon-color-text-secondary)]">Срок решения</dt>
            <dd class="mt-1 text-sm text-ink">{{ formatDateTime(request.dueAt) }}</dd>
          </dl>
        </section>
      </aside>
    </div>

    <section class="flex flex-col gap-4 rounded-[var(--octagon-radius-md)] border border-line bg-panel/50 p-4 sm:flex-row sm:items-center sm:justify-between">
      <p class="text-xs text-subtle">
        Проверьте состояния загрузки и ошибки для карточки заявки.
      </p>
      <MockStateSwitcher
        :model-value="scenario"
        @update:model-value="value => setScenario(value)"
      />
    </section>
  </div>
</template>
