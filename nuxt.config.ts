import path from 'node:path'
import { createResolver } from '@nuxt/kit'
import { getPosts, cachePost, readCacheManifest, writeCacheManifest } from './utils/lemmy'

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

      // TODO can't be in build dir because it is cleared on every build
      const cacheDir = nitro.options.runtimeConfig.content.sources.lemmy.base
      const mediaDir = path.join(nitro.options.output.publicDir, 'media')

      const prevManifest = await readCacheManifest(cacheDir)

      const cutoffTimestamp = prevManifest?.timestamp
        ? new Date(prevManifest.timestamp)
        : null

      if (cutoffTimestamp) {
        console.log(`Lemmy posts cache cut-off timestamp is ${cutoffTimestamp.toISOString()}`)
      } else {
        console.log('Caching all Lemmy posts, no cache cut-off timestamp')
      }

      const buildStartedAt = new Date()

      let posts = []
      let page = 1
      do {
        console.log(`Caching Lemmy posts (page ${page})...`)

        posts = await getPosts(baseUrl, community, { page })

        const postsToCache = posts
          .filter((post) => {
            if (cutoffTimestamp) {
              // TODO make sure no timezone issues
              const postTimestamp = new Date(post.updated || post.published)

              return postTimestamp >= cutoffTimestamp
            }

            // No previous build, cache all posts
            return true
          })

        console.log(`Caching ${postsToCache.length} out of ${posts.length} found posts`)

        await Promise.all(
          postsToCache.map(post => cachePost(post, { cacheDir, mediaDir })),
        )

        page += 1
      } while (posts.length)

      const manifest = {
        timestamp: buildStartedAt.toISOString(),
      }

      await writeCacheManifest(cacheDir, manifest)
    },
  },
})
