export const useApi = async <T>(url: string, options: any = {}) => {
  const config = useRuntimeConfig()
  const authStore = useAuthStore()
  const csrfToken = useCookie('csrftoken')

  let headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  }

  if (options.method && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(options.method.toUpperCase())) {
    headers['X-CSRFToken'] = csrfToken.value
  }

  try {
    return await $fetch<T>(url, {
      baseURL: config.public.apiBase,
      credentials: 'include',
      headers,
      ...options
    })
  } catch (error: any) {
    if (error?.response?.status === 401) {
      authStore.logout()
    }
    throw error
  }
}
