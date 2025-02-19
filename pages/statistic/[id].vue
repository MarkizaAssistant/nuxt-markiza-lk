<template>
  <div class="flex justify-end">
    <Button class="bg-slate-700 text-white hover:bg-slate-600 p-4" @click="useRouter().push('/statistic')">Вернуться назад к списку</Button>
  </div>
  <div>
    ID: {{ route.params.id }}
  </div>
</template>

<script lang="ts" setup>
const route = useRoute()
</script>

<style>

</style>
