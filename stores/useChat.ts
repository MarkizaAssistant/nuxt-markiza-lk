import { defineStore } from 'pinia'
import type { ChatPreview, Message } from '~/types/chats'

export const useChatStore = defineStore('chats', () => {
  // --- Состояние (State) ---
  const isLoading = ref(false)
  const chats = ref<ChatPreview[]>([])
  const messages = ref<Message[]>([])
  const errorMessage = ref<string>('')

  // --- Геттеры (Getters) ---
  const hasChats = computed(() => chats.value && chats.value.length > 0)
  const hasMessages = computed(() => messages.value && messages.value.length > 0)

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
      return response
    } catch (err: any) {
      errorMessage.value = err.response?._data?.data?.error || 'Неизвестная ошибка'
      throw err;
    } finally {
      isLoading.value = false
    }
  }

  const fetchMessages = async (chatId: number) => {
    try {
      isLoading.value = true
      errorMessage.value = ''

      const response = await $fetch<Message[]>('/api/chats/messages', {
        method: 'POST',
        credentials: 'include',
        body: { chatId }
      })

      messages.value = response
      return response
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
    messages,
    errorMessage,
    hasChats,
    hasMessages,
    fetchChats,
    clearError,
    fetchMessages
  }
})
