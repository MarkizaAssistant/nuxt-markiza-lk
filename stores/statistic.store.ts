import { defineStore } from 'pinia'

export interface Chat {
  id: number;
  chat_type: string;
  user_id: string;
  date_last_message: string;
  is_favorite: boolean;
  note: string | null;
  widget_owner: number;
  creator: number;
}

export interface StatisticsPreview extends Chat {
  widget_name: string;
}

export interface PersonalDialog {
  id: number;
  message: string;
  sender: string;
  date: string;
  chat: number;
}

export const useStatisticStore = defineStore('statistic', () => {
  const statistics = ref<StatisticsPreview[]>([])
  const chat = ref<PersonalDialog[]>([])

  const widgetCache = ref<Record<number, string>>({})

  const getStatistics = async () => {
    try {
      const chats = await useApi<Chat[]>('/api/v1/chats/', {
        method: 'GET'
      })
  
      const statisticsWithWidgetNames = await Promise.all(
        chats.map(async (chat: any) => {
          if (widgetCache.value[chat.widget_owner]) {
            return {
              ...chat,
              widget_name: widgetCache.value[chat.widget_owner]
            }
          }
  
          const widgetInfo = await useApi<WidgetPreview>(`/api/v1/widget-info/${chat.widget_owner}/`, {
            method: 'GET'
          })
          widgetCache.value[chat.widget_owner] = widgetInfo.name
  
          return {
            ...chat,
            widget_name: widgetInfo.name
          }
        })
      )
  
      statistics.value = statisticsWithWidgetNames
    } catch (error) {
      console.error('Ошибка получения статистики', error)
      throw new Error('Ошибка получения статистики')
    }
  }

  const getChat = async (chatId: number) => {
    try {
      chat.value = await useApi(`/api/v1/messages/${chatId}/`, {
        method: 'GET'
      })
    } catch (error) {
      console.error('Ошибка получения чата', error)
      throw new Error('Ошибка получения чата')
    }
  }

  return {
    statistics,
    chat,
    getStatistics,
    getChat
  }
})
