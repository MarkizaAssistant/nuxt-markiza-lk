export default defineEventHandler(async (event): Promise<any> => {
  const config = useRuntimeConfig()
  const csrfToken = getCookie(event, 'csrftoken')
  const sessionid = getCookie(event, 'sessionid')
  const referer = getHeader(event, 'referer') || 'https://lk.yamarkiza.ru'

  try {
    if (!csrfToken || !sessionid) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized',
        message: 'CSRF token or session ID is missing.',
      })
    }

    const response = await $fetch<any>('/auth/logout/', {
      method: 'POST',
      baseURL: config.public.apiBase,
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken,
        'Referer': referer,
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
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Internal Server Error',
      data: error.data
    })
  }
})
