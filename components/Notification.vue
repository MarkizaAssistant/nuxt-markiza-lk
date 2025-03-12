<template>
  <div
    class="fixed bottom-4 right-4 p-4 rounded-lg shadow-lg text-white max-w-sm"
    :class="{
      'bg-green-500': type === 'success',
      'bg-yellow-500': type === 'warning',
      'bg-red-500': type === 'error',
    }"
  >
    <div class="flex justify-between items-center">
      <span>{{ message }}</span>
      <button @click="closeNotification" class="ml-4">
        <Icon name="material-symbols:close" class="size-5 hover:opacity-70" />
      </button>
    </div>
    <div
      class="h-1 bg-white/50 mt-2 rounded-full"
      :style="{ width: `${progress}%` }"
    ></div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  type: {
    type: String as () => 'success' | 'warning' | 'error',
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    default: 5000,
  },
})

const emit = defineEmits(['close'])

const progress = ref(100)
let interval: ReturnType<typeof setInterval>

const closeNotification = () => {
  emit('close')
}

onMounted(() => {
  const step = 100 / (props.duration / 50)
  interval = setInterval(() => {
    progress.value -= step
    if (progress.value <= 0) {
      closeNotification()
      clearInterval(interval)
    }
  }, 50)
})

onUnmounted(() => {
  clearInterval(interval)
})
</script>
