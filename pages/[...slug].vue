<template>
  <div :class="useProseStyles()">
    <ContentDoc>
      <template #default="{ doc }">
        <article>
          <h1>
            {{ doc.title }}
          </h1>
          <p v-if="doc.date" class="text-sm">
            <time :datetime="doc.date">
              {{ formatInDisplayTimeZone(doc.date, 'E, MMM d') }}
            </time>
          </p>
          <ContentRenderer :value="doc" />
        </article>
      </template>
      <template #not-found>
        <h1>
          Page not found
        </h1>
      </template>
    </ContentDoc>
    <p>
      <NuxtLink to="/">
        Back to front page
      </NuxtLink>
    </p>
  </div>
</template>
