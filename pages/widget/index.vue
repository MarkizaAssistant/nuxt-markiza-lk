<template>
  <div class="flex flex-col gap-4">
    <div class="flex items-center justify-between">
      <h2 class="text-2xl font-bold">Виджеты ({{ widgets.length }}) </h2>
      <Button 
        class="bg-slate-700 text-white hover:bg-slate-600 p-4 text-xl"
        @click="AddWidget"
      >
        Добавить новый виджет
      </Button>
    </div>

    <div class="overflow-y-auto h-[600px] pr-2 widget-grid">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div v-for="widget in widgets" :key="widget.id" class="widget-card bg-slate-200 p-4 rounded-lg shadow-sm transition-transform transform hover:shadow-md">
          <div class="flex flex-col gap-2">
            <div class="text-lg font-bold">{{ widget.name }}</div>
            <div class="text-sm text-gray-600">{{ widget.domain }}</div>
            <div class="text-sm">
              <span :class="widget.isActive ? 'text-green-600' : 'text-red-600'">
                {{ widget.isActive ? 'Активен' : 'Неактивен' }}
              </span>
            </div>
            <div class="mt-4">
              <Button 
                class="w-full bg-slate-700 text-white hover:bg-slate-600 p-2"
                @click="useRouter().push(`/widget/settings/${widget.id}`)"
              >
                Настроить виджет
              </Button>
            </div>
          </div>
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

const AddWidget = async () => {
  try {
    const widgetId = await widgetStore.createWidget()
    await useRouter().push({
      path: `/widget/settings/${widgetId}`,
      query: { isNew: 'true' }
    })
  } catch (error) {
    console.error('Ошибка при создании виджета:', error)
  }
}
</script>

<style scoped>
.widget-grid::-webkit-scrollbar {
  @apply w-2;
}

.widget-grid::-webkit-scrollbar-track {
  @apply bg-gray-50 rounded-lg;
}

.widget-grid::-webkit-scrollbar-thumb {
  @apply rounded-lg bg-slate-700;
}

.widget-grid::-webkit-scrollbar-thumb:hover {
  @apply bg-slate-600;
}
</style>
