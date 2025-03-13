interface Widget {
  id: number
  name: string
  is_active: boolean
}

export interface WidgetPreview extends Widget {}

export interface Domain {
  id: number
  name: string
}

export interface WidgetIcon {
  id: number
  type: string
  url: string
  name: string
}

export interface WidgetInfo extends Widget {
  manager_tg_id: string[]
  domains: Domain[]
  icon: WidgetIcon
  widget_left: boolean
  start_hints: string[]
  welcome_text: string
}

export interface WidgetSettings extends Widget {
  manager_tg_id: string[]
  welcome_text: string,
  start_hints: string[]
  widget_left: boolean
  icon: number | null
  base_icon: number | null
}
