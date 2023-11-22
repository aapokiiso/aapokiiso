// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxt/image',
    './modules/content-source-lemmy',
    '@nuxt/content',
  ],
  runtimeConfig: {
    public: {
      displayTimeZone: typeof process.env.NUXT_PUBLIC_DISPLAY_TIME_ZONE !== 'undefined'
        ? process.env.NUXT_PUBLIC_DISPLAY_TIME_ZONE
        : 'Europe/Helsinki',
    },
  },
  contentSourceLemmy: {
    baseUrl: process.env.NUXT_LEMMY_BASE_URL,
    community: process.env.NUXT_LEMMY_COMMUNITY,
    username: process.env.NUXT_LEMMY_USERNAME,
    password: process.env.NUXT_LEMMY_PASSWORD,
  },
})
