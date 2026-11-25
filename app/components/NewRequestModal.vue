<script setup lang="ts">
import type { NewRequestInput, RequestPriority, SelectOption } from '~/types'
import { CLIENTS, PRIORITY_META, PRIORITY_FILTER_OPTIONS } from '~/utils/requests'

const open = defineModel<boolean>('open', { default: false })

const emit = defineEmits<{
  create: [input: NewRequestInput]
}>()

const form = reactive({
  title: '',
  client: CLIENTS[0] ?? '',
  priority: 'normal' as RequestPriority,
  category: '',
  description: '',
})

const errors = reactive<{
  title?: string
  client?: string
  description?: string
}>({
  title: undefined,
  client: undefined,
  description: undefined,
})

const priorityOptions: SelectOption[] = PRIORITY_FILTER_OPTIONS.filter(
  (option) => option.value !== 'all',
)

const priorityHint = computed(() => {
  const meta = PRIORITY_META[form.priority]
  return `SLA реакции: ${meta.label.toLowerCase()} приоритет`
})

watch(open, (isOpen) => {
  if (!isOpen) return
  form.title = ''
  form.client = CLIENTS[0] ?? ''
  form.priority = 'normal'
  form.category = ''
  form.description = ''
  errors.title = undefined
  errors.client = undefined
  errors.description = undefined
})

function validate(): boolean {
  errors.title = undefined
  errors.client = undefined
  errors.description = undefined

  if (form.title.trim().length < 3) {
    errors.title = 'Укажите тему заявки — минимум 3 символа'
  }

  if (!form.client.trim()) {
    errors.client = 'Выберите клиента'
  }

  if (form.description.trim().length > 0 && form.description.trim().length < 10) {
    errors.description = 'Добавьте чуть больше деталей — минимум 10 символов'
  }

  return !errors.title && !errors.client && !errors.description
}

function submit(): void {
  if (!validate()) return

  emit('create', {
    title: form.title.trim(),
    client: form.client,
    priority: form.priority,
    category: form.category.trim(),
    description: form.description.trim(),
  })
  open.value = false
}
</script>

<template>
  <BaseModal
    v-model:open="open"
    title="Новая заявка"
    description="Заполните основные данные — заявка сразу появится в списке."
    initial-focus="input"
  >
    <form id="new-request-form" class="space-y-4" novalidate @submit.prevent="submit">
      <BaseInput
        v-model="form.title"
        label="Тема заявки"
        placeholder="Коротко опишите проблему"
        :error="errors.title"
        :maxlength="120"
      />

      <div class="grid gap-4 sm:grid-cols-2">
        <div>
          <BaseSelect
            :model-value="form.client"
            label="Клиент"
            :options="CLIENTS.map((client) => ({ value: client, label: client }))"
            aria-label="Клиент"
            @change="form.client = $event"
          />
          <p v-if="errors.client" class="mt-2 text-xs text-[var(--octagon-priority-critical)]" role="alert">
            {{ errors.client }}
          </p>
        </div>

        <BaseSelect
          :model-value="form.priority"
          label="Приоритет"
          :options="priorityOptions"
          aria-label="Приоритет"
          @change="form.priority = $event as RequestPriority"
        />
      </div>

      <BaseInput
        v-model="form.category"
        label="Категория"
        placeholder="Например, Доступ или Интеграции"
        hint="Необязательно"
        :maxlength="60"
      />

      <BaseTextarea
        v-model="form.description"
        label="Описание"
        placeholder="Что произошло, кого затронуло и что уже проверили?"
        :error="errors.description"
        :rows="4"
        :maxlength="600"
        hint="Необязательно, но так задачу решат быстрее"
      />

      <p class="text-xs leading-relaxed text-subtle">{{ priorityHint }}; исполнитель назначается после создания.</p>
    </form>

    <template #footer>
      <div class="mt-6 flex flex-col-reverse gap-2 border-t border-white/[0.06] pt-5 sm:flex-row sm:justify-end">
        <BaseButton variant="secondary" @click="open = false">Отмена</BaseButton>
        <BaseButton type="submit" form="new-request-form">
          <template #leading>
            <BaseIcon name="plus" :size="15" />
          </template>
          Создать заявку
        </BaseButton>
      </div>
    </template>
  </BaseModal>
</template>
