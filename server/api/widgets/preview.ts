import { WidgetPreview } from "~/types/widgets"

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const csrftoken = getCookie(event, 'csrftoken')
  const sessionid = getCookie(event, 'sessionid')

  try {
    if (csrftoken && sessionid) {
      const response = await $fetch<WidgetPreview[]>('/api/v1/widget-info/', {
        method: 'GET',
        baseURL: config.public.apiBase,
        headers: {
          'Cookie': `csrftoken=${csrftoken}; sessionid=${sessionid}`
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
