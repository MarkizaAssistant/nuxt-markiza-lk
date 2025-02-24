<template>
  <div>
    Главная страница
  </div>
</template>

<script lang="ts" setup>
useSeoMeta({
  title: 'Главная страница',
  description: 'Главная страница сайта'
})

definePageMeta({
  middleware: 'auth'
})
</script>

<style>

</style>
