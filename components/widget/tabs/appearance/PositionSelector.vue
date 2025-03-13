<script lang="ts" setup>
const props = defineProps<{
  widgetLeft: boolean
}>()

const emit = defineEmits(['update-position'])

const isLeftPosition = ref(props.widgetLeft)

watch(() => props.widgetLeft, (newValue) => {
  isLeftPosition.value = newValue
})

function updatePosition() {
  emit('update-position', isLeftPosition.value)
}
</script>

<template>
  <div class="flex flex-col gap-4 my-4">
    <span class="text-lg font-medium">Позиция виджета:</span>
    <div class="flex gap-4">
      <label>
        <input type="radio" v-model="isLeftPosition" :value="true" @change="updatePosition" /> Слева
      </label>
      <label>
        <input type="radio" v-model="isLeftPosition" :value="false" @change="updatePosition" /> Справа
      </label>
    </div>
  </div>
</template>

<style>

</style>
