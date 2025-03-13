<script lang="ts" setup>
import type { ChatPreview } from '~/types/chats'
import dayjs from 'dayjs'
import 'dayjs/locale/ru'

defineProps<{
  chats: ChatPreview[]
  selectedChatId: number
}>()

const emit = defineEmits(['select-chat'])

dayjs.locale('ru')

function isImage (url: string) {
  const imageExtensions = ['.png', '.jpg', '.jpeg']
  return imageExtensions.some(ext => url.toLowerCase().endsWith(ext))
}

function isVideo (url: string) {
  const videoExtensions = ['.mp4', '.webm']
  return videoExtensions.some(ext => url.toLowerCase().endsWith(ext))
}
</script>

<template>
  <div class="p-2 w-full">
    <div class="flex flex-col gap-4">
      <div class="text-sm text-gray-500">
        Показано: {{ chats.length }} из {{ chats.length }} диалогов
      </div>

      <div
        v-for="chat in chats"
        class="p-4 rounded-lg cursor-pointer flex flex-col"
        :key="chat.id"
        :class="{
          'bg-slate-700 text-white': selectedChatId === chat.id,
          'bg-slate-200 hover:bg-slate-300': selectedChatId !== chat.id
        }"
        @click="emit('select-chat', chat)"
      >
        <div class="flex">
          <div class="mr-4 flex items-center justify-center">
            <template v-if="isImage(chat.icon.url)">
              <img :src="`https://api.yamarkiza.ru/${chat.icon.url}`" :alt="chat.icon.name" class="rounded-full size-12 object-contain" />
            </template>
            <template v-else-if="isVideo(chat.icon.url)">
              <video autoplay loop muted playsinline class="rounded-full size-12 object-contain">
                <source :src="`https://api.yamarkiza.ru/${chat.icon.url}`" />
              </video>
            </template>
            <template v-else>
              <span>Ошибка</span>
            </template>
          </div>
          <div class="flex flex-col gap-2">
            <div>{{ chat.widget_name }}</div>
            <div>
              <time :datetime="$dayjs(chat.date_last_message).format('DD.MMMM.YYYY HH:mm:ss')">
                {{ $dayjs(chat.date_last_message).format('DD MMMM YYYY г. HH:mm:ss') }}
              </time>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>

</style>
