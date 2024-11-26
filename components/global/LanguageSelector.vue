<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useRuntimeConfig } from '#app'

const { locale } = useI18n()
const runtimeConfig = useRuntimeConfig()

const availableLocales = computed(() => {
  console.log('availableLocales', runtimeConfig.public.locales)
  return runtimeConfig.public.locales || []
})

// Initialize from localStorage if available
const storedLang = localStorage.getItem('nuxt-lang')
if (storedLang) {
  console.log('storedLang', storedLang)
  locale.value = storedLang
}

// Update localStorage when language changes
const updateLocale = (newLocale: string) => {
  console.log('updateLocale', newLocale)
  localStorage.setItem('nuxt-lang', newLocale)
}

defineOptions({
  inheritAttrs: false
})
</script>

<template>
  <div class="relative">
    <select
      :value="locale"
      @change="e => { locale = e.target.value; updateLocale(e.target.value) }"
      class="appearance-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md py-2 pl-3 pr-8 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 transition-colors"
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
