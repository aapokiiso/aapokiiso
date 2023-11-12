import { getPosts, cachePost } from './utils/lemmy'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxt/image',
    '@nuxt/content',
  ],
  runtimeConfig: {
    public: {
      displayTimeZone: typeof process.env.NUXT_PUBLIC_DISPLAY_TIME_ZONE !== 'undefined'
        ? process.env.NUXT_PUBLIC_DISPLAY_TIME_ZONE
        : 'Europe/Helsinki',
    },
    lemmy: {
      // TODO move to env variables
      baseUrl: 'https://lemmy.aapo.kii.so',
      community: 'general',
    },
  },
  nitro: {
    hooks: {
      'rollup:before': async (nitro) => {
        const { baseUrl, community } = nitro.options.runtimeConfig.lemmy

        let posts = []
        let page = 1
        do {
          console.log(`Get Lemmy posts (page ${page})...`)
          posts = await getPosts(baseUrl, community, { page })
          await Promise.all(posts.map(cachePost))
          page += 1
        } while (posts.length)
      },
    },
  },
})
