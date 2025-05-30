<script lang="ts" setup>
import type { ChatPreview } from '~/types/chats'
import dayjs from 'dayjs'
import 'dayjs/locale/ru'
import { useVirtualList } from '@vueuse/core'

const props = defineProps<{
  chats: ChatPreview[]
  selectedChatId: number
  totalChats: number
}>()

const emit = defineEmits(['select-chat'])

dayjs.locale('ru')

const chatList = computed(() => props.chats)

const { list, containerProps, wrapperProps } = useVirtualList(chatList, {
  itemHeight: 100,
  overscan: 5
})
</script>

<template>
  <div class="p-2 w-full">
    <div class="flex flex-col gap-4">
      <div class="text-sm text-gray-500">
        Показано: {{ chatList.length }} из {{ totalChats }} диалогов
      </div>

      <!-- Список чатов -->
      <div class="w-full" v-if="totalChats > 0">
        <div v-bind="containerProps" class="overflow-y-auto chat-container h-[570px] pr-4">
          <div v-bind="wrapperProps" class="flex flex-col gap-4">
            <div
              v-for="item in list"
              :key="item.index"
              class="p-4 rounded-lg cursor-pointer flex flex-col pb-4"
              :class="{
                'bg-slate-700 text-white': selectedChatId === item.data.id,
                'bg-slate-200 hover:bg-slate-300': selectedChatId !== item.data.id
              }"
              @click="emit('select-chat', item.data)"
            >
              <div class="flex">
                <div class="mr-4 flex items-center justify-center">
                  <div>
                    <div class="rounded-full size-12 bg-gradient-to-r from-slate-500 to-gray-500 flex justify-center items-center text-white font-bold">
                      {{ item.data.id }}
                    </div>
                  </div>
                </div>
                <div class="flex flex-col gap-2">
                  <div>{{ item.data.widget_name }}</div>
                  <div>
                    <time :datetime="$dayjs(item.data.date_last_message).format('DD.MMMM.YYYY HH:mm:ss')">
                      {{ $dayjs(item.data.date_last_message).format('DD MMMM YYYY г. HH:mm:ss') }}
                    </time>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else>Список пуст</div>
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
