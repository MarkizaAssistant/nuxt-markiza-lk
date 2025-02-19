export const useApi = async <T>(url: string, options: any = {}) => {
  const config = useRuntimeConfig()

  let headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  }

  if (options.method && ['POST', 'PUT', 'DELETE'].includes(options.method.toUpperCase())) {
    const csrfToken = document.cookie
      .split('; ')
      .find(row => row.startsWith('csrftoken='))
      ?.split('=')[1] || ''

    headers['X-CSRFToken'] = csrfToken
  }

  return await $fetch<T>(url, {
    baseURL: config.public.apiBase,
    credentials: 'include',
    headers,
    ...options
  })
}
