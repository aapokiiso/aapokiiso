import { SitemapStream, streamToPromise } from 'sitemap'
import { serverQueryContent } from '#content/server'

export default defineEventHandler(async (event) => {
  const { siteUrl } = useRuntimeConfig(event)

  const docs = await serverQueryContent(event).find()
  const sitemap = new SitemapStream({
    hostname: siteUrl,
  })

  for (const doc of docs) {
    sitemap.write({
      url: doc._path,
      changefreq: 'monthly',
    })
  }
  sitemap.end()

  return streamToPromise(sitemap)
})
