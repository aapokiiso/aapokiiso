<template>
  <div :class="useProseStyles()">
    <article v-if="page">
      <h1>
        {{ page.title }}
      </h1>
      <ContentRenderer :value="page" />
    </article>
    <article v-else>
      <h1>
        Page not found
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
const { data: page } = await useAsyncData(route.path, () => {
  return queryCollection('roots').path(route.path).first()
})
</script>
