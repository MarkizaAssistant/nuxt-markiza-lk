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
          <h2 class="text-2xl font-bold">{{ widgetData.name || `Новый виджет ${widgetData.id}` }}</h2>
          <button
            @click="startEditing"
            class="text-gray-500 hover:text-gray-700"
          >
            <Icon name="ic:outline-edit" class="w-6 h-6" />
          </button>
        </template>

        <button
          v-if="isEditing"
          @click="saveName"
          class="text-gray-500 hover:text-gray-700"
        >
          <Icon name="ic:outline-check" class="w-6 h-6" />
        </button>
      </div>

      <span
        ref="tempSpan"
        class="text-2xl font-bold absolute invisible whitespace-nowrap"
      ></span>

      <Button
        class="bg-slate-700 text-white hover:bg-slate-600 p-4 text-xl"
        @click="saveSettings"
      >
        Сохранить настройки
      </Button>
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
      <div class="mb-4 border rounded-lg p-4 shadow-sm">
        <!-- <WidgetTabsWebsites
          v-if="activeTab === 'websites'"
          :domains="settings.domains"
          :widget-id="widget.id"
          @update:domains="updateDomains"
        />
        <WidgetTabsAppearance
          v-if="activeTab === 'appearance'"
        />
        <WidgetTabsBehavior
          v-if="activeTab === 'behavior'"
          :behavior="settings.behavior"
          @update:behavior="updateBehavior"
        />
        <WidgetTabsIntegrations
          v-if="activeTab === 'integrations'"
          :telegram-ids="settings.telegramIds"
          @update:telegram-ids="updateTelegramIds"
        />
        <WidgetTabsCode
          v-if="activeTab === 'code'"
        /> -->
      </div>
    </div>
  </div>
  <div v-else>
    Загрузка...
  </div>
</template>

<script lang="ts" setup>
const route = useRoute()
const widgetStore = useWidgetStore()

useSeoMeta({
  title: `Настройки виджета`
})

definePageMeta({
  middleware: 'auth',
})

const { data: widgetData } = await useAsyncData('settings', async () => {
  const widget = await widgetStore.fetchWidgetId(Number(route.params.id))
  return widget || null
})

const isEditing = ref(false)
const editedName = ref('')
const nameInput = ref<HTMLInputElement | null>(null)
const tempSpan = ref<HTMLSpanElement | null>(null)
const inputWidth = ref(100)

const startEditing = () => {
  isEditing.value = true
  editedName.value = ''
  nextTick(() => {
    nameInput.value?.focus()
    updateInputWidth()
  })
}

const saveName = () => {
}

const updateInputWidth = () => {
}

const activeTab = ref('websites')

const tabs = [
  { id: 'websites', label: 'Сайты', icon: 'ic:outline-public' },
  { id: 'appearance', label: 'Оформление', icon: 'ic:outline-palette' },
  { id: 'behavior', label: 'Поведение', icon: 'ic:outline-settings' },
  { id: 'integrations', label: 'Интеграции', icon: 'ic:outline-integration-instructions' },
  { id: 'code', label: 'Код виджета', icon: 'ic:outline-code' },
]

const updateDomains = async () => {
}

const updateBehavior = (newBehavior: { isPopupEnabled: boolean, startMessage: string }) => {
  
}

const updateTelegramIds = (newTelegramIds: string[]) => {
  
}

const saveSettings = async () => {
  
}

</script>

<style>
.invisible {
  visibility: hidden;
  position: absolute;
  top: -9999px;
  left: -9999px;
}
</style>
