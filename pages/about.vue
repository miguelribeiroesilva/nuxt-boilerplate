<script setup>
const { t } = useI18n();
useHead({
  title: t("pages.about.meta.title"),
  meta: [{ name: "description", content: t("pages.about.meta.description") }],
});
useSeoMeta({
  title: t("pages.about.meta.title"),
  description: t("pages.about.meta.description"),
});
definePageMeta({
  layout: "fullscreen",
});
</script>
<template>
  <BlogLayout>
    <template #title>{{ $t("pages.about.title") }}</template>
    <ContentDoc path="/about" />
  </BlogLayout>
</template>
