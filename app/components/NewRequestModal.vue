<script setup lang="ts">
import type { NewRequestInput, RequestPriority, SelectOption } from '~/types'
import type { ApiCategory, ApiCustomer } from '~~/shared/types/api'
import { PRIORITY_META, PRIORITY_FILTER_OPTIONS } from '~/utils/requests'

const props = defineProps<{
  customers?: ApiCustomer[]
  categories?: ApiCategory[]
}>()

const open = defineModel<boolean>('open', { default: false })

const emit = defineEmits<{
  create: [input: NewRequestInput]
}>()

const customerOptions = computed<SelectOption[]>(() =>
  (props.customers ?? []).map(customer => ({ value: customer.id, label: customer.name })),
)

const categoryOptions = computed<SelectOption[]>(() =>
  (props.categories ?? []).map(category => ({ value: category.id, label: category.name })),
)

const form = reactive({
  title: '',
  customerId: '',
  priority: 'normal' as RequestPriority,
  categoryId: '',
  description: '',
})

const errors = reactive<{
  title?: string
  customerId?: string
  description?: string
}>({
  title: undefined,
  customerId: undefined,
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
  form.customerId = props.customers?.[0]?.id ?? ''
  form.priority = 'normal'
  form.categoryId = ''
  form.description = ''
  errors.title = undefined
  errors.customerId = undefined
  errors.description = undefined
})

function validate(): boolean {
  errors.title = undefined
  errors.customerId = undefined
  errors.description = undefined

  if (form.title.trim().length < 3) {
    errors.title = 'Укажите тему заявки — минимум 3 символа'
  }

  if (!form.customerId) {
    errors.customerId = 'Выберите клиента'
  }

  if (form.description.trim().length > 0 && form.description.trim().length < 10) {
    errors.description = 'Добавьте чуть больше деталей — минимум 10 символов'
  }

  return !errors.title && !errors.customerId && !errors.description
}

function submit(): void {
  if (!validate()) return

  const customer = props.customers?.find(item => item.id === form.customerId)
  const category = props.categories?.find(item => item.id === form.categoryId)

  emit('create', {
    title: form.title.trim(),
    client: customer?.name ?? '',
    priority: form.priority,
    category: category?.name ?? '',
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
            :model-value="form.customerId"
            label="Клиент"
            :options="customerOptions"
            aria-label="Клиент"
            @change="form.customerId = $event"
          />
          <p v-if="errors.customerId" class="mt-2 text-xs text-[var(--octagon-priority-critical)]" role="alert">
            {{ errors.customerId }}
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

      <BaseSelect
        :model-value="form.categoryId"
        label="Категория"
        :options="categoryOptions"
        aria-label="Категория"
        placeholder="Выберите категорию"
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
