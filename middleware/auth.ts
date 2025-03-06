export default defineNuxtRouteMiddleware((to, from) => {
  const auth = useAuthStore()

  auth.checkAuth()

  if (!auth.isAuthenticated) {
    return navigateTo('/auth/login')
  }
})
