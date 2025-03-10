import { transformChatsInfoToChatPreview } from "~/server/utils/chats/transform"
import { ChatInfo } from "~/types/chats"

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const csrftoken = getCookie(event, 'csrftoken')
  const sessionid = getCookie(event, 'sessionid')

  try {
    if (csrftoken && sessionid) {
      const chatsInfo = await $fetch<ChatInfo[]>('/api/v1/chats/', {
        method: 'GET',
        baseURL: config.public.apiBase,
        headers: {
          'Cookie': `csrftoken=${csrftoken}; sessionid=${sessionid}`
        },
        credentials: 'include'
      })

      const chatsPreview = await Promise.all(
        chatsInfo.map((chat) => transformChatsInfoToChatPreview(chat, event))
      )

      return chatsPreview
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
