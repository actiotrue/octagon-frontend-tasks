<script setup lang="ts">
import type { RequestStats } from '~/utils/requests'

defineProps<{
  stats: RequestStats
}>()
</script>

<template>
  <section
    aria-label="Сводка по заявкам"
    class="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4"
  >
    <StatCard label="Новые заявки" :value="stats.new" hint="Ожидают назначения" />
    <StatCard label="В работе" :value="stats.active" hint="Назначены исполнителям" />
    <StatCard label="Ожидают ответа" :value="stats.waiting" hint="Нужна информация" />
    <StatCard label="Решены" :value="stats.resolved" hint="За эту неделю" />
  </section>
</template>
