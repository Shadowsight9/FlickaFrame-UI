// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@pinia/nuxt',
    '@vueuse/nuxt',
    '@unocss/nuxt',
    '@nuxtjs/eslint-module',
    '@formkit/auto-animate',
    '@vueuse/motion/nuxt',
    '@pinia-plugin-persistedstate/nuxt',
    '@ant-design-vue/nuxt',
    'nuxt-swiper',
  ],
  ssr: false,
  vite: {
    vue: {
      script: { defineModel: true },
    },
  },
  devServer: {
    host: '0.0.0.0',
  },
  nitro: {
    devProxy: {
      '/api': {
        target: process.env.NUXT_PUBLIC_API_BASE,
      },
    },
  },
  routeRules: {
    '/': { redirect: '/explore' },
  },
  css: [
    '@unocss/reset/tailwind.css',
    '~/assets/common.css',
  ],
  runtimeConfig: {
    public: {
      baseURL: process.env.NUXT_PUBLIC_API_BASE || '/',
    },
  },
  components: [
    {
      path: '~/components',
      extensions: ['.vue'],
    },
  ],
  app: {
    pageTransition: { name: 'slide-right', mode: 'out-in' },
  },
  eslint: {
    emitWarning: false,
  },
})
