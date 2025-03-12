<template>
  <NuxtLayout>
    <NuxtPage/>
  </NuxtLayout>
  <GlobalLoader />
  <div class="fixed bottom-4 right-4 space-y-2">
    <Notification
      v-for="item in notificationStore.notifications"
      :key="item.id"
      :type="item.type"
      :message="item.message"
      :duration="item.duration"
      @close="notificationStore.removeNotification(item.id)"
    />
  </div>
</template>

<script setup>
const notificationStore = useNotificationStore()
</script>
