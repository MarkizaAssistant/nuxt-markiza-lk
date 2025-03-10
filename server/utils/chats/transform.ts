import { ChatInfo, ChatPreview } from "~/types/chats";
import { WidgetPreview } from "~/types/widgets";

async function getWidgetName(widgetId: number, event: any): Promise<string> {
  try {
    const config = useRuntimeConfig()
    const csrftoken = getCookie(event, 'csrftoken')
    const sessionid = getCookie(event, 'sessionid')

    if (!csrftoken || !sessionid) {
      console.error("Missing cookies");
      return '';
    }

    const widgets = await $fetch<WidgetPreview[]>('/api/widgets/preview', {
      method: 'GET',
      headers: {
        'Cookie': `csrftoken=${csrftoken}; sessionid=${sessionid}`
      },
      credentials: 'include'
    })

    if (widgets) {
      const widget = widgets.find((widget) => widget.id === widgetId)
      return widget ? widget.name : ''
    } else {
      return ''
    }
  } catch (error) {
    console.error('Failed to fetch widgets:', error)
    return ''
  }
}

export async function transformChatsInfoToChatPreview(chatInfo: ChatInfo, event: any): Promise<ChatPreview> {
  const widgetName = await getWidgetName(chatInfo.widget_owner, event)

  return {
    id: chatInfo.id,
    date_last_message: chatInfo.date_last_message,
    widget_owner: chatInfo.widget_owner,
    note: chatInfo.note,
    widget_name: widgetName
  }
}
