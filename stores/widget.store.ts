import { defineStore } from 'pinia'

export interface WidgetPreview {
  id: number,
  name: string,
  domain: string,
  isActive: boolean
}

export interface WidgetInfo extends WidgetPreview {
  created_by: number,
  manager_tg_id: string[]
}

export const useWidgetStore = defineStore('widget', () => {
  const widgetsPreview = ref<WidgetPreview[]>([])
  const widgetInfo = ref<WidgetInfo>()

  const getWidgetsPreview = async () => {
    try {
      widgetsPreview.value = await useApi('/api/v1/widget-info/', {
        method: 'GET'
      })
    } catch (error) {
      console.error('Ошибка получения виджетов', error)
      throw new Error('Ошибка получения виджетов')
    }
  }

  const getWidgetInfo = async (widgetId: number) => {
    try {
      widgetInfo.value = await useApi(`/api/v1/widget-info/${widgetId}/`, {
        method: 'GET'
      })
    } catch (error) {
      console.error(`$Ошибка получения виджета с id ${widgetId}`, error)
      throw new Error(`$Ошибка получения виджета с id ${widgetId}`)
    }
  }

  const createWidget = async () => {
    try {
      await useApi('/api/v1/widget-settings/create/', {
        method: 'POST'
      })
    } catch (error) {
      console.error('Ошибка создания виджета', error)
      throw new Error('Ошибка создания виджета')
    }
  }

  const addSettings = async (widgetId: number) => {
    try {
      await useApi(`/api/v1/widget-settings/${widgetId}/update/`, {
        method: 'PATCH'
      })
    } catch (error) {
      console.error(`Ошибка добавления настроек для виджета ${widgetId}`, error)
      throw new Error(`Ошибка добавления настроек для виджета ${widgetId}`)
    }
  }

  return {
    widgetsPreview,
    widgetInfo,
    getWidgetsPreview,
    getWidgetInfo,
    createWidget,
    addSettings
  }
})
