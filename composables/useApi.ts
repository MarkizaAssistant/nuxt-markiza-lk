export const useApi = async <T>(url: string, options: any = {}) => {
  const config = useRuntimeConfig()
  const authStore = useAuthStore()

  let headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  }

  if (options.method && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(options.method.toUpperCase())) {
    const csrfToken = await useCsrf()
    headers['X-CSRFToken'] = csrfToken
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
