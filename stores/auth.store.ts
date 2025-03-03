import { defineStore } from 'pinia'

export interface User {
  id: number,
  username: string,
  email: string,
  first_name: string,
  last_name: string,
  date_joined: string,
  last_login: string,
  is_staff: boolean,
  is_superuser: boolean
}

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
      await useCsrf()
      
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

  const profile = async (): Promise<User | undefined> => {
    try {
      const response = await useApi<User>('/api/v1/profile/', {
        method: 'GET',
      })

      return response
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
    profile,
  }
})
