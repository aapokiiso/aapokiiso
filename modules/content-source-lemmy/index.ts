import { defineNuxtModule, createResolver } from '@nuxt/kit'
import { defu } from 'defu'
import { zonedTimeToUtc } from 'date-fns-tz'
import { hasInstalledNuxtModule } from './utils/compatibility'
import { getPosts, cachePost, purgePost, readCacheManifest, writeCacheManifest, isRemovedPost } from './utils/lemmy'

export interface ModuleOptions {
  baseUrl: string,
  community: string,
  username: string,
  password: string,
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'content-source-lemmy',
    configKey: 'contentSourceLemmy',
  },
  setup ({ baseUrl, community, username, password }, nuxt) {
    if (!(baseUrl && community && username && password)) {
      throw new Error('[content-source-lemmy] Lemmy not configured properly.')
      return
    }

    if (hasInstalledNuxtModule('@nuxt-content')) {
      throw new Error('[content-source-lemmy] Module must be installed before @nuxt-content.')
    }

    const { resolve: resolveRoot } = createResolver(nuxt.options.srcDir)

    const lemmyContentDir = resolveRoot('content-lemmy')

    // @ts-ignore: @nuxt/content not part of core Nuxt options typing
    nuxt.options.content = defu(nuxt.options.content, {
      sources: {
        lemmy: {
          driver: 'fs',
          base: lemmyContentDir,
        },
      },
    })

    nuxt.hook('build:before', async () => {
      const contentDir = lemmyContentDir
      const mediaDir = resolveRoot('public/media')

      const prevManifest = await readCacheManifest(contentDir)

      const cutoffTimestamp = prevManifest?.cachedAt
        ? new Date(prevManifest.cachedAt)
        : null

      if (cutoffTimestamp) {
        console.log(`Lemmy posts cache cut-off timestamp is ${cutoffTimestamp.toISOString()}.`)
      } else {
        console.log('Caching all Lemmy posts, no cache cut-off timestamp.')
      }

      const cacheStartedAt = new Date()

      let posts = []
      let page = 1
      do {
        console.log(`Page ${page}: Fetching posts.`)

        posts = await getPosts(baseUrl, community, username, password, { page })

        // Deleted posts don't have deletion timestamp so have to delete all.
        const deletedPosts = posts.filter(post => isRemovedPost(post))

        console.log(`Page ${page}: Found ${deletedPosts.length} deleted posts out of ${posts.length} total.`)

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

        console.log(`Page ${page}: Found ${changedPosts.length} new or updated posts out of ${posts.length} total.`)

        await Promise.all(
          changedPosts.map(post => cachePost(post, { contentDir, mediaDir })),
        )

        page += 1
      } while (posts.length)

      const manifest = {
        cachedAt: cacheStartedAt.toISOString(),
      }

      await writeCacheManifest(contentDir, manifest)
    })
  },
})
