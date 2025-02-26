<template>
  <div class="flex flex-col gap-4">
    <h2 class="text-2xl font-bold">Список диалогов</h2>
    <StatisticTable />
  </div>
</template>

<script lang="ts" setup>
useSeoMeta({
  title: 'Статистика',
  description: 'Страница статистики'
})

definePageMeta({
  middleware: 'auth'
})
</script>

<style>

</style>
