<template>
  <div>
    <div class="flex gap-2 mb-4">
      <input
        v-model="newWebsite"
        type="text"
        placeholder="Введите домен, например example.ru"
        class="p-2 border border-gray-300 rounded-lg w-[400px]"
        :class="{ 'border-red-500': errorMessage }"
      />
      <button
        @click="addWebsite"
        class="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        Добавить
      </button>
    </div>
    
    <div v-if="errorMessage" class="text-red-500 text-sm mb-4">
      {{ errorMessage }}
    </div>

    <div v-if="websites.length > 0" class="mt-4 space-y-2">
      <div 
        v-for="(domain, index) in websites" 
        :key="index" 
        class="flex justify-between items-center bg-gray-100 p-2 rounded-lg"
      >
        <a :href="`https://${domain}/`" target="_blank" class="text-blue-500 hover:underline">
          {{ domain }}
        </a>
        <button 
          @click="removeWebsite(index)" 
          class="text-red-500 hover:text-red-700"
        >
          <Icon name="ic:outline-close" />
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{ websites: string[] }>()
const emit = defineEmits<{ (event: 'update:websites', value: string[]): void }>()

const newWebsite = ref('')
const errorMessage = ref('')

const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/

const addWebsite = () => {
  const domain = newWebsite.value.trim()
  if (!domain) {
    errorMessage.value = 'Введите домен.'
    return
  }

  if (!domainRegex.test(domain)) {
    errorMessage.value = 'Некорректный домен.'
    return
  }

  if (props.websites.includes(domain)) {
    errorMessage.value = 'Домен уже добавлен.'
    return
  }

  errorMessage.value = ''
  emit('update:websites', [...props.websites, domain])
  newWebsite.value = ''
}

const removeWebsite = (index: number) => {
  const updatedWebsites = props.websites.filter((_, i) => i !== index)
  emit('update:websites', updatedWebsites)
}
</script>
