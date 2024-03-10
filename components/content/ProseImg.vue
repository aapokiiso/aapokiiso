<template>
  <NuxtPicture
    :src="src"
    :alt="alt"
    :width="width"
    :height="height"
    :densities="densities"
    :format="format"
    :modifiers="modifiers"
    :sizes="`${width}px`"
  />
</template>

<script setup lang="ts">
// Overwritten to use NuxtImg.
// Original source:
// https://github.com/nuxt-modules/mdc/blob/main/src/runtime/components/prose/ProseImg.vue

interface Props {
  src: string,
  alt?: string,
  width?: number|string,
  height?: number|string,
  densities?: string,
  format?: string,
  modifiers?: Record<string, any>
}

const props = withDefaults(defineProps<Props>(), {
  alt: '',
  width: 576, // xl width in Tailwind
  height: 432, // 4:3 aspect ratio
  densities: 'x1 x2',
  format: 'webp,jpg',
  modifiers: undefined,
})

const width = computed(
  () => typeof props.width === 'string'
    ? parseInt(props.width)
    : props.width,
)

const height = computed(
  () => typeof props.height === 'string'
    ? parseInt(props.height)
    : props.height,
)
</script>
