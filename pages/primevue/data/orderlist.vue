<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-6">PrimeVue OrderList Showcase</h1>

    <!-- Basic OrderList -->
    <div class="mb-6">
      <h2 class="text-xl font-semibold mb-3">Basic Product OrderList</h2>
      <div class="card">
        <OrderList 
          v-model:selection="selectedProducts" 
          :value="products" 
          listStyle="height:auto"
          dataKey="id"
        >
          <template #header>
            Product List
          </template>
          
          <template #item="slotProps">
            <div class="flex items-center p-2">
              <img 
                :src="slotProps.item.image" 
                :alt="slotProps.item.name" 
                class="w-16 h-16 object-cover mr-4 rounded" 
              />
              <div>
                <h3 class="font-bold">{{ slotProps.item.name }}</h3>
                <p class="text-sm text-gray-500">{{ slotProps.item.category }}</p>
                <p class="text-primary font-semibold">
                  {{ formatCurrency(slotProps.item.price) }}
                </p>
              </div>
            </div>
          </template>
        </OrderList>
      </div>
    </div>

    <!-- Reorderable List -->
    <div class="mb-6">
      <h2 class="text-xl font-semibold mb-3">Reorderable Task List</h2>
      <div class="card">
        <OrderList 
          v-model:value="tasks" 
          listStyle="height:auto"
          dataKey="id"
        >
          <template #header>
            Task Priority
          </template>
          
          <template #item="slotProps">
            <div class="flex items-center justify-between p-2">
              <div class="flex items-center">
                <i 
                  :class="getTaskPriorityIcon(slotProps.item.priority)" 
                  class="mr-3"
                ></i>
                <span>{{ slotProps.item.name }}</span>
              </div>
              <Badge 
                :value="slotProps.item.priority" 
                :severity="getPrioritySeverity(slotProps.item.priority)" 
              />
            </div>
          </template>
        </OrderList>
      </div>
    </div>

    <!-- Custom Styled OrderList -->
    <div class="mb-6">
      <h2 class="text-xl font-semibold mb-3">Custom Styled Team Members</h2>
      <div class="card">
        <OrderList 
          v-model:value="teamMembers" 
          listStyle="height:auto"
          dataKey="id"
        >
          <template #header>
            Team Member Ranking
          </template>
          
          <template #item="slotProps">
            <div class="flex items-center p-2">
              <Avatar 
                :image="slotProps.item.avatar" 
                size="large" 
                shape="circle" 
                class="mr-4" 
              />
              <div class="flex-grow">
                <h3 class="font-bold">{{ slotProps.item.name }}</h3>
                <p class="text-sm text-gray-500">{{ slotProps.item.role }}</p>
              </div>
              <div class="ml-auto">
                <Tag 
                  :value="`Rank ${slotProps.item.rank}`" 
                  severity="info" 
                />
              </div>
            </div>
          </template>
        </OrderList>
      </div>
    </div>

    <!-- Selection Information -->
    <div class="mt-4">
      <h3 class="text-lg font-semibold mb-2">Current Order</h3>
      <div v-if="tasks.length">
        <p>Current Task Order:</p>
        <ul class="list-disc pl-5">
          <li v-for="(task, index) in tasks" :key="task.id">
            {{ task.name }} (Priority: {{ task.priority }})
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// Currency formatter
const formatCurrency = (value: number) => {
  return value.toLocaleString('en-US', { 
    style: 'currency', 
    currency: 'USD' 
  })
}

// Products for OrderList
const products = ref([
  { 
    id: 1, 
    name: 'Wireless Headphones', 
    category: 'Electronics', 
    price: 129.99,
    image: 'https://picsum.photos/200/200?random=1'
  },
  { 
    id: 2, 
    name: 'Smart Watch', 
    category: 'Electronics', 
    price: 199.99,
    image: 'https://picsum.photos/200/200?random=2'
  },
  { 
    id: 3, 
    name: 'Bluetooth Speaker', 
    category: 'Electronics', 
    price: 79.99,
    image: 'https://picsum.photos/200/200?random=3'
  },
  { 
    id: 4, 
    name: 'Fitness Tracker', 
    category: 'Wearables', 
    price: 59.99,
    image: 'https://picsum.photos/200/200?random=4'
  }
])

// Selected products
const selectedProducts = ref([])

// Tasks for reordering
const tasks = ref([
  { id: 1, name: 'Design Review', priority: 'High' },
  { id: 2, name: 'Code Refactoring', priority: 'Medium' },
  { id: 3, name: 'Bug Fixing', priority: 'Low' },
  { id: 4, name: 'Performance Optimization', priority: 'High' }
])

// Team members for ranking
const teamMembers = ref([
  { 
    id: 1, 
    name: 'John Doe', 
    role: 'Senior Developer', 
    rank: 1,
    avatar: 'https://picsum.photos/200/200?random=5'
  },
  { 
    id: 2, 
    name: 'Jane Smith', 
    role: 'Product Manager', 
    rank: 2,
    avatar: 'https://picsum.photos/200/200?random=6'
  },
  { 
    id: 3, 
    name: 'Mike Johnson', 
    role: 'UX Designer', 
    rank: 3,
    avatar: 'https://picsum.photos/200/200?random=7'
  }
])

// Helper methods for task priority
const getTaskPriorityIcon = (priority: string) => {
  switch(priority) {
    case 'High': return 'pi pi-exclamation-triangle text-red-500'
    case 'Medium': return 'pi pi-info-circle text-yellow-500'
    case 'Low': return 'pi pi-check-circle text-green-500'
    default: return 'pi pi-circle text-gray-500'
  }
}

const getPrioritySeverity = (priority: string) => {
  switch(priority) {
    case 'High': return 'danger'
    case 'Medium': return 'warning'
    case 'Low': return 'success'
    default: return 'info'
  }
}
</script>

<style scoped>
.card {
  @apply shadow-md rounded-lg p-4;
}
</style>
