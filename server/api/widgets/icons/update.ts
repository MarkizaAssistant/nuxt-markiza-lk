export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const csrftoken = getCookie(event, 'csrftoken')
  const sessionid = getCookie(event, 'sessionid')

  const { iconId, newName  } = await readBody(event)

  try {
    if (!csrftoken || !sessionid) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized',
        message: 'CSRF token or session ID is missing.',
      })
    }

    const response = await $fetch(`api/v1/widget-settings/user-icons/${iconId}/update-name/`, {
      method: 'PATCH',
      baseURL: config.public.apiBase,
      headers: {
        'Cookie': `csrftoken=${csrftoken}; sessionid=${sessionid}`,
        'X-CSRFToken': csrftoken,
      },
      body: {
        name: newName,
      },
      credentials: 'include',
    })

    return response
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Internal Server Error',
      message: error.message,
    })
  }
})
