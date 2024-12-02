<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-6">PrimeVue DeferredContent Showcase</h1>

    <!-- Basic DeferredContent -->
    <div class="mb-6">
      <h2 class="text-xl font-semibold mb-3">Basic Deferred Content</h2>
      <div class="card">
        <p class="mb-4">Content below will load only when it becomes visible:</p>
        <DeferredContent>
          <div class="p-4 bg-blue-100 dark:bg-blue-900 rounded">
            <h3 class="text-lg font-semibold mb-2">Lazily Loaded Content</h3>
            <p>This content is loaded only when it comes into view.</p>
          </div>
        </DeferredContent>
      </div>
    </div>

    <!-- DeferredContent with Loading Template -->
    <div class="mb-6">
      <h2 class="text-xl font-semibold mb-3">DeferredContent with Loading Indicator</h2>
      <div class="card">
        <DeferredContent>
          <template #content>
            <div class="p-6 bg-green-100 dark:bg-green-900 rounded">
              <h3 class="text-lg font-semibold mb-2">Loaded Content</h3>
              <p>This content was lazily loaded with a custom loading template.</p>
              <img 
                src="https://picsum.photos/500/300?random=1" 
                alt="Random image" 
                class="mt-4 rounded"
              />
            </div>
          </template>
          <template #loadingTemplate>
            <div class="flex items-center justify-center p-6 bg-gray-200 dark:bg-gray-700 rounded">
              <ProgressSpinner 
                strokeWidth="4" 
                animationDuration="1s"
                class="w-12 h-12"
              />
              <span class="ml-3 text-lg">Loading content...</span>
            </div>
          </template>
        </DeferredContent>
      </div>
    </div>

    <!-- Multiple DeferredContent Sections -->
    <div class="mb-6">
      <h2 class="text-xl font-semibold mb-3">Multiple Deferred Content Sections</h2>
      <div class="grid md:grid-cols-2 gap-4">
        <div v-for="n in 4" :key="n" class="card">
          <DeferredContent>
            <template #content>
              <div class="p-4 bg-purple-100 dark:bg-purple-900 rounded">
                <h3 class="text-lg font-semibold mb-2">Section {{ n }}</h3>
                <p>Lazily loaded content section {{ n }}.</p>
                <img 
                  :src="`https://picsum.photos/400/250?random=${n}`" 
                  :alt="`Random image ${n}`" 
                  class="mt-4 rounded"
                />
              </div>
            </template>
            <template #loadingTemplate>
              <div class="flex items-center justify-center p-6 bg-gray-200 dark:bg-gray-700 rounded">
                <ProgressSpinner 
                  strokeWidth="4" 
                  animationDuration="1s"
                  class="w-8 h-8"
                />
              </div>
            </template>
          </DeferredContent>
        </div>
      </div>
    </div>

    <!-- Scroll-Triggered DeferredContent -->
    <div class="mb-6">
      <h2 class="text-xl font-semibold mb-3">Scroll-Triggered Content</h2>
      <div class="space-y-4">
        <div class="h-[300px] bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
          <p>Scroll down to load more content</p>
        </div>
        
        <DeferredContent>
          <template #content>
            <div class="p-6 bg-orange-100 dark:bg-orange-900 rounded">
              <h3 class="text-lg font-semibold mb-2">Scrolled Content</h3>
              <p>This content is loaded when you scroll to this section.</p>
              <img 
                src="https://picsum.photos/600/400?random=5" 
                alt="Large random image" 
                class="mt-4 rounded"
              />
            </div>
          </template>
        </DeferredContent>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// No additional logic needed for this demo
</script>

<style scoped>
.card {
  @apply shadow-md rounded-lg p-4 mb-4;
}
</style>
