<template>
  <div class="blog-post">
    <h1 class="blog-title">
      <slot name="title"></slot>
    </h1>
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import '@/assets/css/blog.css';
</script>
