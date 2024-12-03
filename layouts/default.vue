<script setup lang="ts">
useLocaleHead({
  addSeoAttributes: true,
});
const { locale, t } = useI18n();
useHead({
  htmlAttrs: {
    lang: locale,
    dir: computed(() => {
      return t("locale.dir") as "ltr" | "rtl" | "auto";
    }),
  },
  titleTemplate(title) {
    return title ? `${title} - ${t("site.name")}` : `${t("site.name")}`;
  },
});


</script>
<template>
  <div class="min-h-screen bg-slate-100 text-slate-900 dark:bg-slate-900 dark:text-white content">
    <div class="container mx-auto max-w-screen-lg px-8">
      <header class="mb-1">
        <NavUpper />
        <NavLower />
      </header>
      <div class="rounded-2xl bg-white px-6 py-2 shadow-xl dark:bg-slate-800">
        <slot />
      </div>
      <Footer />
      <Toast />
    </div>
  </div>
</template>
<style lang="postcss">
ul {
  list-style-type: none !important;
  padding-left: 0 !important;
  margin: 0 !important;
}
</style>
