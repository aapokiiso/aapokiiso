<template>
  <ContentDoc v-slot="{ doc }">
    <div v-if="doc.layout === 'image'" class="py-6 px-2 md:px-0">
      <FeedImageCard :content="doc" />
    </div>
    <ProseContent v-else class="p-6">
      <ContentRenderer :value="doc" />
    </ProseContent>
  </ContentDoc>
</template>
