<script setup lang="ts">
const cookieControl = useCookieControl();

// Example to watch for cookie changes
watch(
  () => cookieControl.cookiesEnabledIds.value,
  (current, previous) => {
    if (
      !previous?.includes("necessary") &&
      current?.includes("necessary")
    ) {
      // Necessary cookies accepted
      console.log('Necessary cookies accepted');
    }
  },
  { deep: true }
);
</script>

<template>
  <ClientOnly>
    <div class="cookie-banner">
      <CookieControl />
    </div>
  </ClientOnly>
</template>

<style scoped>
.cookie-banner {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1000;
}
</style>
