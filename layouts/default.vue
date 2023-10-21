<template>
  <main class="flex min-h-screen justify-center">
    <div class="max-w-lg w-full">
      <header>
        <div class="flex justify-center p-4">
          <HeroAvatar />
        </div>

        <MainMenu />
      </header>

      <slot />
    </div>
  </main>
</template>
