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

  const userCookie = useCookie<User | null>('user', {
    default: () => null
  })

  const user = ref<User | null>(userCookie.value)
  const isAuthenticated = ref(authCookie.value)

  watch(user, (newUser) => {
    userCookie.value = newUser
  }, { immediate: true })

  watch(isAuthenticated, (newValue) => {
    authCookie.value = newValue
  }, { immediate: true })

  const login = async (username: string, password: string): Promise<{ message: string, user: User }> => {
    try {
      await useCsrf()
      
      const response = await useApi<{ message: string, user_data: User }>('/auth/login/', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      })

      isAuthenticated.value = true

      user.value = response.user_data

      return {
        message: response.message,
        user: response.user_data
      }
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

      user.value = null
    } catch (error: any) {
      const errorMessage = error?.data?.error || 'Неизвестная ошибка'
      throw new Error(errorMessage)
    }
  }

  return {
    isAuthenticated,
    user,
    login,
    logout,
  }
})
