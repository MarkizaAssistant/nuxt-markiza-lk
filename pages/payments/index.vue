<script lang="ts" setup>
useSeoMeta({
  title: 'Платежи',
  description: 'Страница с платежами'
})

definePageMeta({
  middleware: 'auth'
})
</script>

<template>
  <div>
    Страница с платежами
  </div>
</template>

<style>

</style>
