<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { onMounted, computed } from "vue";
import { useRuntimeConfig } from '#app';

const { locale, t } = useI18n();
const runtimeConfig = useRuntimeConfig();

// Get available locales from Nuxt config
const availableLocales = computed(() => {
  const locales = runtimeConfig.public.locales || [];
  return locales.map((loc: any) => ({
    code: loc.code,
    name: loc.name
  }));
});

// check for stored language on initial load.
onMounted(() => {
  const storedLanguage = localStorage.getItem("nuxt-lang");
  if (storedLanguage) {
    locale.value = storedLanguage;
  } else {
    // Set English as default if no stored language
    locale.value = 'en';
    localStorage.setItem("nuxt-lang", 'en');
  }
});

// update local storage upon language change
const toggleLocale = () => {
  localStorage.setItem("nuxt-lang", locale.value);
};

defineOptions({
  inheritAttrs: false
})
</script>

<template>
  <div class="relative">
    <select 
      v-model="locale" 
      @change="toggleLocale"
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
/* Custom styling for select dropdown */
select {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}

/* Ensure proper text contrast in options */
select option {
  @apply py-2 px-3;
  color: inherit;
  background-color: inherit;
}

/* Improve contrast on hover and focus */
select option:hover,
select option:focus {
  @apply bg-gray-100 dark:bg-gray-700;
}

/* Ensure proper RTL support */
:dir(rtl) {
  select {
    @apply pl-8 pr-3;
  }
  .absolute.right-0 {
    @apply left-0 right-auto;
  }
}

/* High contrast focus outline for accessibility */
select:focus {
  @apply ring-2 ring-offset-2 ring-blue-500 dark:ring-blue-400;
}
</style>
