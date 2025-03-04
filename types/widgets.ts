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
