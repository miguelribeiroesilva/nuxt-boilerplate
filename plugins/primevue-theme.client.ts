import { defineNuxtPlugin } from '#app';

export default defineNuxtPlugin((nuxtApp) => {
  const colorMode = useColorMode();

  // Watch for color mode changes
  watch(() => colorMode.value, (newMode) => {
    // Remove existing theme
    document.querySelectorAll('link[data-primevue-theme]').forEach(el => el.remove());

    // Add new theme
    const theme = newMode === 'dark' ? 'lara-dark-green' : 'lara-light-green';
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `/themes/${theme}/theme.css`;
    link.setAttribute('data-primevue-theme', theme);
    document.head.appendChild(link);
  }, { immediate: true });
});
