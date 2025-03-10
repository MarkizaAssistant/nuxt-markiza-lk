export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const csrftoken = getCookie(event, 'csrftoken')
  const sessionid = getCookie(event, 'sessionid')

  const { widgetId } = await readBody(event)

  try {
    if (csrftoken && sessionid) {
      const response = await $fetch(`/api/v1/domains/${widgetId}/delete/`, {
        method: 'DELETE',
        baseURL: config.public.apiBase,
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrftoken,
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
