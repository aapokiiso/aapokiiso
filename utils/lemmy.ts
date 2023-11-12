import path from 'node:path'
import fs from 'node:fs/promises'
import { Post, LemmyHttp } from 'lemmy-js-client'

export const getPosts = async (baseUrl: string, community: string, { page, limit }: {page?: number, limit?: number}): Promise<Post[]> => {
  const client = new LemmyHttp(baseUrl)

  try {
    const response = await client.getPosts({
      community_name: community,
      page: page || 1,
      limit: limit || 25,
    })

    return response.posts.map(({ post }) => post)
  } catch (e) {
    console.error(e)

    return []
  }
}

const mapPostSlug = (post: Post): string => {
  const slug = post.name
    .split(' ')
    .filter(_ => _.match(/^[0-9a-zåäöA-ZÅÄÖ]+$/))
    .slice(0, 5)
    .map(_ => _.toLowerCase())
    .join('-')

  return slug || String(post.id)
}

const mapPostContent = (post: Post): string => {
  const layout = post.body ? 'text' : 'image'
  const date = new Date(post.published)

  const published = `${date.getUTCFullYear()}-${date.getUTCMonth()}-${date.getUTCDate()} ${date.getUTCHours()}:${date.getUTCMinutes()}:${date.getUTCSeconds()} +00:00`

  return `---
layout: ${layout}
title: '${post.name}'
date: ${published}
---

${post.body}
`
}

export const cachePost = async (post: Post): Promise<void> => {
  const publishedDate = new Date(post.published)

  const slug = mapPostSlug(post)
  const postPath = `${publishedDate.getUTCFullYear()}-${publishedDate.getUTCMonth()}/${slug}.md`

  const filePath = path.join(__dirname, '../content/posts', postPath)

  await fs.writeFile(filePath, mapPostContent(post))
}
