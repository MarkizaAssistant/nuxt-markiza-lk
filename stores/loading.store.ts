import { defineStore } from 'pinia'

export const useIsLoadingStore = defineStore('isLoading', () => {
  const isLoading = ref(true)

  function set(data: boolean) {
    isLoading.value = data
  }

  return {
    isLoading,
    set
  }
})
