<template>
  <div>
    Страница с платежами
  </div>
</template>

<script lang="ts" setup>
useSeoMeta({
  title: 'Платежи',
  description: 'Страница с платежами'
})

definePageMeta({
  middleware: 'auth'
})
</script>

<style>

</style>
