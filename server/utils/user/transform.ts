import { User, UserInfo } from "~/types/user";

export function transformUserInfoToUser(userInfo: UserInfo): User {
  return {
    id: userInfo.id,
    username: userInfo.username,
    email: userInfo.email,
    first_name: userInfo.first_name,
    last_name: userInfo.last_name,
  }
}
