/**
 * Отложенное обновление значения: пока источник меняется, таймер сбрасывается.
 * Используется для поиска, чтобы не отправлять запрос на каждый символ.
 */
export function useDebouncedRef<T>(source: Ref<T>, delay = 300): Readonly<Ref<T>> {
  const debounced = ref(source.value) as Ref<T>
  let timer: ReturnType<typeof setTimeout> | null = null

  watch(source, (value) => {
    if (timer !== null) clearTimeout(timer)
    timer = setTimeout(() => {
      debounced.value = value
      timer = null
    }, delay)
  })

  onScopeDispose(() => {
    if (timer !== null) clearTimeout(timer)
  })

  return readonly(debounced) as Readonly<Ref<T>>
}
