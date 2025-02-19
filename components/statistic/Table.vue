<template>
  <div class="overflow-auto relative">
    <table class="table-fixed w-full text-xl border-separate border-spacing-y-2.5">
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
          v-for="item in tableData"
          :key="item.id"
          class="bg-slate-100 hover:!bg-slate-200 cursor-pointer"
          @click="onClickDialog(item.id)"
        >
          <td class="table-body rounded-s-lg">{{ item.id }}</td>
          <td class="table-body">{{ item.date }}</td>
          <td class="table-body">{{ item.type }}</td>
          <td class="table-body rounded-e-lg">{{ item.other }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts" setup>
type TABLE_DATA = {
  id: string,
  date: string,
  type: string,
  other: string
}

const tableData = ref<TABLE_DATA[]>([
  { id: '1', date: '06.02.2025', type: 'widget_1', other: 'г' },
  { id: '2', date: '07.02.2025', type: 'widget_1', other: 'г' },
  { id: '3', date: '08.02.2025', type: 'telegram', other: 'г' },
])

const router = useRouter()

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
