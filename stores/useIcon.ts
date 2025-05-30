import { defineStore } from 'pinia'
import type { WidgetIcon } from '~/types/widgets'

export const useIconStore = defineStore('icons', () => {
  // --- Состояние (State) ---
  const isLoading = ref(false)
  const errorMessage = ref<string>('')
  const baseIcons = ref<WidgetIcon[]>([])
  const customIcons = ref<WidgetIcon[]>([])

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

      const response = await $fetch<WidgetIcon[]>('/api/widgets/icons/custom', {
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

      const response = await $fetch<WidgetIcon>('/api/widgets/icons/upload', {
        method: 'POST',
        credentials: 'include',
        body: formData,
        headers: {
          'Accept': 'application/json',
        }
      })

      if (response) {
        customIcons.value.push(response)
      }
      
      return response
    } catch (err: any) {
      errorMessage.value = err.response?._data?.data?.error || 'Неизвестная ошибка'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const updateName = async (iconId: number, newName: string) => {
    try {
      isLoading.value = true
      errorMessage.value = ''

      const response = await $fetch('/api/widgets/icons/update', {
        method: 'POST',
        credentials: 'include',
        body: { iconId, newName }
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

      customIcons.value = customIcons.value.filter(icon => icon.id !== iconId)

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
    updateName,
    deleteIcon,
    isLoading,
    errorMessage,
    clearError,
  }
})
