<script setup lang="ts">
// Define a union type for allowed locales
type AllowedLocale = 'en' | 'fr' | 'ar'

const { locale } = useI18n()
const runtimeConfig = useRuntimeConfig()

const availableLocales = computed(() => {
  return runtimeConfig.public.locales || []
})

// Initialize from localStorage if available
const storedLang = localStorage.getItem('nuxt-lang') as AllowedLocale | null
if (storedLang && ['en', 'fr', 'ar'].includes(storedLang)) {
  locale.value = storedLang
}

// Update localStorage when language changes
const updateLocale = (newLocale: AllowedLocale) => {
  localStorage.setItem('nuxt-lang', newLocale)
}

defineOptions({
  inheritAttrs: false
})
</script>

<template>
  <div class="relative inline-flex rounded-lg border border-gray-200 bg-gray-50 p-1 text-sm text-gray-900 dark:border-gray-700 dark:bg-slate-800 dark:text-white">
    <select
      :value="locale.value"
      @change="e => { 
        const newLocale = (e.target as HTMLSelectElement).value as AllowedLocale
        locale.value = newLocale
        updateLocale(newLocale) 
      }"
      class="appearance-none bg-transparent border-none py-1 pl-3 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 transition-colors"
    >
      <option
        v-for="loc in availableLocales"
        :key="loc.code"
        :value="loc.code"
        class="py-2 px-3 text-gray-900 dark:text-white bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
      >
        {{ loc.name }}
      </option>
    </select>
    <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500 dark:text-gray-400">
      <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  </div>
</template>

<style scoped>
select {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}

:dir(rtl) {
  select {
    @apply pl-8 pr-3;
  }
  .absolute.right-0 {
    @apply left-0 right-auto;
  }
}
</style>
