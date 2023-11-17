import path from 'node:path'
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
      baseUrl: process.env.NUXT_LEMMY_BASE_URL,
      community: process.env.NUXT_LEMMY_COMMUNITY,
    },
  },
  hooks: {
    'nitro:build:public-assets': async (nitro) => {
      const { baseUrl, community } = nitro.options.runtimeConfig.lemmy

      if (!baseUrl) {
        console.error('Lemmy base URL not configured.')
        return
      }

      if (!community) {
        console.error('Lemmy community not configured.')
        return
      }

      // TODO check if there is a better alternative,
      // maybe as as a @nuxt/content source in .nuxt
      // const contentCacheDir = nitro.options.devStorage['cache:content']?.base

      const postsDir = path.join(__dirname, 'content', 'posts')
      const mediaDir = path.join(nitro.options.output.publicDir, 'media')

      let posts = []
      let page = 1
      do {
        // TODO cache only new/updated posts since last build
        console.log(`Caching Lemmy posts (page ${page})...`)
        posts = await getPosts(baseUrl, community, { page })
        await Promise.all(
          posts.map(post => cachePost(post, { postsDir, mediaDir })),
        )
        page += 1
      } while (posts.length)
    },
  },
})
