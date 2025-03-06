import { defineStore } from 'pinia'
import type { User } from '~/types/user'

export const useAuthStore = defineStore('auth', () => {
  const isAuthenticated = useState<boolean>('isAuthenticated', () => false)

  const csrfToken = useCookie<string | null>('csrftoken')
  const session = useCookie<string | null>('sessionid')
  const userData = useCookie<string | null>('userData', {
    maxAge: 60 * 60 * 24 * 30
  })

  const isLoading = ref<boolean>(false)
  const user = ref<User | null>(null)

  const router = useRouter()
  const hasRedirected = ref<boolean>(false)

  watch(csrfToken, (newValue) => {
    if (!newValue && !hasRedirected.value) {
      hasRedirected.value = true
      router.push('/auth/login')
    }
  }, { immediate: true })

  const errorMessage = ref<string>('')

  const checkAuth = () => {
    isAuthenticated.value = !!userData.value
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
      isAuthenticated.value = true
      return response
    } catch (err: any) {
      if (err.response._data.data.error) {
          errorMessage.value = err.response._data.data.error
      } else {
          errorMessage.value = 'Неизвестная ошибка'
      }

      isAuthenticated.value = false
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

      isAuthenticated.value = false
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
      const response = await $fetch('/api/user/profile', {
        method: 'GET',
        credentials: 'include'
      })

      user.value = response
    } catch (err: any) {
      console.log(err.response._data.data.error)
    }
  }

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
