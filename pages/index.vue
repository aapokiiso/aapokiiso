<template>
  <div class="px-2 md:px-0">
    <ol>
      <li v-for="month in months" :key="month" class="my-4">
        <h2 class="text-lg mb-2 text-center text-gray-500 dark:text-gray-400">
          {{ formatInDisplayTimeZone(month, 'MMMM y') }}
        </h2>

        <ol>
          <li v-for="item in contentByMonth[month]" :key="item._id" class="my-4">
            <FeedImageCard v-if="item.layout === 'image'" :content="item" />
            <FeedTextCard v-if="item.layout === 'text'" :content="item" />
          </li>
        </ol>
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

const { data: content } = await useAsyncData(
  'feed',
  () => queryContent('/posts').sort({ date: -1 }).find(),
)
const contentByMonth = computed(() => content.value !== null ? groupByMonth(content.value) : {})
const months = computed(() => Object.keys(contentByMonth.value))
</script>
