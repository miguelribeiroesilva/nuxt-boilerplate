<template>
  <Button
    :icon="isDark ? 'pi pi-sun' : 'pi pi-moon'"
    @click="toggleDark()"
    text
    rounded
    class="theme-toggle inline-flex rounded-lg border border-gray-200 bg-gray-50 p-1 text-gray-900 dark:border-gray-700 dark:bg-slate-800 dark:text-white"
    aria-label="Toggle dark mode"
  />
</template>

<script setup lang="ts">
import { useDark, useToggle } from '@vueuse/core';
import Button from 'primevue/button';

const isDark = useDark();
const toggleDark = useToggle(isDark);
</script>

<style scoped>
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
</style>
