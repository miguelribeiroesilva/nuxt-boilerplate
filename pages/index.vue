<script setup lang="ts">
const { t } = useI18n();
useHead({
  title: t("pages.index.meta.title"),
  meta: [{ name: "description", content: t("pages.index.meta.description") }],
});
useSeoMeta({
  title: t("pages.index.meta.title"),
  description: t("pages.index.meta.description"),
});
</script>
<template>

  <div class="mb-10 mt-5 flex justify-center">
    <section class="w-full max-w-3xl">
      <div
        class="relative overflow-hidden border-b border-gray-200 pb-5 text-center dark:border-gray-600"
      >
        <div class="container relative">
          <div>
            <Icon name="logos:nuxt-icon" size="5rem" />
          </div>
          <div
            class="relative flex flex-col justify-center gap-y-4 sm:h-40 sm:gap-y-5"
          >
            <p
              class="mb-[-1em] font-semibold text-slate-500 dark:text-slate-400"
            >
              {{ $t("pages.index.hero.subtitle") }}
            </p>
            <h1 class="text-4xl">
              {{ $t("pages.index.hero.title") }}
            </h1>
            <div
              class="sm:text-md font-body text-slate-500 dark:text-slate-400"
            >
              {{ $t("pages.index.hero.description") }}
            </div>
          </div>
        </div>
      </div>

      <ul
        class="mt-8 grid sm:grid-cols-2 lg:ml-12 lg:grid-cols-3 rtl:lg:ml-0 rtl:lg:mr-12"
      >
        <li class="py-2">
          <Icon
            name="heroicons:check-circle"
            class="me-2 text-3xl text-green-500 dark:text-green-300"
          />{{ $t("pages.index.features.googleFonts") }}
        </li>
        <li class="py-2">
          <Icon
            name="heroicons:check-circle"
            class="me-2 text-3xl text-green-500 dark:text-green-300"
          />{{ $t("pages.index.features.tailwindcss") }}
        </li>
        <li class="py-2">
          <Icon
            name="heroicons:check-circle"
            class="me-2 text-3xl text-green-500 dark:text-green-300"
          />{{ $t("pages.index.features.prettier") }}
        </li>
        <li class="py-2">
          <Icon
            name="heroicons:check-circle"
            class="me-2 text-3xl text-green-500 dark:text-green-300"
          />{{ $t("pages.index.features.cookies") }}
        </li>
        <li class="py-2">
          <Icon
            name="heroicons:check-circle"
            class="me-2 text-3xl text-green-500 dark:text-green-300"
          />{{ $t("pages.index.features.eslint") }}
        </li>
        <li class="py-2">
          <Icon
            name="heroicons:check-circle"
            class="me-2 text-3xl text-green-500 dark:text-green-300"
          />{{ $t("pages.index.features.darkMode") }}
        </li>
        <li class="py-2">
          <Icon
            name="heroicons:check-circle"
            class="me-2 text-3xl text-green-500 dark:text-green-300"
          />{{ $t("pages.index.features.i18n") }}
        </li>
        <li class="py-2">
          <Icon
            name="heroicons:check-circle"
            class="me-2 text-3xl text-green-500 dark:text-green-300"
          />{{ $t("pages.index.features.iconify") }}
        </li>
        <li class="py-2">
          <Icon
            name="heroicons:check-circle"
            class="me-2 text-3xl text-green-500 dark:text-green-300"
          />{{ $t("pages.index.features.typescript") }}
        </li>
        <li class="py-2">
          <Icon
            name="heroicons:check-circle"
            class="me-2 text-3xl text-green-500 dark:text-green-300"
          />{{ $t("pages.index.features.postcss") }}
        </li>
        <li class="py-2">
          <Icon
            name="heroicons:check-circle"
            class="me-2 text-3xl text-green-500 dark:text-green-300"
          />{{ $t("pages.index.features.deviceDetection") }}
        </li>
        <li class="py-2">
          <Icon
            name="heroicons:check-circle"
            class="me-2 text-3xl text-green-500 dark:text-green-300"
          />{{ $t("pages.index.features.pinia") }}
        </li>
        <li class="py-2">
          <Icon
            name="heroicons:check-circle"
            class="me-2 text-3xl text-green-500 dark:text-green-300"
          />{{ $t("pages.index.features.content") }}
        </li>
        <li class="py-2">
          <Icon
            name="heroicons:check-circle"
            class="me-2 text-3xl text-green-500 dark:text-green-300"
          />{{ $t("pages.index.features.colorMode") }}
        </li>
        <li class="py-2">
          <Icon
            name="heroicons:check-circle"
            class="me-2 text-3xl text-green-500 dark:text-green-300"
          />{{ $t("pages.index.features.lighthouse") }}
        </li>
      </ul>
    </section>
  </div>
</template>
