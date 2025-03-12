<template>
  <div class="relative">
    <div v-if="chatsData">
      <div v-if="status === 'success'">
          <div v-if="chatStore.hasChats" class="h-[600px] overflow-y-auto table-container pr-2">
            <div v-if="chatsData">
              <table  class="table-fixed w-full text-xl border-separate border-spacing-y-2.5">
                <thead class="sticky top-0 bg-slate-300">
                  <tr class="shadow-sm rounded-lg">
                    <th class="table-header rounded-s-lg">Порядковый номер</th>
                    <th class="table-header">
                      <button @click="sortByDate">
                        Дата последнего сообщения
                        <Icon :name="sortDirection === 'asc' ? 'mdi:arrow-up' : 'mdi:arrow-down'" />
                      </button>
                    </th>
                    <th class="table-header">Виджет</th>
                    <th class="table-header rounded-e-lg">Избранное</th>
                  </tr>
                </thead>
                <tbody>
                  <tr 
                    v-for="item in sortedChats" 
                    :key="item.id"
                    class="bg-slate-100 hover:!bg-slate-200 cursor-pointer"
                    @click="onClickDialog(String(item.id))"
                  >
                    <td class="table-body rounded-s-lg">{{ item.id }}</td>
                    <td class="table-body">
                      <time :datetime="$dayjs(item.date_last_message).format('DD.MM.YYYY')">{{ $dayjs(item.date_last_message).format('DD.MM.YYYY') }}</time>
                    </td>
                    <td class="table-body">{{ item.widget_name }}</td>
                    <td class="table-body rounded-e-lg">{{ item.note }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
      
          <div v-else class="flex justify-center">
            <h3 class="text-xl">Список диалогов пуст</h3>
          </div>
      </div>

      <div v-else-if="status === 'pending'">
        <SkeletonLoader
          type="table" 
          :count="5"
          containerClass="w-full space-y-2"
        />
      </div>
    </div>
    
    <div v-else>
      <SkeletonLoader
        type="table" 
        :count="5"
        containerClass="w-full space-y-2"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
const chatStore = useChatStore()
const router = useRouter()
const sortDirection = ref<'asc' | 'desc'>('asc')

const { data: chatsData, status } = await useAsyncData('chats', async () => {
  const chats = await chatStore.fetchChats()
  return chats || null
}, { server: false })

const sortedChats = computed(() => {
  if (chatsData.value === null) return

  return [...chatsData.value].sort((a, b) => {
    const dateA = new Date(a.date_last_message).getTime()
    const dateB = new Date(b.date_last_message).getTime()
    return sortDirection.value === 'asc' ? dateA - dateB : dateB - dateA
  })
})

const sortByDate = () => {
  sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
}

const onClickDialog = (id: string) => {
  router.push(`/statistic/${id}`)
}
</script>

<style scoped>
.table-header {
  @apply font-bold p-6 border-b text-left text-slate-800 bg-slate-300
}
.table-body {
  @apply p-6 border-b text-left
}
.table-container::-webkit-scrollbar {
  @apply w-2
}

.table-container::-webkit-scrollbar-track {
  @apply bg-gray-50 rounded-lg
}

.table-container::-webkit-scrollbar-thumb {
  @apply rounded-lg bg-slate-700
}

.table-container::-webkit-scrollbar-thumb:hover {
  @apply bg-slate-600
}
</style>
