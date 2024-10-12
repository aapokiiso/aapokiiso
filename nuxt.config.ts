const siteUrl = typeof process.env.NUXT_PUBLIC_BASE_URL !== 'undefined'
  ? process.env.NUXT_PUBLIC_BASE_URL
  : 'https://aapo.kii.so'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxt/image',
    '@nuxt/content',
    '@nuxtjs/color-mode',
    'nuxt-feedme',
  ],

  runtimeConfig: {
    app: {
      siteUrl,
    },
    public: {
      displayTimeZone: typeof process.env.NUXT_PUBLIC_DISPLAY_TIME_ZONE !== 'undefined'
        ? process.env.NUXT_PUBLIC_DISPLAY_TIME_ZONE
        : 'Europe/Helsinki',
      postsPerPage: typeof process.env.NUXT_PUBLIC_POSTS_PER_PAGE !== 'undefined'
        ? Number(process.env.NUXT_PUBLIC_POSTS_PER_PAGE)
        : 5,
    },
  },

  colorMode: {
    classSuffix: '',
  },

  feedme: {
    content: {
      feed: {
        defaults: {
          title: 'Aapo Kiiso',
          description: 'Personal website of Aapo Kiiso',
          link: siteUrl,
          id: siteUrl,
          author: { email: 'aapo@kii.so', name: 'Aapo Kiiso' },
        },
      },
      item: {
        mapping: [
          ['link', '_path', (path) => {
            const { siteUrl } = useRuntimeConfig().app

            return siteUrl + path
          }],
        ],
        query: {
          where: [
            { _path: /^\/(posts)\// },
          ],
        },
      },
    },
  },

  compatibilityDate: '2024-10-12',
})
