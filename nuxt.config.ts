// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxt/image',
    '@nuxt/content',
    '@nuxtjs/color-mode',
  ],
  runtimeConfig: {
    public: {
      displayTimeZone: typeof process.env.NUXT_PUBLIC_DISPLAY_TIME_ZONE !== 'undefined'
        ? process.env.NUXT_PUBLIC_DISPLAY_TIME_ZONE
        : 'Europe/Helsinki',
      postsPerPage: typeof process.env.NUXT_PUBLIC_POSTS_PER_PAGE !== 'undefined'
        ? process.env.NUXT_PUBLIC_POSTS_PER_PAGE
        : 5,
    },
  },
  colorMode: {
    classSuffix: '',
  },
})
