<template>
  <div>
    <div>
      <label class="block mb-2">Первое сообщение:</label>
      <textarea
        v-model="welcomeText"
        class="w-full p-2 border border-gray-300 rounded-lg"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
const welcomeText = ref<string>('text')
const startHints = ref<string[]>(['Как купить?', 'Какая цена?', 'Как связаться?'])
</script>

<style>

</style>
