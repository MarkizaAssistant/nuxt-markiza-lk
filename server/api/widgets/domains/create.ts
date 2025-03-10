import { Domain } from "~/types/widgets"

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const csrftoken = getCookie(event, 'csrftoken')
  const sessionid = getCookie(event, 'sessionid')

  const { widgetId, domain } = await readBody(event)

  try {
    if (csrftoken && sessionid) {
      const response = await $fetch<Domain>(`/api/v1/widget-settings/${widgetId}/domains/create/`, {
        method: 'POST',
        baseURL: config.public.apiBase,
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrftoken,
          'Cookie': `csrftoken=${csrftoken}; sessionid=${sessionid};`
        },
        body: { name: domain },
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
