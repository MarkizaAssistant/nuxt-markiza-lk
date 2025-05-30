<script lang="ts" setup>
import type { Domain, WidgetIcon, WidgetSettings } from '~/types/widgets'

const route = useRoute()
const widgetStore = useWidgetStore()

useSeoMeta({
  title: `Настройки виджета`
})

definePageMeta({
  middleware: 'auth',
})

const widgetId = Number(route.params.id)

const { data: widgetData } = await useAsyncData('settings', async () => {
  const widget = await widgetStore.fetchWidgetId(widgetId)
  return widget || null
}, { server: false })

const widgetSettings = ref<WidgetSettings>({
  id: widgetId,
  name: widgetData.value?.name || '',
  is_active: false,
  manager_tg_id: [],
  icon: null,
  base_icon: null,
  start_hints: [],
  welcome_text: '',
  widget_left: false
})

const isEditing = ref(false)
const editedName = ref('')
const nameInput = ref<HTMLInputElement | null>(null)
const tempSpan = ref<HTMLSpanElement | null>(null)
const inputWidth = ref(100)

const startEditing = () => {
  isEditing.value = true
  editedName.value = widgetData.value?.name || ''
  nextTick(() => {
    nameInput.value?.focus()
    updateInputWidth()
  })
}

const saveName = () => {
  if (editedName.value.trim()) {
    if (widgetData.value) {
      widgetData.value.name = editedName.value.trim()
    }
  }
  isEditing.value = false
}

const cancelEditing = () => {
  isEditing.value = false
  editedName.value = ''
}

const updateInputWidth = () => {
  if (tempSpan.value && nameInput.value) {
    tempSpan.value.textContent = editedName.value

    const width = tempSpan.value.offsetWidth

    inputWidth.value = Math.min(Math.max(width, 350), 800)
  }
}

watch(editedName, () => {
  updateInputWidth()
})

const activeTab = ref('websites')

const tabs = [
  { id: 'websites', label: 'Сайты', icon: 'ic:outline-public' },
  { id: 'appearance', label: 'Оформление', icon: 'ic:outline-palette' },
  { id: 'behavior', label: 'Поведение', icon: 'ic:outline-settings' },
  { id: 'integrations', label: 'Интеграции', icon: 'ic:outline-integration-instructions' },
  { id: 'code', label: 'Код виджета', icon: 'ic:outline-code' },
]

const refreshDomains = async (newDomains: Domain[]) => {
  if (widgetData.value) {
    widgetData.value.domains = newDomains
  }
}

const updateTelegramIds = (newTelegramIds: string[]) => {
  if (widgetData.value) {
    widgetData.value.manager_tg_id = newTelegramIds
  }
}

const updateStartHints = (newStartHints: string[]) => {
  if (widgetData.value) {
    widgetData.value.start_hints = newStartHints
  }
}

const updateWelcomeText = (newWelcomeText: string) => {
  if (widgetData.value) {
    widgetData.value.welcome_text = newWelcomeText
  }
}

const handleIconSelect = (payload: { type: 'base_icon' | 'icon'; icon: WidgetIcon }) => {
  if (payload.type === 'base_icon') {
    widgetSettings.value.base_icon = payload.icon.id
    widgetSettings.value.icon = null
  } else if (payload.type === 'icon') {
    widgetSettings.value.icon = payload.icon.id
    widgetSettings.value.base_icon = null
  }

  if(widgetData.value) {
    widgetData.value.icon = payload.icon
  }
}

const saveSettings = async () => {
  widgetSettings.value.name = widgetData.value?.name || ''
  widgetSettings.value.is_active = widgetData.value?.is_active || false
  widgetSettings.value.manager_tg_id = widgetData.value?.manager_tg_id || []
  widgetSettings.value.widget_left = widgetData.value?.widget_left || false
  widgetSettings.value.start_hints = widgetData.value?.start_hints || []
  widgetSettings.value.welcome_text = widgetData.value?.welcome_text || ''
  await widgetStore.updateWidget(widgetSettings.value.id, widgetSettings.value)
  navigateTo('/widget')
}

</script>

<template>
  <div v-if="widgetData">
    
    <div class="mb-6 flex justify-between items-center">
      <div class="flex items-center gap-2">
        <input
          v-if="isEditing"
          v-model="editedName"
          type="text"
          class="text-2xl font-bold border border-gray-300 rounded-lg p-2"
          :style="{ width: inputWidth + 'px' }"
          ref="nameInput"
        />
        <template v-else>
          <h2 class="text-2xl font-bold">{{ widgetData.name }}</h2>
          <button
            @click="startEditing"
            class="text-gray-500 hover:text-gray-700"
          >
            <Icon name="ic:outline-edit" class="w-6 h-6" />
          </button>
        </template>

        <div class="flex items-center gap-4">
          <button
            v-if="isEditing"
            @click="saveName"
            class="text-gray-500 hover:text-gray-700"
          >
            <Icon name="ic:outline-check" class="w-6 h-6" />
          </button>
          <button
            v-if="isEditing"
            @click="cancelEditing"
            class="text-gray-500 hover:text-gray-700"
          >
            <Icon name="ic:outline-close" class="w-6 h-6" />
          </button>
        </div>
      </div>

      <span
        ref="tempSpan"
        class="text-2xl font-bold absolute invisible whitespace-nowrap"
      ></span>

      <div class="flex items-center gap-2">
        <Button 
          class="bg-slate-700 text-white hover:bg-slate-600 p-4 text-xl"
          @click="useRouter().push('/widget')"
        >
          Назад
        </Button>
        <Button
          class="bg-slate-700 text-white hover:bg-slate-600 p-4 text-xl"
          @click="saveSettings"
        >
          Сохранить настройки
        </Button>
      </div>
    </div>

    <div>
      <!-- Tabs Phone -->
      <!-- <div class="sm:hidden">
        <label for="tabs" class="sr-only">Выберите вкладку</label>
        <select
          id="tabs"
          v-model="activeTab"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        >
          <option
            v-for="tab in tabs"
            :key="tab.id"
            :value="tab.id"
          >
            {{ tab.label }}
          </option>
        </select>
      </div> -->

      <!-- Tabs Desktop -->
      <ul class="text-sm font-medium text-center text-gray-500 rounded-lg shadow-sm flex mb-4">
        <li
          v-for="tab in tabs"
          :key="tab.id"
          class="w-full focus-within:z-10"
          @click="activeTab = tab.id"
        >
          <a 
            href="#"
            class="flex items-center justify-center w-full p-4 border border-gray-200 focus:ring-slate-300 focus:ring-4 focus:outline-none"
            :class="{
              'text-gray-900 bg-gray-100 active' : activeTab === tab.id,
              'bg-white hover:text-gray-700 hover:bg-gray-50': activeTab !== tab.id
            }"
          >
            <Icon :name="tab.icon" class="size-6 mr-2" />
            {{ tab.label }}
          </a>
        </li>
      </ul>

      <!-- Content -->
      <div>
        <WidgetTabsWebsites
          v-if="activeTab === 'websites'"
          :widgetId="widgetData.id"
          :domains="widgetData.domains"
          @update:domains="refreshDomains"
        />
        <WidgetTabsAppearance
          v-if="activeTab === 'appearance'"
          :widget-left="widgetData.widget_left"
          :selected-icon="widgetData.icon"
          @select-icon="handleIconSelect"
          @update-position="widgetData.widget_left = $event"
        />
        <WidgetTabsBehavior
          v-if="activeTab === 'behavior'"
          :start-hints="widgetData.start_hints || []"
          :welcome-text="widgetData.welcome_text"
          @update:start-hints="updateStartHints"
          @update:welcome-text="updateWelcomeText"
          
        />
        <WidgetTabsIntegrations
          v-if="activeTab === 'integrations'"
          :telegram-ids="widgetData.manager_tg_id"
          @update:telegram-ids="updateTelegramIds"
        />
        <WidgetTabsCode
          v-if="activeTab === 'code'"
        />
      </div>
    </div>
  </div>
  <div v-else>
    Загрузка...
  </div>
</template>

<style>
.invisible {
  visibility: hidden;
  position: absolute;
  top: -9999px;
  left: -9999px;
}
</style>
