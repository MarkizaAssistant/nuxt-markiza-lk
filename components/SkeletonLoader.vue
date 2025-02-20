<template>
  <div :class="containerClass">
    <template v-if="type === 'table'">
      <div 
        v-for="n in count" 
        :key="n" 
        class="h-20 w-full mb-2 bg-gray-300 rounded animate-pulse"
      ></div>
    </template>

    <template v-else-if="type === 'chat'">
      <div 
        v-for="n in count" 
        :key="n" 
        :class="[
          'flex mb-4', 
          n % 2 === 0 ? 'justify-end' : 'justify-start'
        ]"
      >
        <div
          :class="[
            'p-5 rounded-lg border animate-pulse',
            n % 2 === 0 
              ? 'bg-gray-300 text-black max-w-[70%] min-w-[35%]' 
              : 'bg-gray-400 text-white max-w-[70%] min-w-[35%]'
          ]"
        >
          <div class="w-32 h-4 bg-gray-400 rounded mb-2"></div>
          <div class="w-full h-6 bg-gray-500 rounded mb-1"></div>
          <div class="w-1/2 h-4 bg-gray-400 rounded"></div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  type: 'table' | 'chat'
  count?: number
  containerClass?: string
}>()
</script>
