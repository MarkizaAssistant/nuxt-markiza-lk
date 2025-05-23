<script lang="ts" setup>
import type { Domain } from '~/types/widgets'

const props = defineProps<{
  widgetId: number,
  domains: Domain[],
}>()

const emit = defineEmits(['update:domains'])

const widgetStore = useWidgetStore()
const notificationStore = useNotificationStore()

const errorMessageDomains = ref('')
const errorMessageInput = ref('')
const newDomain = ref('')

const domainRegex = /^(?!:\/\/)([a-zA-Z0-9-_]+\.)*[a-zA-Z]{2,}$/

async function addDomain () {
  const domain = newDomain.value.trim()

  if (!domain) {
    errorMessageInput.value = 'Введите домен.'
    return
  }

  if (!domainRegex.test(domain)) {
    errorMessageInput.value = "Некорректный домен."
    return
  }

  errorMessageInput.value = ''

  try {
    const response = await widgetStore.addDomain(props.widgetId, domain)
    if (Array.isArray(response)) { 
      emit('update:domains', response) 
    }
    newDomain.value = ''
    notificationStore.addNotification('success', 'Домен успешно добавлен!')
  } catch (error) {
    errorMessageInput.value = 'Ошибка при добавлении домена.'
    notificationStore.addNotification('error', 'Ошибка при добавлении домена.')
  }
}

const removeDomain = async (domainId: number) => {
  try {
    await widgetStore.deleteDomain(domainId)
    notificationStore.addNotification('success', 'Домен удален.')
  } catch (error: any) {
    notificationStore.addNotification('error', `${error.message}`)
  }
}
</script>

<template>
  <div class="border border-gray-300 rounded-lg shadow-sm p-4">
    <div class="flex gap-4 mb-4">
      <input
        v-model="newDomain"
        type="text"
        placeholder="Введите домен, например example.ru"
        class="p-2 border border-gray-300 rounded-lg w-[400px]"
        :class="{ 'border-red-500': errorMessageInput }"
      />
      <button
        class="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
        @click="addDomain"
        :disabled="widgetStore.isLoading"
      >
        {{ widgetStore.isLoading ? "Добавление..." : "Добавить" }}
      </button>
    </div>

    <div v-if="errorMessageInput" class="text-red-500 text-sm mb-4">
      {{ errorMessageInput }}
    </div>

    <div v-if="errorMessageDomains" class="text-red-500 text-sm mb-4">
      {{ errorMessageDomains }}
    </div>

    <div v-if="props.domains.length > 0">
      <ul class="flex flex-wrap gap-4">
        <li
          v-for="domain in props.domains"
          :key="domain.id"
          class="flex items-center justify-between border p-3 gap-3 rounded-lg"
        >
          {{ domain.name }}
          <button
            class="flex items-center justify-center"
            @click="removeDomain(domain.id)"
          >
            <Icon name="material-symbols:close" class="size-5 text-red-500 hover:text-red-700" />
          </button>
        </li>
      </ul>
    </div>
    <div v-else>
      Список доменов пуст
    </div>
  </div>
</template>
