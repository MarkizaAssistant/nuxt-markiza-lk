<script setup lang="ts">
defineProps<{
  show: boolean
  title: string
  message: string
  confirmText: string
  cancelText: string
}>()

const emit = defineEmits(['confirm', 'cancel'])

const onConfirm = () => emit('confirm')
const onCancel = () => emit('cancel')
</script>

<template>
  <Teleport to="body">
    <div v-if="show" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div class="bg-white rounded-lg shadow-lg p-6 w-[400px]">
        <h2 class="text-xl font-bold mb-4">{{ title }}</h2>
        <p class="text-gray-700 mb-6">{{ message }}</p>
        <div class="flex justify-end gap-4">
          <button @click="onCancel" class="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300">
            {{ cancelText }}
          </button>
          <button @click="onConfirm" class="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700">
            {{ confirmText }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
