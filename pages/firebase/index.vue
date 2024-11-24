<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="mb-6 text-2xl font-bold">Firebase Test Page</h1>
    <FirebaseTest />
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'Firebase Test',
  meta: [{ name: 'description', content: 'Testing Firebase integration' }],
})
</script>
