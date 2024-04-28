import type { ParsedContent, QueryBuilder } from '@nuxt/content/dist/runtime/types'
import type { LocationQuery } from 'vue-router'

export const usePostsQuery = (): QueryBuilder<ParsedContent> => queryContent('/posts')

type Pagination = {
  page: Ref<number>,
  pageSize: number,
}

const parsePageFromQuery = (query: LocationQuery): number =>
  typeof query.page === 'string' ? Number(query.page) : 1

export const usePostsPagination = (): Pagination => {
  const route = useRoute()

  const page = useState<number>('paginationPage', () => parsePageFromQuery(route.query))
  watch(
    () => route.query,
    (newQuery) => { page.value = parsePageFromQuery(newQuery) },
  )

  return {
    page,
    pageSize: 5,
  }
}
