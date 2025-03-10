<template>
  <div v-if="widgetsData">
    <div class="flex flex-col gap-4">
      <div class="flex items-center justify-between">
        <h2 class="text-2xl font-bold">Виджеты ({{ widgetsData?.length || 0 }})</h2>
        <Button 
          class="bg-slate-700 text-white hover:bg-slate-600 p-4 text-xl"
          @click="AddWidget"
        >
          Добавить новый виджет
        </Button>
      </div>
  
      <div v-if="widgetStore.isLoading">Загрузка...</div>
  
      <div v-else-if="widgetStore.hasWidgets && widgetsData" class="overflow-y-auto h-[600px] pr-2 widget-grid">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <div v-for="widget in widgetsData" :key="widget.id" class="widget-card bg-slate-200 p-6 rounded-lg shadow-sm relative">
            <button 
              @click="openDeleteModal(widget.id)"
              class="absolute top-2 right-2 text-gray-500 hover:text-red-600"
            >
              <Icon name="ic:outline-delete" class="w-6 h-6" />
            </button>
            
            <div class="flex flex-col justify-between h-full gap-2">
              <div class="flex flex-col gap-2">
                <div class="text-lg font-bold widget-name">{{ widget.name }}</div>
                <div class="text-sm">
                  <span :class="widget.is_active ? 'text-green-600' : 'text-red-600'">
                    {{ widget.is_active ? 'Активен' : 'Неактивен' }}
                  </span>
                </div>
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
  
      <div v-else class="flex justify-center items-center">Список виджетов пуст</div>
    </div>
  </div>

  <div v-else>
    Загрузка...
  </div>

  <Modal
    v-if="showDeleteModal"
    :show="showDeleteModal"
    title="Удаление виджета"
    message="При удалении виджета удалятся все чаты, связанные с ним. Вы действительно хотите удалить?"
    confirmText="Удалить"
    cancelText="Отмена"
    @confirm="deleteWidget"
    @cancel="showDeleteModal = false"
  />
</template>

<script lang="ts" setup>
useSeoMeta({
  title: 'Виджет',
  description: 'Страница виджета'
})

definePageMeta({
  middleware: 'auth'
})

const widgetStore = useWidgetStore()
const showDeleteModal = ref(false)
const widgetToDelete = ref<number | null>(null)
const loaderStore = useLoaderStore()

const { data: widgetsData } = await useAsyncData('widgets', async () => {
  const widgets = await widgetStore.fetchWidgets()
  if (widgets) {
    return widgets.sort((a, b) => a.id - b.id)
  }
  return null
})

const AddWidget = async () => {
  try {
    loaderStore.isLoading = true
    const response = await widgetStore.createWidget()
    await useRouter().push(`/widget/settings/${response.widget_id}`)
  } catch (error) {
    console.error('Ошибка при создании виджета:', error)
  } finally {
    loaderStore.isLoading = false
  }
}

const openDeleteModal = (id: number) => {
  widgetToDelete.value = id
  showDeleteModal.value = true
}

const deleteWidget = async () => {
  if (widgetToDelete.value !== null) {
    try {
      await widgetStore.deleteWidget(widgetToDelete.value)
      if (widgetsData?.value) {
        widgetsData.value = widgetsData.value.filter(widget => widget.id !== widgetToDelete.value)
      }
    } catch (error) {
      console.error('Ошибка при удалении виджета:', error)
    }
  }
  showDeleteModal.value = false
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

.widget-name {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
