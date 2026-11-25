<template>
  <div role="status" aria-live="polite" aria-busy="true">
    <span class="sr-only">Загрузка заявок…</span>

    <div class="hidden overflow-hidden rounded-xl border border-line bg-panel md:block">
      <div class="flex gap-4 bg-panel-strong px-4 py-3.5">
        <span v-for="width in ['w-12', 'w-32', 'w-16', 'w-20', 'w-14']" :key="width" class="h-3 animate-pulse rounded bg-white/10" :class="width" />
      </div>
      <div
        v-for="row in 6"
        :key="row"
        class="flex items-center gap-4 border-t border-white/[0.06] px-4 py-4"
      >
        <span class="h-3 w-10 animate-pulse rounded bg-white/[0.07]" />
        <span class="h-3.5 w-[34%] animate-pulse rounded bg-white/[0.1]" />
        <span class="hidden h-3 w-20 animate-pulse rounded bg-white/[0.07] lg:block" />
        <span class="hidden h-3 w-24 animate-pulse rounded bg-white/[0.07] xl:block" />
        <span class="ml-auto h-5 w-20 animate-pulse rounded-full bg-white/[0.08]" />
        <span class="h-3 w-16 animate-pulse rounded bg-white/[0.07]" />
      </div>
    </div>

    <div class="grid gap-3 md:hidden">
      <div v-for="row in 3" :key="row" class="animate-pulse rounded-xl border border-line bg-panel p-4">
        <div class="flex items-center justify-between">
          <span class="h-3 w-10 rounded bg-white/[0.08]" />
          <span class="h-5 w-20 rounded-full bg-white/[0.08]" />
        </div>
        <div class="mt-3 h-4 w-3/4 rounded bg-white/[0.1]" />
        <div class="mt-3 grid grid-cols-2 gap-3">
          <span class="h-3 w-20 rounded bg-white/[0.07]" />
          <span class="h-3 w-24 rounded bg-white/[0.07]" />
        </div>
        <div class="mt-4 h-3 w-16 rounded bg-white/[0.07]" />
      </div>
    </div>
  </div>
</template>
