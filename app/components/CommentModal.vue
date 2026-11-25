<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    open: boolean
    requestTitle?: string
  }>(),
  { requestTitle: '' },
)

const emit = defineEmits<{
  'update:open': [value: boolean]
  close: []
  submit: [text: string]
}>()

const body = ref('')
const touched = ref(false)
const error = computed(() =>
  touched.value && !body.value.trim() ? 'Введите текст комментария' : '',
)

const openModel = computed({
  get: () => props.open,
  set: value => emit('update:open', value),
})

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      body.value = ''
      touched.value = false
    }
  },
)

function submit(): void {
  touched.value = true
  const text = body.value.trim()
  if (!text) return

  emit('submit', text)
  openModel.value = false
}
</script>

<template>
  <BaseModal
    v-model:open="openModel"
    title="Новый комментарий"
    :description="props.requestTitle || undefined"
    initial-focus="textarea"
    @close="emit('close')"
  >
    <form id="comment-form" novalidate @submit.prevent="submit">
      <BaseTextarea
        v-model="body"
        label="Комментарий"
        placeholder="Опишите результат или задайте вопрос…"
        :rows="5"
        :maxlength="1000"
        :error="error"
        hint="Комментарий появится в истории заявки"
      />
    </form>

    <template #footer>
      <div
        class="mt-6 flex flex-col-reverse gap-3 border-t border-white/[0.06] pt-5 sm:flex-row sm:items-center sm:justify-between"
      >
        <p class="text-[11px] text-subtle">Esc — закрыть · Tab — переключение фокуса</p>
        <div class="flex gap-2">
          <BaseButton variant="secondary" @click="openModel = false">
            Отмена
          </BaseButton>
          <BaseButton type="submit" form="comment-form">
            <template #leading>
              <BaseIcon name="message" :size="15" />
            </template>
            Отправить
          </BaseButton>
        </div>
      </div>
    </template>
  </BaseModal>
</template>
