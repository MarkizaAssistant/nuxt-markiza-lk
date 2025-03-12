import { defineStore } from 'pinia'

export const useNotificationStore = defineStore('notification', () => {
  const notifications = ref<{ id: number; type: 'success' | 'warning' | 'error'; message: string; duration?: number }[]>([])

  const addNotification = (type: 'success' | 'warning' | 'error', message: string, duration = 5000) => {
    const id = Date.now()
    notifications.value.push({ id, type, message, duration })
    setTimeout(() => removeNotification(id), duration)
  }

  const removeNotification = (id: number) => {
    notifications.value = notifications.value.filter(n => n.id !== id)
  }

  return {
    notifications,
    addNotification,
    removeNotification
  }
})
