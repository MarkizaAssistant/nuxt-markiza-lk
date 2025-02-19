<template>
  <div class="flex flex-col gap-4">
    <h2 class="text-2xl font-bold">Виджеты ({{ widgets.length }}) </h2>
    
  </div>
</template>

<script lang="ts" setup>
useSeoMeta({
  title: 'Виджет',
  description: 'Страница виджета'
})

type WIDGET = {
  id: string,
  name: string,
  domain: string,
  isActive: boolean
}

const widgets = ref<WIDGET[]>([
  { id: '1', name: 'test1', domain: 'test1.com', isActive: true },
  { id: '2', name: 'test2', domain: 'test2.com', isActive: false },
])

</script>

<style>

</style>
