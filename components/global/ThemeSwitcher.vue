<template>
  <Button
    :icon="isDark ? 'pi pi-sun' : 'pi pi-moon'"
    @click="toggleDark()"
    text
    rounded
    class="inline-flex shadow-none border-0 outline-0 dark:bg-gray-900 dark:text-white bg-white text-gray-900"
    aria-label="Toggle dark mode"
  />
</template>

<script setup lang="ts">
import { useDark, useToggle } from '@vueuse/core';
import Button from 'primevue/button';

const isDark = useDark();
const toggleDark = useToggle(isDark);
</script>

<!-- <style scoped>
.theme-toggle {
  width: 34px;
  height: 34px;
  padding: 0.25rem;

  &:hover {
    background-color: var(--surface-200);
  }

  :deep(.p-button-icon) {
    font-size: 1rem;
    color: #4B5563;
  }
}

:deep(.dark) {
  .theme-toggle:hover {
    background-color: var(--surface-700);
  }

  .theme-toggle :deep(.p-button-icon) {
    color: #FFFFFF;
  }
}
</style> -->
