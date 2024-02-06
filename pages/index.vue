<template>
  <div>
    <ol>
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
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'Aapo Kiiso',
  meta: [
    { name: 'description', content: 'Personal website of Aapo Kiiso.' },
  ],
})

const { data: posts } = await useAsyncData(
  'feed',
  () => queryContent('/posts').sort({ date: -1 }).find(),
)
</script>
