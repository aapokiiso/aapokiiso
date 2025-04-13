import { SitemapStream, streamToPromise } from 'sitemap'

export default defineEventHandler(async (event) => {
  const { siteUrl } = useRuntimeConfig(event)

  const sitemap = new SitemapStream({
    hostname: siteUrl,
  })

  const roots = await queryCollection(event, 'roots').all()
  for (const doc of roots) {
    sitemap.write({
      url: doc.path,
      changefreq: 'monthly',
    })
  }

  const posts = await queryCollection(event, 'posts').all()
  for (const doc of posts) {
    sitemap.write({
      url: doc.path,
      changefreq: 'monthly',
    })
  }
  sitemap.end()

  return streamToPromise(sitemap)
})
