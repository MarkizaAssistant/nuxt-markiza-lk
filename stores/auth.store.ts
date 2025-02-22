import { defineStore } from 'pinia'
import { onMounted } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const isAuthenticated = ref<boolean>(false)

  onMounted(() => {
    if (localStorage.getItem('isAuthenticated')) {
      isAuthenticated.value = true
    }
  })

  const login = async (username: string, password: string) => {
    try {
      const body = new URLSearchParams();
      body.append('username', username);
      body.append('password', password);

      await useApi('/auth/login/', {
        method: 'POST',
        body,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })

      isAuthenticated.value = true
      localStorage.setItem('isAuthenticated', 'true')
    } catch (error:any) {
      const errorMessage = error?.data?.error || 'Неизвестная ошибка'
      throw new Error(errorMessage)
    }
  }

  const logout = async () => {
    try {
      await useApi('/auth/logout/', {
        method: 'POST'
      })
      isAuthenticated.value = false
      localStorage.removeItem('isAuthenticated')
    } catch(error: any) {
      const errorMessage = error?.data?.error || 'Неизвестная ошибка'
      throw new Error(errorMessage)
    }
  }

  return {
    isAuthenticated,
    login,
    logout
  }
})
