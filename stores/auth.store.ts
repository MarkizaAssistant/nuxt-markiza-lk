import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', () => {
  const authCookie = useCookie<boolean>('isAuthenticated', {
    default: () => false
  })

  const isAuthenticated = ref(authCookie.value)

  watch(isAuthenticated, (newValue) => {
    authCookie.value = newValue
  }, { immediate: true })

  const login = async (username: string, password: string) => {
    try {
      await useApi('/auth/login/', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      })

      isAuthenticated.value = true
    } catch (error: any) {
      const errorMessage = error?.data?.error || 'Неизвестная ошибка'
      throw new Error(errorMessage)
    }
  }

  const logout = async () => {
    try {
      await useApi('/auth/logout/', {
        method: 'POST',
      })

      isAuthenticated.value = false
    } catch (error: any) {
      const errorMessage = error?.data?.error || 'Неизвестная ошибка'
      throw new Error(errorMessage)
    }
  }

  return {
    isAuthenticated,
    login,
    logout,
  }
})
