import { defineStore } from 'pinia'
import type { ChatPreview } from '~/types/chats'

export const useChatStore = defineStore('chats', () => {
  // --- Состояние (State) ---
  const isLoading = ref(false)
  const chats = ref<ChatPreview[]>([])
  const errorMessage = ref<string>('')

  // --- Геттеры (Getters) ---
  const hasChats = computed(() => chats.value.length > 0)

  // --- Инициализация ---
  const initialize = () => {}

  // --- Методы (Actions) ---
  const clearError = () => {
    errorMessage.value = ''
  }

  const fetchChats = async () => {
    try {
      isLoading.value = true
      errorMessage.value = ''

      const response = await $fetch<ChatPreview[]>('/api/chats', {
        method: 'GET',
        credentials: 'include'
      })

      chats.value = response
    } catch (err: any) {
      errorMessage.value = err.response?._data?.data?.error || 'Неизвестная ошибка'
      throw err;
    } finally {
      isLoading.value = false
    }
  }

  // --- Наблюдатели (Watchers) ---

  // --- Инициализация хранилища ---
  initialize()

  return {
    isLoading,
    chats,
    errorMessage,
    hasChats,
    fetchChats,
    clearError
  }
})
