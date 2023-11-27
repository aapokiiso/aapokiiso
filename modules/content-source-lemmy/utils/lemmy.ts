import path from 'node:path'
import fs from 'node:fs/promises'
import sizeOf from 'image-size'
import type { Post } from 'lemmy-js-client'
import { LemmyHttp } from 'lemmy-js-client'

interface PostImage {
  src: string,
  alt: '', // Alt text is not available for direct Lemmy uploads
  width?: number,
  height?: number,
}

type PostMeta = Record<string, string|number|undefined>

interface CacheManifest {
  cachedAt: string
}

export const getPosts = async (baseUrl: string, community: string, username: string, password: string, { page = 1, limit = 25 }: {page?: number, limit?: number}): Promise<Post[]> => {
  const client = new LemmyHttp(baseUrl)

  try {
    const { jwt } = await client.login({
      username_or_email: username,
      password,
    })

    const response = await client.getPosts({
      community_name: community,
      page,
      limit,
      // @ts-ignore Auth token accepted only as query param on GET requests
      auth: jwt,
    })

    return response.posts.map(({ post }) => post)
  } catch (e) {
    console.error('Failed to fetch posts', e)

    return []
  }
}

const mapDateSlug = (post: Post): string => {
  const publishedDate = new Date(post.published)

  return `${publishedDate.getUTCFullYear()}-${publishedDate.getUTCMonth() + 1}`
}

const mapTitleSlug = (post: Post): string => {
  const slug = post.name
    .split(' ')
    .filter(_ => _.match(/^[0-9a-zåäöA-ZÅÄÖ]+$/))
    .slice(0, 5) // limit slug length to 5 words
    .map(_ => _.toLowerCase())
    .join('-')

  return slug || String(post.id)
}

const mapPostTimestamp = (post: Post): string => {
  const date = new Date(post.published)

  return date.toISOString()
}

const isImagePost = (post: Post): boolean => Boolean(post.local && post.thumbnail_url)

export const isRemovedPost = (post: Post): boolean => post.deleted || post.removed

const cacheImage = async (url: URL, rootDir: string, dateSlug: string, titleSlug: string): Promise<PostImage> => {
  const response = await fetch(url)
  const image = Buffer.from(await response.arrayBuffer())

  const fileName = decodeURIComponent(path.basename(url.pathname))

  const filePath = path.join(rootDir, dateSlug, titleSlug, fileName)

  await fs.mkdir(path.dirname(filePath), { recursive: true })
  await fs.writeFile(filePath, image)

  const { width, height } = sizeOf(image)

  return {
    src: `/media/${dateSlug}/${titleSlug}/${fileName}`,
    alt: '',
    width,
    height,
  }
}

const purgeImage = async (url: URL, rootDir: string, dateSlug: string, titleSlug: string): Promise<void> => {
  const fileName = decodeURIComponent(path.basename(url.pathname))

  const filePath = path.join(rootDir, dateSlug, titleSlug, fileName)

  await fs.rm(filePath, { force: true })
}

const mapTextPostMeta = (post: Post): PostMeta => {
  const timestamp = mapPostTimestamp(post)

  return {
    layout: 'text',
    title: post.name,
    date: timestamp,
  }
}

const mapImagePostMeta = (post: Post, image: PostImage): PostMeta => {
  const timestamp = mapPostTimestamp(post)

  return {
    layout: 'image',
    title: post.name,
    src: image.src,
    alt: image.alt,
    width: image.width,
    height: image.height,
    date: timestamp,
  }
}

const mapPostContent = (post: Post, meta: PostMeta): string => {
  const contentMeta = Object.keys(meta)
    .filter(key => typeof meta[key] !== 'undefined')
    .map(key => `${key}: ${meta[key]}`)
    .join('\n')

  return `---
${contentMeta}
---

# ${post.name}

${post.body}
`
}

export const cachePost = async (post: Post, { contentDir, mediaDir }: { contentDir: string, mediaDir: string }): Promise<void> => {
  const dateSlug = mapDateSlug(post)
  const titleSlug = mapTitleSlug(post)

  try {
    let meta
    if (isImagePost(post)) {
      const imageUrl = post.url ? new URL(post.url) : null

      const image = imageUrl
        ? await cacheImage(imageUrl, mediaDir, dateSlug, titleSlug)
        : null

      meta = image ? mapImagePostMeta(post, image) : null
    } else {
      meta = mapTextPostMeta(post)
    }

    if (meta) {
      const filePath = path.join(contentDir, 'posts', dateSlug, `${titleSlug}.md`)
      const content = mapPostContent(post, meta)

      await fs.mkdir(path.dirname(filePath), { recursive: true })
      await fs.writeFile(filePath, content)

      console.log('Cached post', post.id, `${dateSlug}/${titleSlug}`)
    } else {
      console.error('Invalid meta information for post', post.id)
    }
  } catch (e) {
    console.error('Failed to cache post', post.id, e)
  }
}

export const purgePost = async (post: Post, { contentDir, mediaDir }: { contentDir: string, mediaDir: string }): Promise<void> => {
  const dateSlug = mapDateSlug(post)
  const titleSlug = mapTitleSlug(post)

  try {
    if (isImagePost(post)) {
      const imageUrl = post.url ? new URL(post.url) : null

      if (imageUrl) {
        await purgeImage(imageUrl, mediaDir, dateSlug, titleSlug)
      }
    }

    const filePath = path.join(contentDir, 'posts', dateSlug, `${titleSlug}.md`)
    await fs.rm(filePath, { force: true })

    console.log('Purged post', post.id, `${dateSlug}/${titleSlug}`)
  } catch (e) {
    console.error('Failed to purge deleted post', post.id, e)
  }
}

export const readCacheManifest = async (dir: string): Promise<CacheManifest|undefined> => {
  try {
    const json = await fs.readFile(path.join(dir, 'manifest.json'))

    return JSON.parse(json.toString('utf-8'))
  } catch (e) {
    return undefined
  }
}

export const writeCacheManifest = async (dir: string, manifest: CacheManifest): Promise<void> => {
  try {
    const json = JSON.stringify(manifest)

    await fs.mkdir(dir, { recursive: true })
    await fs.writeFile(path.join(dir, 'manifest.json'), json)
  } catch (e) {
    console.error('Failed to write cache manifest file')
  }
}
