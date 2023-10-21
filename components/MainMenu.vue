<template>
  <nav class="border-b border-gray-200 dark:border-gray-700">
    <ul class="flex flex-wrap -mb-px font-medium text-center">
      <li class="grow">
        <MainMenuLink to="/" :current="currentRoute === 'index'">
          <template #icon>
            <Bars3BottomLeftIcon class="w-4 h-4 mr-2" />
          </template>

          Feed
        </MainMenuLink>
      </li>
      <li class="grow-0">
        <MainMenuLink to="/contact" :current="currentRoute === 'contact'">
          <template #icon>
            <UserIcon class="w-4 h-4 mr-2" />
          </template>

          Contact
        </MainMenuLink>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import Bars3BottomLeftIcon from '@heroicons/vue/20/solid/esm/Bars3BottomLeftIcon'
import UserIcon from '@heroicons/vue/20/solid/esm/UserIcon'

const route = useRoute()
const currentRoute = computed(() => route.name)
</script>
