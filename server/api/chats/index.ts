import { ChatInfo, ChatPreview } from "~/types/chats"
import { WidgetPreview } from "~/types/widgets"

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

    const chatsInfo = await $fetch<ChatInfo[]>('/api/v1/chats/', {
      method: 'GET',
      baseURL: config.public.apiBase,
      headers: {
        'Cookie': `csrftoken=${csrftoken}; sessionid=${sessionid}`
      },
      credentials: 'include'
    })

    const widgets = await $fetch<WidgetPreview[]>('/api/v1/widget-info/', {
      method: 'GET',
      baseURL: config.public.apiBase,
      headers: {
        'Cookie': `csrftoken=${csrftoken}; sessionid=${sessionid}`
      },
      credentials: 'include'
    })

    const widgetMap = new Map(widgets.map(widget => [widget.id, widget]))

    const chatsPreview: ChatPreview[] = chatsInfo.map(chat => ({
      id: chat.id,
      date_last_message: chat.date_last_message,
      widget_owner: chat.widget_owner,
      note: chat.note,
      widget_name: widgetMap.get(chat.widget_owner)?.name || ''
    }))

    return chatsPreview
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Internal Server Error',
      data: error.data
    })
  }
})
