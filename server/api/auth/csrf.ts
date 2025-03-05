import { H3Event } from 'h3'

export default defineEventHandler(async (event: H3Event): Promise<any> => {
  const config = useRuntimeConfig()

  const response = await $fetch<any>('/api/v1/csrf', {
    baseURL: config.public.apiBase,
    method: 'GET'
  })

  if (!response) {
    throw createError({
      statusCode: 500,
      statusMessage: 'CSRF token not received from server'
    })
  }
  
  const csrfToken = response.csrfToken

  setCookie(event, 'csrftoken', csrfToken, {
    sameSite: config.public.nodeEnv === 'production' ? 'none' : 'lax',
    path: '/',
    secure: config.public.nodeEnv === 'production',
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 30
  })

  return response
})
