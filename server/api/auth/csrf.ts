import { H3Event } from 'h3'

export default defineEventHandler(async (event: H3Event) => {
  const config = useRuntimeConfig()

  const response = await $fetch<{ csrfToken: string }>('/api/v1/csrf', {
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
    sameSite: 'lax',
    path: '/',
    secure: config.public.nodeEnv === 'production',
    maxAge: 60 * 60 * 24 * 30
  })

  return response
})
