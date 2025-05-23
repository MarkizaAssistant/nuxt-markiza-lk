import { defineStore } from 'pinia'
import type { WidgetInfo, WidgetPreview } from '~/types/widgets'

export const useWidgetStore = defineStore('widget', () => {
  // --- Состояние (State) ---
  const isLoading = ref(false)
  const errorMessage = ref<string>('')
  const widgets = ref<WidgetPreview[]>([])
  const widget = ref<WidgetInfo>()

  // --- Геттеры (Getters) ---
  const hasWidgets = computed(() => widgets.value && widgets.value.length > 0)

  // --- Инициализация ---
  const initialize = () => {}

  // --- Методы (Actions) ---
  const clearError = () => {
    errorMessage.value = ''
  }

  const fetchWidgets = async () => {
    try {
      isLoading.value = true
      errorMessage.value = ''

      const response = await $fetch<WidgetPreview[]>('/api/widgets/preview', {
        method: 'GET',
        credentials: 'include'
      })

      widgets.value = response
      return response
    } catch (err: any) {
      errorMessage.value = err.response?._data?.data?.error || 'Неизвестная ошибка'
      throw err;
    } finally {
      isLoading.value = false
    }
  }

  const fetchWidgetId = async (widgetId: number) => {
    try {
      isLoading.value = true
      errorMessage.value = ''

      const response = await $fetch<WidgetInfo>('/api/widgets/getById', {
        method: 'POST',
        credentials: 'include',
        body: { widgetId }
      })

      widget.value = response
      return response
    } catch (err: any) {
      errorMessage.value = err.response?._data?.data?.error || 'Неизвестная ошибка'
      throw err;
    } finally {
      isLoading.value = false
    }
  }

  const createWidget = async (): Promise<any> => {
    try {
      isLoading.value = true
      errorMessage.value = ''

      const startTime = Date.now()

      const response = await $fetch('/api/widgets/create', {
        credentials: 'include'
      })

      const elapsedTime = Date.now() - startTime
      const delay = Math.max(500 - elapsedTime, 0)

      await new Promise((resolve) => setTimeout(resolve, delay))

      return response
    } catch (err: any) {
      errorMessage.value = err.response?._data?.data?.error || 'Неизвестная ошибка'
      throw err;
    } finally {
      isLoading.value = false
    }
  }

  const deleteWidget = async (widgetId: number) => {
    try {
      isLoading.value = true
      errorMessage.value = ''

      const response = await $fetch('/api/widgets/delete', {
        method: 'POST',
        credentials: 'include',
        body: { widgetId }
      })

      return response
    } catch (err: any) {
      errorMessage.value = err.response?._data?.data?.error || 'Неизвестная ошибка'
      throw err;
    } finally {
      isLoading.value = false
    }
  }

  const addDomain = async (widgetId: number, domain: string) => {
    try {
      isLoading.value = true
      errorMessage.value = ''

      const response = await $fetch('/api/widgets/domains/create', {
        method: 'POST',
        credentials: 'include',
        body: { widgetId, domain }
      })

      if (response === null) return

      if (widget.value) {
        widget.value.domains.push(response)
      }
    } catch (err: any) {
      errorMessage.value = err.response?._data?.data?.error || 'Неизвестная ошибка'
      throw err;
    } finally {
      isLoading.value = false
    }
  }

  const deleteDomain = async (widgetId: number) => {
    try {
      isLoading.value = true
      errorMessage.value = ''

      const response = await $fetch('/api/widgets/domains/delete', {
        method: 'POST',
        credentials: 'include',
        body: { widgetId }
      })

      if (response === null) return

      if (widget.value) {
        widget.value.domains = widget.value.domains.filter(d => d.id !== widgetId);
      }
    } catch (err: any) {
      errorMessage.value = err.response?._data?.data?.error || 'Неизвестная ошибка'
      throw err;
    } finally {
      isLoading.value = false
    }
  }

  const updateWidget = async (widgetId: number, widgetData: any) => {
    try {
      isLoading.value = true
      errorMessage.value = ''

      const { id, ...data } = widgetData

      const response = await $fetch('/api/widgets/update', {
        method: 'POST',
        credentials: 'include',
        body: { widgetId, widgetData: data }
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
    isLoading,
    errorMessage,
    widgets,
    widget,
    hasWidgets,
    fetchWidgets,
    fetchWidgetId,
    createWidget,
    deleteWidget,
    addDomain,
    deleteDomain,
    updateWidget,
    clearError
  }
})
