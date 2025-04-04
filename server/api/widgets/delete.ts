export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const csrftoken = getCookie(event, 'csrftoken')
  const sessionid = getCookie(event, 'sessionid')
  const referer = getHeader(event, 'referer') || 'https://lk.yamarkiza.ru'

  const { widgetId } = await readBody(event)

  try {
    if (!csrftoken || !sessionid) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized',
        message: 'CSRF token or session ID is missing.',
      })
    }

    const response = await $fetch(`/api/v1/widget-settings/${widgetId}/delete/`, {
      baseURL: config.public.apiBase,
      method: 'DELETE',
      headers: {
        'X-CSRFToken': csrftoken,
        'Content-Type': 'application/json',
        'Referer': referer,
        'Cookie': `csrftoken=${csrftoken}; sessionid=${sessionid};`
      },
      credentials: 'include'
    })

    return response
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Internal Server Error',
      data: error.data
    })
  }
})
