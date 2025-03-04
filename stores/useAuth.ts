import { defineStore } from 'pinia'

export const useMyUseAuthStore = defineStore('auth', () => {
  const isAuthenticated = useState<boolean>('isAuthenticated', () => false)
  const csrfToken = useCookie<string | null>('csrftoken')
  const router = useRouter()
  const hasRedirected = ref<boolean>(false)

  const checkAuth = () => {
    isAuthenticated.value = !!csrfToken.value
    return isAuthenticated.value
  }

  watch(csrfToken, (newValue) => {
    if (!newValue && !hasRedirected.value) {
      hasRedirected.value = true
      router.push('/auth/login')
    }
  })

  const login = async (username: string, password: string) => {
    try {
      await $fetch('/api/auth/csrf')

      
    } catch (error) {
      
    }
  }
})
