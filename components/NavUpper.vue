<template>
  <nav class="border-b border-gray-200 dark:border-gray-700">
    <div class="flex items-center justify-between px-4 py-2">
      <div class="flex items-center space-x-4">
        <NuxtLink to="/" class="flex items-center">
          <img
            src="~/assets/img/ai-nuxt-logo.webp"
            alt="Nuxt Logo"
            class="w-8 h-8 mr-5"
          />
          <span class="font-bold text-xl">{{ $t("site.name") }}</span>
        </NuxtLink>
      </div>

      <div class="flex items-center space-x-4">
        <ClientOnly>
          <ThemeSwitcher />
        </ClientOnly>

        <ClientOnly>
          <LanguageSelector />
        </ClientOnly>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, onMounted } from '#imports'

const mounted = ref(false);

onMounted(() => {
  mounted.value = true;
});
</script>

<style scoped>
</style>
