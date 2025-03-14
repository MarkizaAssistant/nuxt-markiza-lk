// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    'shadcn-nuxt',
    '@pinia/nuxt',
    '@nuxt/icon',
    'dayjs-nuxt',
    '@vueuse/nuxt'
  ],
  shadcn: {
    prefix: '',
    componentDir: './components/ui'
  },

  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_API_BASE,
      nodeEnv: process.env.NODE_ENV,
    }
  },

  routeRules: {
    '/api/**': {
      cors: true,
      headers: {
        'access-control-allow-credentials': 'true',
      }
    }
  }
})