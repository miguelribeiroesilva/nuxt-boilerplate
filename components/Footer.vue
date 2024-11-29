<template>
  <footer class="dark:text-300 py-2 px-4 text-xs text-gray-600 dark:bg-slate-900">
    <div class="container mx-auto flex justify-between items-center">
      <div class="copyright">
        &copy; <a href="https://yesmkt.com" target="_blank" rel="noopener noreferrer" class="hover:text-primary">YES
          Marketing</a> 2024
      </div>
      <ClientOnly>
        <div v-if="currentQuote" class="quote italic text-gray-800 dark:text-gray-300">
          "{{ currentQuote.quote }}" <span class="font-medium">- {{ currentQuote.author }}</span>
        </div>
      </ClientOnly>
    </div>
  </footer>
</template>

<script setup lang="ts">
const { currentQuote } = useAiQuotes();
</script>
