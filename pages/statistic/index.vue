<script lang="ts" setup>
import type { ChatPreview } from '~/types/chats'
import dayjs from 'dayjs'
import 'dayjs/locale/ru'

const chatStore = useChatStore()

useSeoMeta({
  title: 'Статистика',
  description: 'Страница статистики'
})

definePageMeta({
  middleware: 'auth'
})

const chatIdCookie = useCookie<number>('chatId', { default: () => 0 })
const widgetNameCookie = useCookie<string>('widgetName', { default: () => '' })

const chatId = ref(chatIdCookie.value)
const widgetName = ref(widgetNameCookie.value)

const selectedDate = ref<string | null>(null)
const isLoading = ref(false)
const chatsData = ref<ChatPreview[] | null>(null)

onMounted(async () => {
  isLoading.value = true
  chatsData.value = await chatStore.fetchChats()
  isLoading.value = false

  if (chatId.value === 0 && chatsData.value && chatsData.value.length > 0) {
    chatId.value = chatsData.value[0].id
    widgetName.value = chatsData.value[0].widget_name

    chatIdCookie.value = chatId.value
    widgetNameCookie.value = widgetName.value
  }
})

const filteredChats = computed(() => {
  if (!chatsData.value) return []

  let chats = chatsData.value
  if (selectedDate.value) {
    chats = chats.filter(chat => {
      return dayjs(chat.date_last_message).isSame(selectedDate.value, 'day')
    })
  }

  return chats.sort((a, b) => {
    return dayjs(b.date_last_message).unix() - dayjs(a.date_last_message).unix()
  })
})

function handleChat(chat: ChatPreview) {
  chatId.value = chat.id
  widgetName.value = chat.widget_name

  chatIdCookie.value = chat.id
  widgetNameCookie.value = chat.widget_name
}
</script>

<template>
  <div class="flex flex-col gap-4 h-full">
    <h2 class="text-2xl font-bold">Список диалогов</h2>

    <div v-if="isLoading">Загрузка чатов...</div>
    <div v-else>
      <div v-if="chatsData">
        <div class="w-full border h-[700px] p-4 rounded-lg shadow-md flex flex-col">
          <div class="w-full border-b border-gray-200 pb-2">
            <div class="flex items-center gap-4">
              <label for="date-filter" class="text-sm text-gray-500">Фильтр по дате:</label>
              <input
                id="date-filter"
                v-model="selectedDate"
                type="date"
                class="p-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>
    
          <div class="flex flex-1 w-full overflow-hidden">
            <StatisticList
              class="max-w-sm w-full border-r"
              :chats="filteredChats"
              :total-chats="chatsData.length || 0"
              :selected-chat-id="chatId"
              @select-chat="handleChat"
            />
            <StatisticDialog
              class="w-full"
              :chat-id="chatId"
              :widget-name="widgetName"
            />
          </div>
        </div>
      </div>
      <div v-else>Нет данных</div>
    </div>
  </div>
</template>

<style>
</style>
