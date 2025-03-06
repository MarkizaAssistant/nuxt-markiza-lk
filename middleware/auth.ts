export default defineNuxtRouteMiddleware(async (to, from) => {
  const auth = useAuthStore()

  await auth.checkAuth()

  console.log(!auth.isAuthenticated)

  if (!auth.isAuthenticated) {
    return navigateTo('/auth/login')
  }
})
