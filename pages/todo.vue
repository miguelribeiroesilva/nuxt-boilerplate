<script setup lang="ts">
const { t } = useI18n()
useHead({
  title: 'Todo List',
  meta: [{ name: 'description', content: 'A simple todo list using Firebase Firestore' }],
})
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <TodoList />
  </div>
</template>
