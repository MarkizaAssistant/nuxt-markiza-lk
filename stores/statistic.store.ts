import { defineStore } from 'pinia'

export interface StatisticsPreview {
  id: number,
  date_last_message: string,
  chat_type: string,
  note: string | null
}

export const useStatisticStore = defineStore('statistic', () => {
  const statistics = ref<StatisticsPreview[]>([])

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

  return {
    statistics,
    getStatistics
  }
})
