<template>
  <div class="flex min-h-screen justify-center">
    <div class="max-w-lg w-full">
      <header>
        <div class="flex justify-center p-4">
          <HeroAvatar />
        </div>

        <MainMenu />
      </header>

      <main>
        <slot />
      </main>
    </div>
  </div>
</template>
