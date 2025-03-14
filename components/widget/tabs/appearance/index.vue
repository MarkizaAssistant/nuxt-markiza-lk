<script lang="ts" setup>
import type { WidgetIcon } from '~/types/widgets';

const iconStore = useIconStore()
const notificationStore = useNotificationStore()

defineProps<{
  widgetLeft: boolean
  selectedIcon: WidgetIcon | null
}>()

const emit = defineEmits(['select-icon', 'update-position'])

const { data: baseIcons } = await useAsyncData('baseIcons', async () => {
  return await iconStore.fetchBaseIcons()
}, {
  server: false
})

const { data: customIcons } = await useAsyncData('customIcons', async () => {
  return await iconStore.fetchCustomIcons()
}, {
  server: false
})

function handleSelectIcon (payload: { type: 'base_icon' | 'icon'; icon: WidgetIcon }) {
  emit('select-icon', payload)
}

async function handleRemoveIcon (iconId: number) {
  try {
    await iconStore.deleteIcon(iconId)
    notificationStore.addNotification('success', 'Иконка успешно удалена!')
  } catch (error) {
    notificationStore.addNotification('error', 'Ошибка при удалении иконки.')
  }
}

async function handleUpdateIconName (payload: { iconId: number; name: string }) {
  try {
    await iconStore.updateName(payload.iconId, payload.name)
    notificationStore.addNotification('success', 'Имя иконки успешно изменено!')
  } catch (error) {
    notificationStore.addNotification('error', 'Ошибка при изменении имени иконки.')
  }
}

async function handleUploadIcon (file: File) {
  try {
    await iconStore.uploadCustomIcon(file)
    notificationStore.addNotification('success', 'Иконка успешно загружена!')
  } catch (error) {
    notificationStore.addNotification('error', 'Ошибка при загрузке иконки.')
  }
}

function updatePosition (value: boolean) {
  emit('update-position', value)
}
</script>

<template>
  <div class="flex flex-col gap-4 overflow-y-auto h-[600px] table-container pr-2">
    <div class="border border-gray-300 rounded-lg shadow-sm p-4">
      <div v-if="baseIcons">
        <WidgetTabsAppearanceBaseIcons
          :base-icons="baseIcons"
          :selected-icon="selectedIcon"
          :has-base-icons="iconStore.hasBaseIcons"
          @select-icon="handleSelectIcon"
        />
      </div>
      <div v-else>Загрузка базовых иконок...</div>
  
      <div v-if="customIcons">
        <WidgetTabsAppearanceCustomIcons
          :user-icons="customIcons"
          :selected-icon="selectedIcon"
          :has-custom-icons="iconStore.hasCustomIcons"
          @select-icon="handleSelectIcon"
          @remove-icon="handleRemoveIcon"
          @update-icon-name="handleUpdateIconName"
          @upload-icon="handleUploadIcon"
        />
      </div>
      <div v-else>Загрузка пользовательских иконок...</div>
    </div>
    
    <div class="border border-gray-300 rounded-lg shadow-sm p-4">
      <WidgetTabsAppearancePositionSelector
        :widget-left="widgetLeft"
        @update-position="updatePosition"
      />
    </div>
  </div>
</template>

<style lang="css" scoped>
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
