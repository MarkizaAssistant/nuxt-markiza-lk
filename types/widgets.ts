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

export interface WidgetSettings {
  name: string
  is_active: boolean
  manager_tg_id: string[]
  // welcome_text: string
  // start_hints: string[]
  // widget_left: boolean
  // icon: number
  // base_icon: number
}

export interface Icon {
  id: number
  url: string
}

export interface WidgetIcon extends Icon {
  name: string
}

export interface CustomIcon extends Icon {}
