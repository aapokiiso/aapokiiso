<template>
  <nav :class="['flex items-center mt-8', useProseStyles()]">
    <NuxtLink v-if="canShowPrev" :to="prevTo">
      <ChevronLeftIcon class="inline w-6 h-6 text-current" />
      Newer posts
    </NuxtLink>
    <NuxtLink v-if="canShowNext" :to="nextTo" class="ml-auto">
      Older posts
      <ChevronRightIcon class="inline w-6 h-6 text-current" />
    </NuxtLink>
  </nav>
</template>

<script setup lang="ts">
import ChevronLeftIcon from '@heroicons/vue/20/solid/esm/ChevronLeftIcon'
import ChevronRightIcon from '@heroicons/vue/20/solid/esm/ChevronRightIcon'

interface Props {
  currentPage: number,
}
const props = defineProps<Props>()

const { postsPerPage } = useRuntimeConfig().public

const postsCount = await usePostsQuery().count()

const lastPage = Math.ceil(postsCount / postsPerPage)

const canShowPrev = props.currentPage > 1
const prevPage = Math.min(props.currentPage - 1, lastPage)
const prevTo = prevPage > 1 ? `/posts/page/${prevPage}` : '/'

const canShowNext = props.currentPage * postsPerPage < postsCount
const nextPage = Math.max(props.currentPage + 1, 1)
const nextTo = nextPage > 1 ? `/posts/page/${nextPage}` : '/'
</script>
