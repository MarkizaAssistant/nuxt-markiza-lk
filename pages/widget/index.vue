<template>
  <div class="flex flex-col gap-4">
    <div class="flex items-center justify-between">
      <h2 class="text-2xl font-bold">Виджеты ({{ widgets.length }}) </h2>
      <Button 
        class="bg-slate-700 text-white hover:bg-slate-600 p-4 text-xl"
      >
        Добавить новый виджет
      </Button>
    </div>
    
    <div v-for="widget in widgets" :key="widget.id" class="space-y-4">
      <div class="bg-slate-200 p-4 flex gap-4 w-full items-center justify-between">
        <div>{{ widget.id }}</div>
        <div>{{ widget.name }}</div>
        <div>{{ widget.domain }}</div>
        <div>{{ widget.isActive ? 'Активен' : 'Неактивен' }}</div>
        <div class="flex gap-4">
          <Button @click="useRouter().push(`/widget/${widget.id}`)">Посмотреть виджет</Button>
          <Button @click="useRouter().push(`/widget/settings/${widget.id}`)">Настроить виджет</Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
useSeoMeta({
  title: 'Виджет',
  description: 'Страница виджета'
})

const widgetStore = useWidgetStore()
const widgets = ref<WidgetPreview[]>([])

onMounted(async () => {
  await widgetStore.getWidgetsPreview()
  widgets.value = widgetStore.widgetsPreview
})

</script>

<style>

</style>
