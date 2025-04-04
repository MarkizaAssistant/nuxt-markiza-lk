export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const csrftoken = getCookie(event, 'csrftoken')
  const sessionid = getCookie(event, 'sessionid')
  const referer = getHeader(event, 'referer') || 'https://lk.yamarkiza.ru'

  try {
    if (!csrftoken || !sessionid) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized',
        message: 'CSRF token or session ID is missing.',
      })
    }

    const files = await readMultipartFormData(event)

    if (!files || files.length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: "Bad Request",
        message: "No file uploaded.",
      });
    }

    const formData = new FormData()
    for (const file of files) {
      formData.append('file', new Blob([file.data]), file.filename)
    }

    const response = await $fetch('api/v1/widget-settings/user-icon/upload/', {
      method: 'POST',
      baseURL: config.public.apiBase,
      headers: {
        'Cookie': `csrftoken=${csrftoken}; sessionid=${sessionid}`,
        'X-CSRFToken': csrftoken,
        'Referer': referer,
      },
      body: formData,
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
