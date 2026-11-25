const PROTECTED_PREFIXES = ['/dashboard', '/requests', '/profile']

export default defineNuxtRouteMiddleware((to) => {
  const { isAuthenticated } = useAuth()

  if (isAuthenticated.value) return

  const isProtected = PROTECTED_PREFIXES.some(
    (prefix) => to.path === prefix || to.path.startsWith(`${prefix}/`),
  )

  if (isProtected) {
    return navigateTo({
      path: '/login',
      query: { redirect: to.fullPath },
    })
  }
})
