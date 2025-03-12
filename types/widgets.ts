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

export interface WidgetInfo extends Widget {
  domains: Domain[]
  manager_tg_id: string[]
}

export interface WidgetIcon {
  id: number
  url: string
  name: string
}

export interface WidgetSettings extends Widget {
  manager_tg_id: string[]
  welcome_text: string
  start_hints: string[]
  widget_left: boolean
  icon: number | null
  base_icon: number | null
}
