<template>
  <div role="status" aria-live="polite" aria-busy="true" class="space-y-6">
    <span class="sr-only">Загрузка заявки…</span>

    <div class="h-4 w-28 animate-pulse rounded bg-white/[0.07]" />
    <div class="space-y-3">
      <div class="h-8 w-2/3 animate-pulse rounded bg-white/[0.1]" />
      <div class="h-4 w-1/3 animate-pulse rounded bg-white/[0.07]" />
    </div>

    <div class="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
      <div class="space-y-6">
        <div class="panel animate-pulse p-6">
          <div class="h-4 w-24 rounded bg-white/[0.08]" />
          <div class="mt-4 h-3 w-full rounded bg-white/[0.06]" />
          <div class="mt-2 h-3 w-5/6 rounded bg-white/[0.06]" />
          <div class="mt-2 h-3 w-2/3 rounded bg-white/[0.06]" />
        </div>
        <div class="panel animate-pulse p-6">
          <div class="h-4 w-32 rounded bg-white/[0.08]" />
          <div v-for="row in 4" :key="row" class="mt-5 flex gap-3">
            <span class="size-6 rounded-full bg-white/[0.08]" />
            <div class="flex-1 space-y-2">
              <div class="h-3 w-1/3 rounded bg-white/[0.08]" />
              <div class="h-3 w-3/4 rounded bg-white/[0.06]" />
            </div>
          </div>
        </div>
      </div>
      <div class="space-y-4">
        <div class="panel h-64 animate-pulse" />
        <div class="panel h-40 animate-pulse" />
      </div>
    </div>
  </div>
</template>
