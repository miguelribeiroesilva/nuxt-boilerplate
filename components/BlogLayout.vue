<template>
  <div class="max-w-4xl mx-auto px-4 py-8">
    <header class="mb-8">
      <h1 class="text-4xl font-bold text-gray-900 dark:text-white">
        <slot name="title" />
      </h1>
      <div class="mt-2 text-gray-600 dark:text-gray-400">
        <slot name="meta" />
      </div>
    </header>
    <main class="prose dark:prose-invert max-w-none">
      <slot />
    </main>
  </div>
</template>
