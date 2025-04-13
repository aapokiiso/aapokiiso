<template>
  <div :class="useProseStyles()">
    <article v-if="post">
      <h1>
        {{ post.title }}
      </h1>
      <time :datetime="String(post.date)">
        {{ formatInDisplayTimeZone(post.date, 'E, MMM d') }}
      </time>
      <ContentRenderer :value="post" />
    </article>
    <article v-else>
      <h1>
        Post not found
      </h1>
    </article>

    <p>
      <NuxtLink to="/">
        Back to front page
      </NuxtLink>
    </p>
  </div>
</template>

<script lang="ts" setup>
const route = useRoute()
const { data: post } = await useAsyncData(route.path, () => {
  return queryCollection('posts').path(route.path).first()
})
</script>
