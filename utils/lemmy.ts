import path from 'node:path'
import fs from 'node:fs/promises'
import sizeOf from 'image-size'
import { Post, LemmyHttp } from 'lemmy-js-client'

interface PostImage {
  src: string,
  alt: '', // Alt text is not available for direct Lemmy uploads
  width?: number,
  height?: number,
}

type PostMeta = Record<string, string|number|undefined>

export const getPosts = async (baseUrl: string, community: string, { page = 1, limit = 25 }: {page?: number, limit?: number}): Promise<Post[]> => {
  const client = new LemmyHttp(baseUrl)

  try {
    const response = await client.getPosts({
      community_name: community,
      page,
      limit,
    })

    return response.posts.map(({ post }) => post)
  } catch (e) {
    console.error(e)

    return []
  }
}

const mapDateSlug = (post: Post): string => {
  const publishedDate = new Date(post.published)

  return `${publishedDate.getUTCFullYear()}-${publishedDate.getUTCMonth()}`
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

  return `${date.getUTCFullYear()}-${date.getUTCMonth()}-${date.getUTCDate()} ${date.getUTCHours()}:${date.getUTCMinutes()}:${date.getUTCSeconds()} +00:00`
}

const isImagePost = (post: Post): boolean => Boolean(post.local && post.thumbnail_url)

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

  const contentBody = post.body

  return `---
${contentMeta}
---

${contentBody}
`
}

export const cachePost = async (post: Post, { cacheDir, mediaDir }: { cacheDir: string, mediaDir: string }): Promise<void> => {
  const dateSlug = mapDateSlug(post)
  const titleSlug = mapTitleSlug(post)

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
    const filePath = path.join(cacheDir, 'posts', dateSlug, `${titleSlug}.md`)
    const content = mapPostContent(post, meta)

    await fs.mkdir(path.dirname(filePath), { recursive: true })
    await fs.writeFile(filePath, content)
  } else {
    console.error('Invalid meta information for post', post.id)
  }
}
