<template>
  <div class="flex flex-col gap-4">
    <div class="flex justify-end">
      <Button 
        class="bg-slate-700 text-white hover:bg-slate-600 p-4 text-xl"
        @click="useRouter().push('/statistic')"
      >
        Назад
      </Button>
    </div>

    <div class="flex flex-col max-h-[700px] space-y-4 px-14 py-12 border bg-slate-50 shadow-md rounded-lg overflow-y-auto chat-container">
      <SkeletonLoader 
        v-if="loading"
        type="chat" 
        :count="4"
      />

      <template v-else>
        <div v-if="chat.length > 0">
          <div
            v-for="item in chat"
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
      </template>
      
    </div>
  </div>
</template>

<script lang="ts" setup>
const route = useRoute()
const statisticStore = useStatisticStore()
const chat = ref<PersonalDialog[]>([])
const loading = ref(true)

definePageMeta({
  middleware: 'auth'
})

onMounted(async () => {
  await statisticStore.getChat(Number(route.params.id))
  chat.value = statisticStore.chat
  setTimeout(() => {
    loading.value = false
  }, 500)
})
</script>

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
