import { UserInfo } from "~/types/user"

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const csrftoken = getCookie(event, 'csrftoken')

  const { username, password } = await readBody(event)

  const response = await $fetch<{ message: string, user_data: UserInfo, error?: string }>('/auth/login/', {
    baseURL: config.public.apiBase,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': csrftoken ?? ''
    },
    body: { username, password },
    credentials: 'include'
  })

  if (response.error) {
    throw createError({
      statusCode: 400,
      statusMessage: response.error
    })
  } else {
    return response
  }
})
