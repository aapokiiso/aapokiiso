import type { ParsedContent, QueryBuilder } from '@nuxt/content/dist/runtime/types'

export const usePostsQuery = (): QueryBuilder<ParsedContent> => queryContent('/posts')
