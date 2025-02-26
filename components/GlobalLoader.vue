<template>
  <Transition name="fade">
    <div v-if="loaderStore.isLoading" class="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div class="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
    </div>
  </Transition>
</template>

<script lang="ts" setup>
const loaderStore = useLoaderStore()
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
