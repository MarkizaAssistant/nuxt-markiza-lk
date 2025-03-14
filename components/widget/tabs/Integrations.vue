<script lang="ts" setup>
const props = defineProps<{
  telegramIds: string[]
}>()

const emit = defineEmits<{
  (event: 'update:telegramIds', value: string[]): void
}>()

const newTelegramId = ref('')

function addTelegramId () {
  if (newTelegramId.value.trim()) {
    emit('update:telegramIds', [...props.telegramIds, newTelegramId.value.trim()])
    newTelegramId.value = ''
  }
}

function removeTelegramId (index: number) {
  const updateTelegramIds = props.telegramIds.filter((_, i) => i !== index)
  emit('update:telegramIds', updateTelegramIds)
}
</script>

<template>
  <div class="border border-gray-300 rounded-lg shadow-sm p-4">
    <div class="flex gap-2 mb-4">
      <input
        v-model="newTelegramId"
        type="text"
        placeholder="Введите Telegram ID"
        class="p-2 border border-gray-300 rounded-lg w-[400px]"
      >
      <button
        @click="addTelegramId"
        class="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        Добавить
      </button>
    </div>

    <div class="flex flex-wrap gap-2">
      <div
        v-for="(id, index) in telegramIds"
        :key="index"
        class="flex items-center gap-2 bg-gray-100 p-2 rounded-lg"
      >
        <span>{{ id }}</span>
        <button @click="removeTelegramId(index)" class="text-red-500 hover:text-red-700">
          <Icon name="ic:outline-close" />
        </button>
      </div>
    </div>
  </div>
</template>

<style>

</style>
