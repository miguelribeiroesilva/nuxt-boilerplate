<template>
  <BlogLayout>
    <template #title>Blog Posts</template>
    <template #meta>Latest articles and updates</template>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <article v-for="article in articles" :key="article._path" class="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow">
        <NuxtLink :to="article._path" class="no-underline">
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {{ article.title }}
          </h2>
          <p class="text-gray-600 dark:text-gray-400">
            {{ article.description }}
          </p>
        </NuxtLink>
      </article>
    </div>
  </BlogLayout>
</template>

<script setup>
const { data: articles } = await useAsyncData('articles', () => queryContent('blog').find())
definePageMeta({
  layout: "fullscreen",
});
</script>
