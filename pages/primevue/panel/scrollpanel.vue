<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-6">PrimeVue ScrollPanel Showcase</h1>

    <!-- Basic ScrollPanel -->
    <div class="mb-6">
      <h2 class="text-xl font-semibold mb-3">Basic ScrollPanel</h2>
      <ScrollPanel style="width: 100%; height: 200px;">
        <div class="pr-4">
          <h3 class="font-semibold mb-2">Lorem Ipsum Content</h3>
          <p v-for="n in 10" :key="n" class="mb-2">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </p>
        </div>
      </ScrollPanel>
    </div>

    <!-- Styled ScrollPanel -->
    <div class="mb-6">
      <h2 class="text-xl font-semibold mb-3">Styled ScrollPanel</h2>
      <ScrollPanel 
        style="width: 100%; height: 250px;" 
        class="custom-scrollpanel"
      >
        <div class="pr-4">
          <h3 class="font-semibold mb-3">Code Snippet</h3>
          <pre class="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg text-sm">
<code>function exampleFunction() {
  const message = 'Hello, ScrollPanel!';
  console.log(message);
  
  return {
    greeting: message,
    timestamp: new Date()
  };
}

// This is a long code snippet to demonstrate scrolling
const longArray = Array.from({length: 50}, (_, i) => `Item ${i + 1}`);
          </code>
          </pre>
        </div>
      </ScrollPanel>
    </div>

    <!-- Multiple Content Sections -->
    <div class="mb-6">
      <h2 class="text-xl font-semibold mb-3">Multiple Content Sections</h2>
      <div class="grid md:grid-cols-2 gap-4">
        <ScrollPanel style="width: 100%; height: 300px;">
          <div class="pr-4">
            <h3 class="font-semibold mb-3">Team Members</h3>
            <div 
              v-for="n in 15" 
              :key="n" 
              class="flex items-center mb-3 pb-3 border-b last:border-b-0"
            >
              <Avatar 
                :image="`https://picsum.photos/200/200?random=${n}`" 
                size="large" 
                shape="circle" 
                class="mr-3" 
              />
              <div>
                <h4 class="font-semibold">Team Member {{ n }}</h4>
                <p class="text-gray-500">Role Description</p>
              </div>
            </div>
          </div>
        </ScrollPanel>

        <ScrollPanel style="width: 100%; height: 300px;">
          <div class="pr-4">
            <h3 class="font-semibold mb-3">Project Updates</h3>
            <div 
              v-for="n in 20" 
              :key="n" 
              class="mb-3 pb-3 border-b last:border-b-0"
            >
              <div class="flex justify-between">
                <span class="font-semibold">Project Update {{ n }}</span>
                <span class="text-gray-500">{{ new Date().toLocaleDateString() }}</span>
              </div>
              <p>Detailed update description for project {{ n }}.</p>
            </div>
          </div>
        </ScrollPanel>
      </div>
    </div>

    <!-- Horizontal ScrollPanel -->
    <div class="mb-6">
      <h2 class="text-xl font-semibold mb-3">Horizontal ScrollPanel</h2>
      <ScrollPanel style="width: 100%; height: 150px;">
        <div class="flex space-x-4 pr-4">
          <div 
            v-for="n in 10" 
            :key="n" 
            class="flex-shrink-0 w-48 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg"
          >
            <h4 class="font-semibold mb-2">Card {{ n }}</h4>
            <p>Horizontal scrolling content card.</p>
          </div>
        </div>
      </ScrollPanel>
    </div>

    <!-- Complex Content with ScrollPanel -->
    <div class="mb-6">
      <h2 class="text-xl font-semibold mb-3">Complex Content with ScrollPanel</h2>
      <ScrollPanel style="width: 100%; height: 400px;">
        <div class="pr-4">
          <h3 class="font-semibold text-lg mb-4">Comprehensive Report</h3>
          
          <div class="mb-4">
            <h4 class="font-semibold mb-2">Performance Metrics</h4>
            <div class="grid md:grid-cols-2 gap-3">
              <div class="bg-blue-50 dark:bg-blue-900 p-3 rounded">
                <span class="font-semibold">Total Users</span>
                <ProgressBar :value="75" class="mt-2" />
              </div>
              <div class="bg-green-50 dark:bg-green-900 p-3 rounded">
                <span class="font-semibold">Conversion Rate</span>
                <ProgressBar :value="60" class="mt-2" />
              </div>
            </div>
          </div>

          <Divider />

          <div>
            <h4 class="font-semibold mb-3">Detailed Logs</h4>
            <div 
              v-for="n in 30" 
              :key="n" 
              class="mb-2 p-2 bg-gray-100 dark:bg-gray-700 rounded"
            >
              <div class="flex justify-between">
                <span>Log Entry {{ n }}</span>
                <span class="text-gray-500">{{ new Date().toLocaleTimeString() }}</span>
              </div>
            </div>
          </div>
        </div>
      </ScrollPanel>
    </div>
  </div>
</template>

<script setup lang="ts">
// No additional logic needed for this demo
</script>

<style scoped>
/* Custom scrollbar styling */
.custom-scrollpanel :deep(.p-scrollpanel-bar) {
  @apply bg-primary/50 rounded-full;
}
</style>
