export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const csrftoken = getCookie(event, 'csrftoken')
  const sessionid = getCookie(event, 'sessionid')

  const { widgetId } = await readBody(event)

  try {
    if (csrftoken && sessionid) {
      const response = await $fetch(`/api/v1/widget-settings/${widgetId}/delete/`, {
        baseURL: config.public.apiBase,
        method: 'DELETE',
        headers: {
          'X-CSRFToken': csrftoken,
          'Content-Type': 'application/json',
          'Cookie': `csrftoken=${csrftoken}; sessionid=${sessionid};`
        },
        credentials: 'include'
      })

      return response
    } else {
      return null
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Internal Server Error',
      data: error.data
    })
  }
})
