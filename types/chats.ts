import type { WidgetIcon } from "./widgets"

interface Chat {
  id: number
  widget_owner: number
  date_last_message: string
  note: string | null
}

export interface ChatPreview extends Chat {
  widget_name: string
  icon: WidgetIcon
}

export interface ChatInfo extends Chat {
  chat_type: string
  user_id: string
  is_favorite: boolean
  creator: number
}

export interface Message {
  id: number
  message: string
  sender: string
  date: string
  chat: number
}
