export default defineNuxtRouteMiddleware((to, from) => {
  const auth = useAuthStoreBff()

  if (!auth.checkAuth()) {
    return navigateTo('/auth/login')
  }
})
