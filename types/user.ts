export interface User {
  id: number
  username: string
  email: string
  first_name: string
  last_name: string
}

export interface UserInfo extends User {
  date_joined: string
  last_login: string
  is_staff: boolean
  is_superuser: boolean
}
