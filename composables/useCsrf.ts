export const useCsrf = async (): Promise<string> => {
  const config = useRuntimeConfig()

  const response = await $fetch<{ csrfToken: string }>('/api/v1/csrf/', {
    baseURL: config.public.apiBase,
    method: 'GET',
    credentials: 'include',
    headers: {
      'Accept': 'application/json',
    }
  })

  if (!response.csrfToken) {
    throw new Error('CSRF token not received from server')
  }

  return response.csrfToken
}
