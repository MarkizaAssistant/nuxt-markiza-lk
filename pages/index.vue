<script lang="ts" setup>
useSeoMeta({
  title: 'Главная страница',
  description: 'Главная страница сайта'
})

definePageMeta({
  middleware: 'auth'
})
</script>

<template>
  <div>
    Главная страница
  </div>
</template>

<style>

</style>
