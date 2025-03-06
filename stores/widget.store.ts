import { defineStore } from 'pinia'

export interface WidgetPreview {
  id: number,
  name: string,
  is_active: boolean
}

export interface Domain {
  id: number;
  name: string;
}


export interface WidgetInfo extends WidgetPreview {
  domains: Domain[],
  manager_tg_id: string[]
}

const handleError = (action: string, error: any) => {
  console.error(`${action} не удалось`, error);
  throw new Error(`${action} не удалось: ${error.message}`);
}

export const useWidgetStoreBFf = defineStore('widget', () => {
  const widgetsPreview = ref<WidgetPreview[]>([])
  const widgetInfo = ref<WidgetInfo | null>(null);

  const getWidgetsPreview = async () => {
    try {
      widgetsPreview.value = await useApi('/api/v1/widget-info/', {
        method: 'GET'
      })
    } catch (error) {
      handleError('Ошибка получения виджетов', error)
    }
  }

  const getWidgetInfo = async (widgetId: number) => {
    try {
      widgetInfo.value = await useApi(`/api/v1/widget-info/${widgetId}/`, {
        method: 'GET'
      })
    } catch (error) {
      handleError(`Ошибка получения виджета с id ${widgetId}`, error)
    }
  }

  const createWidget = async (): Promise<{ widgetId: number, createdWidget: WidgetInfo } | undefined> => {
    try {
      const response = await useApi<{ widget_id: number }>('/api/v1/widget-settings/create/', {
        method: 'POST'
      })
      const widgetId = response.widget_id

      const createdWidget = await useApi<WidgetInfo>(`/api/v1/widget-settings/${widgetId}/update/`, {
        method: 'PATCH',
        body: { name: `Новый виджет ${widgetId}` },
      })

      return {
        widgetId,
        createdWidget
      }
    } catch (error) {
      handleError('Ошибка создания виджета', error)
    }
  }

  const deleteWidget = async (widgetId: number) => {
    try {
      await useApi(`/api/v1/widget-settings/${widgetId}/delete/`, {
        method: 'DELETE'
      })
    } catch (error) {
      handleError('Ошибка удаления виджета', error);
    }
  }

  const addSettings = async (widgetInfo: WidgetInfo) => {
    try {
      await useApi(`/api/v1/widget-settings/${widgetInfo.id}/update/`, {
        method: 'PATCH',
        body: {
          name: widgetInfo.name,
          is_active: widgetInfo.is_active,
          manager_tg_id: widgetInfo.manager_tg_id
        }
      })
    } catch (error) {
      handleError(`Ошибка добавления настроек для виджета ${widgetInfo.id}`, error)
    }
  }

  const addDomain = async (widgetId: number, domain: string): Promise<Domain | undefined> => {
    try {
      const newDomain = await useApi<Domain>(`/api/v1/widget-settings/${widgetId}/domains/create/`, {
        method: "POST",
        body: { name: domain },
      })

      if (widgetInfo.value) {
        widgetInfo.value.domains.push(newDomain)
      }

      return newDomain
    } catch (error) {
      handleError('Ошибка при добавлении домена', error)
    }
  };
  
  const deleteDomain = async (domainId: number) => {
    try {
      await useApi(`/api/v1/domains/${domainId}/delete/`, {
        method: "DELETE",
      })

      if (widgetInfo.value) {
        widgetInfo.value.domains = widgetInfo.value.domains.filter(d => d.id !== domainId);
      }
    } catch (error) {
      handleError('Ошибка при удалении домена', error)
    }
  }

  return {
    widgetsPreview,
    widgetInfo,
    getWidgetsPreview,
    getWidgetInfo,
    createWidget,
    addSettings,
    deleteWidget,
    addDomain,
    deleteDomain
  }
})
