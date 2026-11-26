<script setup lang="ts">
import type { SelectOption } from '~/types'
import { usePreferencesStore, type ListDensity } from '~/stores/preferences'

definePageMeta({
  layout: 'default',
  title: 'Профиль',
})

const { user, updateProfile, logout } = useAuth()
const preferences = usePreferencesStore()

const form = reactive({
  name: user.value?.name ?? '',
  email: user.value?.email ?? '',
})

const saved = ref(false)

const densityOptions: SelectOption[] = [
  { value: 'comfortable', label: 'Комфортная' },
  { value: 'compact', label: 'Компактная' },
]

const density = computed<ListDensity>({
  get: () => preferences.listDensity,
  set: value => preferences.setListDensity(value),
})

watch(user, (value) => {
  if (!value) return
  form.name = value.name
  form.email = value.email
})

watch(form, () => { saved.value = false })

const emailError = computed(() =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) ? '' : 'Введите корректный e-mail',
)
const nameError = computed(() => (form.name.trim() ? '' : 'Укажите имя'))
const canSave = computed(() => !emailError.value && !nameError.value)

function save(): void {
  if (!canSave.value) return
  updateProfile({ name: form.name, email: form.email })
  saved.value = true
}

async function handleLogout(): Promise<void> {
  logout()
  await navigateTo('/login')
}
</script>

<template>
  <div class="space-y-6">
    <PageHeader
      title="Профиль"
      description="Ваши данные и настройки интерфейса"
    />

    <!-- Данные профиля -->
    <form class="panel space-y-5 p-6" novalidate @submit.prevent="save">
      <span
        class="grid size-8 shrink-0 place-items-center rounded-full bg-[var(--octagon-color-bg-accent-soft)] text-xs font-semibold text-[var(--octagon-color-text-accent)]"
        aria-hidden="true"
      >
        {{ user?.initials ?? '—' }}
      </span>

      <BaseInput
        v-model="form.name"
        label="Имя"
        autocomplete="name"
        :error="nameError"
        class="max-w-[480px]"
      />

      <BaseInput
        v-model="form.email"
        label="Электронная почта"
        type="email"
        autocomplete="email"
        :error="emailError"
        class="max-w-[480px]"
      />

      <p class="text-sm text-[var(--octagon-color-text-secondary)]">
        Роль: {{ user?.role ?? 'оператор' }}
      </p>

      <div class="flex flex-wrap items-center gap-3">
        <BaseButton type="submit" :disabled="!canSave">Сохранить изменения</BaseButton>
        <span v-if="saved" class="inline-flex items-center gap-1.5 text-xs text-[var(--octagon-status-resolved-fg)]" role="status">
          <BaseIcon name="check" :size="15" />
          Изменения сохранены
        </span>
      </div>
    </form>

    <!-- Настройки интерфейса -->
    <section class="panel p-6" aria-labelledby="settings-title">
      <h2 id="settings-title" class="text-lg font-bold tracking-[-0.01em] text-white">
        Настройки интерфейса
      </h2>
      <BaseSelect
        v-model="density"
        label="Плотность списка"
        :options="densityOptions"
        class="mt-4 max-w-[480px]"
      />
    </section>

    <BaseButton variant="secondary" size="md" class="w-fit" @click="handleLogout">
      Выйти из аккаунта
    </BaseButton>
  </div>
</template>
