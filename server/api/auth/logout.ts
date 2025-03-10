export default defineEventHandler(async (event): Promise<any> => {
  const config = useRuntimeConfig()
  const csrfToken = getCookie(event, 'csrftoken')
  const sessionid = getCookie(event, 'sessionid')

  try {
    if (sessionid && csrfToken) {
      const response = await $fetch<any>('/auth/logout/', {
        method: 'POST',
        baseURL: config.public.apiBase,
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken,
          'Cookie': `csrftoken=${csrfToken}; sessionid=${sessionid}`
        },
        credentials: 'include',
      })
  
      if (response.error) {
        throw createError({
          statusCode: 403,
          statusMessage: response.data.error,
          data: response
        })
      }
  
      return response
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Internal Server Error',
      data: error.data
    })
  }
})
