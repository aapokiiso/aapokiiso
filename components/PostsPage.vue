<template>
  <div>
    <ol v-if="posts?.length">
      <li v-for="post in posts" :key="post._id" class="my-8 first:mt-0 last:mb-0">
        <article :class="useProseStyles()">
          <h2>
            {{ post.title }}
          </h2>
          <p class="text-sm">
            <time :datetime="post.date">
              {{ formatInDisplayTimeZone(post.date, 'E, MMM d') }}
            </time>
          </p>
          <ContentRenderer :value="post" :excerpt="!!post.excerpt" />
          <p v-if="post.excerpt">
            <NuxtLink :to="post._path">
              Read more
            </NuxtLink>
          </p>
        </article>
      </li>
    </ol>
    <p v-else>
      No matching posts found.
    </p>
    <PostsPagination :current-page="page" />
  </div>
</template>

<script setup lang="ts">
interface Props {
  page: number,
}
const props = defineProps<Props>()

const { postsPerPage } = useRuntimeConfig().public

const { data: posts } = await useAsyncData(
  `feed_page_${props.page}`,
  () => usePostsQuery()
    .sort({ date: -1 })
    .limit(postsPerPage)
    .skip((props.page - 1) * postsPerPage)
    .find(),
)
</script>
