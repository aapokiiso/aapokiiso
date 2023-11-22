<template>
  <ContentDoc>
    <template #default="{ doc }">
      <div v-if="doc.layout === 'image'" class="py-6 px-2 md:px-0">
        <FeedImageCard :content="doc" />
      </div>
      <ProseContent v-else class="p-6">
        <ContentRenderer :value="doc" />
      </ProseContent>
    </template>
    <template #not-found>
      <ProseContent class="p-6">
        <h1>Page not found</h1>
        <p>
          <NuxtLink to="/">
            Back to front page
          </NuxtLink>
        </p>
      </ProseContent>
    </template>
  </ContentDoc>
</template>
