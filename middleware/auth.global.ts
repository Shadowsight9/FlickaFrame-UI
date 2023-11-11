export default defineNuxtRouteMiddleware((from, to) => {
  const store = useSessionStore()

  if (to.meta.needAuth && !store.isLogin) {
    if (!from.meta.needAuth) return
    return navigateTo({ path: '/explore' })
  }
})
