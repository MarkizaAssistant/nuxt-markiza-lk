export default defineNuxtRouteMiddleware(async (to, from) => {
  const auth = useAuthStore()

  await auth.checkAuth()

  if (!auth.isAuthenticated) {
    return navigateTo('/auth/login')
  }
})
