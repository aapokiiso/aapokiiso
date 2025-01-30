<template>
  <div className="flex items-center p-4">
    <NuxtImg
      src="/me.jpg"
      alt="Profile picture of me"
      width="256"
      height="256"
      class="w-20 h-20 rounded-full"
    />
    <div class="ml-4 grow">
      <div class="flex items-center">
        <span class="text-2xl font-medium mb-1">Aapo Kiiso</span>
        <span class="ml-auto">
          <button class="p-2 rounded-full" @click="toggleDarkMode">
            <SunIcon class="w-4 h-4 text-current" />
            <span v-if="darkMode" class="sr-only">Switch to light theme</span>
            <span v-else class="sr-only">Switch to dark theme</span>
          </button>
        </span>
      </div>
      <div :class="['flex items-center', useProseStyles()]">
        <NuxtLink to="/">
          home
        </NuxtLink>
        <NuxtLink to="/contact" class="ml-2">
          contact
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import SunIcon from '@heroicons/vue/20/solid/esm/SunIcon'

const colorMode = useColorMode()

const darkMode = computed(() => colorMode.preference === 'dark')

const toggleDarkMode = () => {
  colorMode.preference = darkMode.value ? 'light' : 'dark'
}
</script>
