import { defineStore } from 'pinia'
import type { User } from '~/types/user'

export const useAuthStore = defineStore('auth', () => {
  // --- Состояние (State) ---
  const csrfToken = useCookie<string | null>('csrftoken')
  const session = useCookie<string | null>('sessionid')
  const userData = useCookie<string | null>('userData', {
    maxAge: 60 * 60 * 24 * 30
  })

  const isLoading = ref<boolean>(false)
  const user = ref<User | null>(null)
  const errorMessage = ref<string>('')
  const hasRedirected = ref<boolean>(false)

  const router = useRouter()

  // --- Геттеры (Getters) ---
  const isAuthenticated = computed(() => !!userData.value)

  // --- Инициализация ---
  const initialize = () => {
    checkAuth()
    setupCsrfTokenWatcher()
  }

  // --- Методы (Actions) ---
  const checkAuth = () => {
    return isAuthenticated.value
  }

  const clearError = () => {
    errorMessage.value = ''
  }

  const login = async (username: string, password: string) => {
    try {
      isLoading.value = true
      errorMessage.value = ''

      if (!csrfToken.value) await $fetch('/api/auth/csrf')

      const response = await $fetch('/api/auth/login', {
        method: 'POST',
        body: {
          username,
          password
        },
        credentials: 'include'
      })

      userData.value = 'auth'
      return response
    } catch (err: any) {
      errorMessage.value = err.response?._data?.data?.error || 'Неизвестная ошибка'
      throw err;
    } finally {
      isLoading.value = false
    }
  }

  const logout = async () => {
    try {
      isLoading.value = true
      const response = await $fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      })

      userData.value = null
      session.value = null
      return response
    } catch (err: any) {
      console.log(err.response._data.data.error)
    } finally {
      isLoading.value = false
    }
  }

  const profile = async () => {
    try {
      isLoading.value = true

      const response = await $fetch('/api/user/profile', {
        method: 'GET',
        credentials: 'include'
      })

      user.value = response
    } catch (err: any) {
      console.log(err.response._data.data.error)
    } finally {
      isLoading.value = false
    }
  }

  // --- Наблюдатели (Watchers) ---
  const setupCsrfTokenWatcher = () => {
    watch(csrfToken, (newValue) => {
      if (isAuthenticated.value) return

      if (!newValue && !hasRedirected.value) {
        hasRedirected.value = true
        router.push('/auth/login')
      }
    }, { immediate: true })
  }

  // --- Инициализация хранилища ---
  initialize()

  return {
    isLoading,
    user,
    isAuthenticated,
    checkAuth,
    errorMessage,
    login,
    logout,
    clearError,
    profile
  }
})
