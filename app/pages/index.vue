<script setup lang="ts">
definePageMeta({
  layout: 'public',
  title: 'WorkFlow — поддержка без потерь',
})

const features = [
  {
    title: 'Все обращения рядом',
    text: 'Статусы, приоритеты и история общения.',
  },
  {
    title: 'Понятная ответственность',
    text: 'У каждой заявки есть исполнитель.',
  },
  {
    title: 'Контроль сроков',
    text: 'Сроки реакции и решения всегда видны.',
  },
]

const steps = [
  { step: '01', title: 'Создайте заявку' },
  { step: '02', title: 'Назначьте исполнителя' },
  { step: '03', title: 'Подтвердите решение' },
]

const faqs = [
  {
    question: 'Нужно ли подключать бэкенд?',
    answer: 'Нет. Это демоверсия: все заявки, комментарии и изменения хранятся локально в браузере и сбрасываются после полной перезагрузки страницы.',
  },
  {
    question: 'Как посмотреть загрузку, пустой список и ошибку?',
    answer: 'Это учебный проект: состояния загрузки и ошибок появятся, когда будет подключён реальный бэкенд.',
  },
  {
    question: 'Можно ли работать с интерфейсом с клавиатуры?',
    answer: 'Да. Меню, селекты и модальные окна поддерживают стрелки, Home, End, Enter и Esc, а у всех интерактивных элементов есть видимый фокус.',
  },
  {
    question: 'Сохраняются ли фильтры?',
    answer: 'Да. Поиск, фильтры, сортировка и номер страницы синхронизируются с URL — такой ссылкой можно поделиться с командой.',
  },
]
</script>

<template>
  <div>
    <section class="bg-[var(--octagon-color-bg-sidebar,#17153a)]">
      <div class="container-page flex flex-col gap-6 py-16 lg:py-24">
        <div class="flex flex-col items-start gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div class="flex max-w-[600px] flex-col gap-6">
            <p class="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--octagon-color-text-secondary)]">
              Заявки · Команда · Результат
            </p>
            <h1 class="text-4xl font-bold leading-[1.2] text-white sm:text-5xl lg:text-[52px]">
              Поддержка, в которой ничего не теряется
            </h1>
            <p class="text-sm leading-relaxed text-[var(--octagon-color-text-secondary)] sm:text-base">
              От первого обращения до решения — управляйте заявками, назначайте исполнителей и держите сроки под контролем.
            </p>
            <BaseButton to="/dashboard" size="md" class="mt-2 w-fit">
              Начать работу
            </BaseButton>
          </div>

          <img
            src="/images/octagon-hero.png"
            alt=""
            aria-hidden="true"
            class="pointer-events-none mx-auto size-[320px] object-contain sm:size-[400px] lg:mx-0 lg:size-[460px]"
          >
        </div>

        <div class="grid gap-4 sm:grid-cols-3">
          <div
            v-for="step in steps"
            :key="step.step"
            class="rounded-[var(--octagon-radius-md)] border border-line bg-panel px-6 py-6"
          >
            <p class="text-base font-medium text-[var(--octagon-color-text-primary)]">
              {{ step.step }}&nbsp; {{ step.title }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Возможности -->
    <section id="features" class="border-t border-white/[0.05] bg-panel/25">
      <div class="container-page py-16">
        <h2 class="text-2xl font-bold tracking-[-0.01em] text-white sm:text-3xl">
          Одна система для всей команды
        </h2>

        <div class="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <article
            v-for="feature in features"
            :key="feature.title"
            class="rounded-[var(--octagon-radius-md)] border border-line bg-panel px-6 py-6"
          >
            <h3 class="text-base font-semibold text-white">{{ feature.title }}</h3>
            <p class="mt-4 text-sm leading-relaxed text-[var(--octagon-color-text-secondary)]">{{ feature.text }}</p>
          </article>
        </div>
      </div>
    </section>

    <!-- FAQ -->
    <section id="faq" class="border-t border-white/[0.05]">
      <div class="container-page grid gap-10 py-16 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <h2 class="text-2xl font-bold tracking-[-0.01em] text-white sm:text-3xl">
            Частые вопросы
          </h2>
          <p class="mt-3 text-sm leading-relaxed text-muted">
            Не нашли ответ? Откройте интерфейс и посмотрите всё на практике.
          </p>
          <BaseButton to="/requests" variant="secondary" size="sm" class="mt-6">
            Посмотреть заявки
          </BaseButton>
        </div>

        <div class="space-y-3">
          <details
            v-for="faq in faqs"
            :key="faq.question"
            class="group rounded-[var(--octagon-radius-md)] border border-line bg-panel px-5 py-4"
          >
            <summary class="flex cursor-pointer items-center justify-between gap-4 text-sm font-medium text-white transition hover:text-[var(--octagon-status-new-fg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--octagon-color-focus-ring)]">
              {{ faq.question }}
              <BaseIcon name="chevron-down" :size="17" class="shrink-0 text-subtle transition-transform group-open:rotate-180" />
            </summary>
            <p class="mt-3 text-sm leading-relaxed text-muted">{{ faq.answer }}</p>
          </details>
        </div>
      </div>
    </section>
  </div>
</template>
