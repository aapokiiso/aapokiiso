<template>
  <div>
    <h1>Feed</h1>
    <div>{{ JSON.stringify(data) }}</div>
  </div>
</template>

<script setup lang="ts">
const { data } = await useAsyncData('feed', () => queryContent('/').sort({ date: -1 }).find())

</script>
