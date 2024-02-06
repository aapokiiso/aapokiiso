<template>
  <div>
    <header class="sticky top-0 bg-white dark:bg-gray-900 dark:text-white">
      <MainMenu />
    </header>
    <main class="max-w-lg p-4">
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
