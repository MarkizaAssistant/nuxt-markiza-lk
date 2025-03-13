<script lang="ts" setup>
const chatStore = useChatStore()

const props = defineProps<{
  chatId: number
  widgetName: string
}>()

const messagesData = ref<any[] | null>(null)

const fetchMessages = async (chatId: number) => {
  messagesData.value = await chatStore.fetchMessages(chatId)
}

watch(() => props.chatId, (newChatId) => {
  if (newChatId) {
    fetchMessages(newChatId)
  }
}, { immediate: true })
</script>

<template>
  <div class="flex flex-col">
    <div class="p-4 border-b">
      {{ widgetName }}
    </div>
    <div class="flex bg-gray-100 flex-col max-h-[700px] space-y-4 px-14 py-12 overflow-y-auto chat-container">
      <div v-if="messagesData">
        <div v-if="chatStore.hasMessages">
          <div
            v-for="item in messagesData"
            :key="item.id"
            :class="['flex', item.sender === 'user' ? 'justify-start' : 'justify-end']"
          >
            <div
              :class="[
                'p-5 rounded-lg max-w-[70%] min-w-[35%] flex flex-col gap-2 border',
                item.sender === 'user' ? 'bg-slate-500 text-white' : 'bg-blue-100 text-black'
              ]">
              <div :class="['flex', item.sender === 'user' ? 'justify-start' : 'justify-end']">
                <span class="text-xl capitalize font-bold">{{ item.sender }}</span>
              </div>
              <div :class="['flex', item.sender === 'user' ? 'justify-start' : 'justify-end']">
                <p v-if="item.sender === 'user'" class="text-lg">{{ item.message }}</p>
                <p v-else class="text-lg" v-html="item.message"></p>
              </div>
              <div :class="['flex', item.sender === 'user' ? 'justify-start' : 'justify-end']">
                <span class="text-xs">{{ $dayjs(item.date).format('HH:MM DD.MM.YY') }}</span>
              </div>
            </div>
          </div>
        </div>
  
        <div v-else>Диалогов нет</div>
      </div>
      
      <div v-else>
        <SkeletonLoader type="chat" :count="4" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.chat-container::-webkit-scrollbar {
  @apply w-2
}

.chat-container::-webkit-scrollbar-track {
  @apply bg-gray-50 rounded-lg
}

.chat-container::-webkit-scrollbar-thumb {
  @apply rounded-lg bg-slate-700
}

.chat-container::-webkit-scrollbar-thumb:hover {
  @apply bg-slate-600
}
</style>
