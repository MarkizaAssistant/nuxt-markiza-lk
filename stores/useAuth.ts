import { defineStore } from 'pinia'

export const useAuthStoreBff = defineStore('auth', () => {
  const isAuthenticated = useState<boolean>('isAuthenticated', () => false)

  const csrfToken = useCookie<string | null>('csrftoken')
  const session = useCookie<string | null>('sessionid')

  const isLoading = ref<boolean>(false)

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
    isAuthenticated.value = !!session.value
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
      })

      isAuthenticated.value = false
      session.value = null

      return response
    } catch (err: any) {
      console.log(err.response._data.data.error)
    } finally {
      isLoading.value = false
    }
  }

  return {
    isLoading,
    isAuthenticated,
    checkAuth,
    errorMessage,
    login,
    logout,
    clearError
  }
})
