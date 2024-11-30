<template>
  <BlogLayout>
    <template #title>{{ post?.title }}</template>
    <ContentRenderer :value="post" />
  </BlogLayout>
</template>

<script setup lang="ts">
const route = useRoute();
const { data: post } = await useAsyncData(`content-${route.path}`, () => {
  return queryContent().where({ _path: route.path }).findOne();
});

if (!post.value) {
  throw createError({ statusCode: 404, message: 'Post not found' });
}

useHead({
  title: post.value.title,
  meta: [{ name: 'description', content: post.value.description }],
});
</script>
