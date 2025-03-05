<template>
  <div
    class="w-full h-svh overflow-hidden"
    :class="{
      'grid grid-cols-[auto_1fr] grid-rows-[auto_1fr]': authStore.isAuthenticated
    }"
  >
    <Header
      v-if="authStore.checkAuth()"
      :is-collapsed="isCollapsed"
      @toggle="toggleSidebar"
      class="col-span-2"
    />
    
    <Sidebar
      v-if="authStore.checkAuth()"
      :is-collapsed="isCollapsed"
    />

    <main
      class="col-span-1 row-span-1"
      :class="{ 'py-12 px-24': authStore.checkAuth()}"
    >
      <slot />
    </main>
  </div>
</template>

<script lang="ts" setup>
const authStore = useAuthStoreBff()

const isCollapsed = ref(false)

const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value
}

</script>

<style>

</style>
