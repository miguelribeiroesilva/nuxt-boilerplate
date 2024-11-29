<template>
  <div class="max-w-4xl mx-auto px-4 py-2">
    <header class="mb-8">
      <Button severity="info" disabled>
        <slot name="title" />
      </Button>
      <div class="mt-2 text-gray-600 dark:text-gray-400">
        <slot name="meta" />
      </div>
    </header>
    <main class="prose dark:prose-invert max-w-none">
      <slot />
    </main>
  </div>
</template>
