import { defineStore } from 'pinia'

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
    clearError
  }
})
