export const useCsrf = async (): Promise<string> => {
  const config = useRuntimeConfig()

  await $fetch('/api/v1/csrf/', {
    baseURL: config.public.apiBase,
    method: 'GET', 
    credentials: 'include'
  })

  const csrfToken = document.cookie
    .split(';')
    .find(row => row.startsWith('csrftoken='))
    ?.split('=')[1] || ''

  if (!csrfToken) {
    throw new Error('CSRF token not found in cookies')
  }

  return csrfToken
}
