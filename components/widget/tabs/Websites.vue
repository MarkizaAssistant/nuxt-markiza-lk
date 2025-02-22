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
        {{ domainAdded ? 'Изменить' : 'Добавить' }}
      </button>
    </div>
    <div v-if="errorMessage" class="text-red-500 text-sm mb-4">
      {{ errorMessage }}
    </div>
    <div v-if="website" class="mt-4">
      <p class="text-gray-700">
        Домены добавлены для: <a :href="`https://${website}/`" target="_blank" class="text-blue-500 hover:underline">https://{{ website }}/</a>.
        Можно использовать только один домен. Новый домен заменит старый
      </p>
      <button
        @click="removeWebsite"
        class="mt-2 text-red-500 hover:text-red-700 flex items-center gap-1"
      >
        <Icon icon="ic:outline-close" />
        Удалить домен
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { Icon } from '@iconify/vue'

const props = defineProps<{
  websites: string
}>()

const emit = defineEmits<{
  (event: 'update:websites', value: string): void
}>()

const newWebsite = ref('')
const website = ref(props.websites)
const errorMessage = ref('')
const domainAdded = ref(false)

const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/

const addWebsite = () => {
  const domain = newWebsite.value.trim()

  if (!domain) {
    errorMessage.value = 'Пожалуйста, введите домен.'
    return
  }

  if (!domainRegex.test(domain)) {
    errorMessage.value = 'Некорректный домен. Убедитесь, что домен содержит расширение (например, .com, .ru).'
    return
  }

  errorMessage.value = ''
  website.value = domain
  emit('update:websites', website.value)
  newWebsite.value = ''
  domainAdded.value = true
}

const removeWebsite = () => {
  website.value = ''
  emit('update:websites', '')
  domainAdded.value = false
}

watch(
  () => props.websites,
  (newValue) => {
    website.value = newValue
  }
)
</script>
