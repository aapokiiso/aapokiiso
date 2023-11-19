import path from 'node:path'
import { copyPublicAssets } from 'nitropack'
import { zonedTimeToUtc } from 'date-fns-tz'
import { getPosts, cachePost, purgePost, readCacheManifest, writeCacheManifest, isRemovedPost } from './utils/lemmy'

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
      username: process.env.NUXT_LEMMY_USERNAME,
      password: process.env.NUXT_LEMMY_PASSWORD,
    },
  },
  hooks: {
    'nitro:build:public-assets': async (nitro) => {
      const { baseUrl, community, username, password } = nitro.options.runtimeConfig.lemmy

      if (!(baseUrl && community && username && password)) {
        console.error('Lemmy not configured properly.')
        return
      }

      // Nitro srcDir is the server/ directory inside Nuxt's srcDir.
      const nuxtSrcDir = path.dirname(nitro.options.srcDir)
      const cacheManifestDir = nuxtSrcDir
      const contentDir = path.join(nuxtSrcDir, 'content')
      const mediaDir = path.join(nuxtSrcDir, 'public', 'media')

      const prevManifest = await readCacheManifest(cacheManifestDir)

      const cutoffTimestamp = prevManifest?.timestamp
        ? new Date(prevManifest.timestamp)
        : null

      if (cutoffTimestamp) {
        console.log(`Lemmy posts cache cut-off timestamp is ${cutoffTimestamp.toISOString()}`)
      } else {
        console.log('Caching all Lemmy posts, no cache cut-off timestamp')
      }

      const cacheStartedAt = new Date()

      let posts = []
      let page = 1
      do {
        console.log(`Iterating over Lemmy posts (page ${page})...`)

        posts = await getPosts(baseUrl, community, username, password, { page })

        const deletedPosts = posts.filter(post => isRemovedPost(post))

        console.log(`Found ${deletedPosts.length} deleted out of ${posts.length} posts`)

        // TODO figure out why /contact 404s when any post is purged from content cache
        await Promise.all(
          deletedPosts.map(post => purgePost(post, { contentDir, mediaDir })),
        )

        const changedPosts = posts
          .filter(post => !isRemovedPost(post))
          .filter((post) => {
            if (cutoffTimestamp) {
              // Lemmy timestamps are in UTC but ambiguous, can't use Date constructor
              const postTimestamp = zonedTimeToUtc(post.updated || post.published, 'UTC')

              return postTimestamp >= cutoffTimestamp
            }

            // No previous build, cache all posts
            return true
          })

        console.log(`Found ${changedPosts.length} changed out of ${posts.length} posts`)

        await Promise.all(
          changedPosts.map(post => cachePost(post, { contentDir, mediaDir })),
        )

        page += 1
      } while (posts.length)

      const manifest = {
        timestamp: cacheStartedAt.toISOString(),
      }

      await writeCacheManifest(cacheManifestDir, manifest)
      await copyPublicAssets(nitro)
    },
  },
})
