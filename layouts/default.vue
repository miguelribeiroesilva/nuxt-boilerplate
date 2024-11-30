<script setup lang="ts">
useLocaleHead({
  addSeoAttributes: true,
});
</script>
<template>
  <div class="min-h-screen bg-slate-100 text-slate-900 dark:bg-slate-900 dark:text-white">
    <div class="container mx-auto max-w-screen-lg px-8">
      <header class="mb-1">
        <NavUpper />
        <NavLower />
      </header>
      <div class="rounded-2xl bg-white px-6 py-2 shadow-xl dark:bg-slate-800">
        <slot />
      </div>
      <Footer />
    </div>
  </div>
</template>
<style lang="postcss">
ul {
  list-style-type: none !important;
  padding-left: 0 !important;
  margin: 0 !important;
}

</style>
