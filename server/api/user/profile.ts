import { transformUserInfoToUser } from "~/server/utils/user/transform"
import { UserInfo } from "~/types/user"

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const csrftoken = getCookie(event, 'csrftoken')
  const sessionid = getCookie(event, 'sessionid')

  if (csrftoken && sessionid) {
    const response = await $fetch<UserInfo>('/api/v1/profile/', {
      baseURL: config.public.apiBase,
      method: 'GET',
      credentials: 'include',
      headers: {
        'Cookie': `csrftoken=${csrftoken}; sessionid=${sessionid}`
      }
    })

    const user = transformUserInfoToUser(response)
    return user
  } else {
    return null
  }
})
