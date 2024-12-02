<template>
  <div class="container mx-auto p-4">
    <h1 class="text-3xl font-bold mb-6">PrimeVue VirtualScroller Showcase</h1>

    <!-- Large Product Catalog -->
    <div class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">Massive Product Catalog</h2>
      <div class="card">
        <VirtualScroller 
          :items="largeProductCatalog" 
          :itemSize="100"
          :rows="10"
          class="border rounded-lg"
        >
          <template #item="{ item }">
            <div class="flex items-center p-4 border-b hover:bg-gray-50 transition-colors">
              <img 
                :src="item.image" 
                :alt="item.name" 
                class="w-24 h-24 object-cover rounded-lg mr-4"
              />
              <div class="flex-grow">
                <h3 class="font-bold text-lg">{{ item.name }}</h3>
                <p class="text-gray-600 mb-2">{{ item.category }}</p>
                <div class="flex justify-between items-center">
                  <span class="text-primary font-semibold">
                    {{ formatCurrency(item.price) }}
                  </span>
                  <div class="space-x-2">
                    <Button 
                      icon="pi pi-shopping-cart" 
                      severity="secondary" 
                      size="small"
                      outlined
                    />
                    <Button 
                      icon="pi pi-heart" 
                      severity="danger" 
                      size="small"
                      text
                    />
                  </div>
                </div>
              </div>
            </div>
          </template>
          <template #loader="{ loadOptions }">
            <div class="flex justify-center items-center p-4">
              <ProgressSpinner 
                strokeWidth="4" 
                animationDuration=".5s" 
                class="h-12 w-12"
              />
            </div>
          </template>
        </VirtualScroller>
      </div>
    </div>

    <!-- Large User Directory -->
    <div class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">Extensive User Directory</h2>
      <div class="card">
        <VirtualScroller 
          :items="largeUserDirectory" 
          :itemSize="80"
          :rows="15"
          class="border rounded-lg"
        >
          <template #item="{ item }">
            <div class="flex items-center p-4 border-b hover:bg-gray-50 transition-colors">
              <Avatar 
                :image="item.avatar" 
                size="large" 
                shape="circle" 
                class="mr-4"
              />
              <div class="flex-grow">
                <h3 class="font-bold">{{ item.name }}</h3>
                <p class="text-gray-600">{{ item.email }}</p>
              </div>
              <div>
                <Tag 
                  :value="item.role" 
                  :severity="getRoleSeverity(item.role)" 
                />
              </div>
            </div>
          </template>
          <template #loader="{ loadOptions }">
            <div class="flex justify-center items-center p-4">
              <ProgressSpinner 
                strokeWidth="4" 
                animationDuration=".5s" 
                class="h-12 w-12"
              />
            </div>
          </template>
        </VirtualScroller>
      </div>
    </div>

    <!-- Large Log Data -->
    <div>
      <h2 class="text-2xl font-semibold mb-4">System Log Viewer</h2>
      <div class="card">
        <VirtualScroller 
          :items="systemLogs" 
          :itemSize="60"
          :rows="20"
          class="border rounded-lg font-mono bg-gray-900 text-green-400"
        >
          <template #item="{ item }">
            <div 
              class="p-2 border-b border-gray-800 hover:bg-gray-800 transition-colors"
              :class="getLogLevelClass(item.level)"
            >
              <div class="flex justify-between">
                <span class="font-bold">{{ item.timestamp }}</span>
                <Tag 
                  :value="item.level" 
                  :severity="getLogLevelSeverity(item.level)" 
                  size="small"
                />
              </div>
              <p class="mt-1">{{ item.message }}</p>
            </div>
          </template>
          <template #loader="{ loadOptions }">
            <div class="flex justify-center items-center p-4 text-green-400">
              <ProgressSpinner 
                strokeWidth="4" 
                animationDuration=".5s" 
                class="h-12 w-12"
              />
            </div>
          </template>
        </VirtualScroller>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

// Utility Functions
const formatCurrency = (value: number) => {
  return value.toLocaleString('en-US', { 
    style: 'currency', 
    currency: 'USD' 
  })
}

// Generate Large Product Catalog
const generateProductCatalog = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `Product ${i + 1}`,
    category: ['Electronics', 'Clothing', 'Home', 'Sports'][i % 4],
    price: Math.random() * 500 + 50,
    image: `https://picsum.photos/200/200?random=${i}`
  }))
}

const largeProductCatalog = ref(generateProductCatalog(1000))

// Generate Large User Directory
const generateUserDirectory = (count: number) => {
  const roles = ['Admin', 'User', 'Manager', 'Developer', 'Support']
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `User ${i + 1}`,
    email: `user${i + 1}@example.com`,
    role: roles[i % roles.length],
    avatar: `https://picsum.photos/200/200?random=${i + 1000}`
  }))
}

const largeUserDirectory = ref(generateUserDirectory(5000))

// Generate System Logs
const generateSystemLogs = (count: number) => {
  const levels = ['INFO', 'WARN', 'ERROR', 'DEBUG']
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    timestamp: new Date(Date.now() - i * 60000).toISOString(),
    level: levels[i % levels.length],
    message: `Log message for entry ${i + 1} with some additional context`
  }))
}

const systemLogs = ref(generateSystemLogs(10000))

// Helper Methods for Styling
const getRoleSeverity = (role: string) => {
  switch(role) {
    case 'Admin': return 'danger'
    case 'Manager': return 'warning'
    case 'Developer': return 'info'
    case 'Support': return 'success'
    default: return 'secondary'
  }
}

const getLogLevelSeverity = (level: string) => {
  switch(level) {
    case 'ERROR': return 'danger'
    case 'WARN': return 'warning'
    case 'INFO': return 'info'
    case 'DEBUG': return 'secondary'
    default: return 'secondary'
  }
}

const getLogLevelClass = (level: string) => {
  switch(level) {
    case 'ERROR': return 'text-red-400'
    case 'WARN': return 'text-yellow-400'
    case 'INFO': return 'text-blue-400'
    case 'DEBUG': return 'text-gray-400'
    default: return 'text-green-400'
  }
}
</script>

<style scoped>
.card {
  @apply shadow-md rounded-lg p-4 bg-white;
}
</style>
