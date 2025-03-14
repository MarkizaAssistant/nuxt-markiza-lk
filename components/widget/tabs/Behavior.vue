<script lang="ts" setup>
const props = defineProps<{
  startHints: string[],
  welcomeText: string
}>()

const emit = defineEmits<{
  (event: 'update:startHints', value: string[]): void
  (event: 'update:welcomeText', value: string): void
}>()

const newStartHint = ref('')
const localWelcomeText = ref(props.welcomeText)

function addHint () {
  if (newStartHint.value.trim()) {
    const updatedHints = [...props.startHints, newStartHint.value.trim()]
    emit('update:startHints', updatedHints)
    newStartHint.value = ''
  }
}

function removeHint (index: number) {
  const updateTelegramIds = props.startHints.filter((_, i) => i !== index)
  emit('update:startHints', updateTelegramIds)
}

function updateWelcomeText () {
  emit('update:welcomeText', localWelcomeText.value)
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex flex-col gap-2 border border-gray-300 rounded-lg shadow-sm p-4">
      <label class="block">Напишите первое приветствие:</label>
      <textarea
        v-model="localWelcomeText"
        placeholder="Введите приветствующее сообщение"
        class="p-2 border border-gray-300 rounded-lg"
        @input="updateWelcomeText"
      ></textarea>
      <span class="text-sm text-gray-500">Данный текст будет показываться новым клиентам, как первое сообщение.</span>
      <span class="text-sm text-gray-500">Подсказка: Призывайте начать диалог. Задайте вопрос, или кратко сообщите чем чат может быть полезен.</span>
    </div>

    <div class="flex flex-col gap-2 border border-gray-300 rounded-lg shadow-sm p-4">
      <label class="block">Заполните несколько (мы рекомендуем 4) стартовых примера сообщений:</label>
      <div class="flex flex-col gap-4">
        <div class="flex gap-2">
          <input
            v-model="newStartHint"
            type="text"
            placeholder="Напишите вариант запроса"
            class="p-2 border border-gray-300 rounded-lg w-[400px]"
          >
          <button
            @click="addHint"
            class="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Добавить
          </button>
        </div>
        <div class="flex flex-col gap-2">
          <span class="text-sm text-gray-500">Стартовые сообщения (стартеры) используются как подсказки с чего можно начать диалог</span>
          <span class="text-sm text-gray-500">Они повышают вовлеченность, подталкивают сделать первый шаг.</span>
          <span class="text-sm text-gray-500">Напиши наиболее распространенные запросы.</span>
        </div>
      </div>

      <div class="flex flex-wrap gap-2">
        <div
          v-for="(hint, index) in startHints"
          :key="index"
          class="flex items-center gap-2 bg-gray-100 p-2 rounded-lg"
        >
          <span>{{ hint }}</span>
          <button @click="removeHint(index)" class="text-red-500 hover:text-red-700">
            <Icon name="ic:outline-close" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style>

</style>
