export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const csrftoken = getCookie(event, 'csrftoken')
  const sessionid = getCookie(event, 'sessionid')

  const { widgetId, widgetData } = await readBody(event)

  try {
    if (!csrftoken || !sessionid) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized',
        message: 'CSRF token or session ID is missing.',
      })
    }

    const response = await $fetch(`/api/v1/widget-settings/${widgetId}/update/`, {
      method: 'PATCH',
      baseURL: config.public.apiBase,
      body: widgetData,
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrftoken,
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
