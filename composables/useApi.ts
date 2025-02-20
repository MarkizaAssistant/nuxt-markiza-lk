export const useApi = async <T>(url: string, options: any = {}) => {
  const config = useRuntimeConfig()

  const csrfToken = useCookie('csrftoken').value

  let headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  }

  if (options.method && ['POST', 'PUT', 'DELETE'].includes(options.method.toUpperCase())) {
    headers['X-CSRFToken'] = csrfToken
  }

  return await $fetch<T>(url, {
    baseURL: config.public.apiBase,
    credentials: 'include',
    headers,
    ...options
  })
}
