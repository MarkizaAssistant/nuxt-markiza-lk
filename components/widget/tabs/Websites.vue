<template>

  <div class="flex gap-4 mb-4">
    <input
      v-model="newDomain"
      type="text"
      placeholder="Введите домен, например example.ru"
      class="p-2 border border-gray-300 rounded-lg w-[400px]"
      :class="{ 'border-red-500': errorMessageInput }"
    >
    <button
      class="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
      @click="addDomain"
      :disabled="loading"
    >
      {{ loading ? "Добавление..." : "Добавить" }}
    </button>
  </div>

  <div v-if="errorMessageInput" class="text-red-500 text-sm mb-4">
    {{ errorMessageInput }}
  </div>

  <div v-if="errorMessageDomains" class="text-red-500 text-sm mb-4">
    {{ errorMessageDomains }}
  </div>
  
  <div v-if="domainsList.length > 0">
    <ul class="flex flex-wrap gap-4">
      <li
        v-for="domain in domainsList"
        :key="domain.id"
        class="flex items-center justify-between border p-3 gap-3 rounded-lg"
      >
        {{ domain.name }}
        <button
          class="flex items-center justify-center"
          @click="removeDomain(domain)"
        >
          <Icon name="material-symbols:close" class="size-5 text-red-500 hover:text-red-700" />
        </button>
      </li>
    </ul>
  </div>
  <div v-else>
   Список доменов пуст
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  widgetId: {
    type: Number,
    required: true
  },
  domains: {
    type: Array<Domain>,
    required: true
  }
})

const widgetStore = useWidgetStore()
const errorMessageDomains = ref('')
const errorMessageInput = ref('')
const domainsList = ref<Domain[]>(props.domains)
const loading = ref(false)
const newDomain = ref('')

const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/;

const addDomain = async () => {
  const domain = newDomain.value.trim()

  if (!domain) {
    errorMessageInput.value = 'Введите домен.'
    return
  }

  if (!domainRegex.test(domain)) {
    errorMessageInput.value = "Некорректный домен.";
    return;
  }

  errorMessageInput.value = ''

  loading.value = true

  try {
    const response = await widgetStore.addDomain(props.widgetId, domain)
    domainsList.value.push({ id: response.id, name: response.name })
    newDomain.value = ''
  } catch (error) {
    errorMessageInput.value = 'Ошибка при добалении домена.'
  } finally {
    loading.value = false
  }
}

const removeDomain = async (domain: Domain) => {
  try {
    await widgetStore.deleteDomain(domain)
    domainsList.value = domainsList.value.filter(d => d.id !== domain.id)
  } catch (error) {
    errorMessageDomains.value = 'Ошибка при удалении домена.'
  }
}

watch(() => props.domains, (newDomains) => {
  domainsList.value = newDomains
}, { immediate: true })
</script>
