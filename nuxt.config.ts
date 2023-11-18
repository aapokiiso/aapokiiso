import path from 'node:path'
import { createResolver } from '@nuxt/kit'
import { getPosts, cachePost } from './utils/lemmy'

const { resolve } = createResolver(import.meta.url)

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
  content: {
    sources: {
      lemmy: {
        driver: 'fs',
        base: resolve('.nuxt/content-cache/lemmy'),
      },
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

      const cacheDir = nitro.options.runtimeConfig.content.sources.lemmy.base
      const mediaDir = path.join(nitro.options.output.publicDir, 'media')

      let posts = []
      let page = 1
      do {
        // TODO cache only new/updated posts since last build
        console.log(`Caching Lemmy posts (page ${page})...`)
        posts = await getPosts(baseUrl, community, { page })
        await Promise.all(
          posts.map(post => cachePost(post, { cacheDir, mediaDir })),
        )
        page += 1
      } while (posts.length)
    },
  },
})
