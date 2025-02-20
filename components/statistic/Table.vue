<template>
  <div class="overflow-auto relative">
    <table v-if="statistics.length > 0" class="table-fixed w-full text-xl border-separate border-spacing-y-2.5">
      <thead>
        <tr class="shadow-sm rounded-lg">
          <th class="table-header rounded-s-lg">Порядковый номер</th>
          <th class="table-header">Дата последнего сообщения</th>
          <th class="table-header">Тип чата</th>
          <th class="table-header rounded-e-lg">Избранное</th>
        </tr>
      </thead>
      <tbody>
        <tr 
          v-for="item in statistics" 
          :key="item.id"
          class="bg-slate-100 hover:!bg-slate-200 cursor-pointer"
          @click="onClickDialog(String(item.id))"
        >
          <td class="table-body rounded-s-lg">{{ item.id }}</td>
          <td class="table-body">
            <time :datetime="$dayjs(item.date_last_message).format('DD.MM.YYYY')">{{ $dayjs(item.date_last_message).format('DD.MM.YYYY') }}</time>
          </td>
          <td class="table-body">{{ item.chat_type }}</td>
          <td class="table-body rounded-e-lg">{{ item.note }}</td>
        </tr>
      </tbody>
    </table>
    <div v-else class="flex justify-center">
      <h3 class="text-xl">Список диалогов пуст</h3>
    </div>
  </div>
</template>

<script lang="ts" setup>
const statisticStore = useStatisticStore()
const router = useRouter()

const statistics = ref<StatisticsPreview[]>([])

onMounted(async () => {
  await statisticStore.getStatistics()
  statistics.value = statisticStore.statistics
})

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
</style>
