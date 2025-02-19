<template>
  <div
    class="w-full h-svh overflow-hidden"
    :class="{
      'grid grid-cols-[auto_1fr] grid-rows-[auto_1fr]': authStore.isAuthenticated
    }"
  >
    <Header
      v-if="authStore.isAuthenticated"
      :is-collapsed="isCollapsed"
      @toggle="toggleSidebar"
      class="col-span-2"
    />
    
    <Sidebar
      v-if="authStore.isAuthenticated"
      :is-collapsed="isCollapsed"
    />

    <main
      class="col-span-1 row-span-1"
      :class="{ 'py-12 px-24': authStore.isAuthenticated}"
    >
      <slot />
    </main>
  </div>
</template>

<script lang="ts" setup>
const isLoadingStore = useIsLoadingStore()
const router = useRouter()
const authStore = useAuthStore()

onMounted(async () => {
  try {
    if (authStore.isAuthenticated) {
      await router.push('/')
    } else {
      await router.push('/auth/login')
    }
  } catch(err) {
    await router.push('/auth/login')
  } finally {
    isLoadingStore.set(false)
  }
})

const isCollapsed = ref(false)

const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value
}

</script>

<style>

</style>
