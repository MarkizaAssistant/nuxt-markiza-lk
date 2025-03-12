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
              class="flex items-center gap-4 p-2 rounded-lg border-2 transition-all duration-300 cursor-pointer"
              :class="{
                'border-slate-800 opacity-100': selectedBaseIconId === icon.id,
                'border-slate-200 opacity-80 hover:border-slate-800 hover:opacity-100': selectedBaseIconId !== icon.id,
              }"
              @click="selectIcon(icon.id, 'base')"
            >
              <div>
                <img :src="icon.url" :alt="icon.name" class="size-14 object-contain" />
              </div>

              <div>{{ icon.name }}</div>
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
              class="flex flex-col items-center gap-4 p-2 rounded-lg border-2 transition-all duration-300 cursor-pointer w-48"
              :class="{
                'border-slate-800 opacity-100': selectedCustomIconId === icon.id,
                'border-slate-200 opacity-80 hover:border-slate-800 hover:opacity-100': selectedCustomIconId !== icon.id,
              }"
              @click="selectIcon(icon.id, 'custom')"
            >
            <div class="w-full">
              <div class="flex justify-end">
                <button 
                  class="text-slate-800 flex items-center"
                  @click.stop="confirmRemoveCustomIcon(icon.id)"
                >
                  <Icon name="ic:outline-delete" class="size-6" />
                </button>
              </div>
              <div class="flex justify-center">
                <img :src="icon.url" :alt="icon.name" class="size-14 object-contain" />
              </div>
  
              <div class="flex items-center justify-between mb-4">
                <div v-if="!isEditing(icon.id)" class="icon-name">{{ icon.name }}</div>
                <input
                  v-else
                  type="text"
                  v-model="editedIconName"
                  @keyup.enter="saveIconName(icon.id)"
                  @blur="saveIconName(icon.id)"
                  class="p-1 border rounded w-full"
                />

                <button 
                  v-if="!isEditing(icon.id)"
                  class="text-slate-800 flex items-center"
                  @click.stop="startEditing(icon.id, icon.name)"
                >
                  <Icon name="ic:baseline-edit" class="size-5" />
                </button>
              </div>
    
              <div class="flex justify-center gap-4">
                <button 
                  v-if="isEditing(icon.id)"
                  class="border rounded-lg bg-green-500 p-2 text-white flex items-center"
                  @click.stop="saveIconName(icon.id)"
                >
                  <Icon name="ic:outline-check" class="size-5" />
                </button>
    
                <button 
                  v-if="isEditing(icon.id)"
                  class="border rounded-lg bg-red-500 p-2 text-white flex items-center"
                  @click.stop="cancelEditing"
                >
                  <Icon name="ic:outline-close" class="size-5" />
                </button>
              </div>
              </div>
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
const editingIconId = ref<number | null>(null)
const editedIconName = ref<string>('')

const isEditing = (iconId: number) => editingIconId.value === iconId

const startEditing = (iconId: number, currentName: string) => {
  editingIconId.value = iconId;
  editedIconName.value = currentName;
}

const cancelEditing = () => {
  editingIconId.value = null
  editedIconName.value = ''
}

const saveIconName = async (iconId: number) => {
  if (editedIconName.value.trim() === '') {
    notificationStore.addNotification('error', 'Имя не может быть пустым.');
    return;
  }

  try {
    await iconStore.updateName(iconId, editedIconName.value);
    notificationStore.addNotification('success', 'Имя иконки успешно изменено!');
    userIcons.value = await iconStore.fetchCustomIcons();
  } catch (error) {
    notificationStore.addNotification('error', 'Ошибка при изменении имени иконки.');
  } finally {
    editingIconId.value = null;
    editedIconName.value = '';
  }
}

const emit = defineEmits(['select-icon'])

const selectIcon = (iconId: number, type: 'base' | 'custom') => {
  if (type === 'base') {
    selectedBaseIconId.value = iconId
    selectedCustomIconId.value = null
    
  }

  if (type === 'custom') {
    selectedCustomIconId.value = iconId
    selectedBaseIconId.value = null
  }

  emit('select-icon', { type, iconId })
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

<style>
.icon-name {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
