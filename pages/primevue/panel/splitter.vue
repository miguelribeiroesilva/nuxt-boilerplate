<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-6">PrimeVue Splitter Showcase</h1>

    <!-- Basic Horizontal Splitter -->
    <div class="mb-6">
      <h2 class="text-xl font-semibold mb-3">Basic Horizontal Splitter</h2>
      <Splitter style="height: 300px">
        <SplitterPanel>
          <div class="p-4 h-full flex items-center justify-center bg-blue-50 dark:bg-blue-900">
            <p>Left Panel Content</p>
          </div>
        </SplitterPanel>
        <SplitterPanel>
          <div class="p-4 h-full flex items-center justify-center bg-green-50 dark:bg-green-900">
            <p>Right Panel Content</p>
          </div>
        </SplitterPanel>
      </Splitter>
    </div>

    <!-- Vertical Splitter -->
    <div class="mb-6">
      <h2 class="text-xl font-semibold mb-3">Vertical Splitter</h2>
      <Splitter layout="vertical" style="height: 400px">
        <SplitterPanel>
          <div class="p-4 h-full flex items-center justify-center bg-purple-50 dark:bg-purple-900">
            <p>Top Panel Content</p>
          </div>
        </SplitterPanel>
        <SplitterPanel>
          <div class="p-4 h-full flex items-center justify-center bg-pink-50 dark:bg-pink-900">
            <p>Bottom Panel Content</p>
          </div>
        </SplitterPanel>
      </Splitter>
    </div>

    <!-- Multiple Splitter Panels -->
    <div class="mb-6">
      <h2 class="text-xl font-semibold mb-3">Multiple Splitter Panels</h2>
      <Splitter style="height: 300px">
        <SplitterPanel :size="20">
          <div class="p-4 h-full flex items-center justify-center bg-red-50 dark:bg-red-900">
            <p>Left Panel</p>
          </div>
        </SplitterPanel>
        <SplitterPanel :size="60">
          <div class="p-4 h-full flex items-center justify-center bg-yellow-50 dark:bg-yellow-900">
            <p>Center Panel</p>
          </div>
        </SplitterPanel>
        <SplitterPanel :size="20">
          <div class="p-4 h-full flex items-center justify-center bg-orange-50 dark:bg-orange-900">
            <p>Right Panel</p>
          </div>
        </SplitterPanel>
      </Splitter>
    </div>

    <!-- Nested Splitters -->
    <div class="mb-6">
      <h2 class="text-xl font-semibold mb-3">Nested Splitters</h2>
      <Splitter style="height: 400px">
        <SplitterPanel :size="30">
          <div class="p-4 h-full flex items-center justify-center bg-teal-50 dark:bg-teal-900">
            <p>Left Panel</p>
          </div>
        </SplitterPanel>
        <SplitterPanel :size="70">
          <Splitter layout="vertical">
            <SplitterPanel>
              <div class="p-4 h-full flex items-center justify-center bg-indigo-50 dark:bg-indigo-900">
                <p>Top Right Panel</p>
              </div>
            </SplitterPanel>
            <SplitterPanel>
              <div class="p-4 h-full flex items-center justify-center bg-cyan-50 dark:bg-cyan-900">
                <p>Bottom Right Panel</p>
              </div>
            </SplitterPanel>
          </Splitter>
        </SplitterPanel>
      </Splitter>
    </div>

    <!-- Splitter with Complex Content -->
    <div class="mb-6">
      <h2 class="text-xl font-semibold mb-3">Splitter with Complex Content</h2>
      <Splitter style="height: 500px">
        <SplitterPanel :size="30">
          <div class="p-4 h-full overflow-auto">
            <h3 class="text-lg font-semibold mb-3">User List</h3>
            <div 
              v-for="n in 10" 
              :key="n" 
              class="flex items-center mb-3 pb-3 border-b"
            >
              <Avatar 
                :image="`https://picsum.photos/200/200?random=${n}`" 
                size="large" 
                shape="circle" 
                class="mr-3" 
              />
              <div>
                <h4 class="font-semibold">User {{ n }}</h4>
                <p class="text-gray-500">Role Description</p>
              </div>
            </div>
          </div>
        </SplitterPanel>
        <SplitterPanel :size="70">
          <div class="p-4 h-full">
            <h3 class="text-lg font-semibold mb-3">User Details</h3>
            <div class="grid md:grid-cols-2 gap-4">
              <div>
                <label class="block mb-2">Name</label>
                <InputText class="w-full" />
              </div>
              <div>
                <label class="block mb-2">Email</label>
                <InputText class="w-full" />
              </div>
              <div class="md:col-span-2">
                <label class="block mb-2">Bio</label>
                <Textarea class="w-full" rows="4" />
              </div>
            </div>
          </div>
        </SplitterPanel>
      </Splitter>
    </div>

    <!-- Disabled Splitter Bars -->
    <div class="mb-6">
      <h2 class="text-xl font-semibold mb-3">Splitter with Disabled Bars</h2>
      <Splitter style="height: 300px">
        <SplitterPanel>
          <div class="p-4 h-full flex items-center justify-center bg-lime-50 dark:bg-lime-900">
            <p>Left Panel Content</p>
          </div>
        </SplitterPanel>
        <SplitterPanel>
          <div class="p-4 h-full flex items-center justify-center bg-emerald-50 dark:bg-emerald-900">
            <p>Right Panel Content</p>
          </div>
        </SplitterPanel>
      </Splitter>
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
