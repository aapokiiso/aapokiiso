<template>
  <div class="max-w-xl mx-auto">
    <header class="sticky top-0 bg-white dark:bg-gray-900">
      <MainMenu />
    </header>
    <main class="p-4">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
useHead({
  htmlAttrs: {
    lang: 'en',
  },
})
</script>
