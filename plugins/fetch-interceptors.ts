import { ofetch } from 'ofetch'
import type { FetchResponse } from 'ofetch'

function responseHandler(response: FetchResponse<ApiResult<unknown>>) {
  if (!process.browser) return

  if (response._data?.code === 401) {
    const store = useSessionStore()
    store.cleanup()
    notification.info({
      message: '未登录',
      description: '您尚未登录哦～～登录后再继续吧',
    })

    store.isSessionModalOpen = true
  }
}

export default defineNuxtPlugin(() => {
  globalThis.$fetch = ofetch.create({
    onRequest({ options, ...ctx }) {
      const { public: { baseURL } } = useRuntimeConfig()
      const rawUrl = ctx.request.toString()

      // TODO: 临时解决方案，后续需要优化
      if (rawUrl.startsWith('/v1')) {
        options.baseURL = baseURL
      } else {
        options.baseURL = process.browser ? '/' : baseURL
      }

      const sessionStore = useSessionStore()

      if (!sessionStore.isLogin) return

      options.headers = new Headers(options.headers)
      options.headers.set('Authorization', `Bearer ${sessionStore.session.accessToken}`)
    },
    onResponse({ response }) {
      responseHandler(response)
    },
    onRequestError(context) {
      console.error('onRequestError', context)
    },
  })
})
