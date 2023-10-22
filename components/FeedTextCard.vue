<template>
  <div class="bg-white border border-gray-200 rounded-lg shadow p-6 dark:bg-gray-800 dark:border-gray-700">
    <h2 class="text-lg font-bold mb-2">
      {{ content.title }}
    </h2>
    <p v-if="content.description" class="mb-2 text-gray-700 dark:text-gray-300">
      {{ content.description }}
    </p>
    <p>
      <NuxtLink :to="content._path" class="text-blue-600 dark:text-blue-500">
        Read more
      </NuxtLink>
    </p>
    <div class="mt-4 text-sm text-gray-500 dark:text-gray-400">
      <p class="mb-2">
        &mdash;
      </p>
      <p>
        <time :datetime="content.date">
          {{ formatInDisplayTimeZone(content.date, 'E, MMM d') }}
        </time>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ParsedContent } from '@nuxt/content/dist/runtime/types'

interface Props {
  content: ParsedContent
}

defineProps<Props>()
</script>
