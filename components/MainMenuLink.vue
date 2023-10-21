<template>
  <NuxtLink
    :to="to"
    :class="[
      'flex items-center justify-center p-4 border-b-2 group',
      current
        ? 'text-blue-600 border-blue-600 active dark:text-blue-500 dark:border-blue-500'
        : 'border-transparent hover:border-gray-300'
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
