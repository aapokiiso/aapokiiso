<template>
  <nav :class="['flex items-center mt-8', useProseStyles()]">
    <NuxtLink v-if="canShowPrev" :to="prevTo" @click="scrollToTop">
      <ChevronLeftIcon class="inline w-6 h-6 text-current" />
      Newer posts
    </NuxtLink>
    <NuxtLink v-if="canShowNext" :to="nextTo" class="ml-auto" @click="scrollToTop">
      Older posts
      <ChevronRightIcon class="inline w-6 h-6 text-current" />
    </NuxtLink>
  </nav>
</template>

<script setup lang="ts">
import ChevronLeftIcon from '@heroicons/vue/20/solid/esm/ChevronLeftIcon'
import ChevronRightIcon from '@heroicons/vue/20/solid/esm/ChevronRightIcon'

const { page, pageSize } = usePostsPagination()

const postsCount = await usePostsQuery().count()

const lastPage = Math.ceil(postsCount / pageSize)

const canShowPrev = computed(() => page.value > 1)
const prevTo = computed(() => {
  const prevPage = Math.min(page.value - 1, lastPage)

  return prevPage > 1 ? `/?page=${prevPage}` : '/'
})

const canShowNext = computed(() => page.value * pageSize < postsCount)
const nextTo = computed(() => {
  const nextPage = Math.max(page.value + 1, 1)

  return nextPage > 1 ? `/?page=${nextPage}` : '/'
})

const scrollToTop = () => { window.scrollTo(0, 0) }
</script>
