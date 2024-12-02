<template>
  <div class="p-6 space-y-6">
    <div class="card">
      <h2 class="text-xl font-semibold mb-4 dark:text-white">Button Variants</h2>
      <div class="flex flex-wrap gap-4 items-center">
        <Button label="Default" />
        <Button label="Primary" severity="primary" />
        <Button label="Secondary" severity="secondary" />
        <Button label="Success" severity="success" />
        <Button label="Info" severity="info" />
        <Button label="Warning" severity="warning" />
        <Button label="Help" severity="help" />
        <Button label="Danger" severity="danger" />
      </div>
    </div>

    <div class="card">
      <h2 class="text-xl font-semibold mb-4 dark:text-white">Button Sizes</h2>
      <div class="flex flex-wrap gap-4 items-center">
        <Button label="Small" size="small" />
        <Button label="Normal" />
        <Button label="Large" size="large" />
      </div>
    </div>

    <div class="card">
      <h2 class="text-xl font-semibold mb-4 dark:text-white">Button States</h2>
      <div class="flex flex-wrap gap-4 items-center">
        <Button label="Disabled" disabled />
        <Button label="Loading" loading />
        <Button icon="pi pi-check" label="Icon" />
        <Button icon="pi pi-check" aria-label="Submit" />
      </div>
    </div>

    <div class="card">
      <h2 class="text-xl font-semibold mb-4 dark:text-white">Button Styles</h2>
      <div class="flex flex-wrap gap-4 items-center">
        <Button label="Outlined" outlined />
        <Button label="Raised" raised />
        <Button label="Rounded" rounded />
        <Button label="Text" text />
      </div>
    </div>
  </div>
</template>

<script setup>
import Button from 'primevue/button'
</script>

<style scoped>
.card {
  @apply bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-6;
}
</style>
