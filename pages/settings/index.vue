<script lang="ts" setup>
useSeoMeta({
  title: 'Настройки',
  description: 'Страница с настройками'
})

definePageMeta({
  middleware: 'auth'
})
</script>

<template>
  <div>
    Страница с настройками
  </div>
</template>

<style>

</style>
