<template>
  <div>
    <!-- Стандартные иконки -->
    <div class="flex flex-col gap-4 mb-10">
      <div class="text-lg font-medium">Выбрать стандартные иконки</div>
      <div>
        <div v-if="baseIcons">
          <div v-if="iconStore.hasBaseIcons" class="flex gap-4 flex-wrap">
            <div
              v-for="icon in baseIcons"
              :key="icon.id"
              class="p-2 rounded-lg border-2 transition-all duration-300 cursor-pointer"
              :class="{
                'border-slate-800 opacity-100': selectedBaseIconId === icon.id,
                'border-transparent opacity-80 hover:border-slate-800 hover:opacity-100': selectedBaseIconId !== icon.id,
              }"
              @click="selectIcon(icon.id, 'base')"
            >
              <img :src="icon.url" :alt="icon.name" class="size-14 object-contain" />
            </div>
          </div>
          <div v-else>Список иконок пуст</div>
        </div>
        <div v-else>Загрузка стандартных иконок...</div>
      </div>
    </div>

    <!-- Пользовательские иконки -->
    <div class="flex flex-col gap-4">
      <div class="text-lg font-medium">Выбрать пользовательские иконки</div>
      <div>
        <div v-if="userIcons">
          <div v-if="iconStore.hasCustomIcons" class="flex gap-4 flex-wrap">
            <div
              v-for="icon in userIcons"
              :key="icon.id"
              class="p-2 rounded-lg border-2 transition-all duration-300 cursor-pointer"
              :class="{
                'border-slate-800 opacity-100': selectedCustomIconId === icon.id,
                'border-transparent opacity-80 hover:border-slate-800 hover:opacity-100': selectedCustomIconId !== icon.id,
              }"
              @click="selectIcon(icon.id, 'custom')"
            >
              <img :src="icon.url" :alt="`Иконка ${icon.id}`" class="size-14 object-contain" />
              <button 
                class="text-red-500 mt-2 text-xs"
                @click="confirmRemoveCustomIcon(icon.id)"
              >
                Удалить
              </button>
            </div>
          </div>
          <div v-else>Список иконок пуст</div>
        </div>
        <div v-else>Загрузка пользовательских иконок...</div>
      </div>
      <div>
        <input
          type="file"
          ref="fileInput"
          accept="image/*,video/*"
          style="display: none;"
          @change="handleFileUpload"
        >
        <button
          class="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700"
          @click="triggerFileInput"
        >
          Добавить свою иконку
        </button>
      </div>
    </div>

    <!-- Модальное окно для подтверждения удаления -->
    <Modal
      v-if="showModal"
      :show="showModal"
      title="Подтвердите удаление"
      message="Вы уверены, что хотите удалить эту иконку?"
      confirmText="Удалить"
      cancelText="Отмена"
      @confirm="handleRemoveIcon"
      @cancel="cancelRemoveIcon"
    />
  </div>
</template>

<script lang="ts" setup>
const iconStore = useIconStore()
const selectedBaseIconId = ref<number | null>(null)
const selectedCustomIconId = ref<number | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)
const notificationStore = useNotificationStore()

const { data: baseIcons } = await useAsyncData('baseIcons', async () => {
  const baseIcons = await iconStore.fetchBaseIcons()
  return baseIcons
})

const { data: userIcons } = await useAsyncData('customIcons', async () => {
  const userIcons = await iconStore.fetchCustomIcons()
  return userIcons
})

const showModal = ref(false)
const iconIdToRemove = ref<number | null>(null)

const selectIcon = (iconId: number, type: 'base' | 'custom') => {
  if (type === 'base') {
    selectedBaseIconId.value = iconId
    selectedCustomIconId.value = null
  }

  if (type === 'custom') {
    selectedCustomIconId.value = iconId
    selectedBaseIconId.value = null
  }
}

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileUpload = async (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]

  if (!file) {
    notificationStore.addNotification('warning', 'Файл не выбран.')
    return
  }

  const maxSize = 5 * 1024 * 1024
  if (file.size > maxSize) {
    notificationStore.addNotification('error', 'Файл слишком большой. Максимальный размер - 5 МБ.')
    return
  }

  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'video/webm']
  if (!allowedTypes.includes(file.type)) {
    notificationStore.addNotification('error', 'Недопустимый тип файла.')
    return
  }

  try {
    await iconStore.uploadCustomIcon(file)
    notificationStore.addNotification('success', 'Файл успешно загружен!')
    userIcons.value = await iconStore.fetchCustomIcons()
  } catch (error) {
    notificationStore.addNotification('error', 'Ошибка при загрузке файла.')
  } finally {
    input.value = ''
  }
}

const confirmRemoveCustomIcon = (iconId: number) => {
  iconIdToRemove.value = iconId
  showModal.value = true
}

const handleRemoveIcon = async () => {
  if (iconIdToRemove.value !== null) {
    try {
      await iconStore.deleteIcon(iconIdToRemove.value)
      notificationStore.addNotification('success', 'Иконка успешно удалена!')
      userIcons.value = await iconStore.fetchCustomIcons()
    } catch (error) {
      notificationStore.addNotification('error', 'Ошибка при удалении иконки.')
    } finally {
      showModal.value = false
      iconIdToRemove.value = null
    }
  }
}

const cancelRemoveIcon = () => {
  showModal.value = false
  iconIdToRemove.value = null
}
</script>
