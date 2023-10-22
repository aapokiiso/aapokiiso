<template>
  <NuxtImg
    :src="src"
    :alt="alt"
    :width="width"
    :height="height"
    :modifiers="modifiers"
  />
</template>

<script setup lang="ts">
// Overwritten to use NuxtImg.
// Original source:
// https://github.com/nuxt-modules/mdc/blob/main/src/runtime/components/prose/ProseImg.vue

import { defu } from 'defu'

interface Props {
  src: string,
  alt?: string,
  width?: number,
  height?: number,
  modifiers?: Record<string, any>
}

withDefaults(defineProps<Props>(), {
  alt: '',
  width: undefined,
  height: undefined,
  modifiers: props => defu(props.modifiers, { format: 'webp' }),
})
</script>
