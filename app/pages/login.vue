<script setup lang="ts">
definePageMeta({
  layout: 'public',
  title: 'Вход в WorkFlow',
})

const route = useRoute()
const { login } = useAuth()

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const submitted = ref(false)

const redirectTo = computed(() => {
  const value = route.query.redirect
  return typeof value === 'string' && value.startsWith('/') && !value.startsWith('//')
    ? value
    : '/dashboard'
})

const emailError = computed(() => {
  if (!submitted.value) return ''
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)
    ? ''
    : 'Введите корректный адрес электронной почты.'
})

const passwordError = computed(() => {
  if (!submitted.value) return ''
  return password.value.length >= 4 ? '' : 'Пароль должен содержать минимум 4 символа'
})

async function submit(): Promise<void> {
  submitted.value = true
  if (emailError.value || passwordError.value) return

  login(email.value)
  await navigateTo(redirectTo.value)
}
</script>

<template>
  <div class="flex flex-col gap-16 py-16 sm:py-24">
    <div class="flex justify-center px-4">
      <form
        class="w-full max-w-[440px] rounded-[var(--octagon-radius-md)] border border-line bg-panel p-6"
        novalidate
        aria-labelledby="login-title"
        @submit.prevent="submit"
      >
        <h1 id="login-title" class="text-[28px] font-bold leading-9 text-white">
          С возвращением
        </h1>
        <p class="mt-2 text-sm text-[var(--octagon-color-text-secondary)]">
          Войдите для работы с заявками
        </p>

        <div class="mt-6 space-y-4">
          <BaseInput
            v-model="email"
            label="Электронная почта"
            type="email"
            autocomplete="email"
            placeholder="0000@mail.demo"
            :error="emailError"
          />

          <BaseInput
            v-model="password"
            label="Пароль"
            :type="showPassword ? 'text' : 'password'"
            autocomplete="current-password"
            placeholder="••••••••••"
            :error="passwordError"
          >
            <template #trailing>
              <button
                type="button"
                class="rounded-md px-2 py-1.5 text-xs text-muted transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--octagon-color-focus-ring)]"
                :aria-label="showPassword ? 'Скрыть пароль' : 'Показать пароль'"
                :aria-pressed="showPassword"
                @click="showPassword = !showPassword"
              >
                {{ showPassword ? 'Скрыть' : 'Показать' }}
              </button>
            </template>
          </BaseInput>
        </div>

        <BaseButton type="submit" size="md" class="mt-6 w-fit">
          Войти
        </BaseButton>

        <p class="mt-4 text-xs font-medium text-[var(--octagon-color-text-accent)]">
          Нет аккаунта? Зарегистрироваться
        </p>

        <p v-if="submitted && (emailError || passwordError)" class="sr-only" role="alert">
          Проверьте правильность заполнения полей формы.
        </p>
      </form>
    </div>

    <section class="container-page">
      <div class="mx-auto max-w-[440px] space-y-2 rounded-[var(--octagon-radius-md)] border border-line bg-panel/60 p-4 text-center text-xs leading-relaxed text-subtle">
        <p>Демо-режим: подойдут любой корректный e-mail и пароль от 4 символов.</p>
        <p>
          Не хотите входить?
          <NuxtLink
            to="/"
            class="font-medium text-[var(--octagon-color-text-accent)] transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--octagon-color-focus-ring)]"
          >
            Вернитесь на главную
          </NuxtLink>
        </p>
      </div>
    </section>
  </div>
</template>
