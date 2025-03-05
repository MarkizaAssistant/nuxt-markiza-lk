export default defineEventHandler(async (event): Promise<any> => {
  const config = useRuntimeConfig()
  const csrftoken = getCookie(event, 'csrftoken')

  const { username, password } = await readBody(event)

  try {
    let sessionid: string | null = null

    const response = await $fetch<any>('/auth/login/', {
      baseURL: config.public.apiBase,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrftoken ?? '',
      },
      body: { username, password },
      credentials: 'include',
      onResponse({ response }) {
        const setCookieHeader = response.headers.get('set-cookie')

        if (setCookieHeader) {
          const sessionidMatch = setCookieHeader.match(/sessionid=([^;]+)/)
          if (sessionidMatch && sessionidMatch[1]) {
            sessionid = sessionidMatch[1]
          }
        }
      }
    })

    if (sessionid) {
      setCookie(event, 'sessionid', sessionid, {
        sameSite: config.public.nodeEnv === 'production' ? 'none' : 'lax',
        path: '/',
        secure: config.public.nodeEnv === 'production',
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 30
      })
    }

    if ('data' in response && response.data?.error) {
      throw createError({
        statusCode: 400,
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
