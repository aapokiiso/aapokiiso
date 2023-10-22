<template>
  <div class="bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
    <NuxtImg
      :src="content.src"
      :alt="content.alt"
      :width="resizedWidth"
      :height="resizedHeight"
      :modifiers="{ width: resizedWidth }"
      class="rounded-t-lg"
    />

    <div class="p-6">
      <ProseContent>
        <ContentRenderer :value="content" />
      </ProseContent>

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
  </div>
</template>

<script setup lang="ts">
import type { ParsedContent } from '@nuxt/content/dist/runtime/types'

interface Props {
  content: ParsedContent
}

const props = defineProps<Props>()

const resizedWidth = 1024
const resizedHeight = Math.round(resizedWidth * (props.content.height / props.content.width))
</script>
