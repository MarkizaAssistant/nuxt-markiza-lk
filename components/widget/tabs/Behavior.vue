<template>
  <div>
    <div class="mb-4">
      <label class="flex items-center gap-2">
        <input
          v-model="behavior.isPopupEnabled"
          type="checkbox"
          class="form-checkbox"
        >
        Включить всплывающие приглашения
      </label>
    </div>
    <div>
      <label class="block mb-2">Первое сообщение:</label>
      <textarea
        v-model="behavior.startMessage"
        class="w-full p-2 border border-gray-300 rounded-lg"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
  behavior: {
    isPopupEnabled: boolean,
    startMessage: string
  }
}>()

const emit = defineEmits<{
  (event: 'update:behavior', value: { isPopupEnabled: boolean; startMessage: string }): void
}>()

const behavior = ref({ ...props.behavior })

watch(behavior, (newValue) => {
  emit('update:behavior', newValue)
}, { deep: true })
</script>

<style>

</style>
