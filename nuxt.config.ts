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
    '@nuxt/scripts',
  ],

  runtimeConfig: {
    siteUrl,
    public: {
      displayTimeZone: typeof process.env.NUXT_PUBLIC_DISPLAY_TIME_ZONE !== 'undefined'
        ? process.env.NUXT_PUBLIC_DISPLAY_TIME_ZONE
        : 'Europe/Helsinki',
      postsPerPage: typeof process.env.NUXT_PUBLIC_POSTS_PER_PAGE !== 'undefined'
        ? Number(process.env.NUXT_PUBLIC_POSTS_PER_PAGE)
        : 5,
    },
  },

  nitro: {
    prerender: {
      routes: ['/sitemap.xml'],
    },
  },

  colorMode: {
    classSuffix: '',
  },

  feedme: {
    defaults: {
      rss: {
        title: 'Aapo Kiiso',
        description: 'Personal website of Aapo Kiiso',
        link: siteUrl,
        id: siteUrl,
        author: { email: 'aapo@kii.so', name: 'Aapo Kiiso' },
      },
      content: {
        collections: {
          posts: x => x.all(),
        },
        mapping: [
          ['link', 'path', (path) => {
            const { siteUrl } = useRuntimeConfig()

            return siteUrl + path
          }],
        ],
      },
    },
  },

  compatibilityDate: '2024-10-12',
})
