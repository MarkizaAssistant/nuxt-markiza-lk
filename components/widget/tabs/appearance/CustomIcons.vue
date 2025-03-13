<script lang="ts" setup>
import type { WidgetIcon } from '~/types/widgets'

const notificationStore = useNotificationStore()

defineProps<{
  userIcons: WidgetIcon[]
  selectedIcon: WidgetIcon | null
  hasCustomIcons: boolean
}>()

const emit = defineEmits([
  'select-icon',
  'remove-icon',
  'update-icon-name',
  'upload-icon'
])

const fileInput = ref<HTMLInputElement | null>(null)
const editingIconId = ref<number | null>(null)
const editedIconName = ref<string>('')
const isEditing = (iconId: number) => editingIconId.value === iconId

function selectIcon (icon: WidgetIcon, type: 'base_icon' | 'icon') {
  emit('select-icon', { type, icon })
}

function confirmRemoveCustomIcon (iconId: number) {
  emit('remove-icon', iconId)
}

function startEditing (iconId: number, currentName: string) {
  editingIconId.value = iconId
  editedIconName.value = currentName
}

function cancelEditing () {
  editingIconId.value = null
  editedIconName.value = ''
}

function saveIconName (iconId: number) {
  if (editedIconName.value.trim()) {
    emit('update-icon-name', { iconId, name: editedIconName.value.trim() })
    editingIconId.value = null
    editedIconName.value = ''
  }
}

function triggerFileInput () {
  fileInput.value?.click()
}

function isImage (url: string) {
  const imageExtensions = ['.png', '.jpg', '.jpeg']
  return imageExtensions.some(ext => url.toLowerCase().endsWith(ext))
}

function isVideo (url: string) {
  const videoExtensions = ['.mp4', '.webm']
  return videoExtensions.some(ext => url.toLowerCase().endsWith(ext))
}

function handleFileUpload (event: Event) {
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

  const allowedTypes = ['image/jpeg', 'image/png', 'video/mp4', 'video/webm']
  if (!allowedTypes.includes(file.type)) {
    notificationStore.addNotification('error', 'Недопустимый тип файла.')
    return
  }

  emit('upload-icon', file)
  input.value = ''
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="text-lg font-medium">Выбрать пользовательские иконки</div>
    <div>
      <div v-if="userIcons">
        <div v-if="hasCustomIcons" class="flex gap-4 flex-wrap">
          <div
            v-for="icon in userIcons"
            :key="icon.id"
            class="flex flex-col items-center gap-4 p-2 rounded-lg border-2 transition-all duration-300 cursor-pointer w-48"
            :class="{
              'border-slate-800 opacity-100': selectedIcon?.id === icon.id,
              'border-slate-200 opacity-80 hover:border-slate-800 hover:opacity-100': selectedIcon?.id !== icon.id,
            }"
            @click="selectIcon(icon, 'icon')"
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
                <template v-if="isImage(icon.url)">
                  <img :src="`https://api.yamarkiza.ru/${icon.url}`" :alt="icon.name" class="size-16 object-contain" />
                </template>
                <template v-else-if="isVideo(icon.url)">
                  <video autoplay loop muted playsinline class="size-16 object-contain">
                    <source :src="`https://api.yamarkiza.ru/${icon.url}`" />
                  </video>
                </template>
                <template v-else>
                  <span>Неподдерживаемый формат файла</span>
                </template>
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
</template>

<style scoped>
.icon-name {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
