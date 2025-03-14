<script lang="ts" setup>
import type { ChatPreview } from '~/types/chats'

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

const { data: chatsData } = await useAsyncData('chats', async () => {
  return await chatStore.fetchChats()
}, { 
  server: false
})

if (chatsData.value && chatId.value === 0) {
  chatId.value = chatsData.value[0].id
  widgetName.value = chatsData.value[0].widget_name

  chatIdCookie.value = chatId.value
  widgetNameCookie.value = widgetName.value
}

function handleChat (chat: ChatPreview) {
  chatId.value = chat.id
  widgetName.value = chat.widget_name

  chatIdCookie.value = chat.id
  widgetNameCookie.value = chat.widget_name
}
</script>

<template>
  <div class="flex flex-col gap-4 h-full">
    <h2 class="text-2xl font-bold">Список диалогов</h2>

    <div v-if="chatsData">
      <div class="w-full border h-[700px] p-4 rounded-lg shadow-md flex flex-col">
        <div class="w-full border-b border-gray-200 pb-2">
          <button class="px-4 py-2 rounded-lg bg-slate-800 text-white hover:bg-slate-700">
            Фильтры
          </button>
        </div>
  
        <div class="flex flex-1 w-full overflow-hidden">
          <StatisticList
            class="max-w-sm w-full border-r"
            :chats="chatsData"
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
    <div v-else>Загрузка чатов...</div>

  </div>
</template>

<style>

</style>
