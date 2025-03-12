import { WidgetIcon } from "~/types/widgets"

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const csrftoken = getCookie(event, 'csrftoken')
  const sessionid = getCookie(event, 'sessionid')

  try {
    if (!csrftoken || !sessionid) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized',
        message: 'CSRF token or session ID is missing.',
      })
    }

    const response = await $fetch<WidgetIcon[]>('/api/v1/widget-settings/user-icons/', {
      method: 'GET',
      baseURL: config.public.apiBase,
      headers: {
        'Cookie': `csrftoken=${csrftoken}; sessionid=${sessionid}`,
        'X-CSRFToken': csrftoken,
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
