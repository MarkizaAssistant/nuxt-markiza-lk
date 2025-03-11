import { defineStore } from 'pinia'
import type { CustomIcon, WidgetIcon } from '~/types/widgets'

export const useIconStore = defineStore('icons', () => {
  // --- Состояние (State) ---
  const isLoading = ref(false)
  const errorMessage = ref<string>('')
  const baseIcons = ref<WidgetIcon[]>([])
  const customIcons = ref<CustomIcon[]>([])

  // --- Геттеры (Getters) ---
  const hasBaseIcons = computed(() => baseIcons.value && baseIcons.value.length > 0)
  const hasCustomIcons = computed(() => customIcons.value && customIcons.value.length > 0)

  // --- Инициализация ---
  const initialize = () => {}

  // --- Методы (Actions) ---
  const clearError = () => {
    errorMessage.value = ''
  }

  const fetchBaseIcons = async () => {
    try {
      isLoading.value = true
      errorMessage.value = ''

      const response = await $fetch<WidgetIcon[]>('/api/widgets/icons/base', {
        method: 'GET',
        credentials: 'include'
      })

      baseIcons.value = response
      return response
    } catch (err: any) {
      errorMessage.value = err.response?._data?.data?.error || 'Неизвестная ошибка'
      throw err;
    } finally {
      isLoading.value = false
    }
  }

  const fetchCustomIcons = async () => {
    try {
      isLoading.value = true
      errorMessage.value = ''

      const response = await $fetch<CustomIcon[]>('/api/widgets/icons/custom', {
        method: 'GET',
        credentials: 'include'
      })

      customIcons.value = response
      return response
    } catch (err: any) {
      errorMessage.value = err.response?._data?.data?.error || 'Неизвестная ошибка'
      throw err;
    } finally {
      isLoading.value = false
    }
  }

  const uploadCustomIcon = async (file: File) => {
    try {
      isLoading.value = true
      errorMessage.value = ''

      const formData = new FormData()
      formData.append('file', file)

      const response = await $fetch('/api/widgets/icons/upload', {
        method: 'POST',
        credentials: 'include',
        body: formData,
        headers: {
          'Accept': 'application/json',
        }
      })
      
      return response
    } catch (err: any) {
      errorMessage.value = err.response?._data?.data?.error || 'Неизвестная ошибка'
      throw err;
    } finally {
      isLoading.value = false
    }
  }

  const deleteIcon = async (iconId: number) => {
    try {
      isLoading.value = true
      errorMessage.value = ''

      const response = await $fetch('/api/widgets/icons/delete', {
        method: 'POST',
        credentials: 'include',
        body: { iconId }
      })

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
    baseIcons,
    customIcons,
    hasBaseIcons,
    hasCustomIcons,
    fetchBaseIcons,
    fetchCustomIcons,
    uploadCustomIcon,
    deleteIcon,
    isLoading,
    errorMessage,
    clearError,
  }
})
