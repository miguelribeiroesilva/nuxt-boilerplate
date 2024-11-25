<template>
  <nav class="flex flex-row justify-between pb-5 pt-10">
    <NuxtLink to="/" aria-label="Home" class="min-w-fit">
      <nuxt-img
        class="h-6 dark:hidden sm:ml-3 lg:ml-0"
        src="nuxt/full-logo-green-dark.svg"
        densities="x1 x2"
        alt="nuxt-logo"
        style="height: 24px; width: 99px"
      />
      <nuxt-img
        class="hidden h-6 dark:block"
        src="nuxt/full-logo-green-light.svg"
        densities="x1 x2"
        alt="nuxt-logo"
        style="height: 24px; width: 99px"
      />
    </NuxtLink>
    <div
      class="flex flex-col space-x-3 space-y-4 sm:flex-row sm:space-y-0 rtl:space-x-reverse"
    >
      <ThemeSwitcher
        class="inline-flex rounded-lg border border-gray-200 bg-gray-50 p-2.5 text-sm text-gray-900 dark:border-gray-700 dark:bg-slate-800 dark:text-white"
      />

      <LanguageSelector
        class="inline-flex rounded-lg border border-gray-200 bg-gray-50 p-2.5 text-sm text-gray-900 dark:border-gray-700 dark:bg-slate-800 dark:text-white"
      />
    </div>
  </nav>
</template>
