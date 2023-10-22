<template>
  <NuxtLink
    :to="to"
    :class="[
      'flex items-center justify-center p-4 border-b-2 group',
      current
        ? 'border-black dark:border-white'
        : 'border-transparent hover:border-gray-400'
    ]"
  >
    <slot name="icon" />
    <slot />
  </NuxtLink>
</template>

<script setup lang="ts">
interface Props {
  to: NuxtLink,
  current: boolean
}

withDefaults(defineProps<Props>(), {
  current: false,
})
</script>
