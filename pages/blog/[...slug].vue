<template>
  <BlogLayout>
    <template #title>{{ data?.title }}</template>
    <template #meta>
      <time :datetime="data?.date">{{ formatDate(data?.date) }}</time>
    </template>
    
    <ContentRenderer v-if="data" :value="data" />
  </BlogLayout>
</template>

<script setup>
const { path } = useRoute()
const { data } = await useAsyncData(`content-${path}`, () => queryContent(path).findOne())

function formatDate(date) {
  if (!date) return ''
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>
