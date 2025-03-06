import { Message } from "~/types/chats"

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const csrftoken = getCookie(event, 'csrftoken')
  const sessionid = getCookie(event, 'sessionid')

  const { chatId } = await readBody(event)

  try {
    if (csrftoken && sessionid) {
      const response = await $fetch<Message>(`/api/v1/messages/${chatId}/`, {
        baseURL: config.public.apiBase,
        method: 'GET',
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
