import { defineStore } from 'pinia'

export interface StatisticsPreview {
  id: number,
  date_last_message: string,
  chat_type: string,
  note: string | null
}

export interface PersonalDialog {
  id: number,
  message: string,
  sender: string,
  date: string,
  chat: number
}

export const useStatisticStore = defineStore('statistic', () => {
  const statistics = ref<StatisticsPreview[]>([])
  const chat = ref<PersonalDialog[]>([])

  const getStatistics = async () => {
    try {
      statistics.value = await useApi('/api/v1/chats/', {
        method: 'GET'
      })
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
