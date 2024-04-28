<template>
  <PostsPage :page="page" />
</template>

<script setup lang="ts">
const route = useRoute()

const page = typeof route.params.page === 'string'
  ? Number(route.params.page)
  : 1

useHead({
  title: `Page ${page} - Aapo Kiiso`,
})
</script>
