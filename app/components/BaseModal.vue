<script setup lang="ts">
import { cn } from '~/utils/cn'

const props = withDefaults(
  defineProps<{
    open: boolean
    title?: string
    description?: string
    size?: 'sm' | 'md' | 'lg'
    initialFocus?: string
  }>(),
  {
    size: 'md',
    initialFocus: '[data-autofocus]',
  },
)

const emit = defineEmits<{
  'update:open': [value: boolean]
  close: []
}>()

const panel = ref<HTMLElement | null>(null)
const closeButton = ref<HTMLButtonElement | null>(null)
const titleId = useId()
const descriptionId = useId()
let previousOverflow = ''

const panelSize = computed(() => {
  if (props.size === 'sm') return 'max-w-md'
  if (props.size === 'lg') return 'max-w-2xl'
  return 'max-w-xl'
})

function close(): void {
  emit('update:open', false)
  emit('close')
}

useFocusTrap(
  panel,
  computed(() => props.open),
  {
    onEscape: close,
    initialFocus: () =>
      panel.value?.querySelector<HTMLElement>(props.initialFocus) ??
      closeButton.value,
  },
)

watch(
  () => props.open,
  (open) => {
    if (!import.meta.client) return
    if (open) {
      previousOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = previousOverflow
      previousOverflow = ''
    }
  },
  { immediate: true },
)

onBeforeUnmount(() => {
  if (import.meta.client) document.body.style.overflow = previousOverflow
})
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="open"
        class="fixed inset-0 z-[100] flex items-end justify-center p-0 sm:items-center sm:p-6"
        role="presentation"
      >
        <div
          class="absolute inset-0 bg-[var(--octagon-color-overlay)]/80 backdrop-blur-sm"
          aria-hidden="true"
          @click="close"
        />

        <div
          ref="panel"
          role="dialog"
          aria-modal="true"
          :aria-labelledby="title ? titleId : undefined"
          :aria-describedby="description ? descriptionId : undefined"
          tabindex="-1"
          :class="
            cn(
              'modal-panel relative z-10 max-h-[92dvh] w-full overflow-y-auto rounded-t-[var(--octagon-radius-lg)] border border-line bg-[var(--octagon-color-bg-surface)] p-5 shadow-[0_30px_90px_-20px_rgba(3,1,20,0.95)] sm:rounded-[var(--octagon-radius-lg)] sm:p-6',
              panelSize,
            )
          "
        >
          <button
            ref="closeButton"
            type="button"
            class="absolute right-3 top-3 inline-flex size-9 items-center justify-center rounded-[var(--octagon-radius-md)] text-subtle transition hover:bg-white/[0.06] hover:text-ink focus-ring"
            aria-label="Закрыть окно"
            @click="close"
          >
            <BaseIcon name="x" :size="18" />
          </button>

          <header v-if="title || description" class="mb-5 pr-10">
            <h2
              v-if="title"
              :id="titleId"
              class="text-xl font-semibold tracking-[-0.02em] text-ink"
            >
              {{ title }}
            </h2>
            <p
              v-if="description"
              :id="descriptionId"
              class="mt-1.5 text-sm leading-relaxed text-muted"
            >
              {{ description }}
            </p>
          </header>

          <slot />

          <slot name="footer" />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
