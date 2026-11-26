<script setup lang="ts">
/**
 * Баннер состояния мутации (макеты 3.03–3.05): успех с Undo,
 * ошибка с причиной rollback. Полноширинный, над контентом.
 */
import { useRequestUiStore } from '~/stores/requestUi'
import { useRequestsStore } from '~/stores/requests'

const ui = useRequestUiStore()
const requests = useRequestsStore()

const isUndoing = ref(false)

async function onUndo(): Promise<void> {
  if (isUndoing.value) return
  isUndoing.value = true
  const hadUndo = ui.banner?.undoable
  await requests.undoLastChange()
  if (hadUndo) ui.dismissBanner()
  isUndoing.value = false
}
</script>

<template>
  <Transition name="banner">
    <div
      v-if="ui.banner"
      class="panel mb-6 p-4 sm:p-5"
      :class="{
        'border-[var(--octagon-status-resolved-bg)]': ui.banner.tone === 'success',
        'border-[var(--octagon-status-escalated-bg)]': ui.banner.tone === 'error',
      }"
      :role="ui.banner.tone === 'error' ? 'alert' : 'status'"
      aria-live="polite"
    >
      <p
        class="text-sm font-medium"
        :class="ui.banner.tone === 'error' ? 'text-[var(--octagon-priority-critical)]' : 'text-ink'"
      >
        {{ ui.banner.title }}
      </p>
      <p
        v-if="ui.banner.description"
        class="mt-1.5 text-sm leading-relaxed text-[var(--octagon-color-text-secondary)]"
      >
        {{ ui.banner.description }}
      </p>
      <div class="mt-3 flex flex-wrap items-center gap-2">
        <BaseButton
          v-if="ui.banner.undoable"
          variant="secondary"
          size="sm"
          :disabled="isUndoing"
          @click="onUndo"
        >
          {{ isUndoing ? 'Возвращаю…' : 'Отменить изменение' }}
        </BaseButton>
        <BaseButton
          v-if="ui.banner.tone === 'error'"
          variant="secondary"
          size="sm"
          @click="ui.dismissBanner()"
        >
          Обновить заявку
        </BaseButton>
        <button
          type="button"
          class="ml-auto text-xs text-subtle transition hover:text-ink focus-ring rounded"
          aria-label="Закрыть уведомление"
          @click="ui.dismissBanner()"
        >
          Закрыть
        </button>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.banner-enter-active,
.banner-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.banner-enter-from,
.banner-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
