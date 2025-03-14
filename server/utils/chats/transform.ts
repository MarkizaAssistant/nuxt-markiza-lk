import { ChatInfo, ChatPreview } from "~/types/chats"
import { WidgetInfo } from "~/types/widgets"

async function getWidget(widgetId: number, event: any): Promise<WidgetInfo | null> {
  try {
    const csrftoken = getCookie(event, 'csrftoken')
    const sessionid = getCookie(event, 'sessionid')

    if (!csrftoken || !sessionid) {
      console.error("Missing cookies")
      return null
    }

    const widget = await $fetch<WidgetInfo>('/api/widgets/getById', {
      method: 'POST',
      headers: {
        'Cookie': `csrftoken=${csrftoken}; sessionid=${sessionid}`
      },
      credentials: 'include',
      body: { widgetId }
    })

    if (widget) {
      return widget
    } else {
      return null
    }
  } catch (error) {
    console.error('Failed to fetch widgets:', error)
    return null
  }
}

export async function transformChatsInfoToChatPreview(chatInfo: ChatInfo, event: any): Promise<ChatPreview> {
  const widget = await getWidget(chatInfo.widget_owner, event)

  return {
    id: chatInfo.id,
    date_last_message: chatInfo.date_last_message,
    widget_owner: chatInfo.widget_owner,
    note: chatInfo.note,
    widget_name: widget?.name || '',
    icon: widget?.icon || {
      id: 0,
      name: '',
      type: '',
      url: ''
    }
  }
}
