<template>
  <div class="container mx-auto p-4">
    <h1 class="text-3xl font-bold mb-6">PrimeVue PickList Showcase</h1>

    <!-- Team Resource Allocation -->
    <div class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">Team Resource Allocation</h2>
      <div class="card">
        <PickList 
          v-model:source="availableResources" 
          v-model:target="allocatedResources"
          :showSourceFilter="true"
          :showTargetFilter="true"
          filterBy="name"
          dataKey="id"
        >
          <template #item="slotProps">
            <div class="flex items-center p-2">
              <Avatar 
                :image="slotProps.item.avatar" 
                size="large" 
                shape="circle" 
                class="mr-4" 
              />
              <div>
                <h3 class="font-bold">{{ slotProps.item.name }}</h3>
                <p class="text-sm text-gray-500">{{ slotProps.item.role }}</p>
              </div>
              <div class="ml-auto">
                <Tag 
                  :value="slotProps.item.skill" 
                  :severity="getSkillSeverity(slotProps.item.skill)" 
                />
              </div>
            </div>
          </template>
        </PickList>

        <!-- Resource Allocation Summary -->
        <div class="mt-4 p-4 bg-gray-100 rounded-lg">
          <h3 class="font-semibold mb-2">Resource Allocation Summary</h3>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <h4 class="font-medium">Available Resources</h4>
              <ul class="list-disc pl-5">
                <li v-for="resource in availableResources" :key="resource.id">
                  {{ resource.name }} ({{ resource.skill }})
                </li>
              </ul>
            </div>
            <div>
              <h4 class="font-medium">Allocated Resources</h4>
              <ul class="list-disc pl-5">
                <li v-for="resource in allocatedResources" :key="resource.id">
                  {{ resource.name }} ({{ resource.skill }})
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Product Inventory Management -->
    <div class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">Product Inventory Management</h2>
      <div class="card">
        <PickList 
          v-model:source="availableProducts" 
          v-model:target="selectedProducts"
          :showSourceFilter="true"
          :showTargetFilter="true"
          filterBy="name"
          dataKey="id"
        >
          <template #item="slotProps">
            <div class="flex items-center p-2">
              <img 
                :src="slotProps.item.image" 
                :alt="slotProps.item.name" 
                class="w-16 h-16 object-cover rounded mr-4" 
              />
              <div class="flex-grow">
                <h3 class="font-bold">{{ slotProps.item.name }}</h3>
                <p class="text-sm text-gray-500">{{ slotProps.item.category }}</p>
              </div>
              <div>
                <span class="font-semibold text-primary">
                  {{ formatCurrency(slotProps.item.price) }}
                </span>
              </div>
            </div>
          </template>
        </PickList>

        <!-- Inventory Summary -->
        <div class="mt-4 p-4 bg-gray-100 rounded-lg">
          <h3 class="font-semibold mb-2">Inventory Summary</h3>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <h4 class="font-medium">Available Products</h4>
              <p>Total: {{ availableProducts.length }}</p>
              <p>Total Value: {{ calculateTotalValue(availableProducts) }}</p>
            </div>
            <div>
              <h4 class="font-medium">Selected Products</h4>
              <p>Total: {{ selectedProducts.length }}</p>
              <p>Total Value: {{ calculateTotalValue(selectedProducts) }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Event Schedule Management -->
    <div>
      <h2 class="text-2xl font-semibold mb-4">Event Schedule Management</h2>
      <div class="card">
        <PickList 
          v-model:source="availableEvents" 
          v-model:target="scheduledEvents"
          :showSourceFilter="true"
          :showTargetFilter="true"
          filterBy="name"
          dataKey="id"
        >
          <template #item="slotProps">
            <div class="flex items-center p-2">
              <div class="mr-4">
                <i 
                  :class="getEventTypeIcon(slotProps.item.type)" 
                  class="text-2xl"
                ></i>
              </div>
              <div class="flex-grow">
                <h3 class="font-bold">{{ slotProps.item.name }}</h3>
                <p class="text-sm text-gray-500">
                  {{ slotProps.item.date }} | {{ slotProps.item.time }}
                </p>
              </div>
              <div>
                <Tag 
                  :value="slotProps.item.type" 
                  :severity="getEventTypeSeverity(slotProps.item.type)" 
                />
              </div>
            </div>
          </template>
        </PickList>

        <!-- Event Schedule Summary -->
        <div class="mt-4 p-4 bg-gray-100 rounded-lg">
          <h3 class="font-semibold mb-2">Event Schedule Summary</h3>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <h4 class="font-medium">Available Events</h4>
              <ul class="list-disc pl-5">
                <li v-for="event in availableEvents" :key="event.id">
                  {{ event.name }} ({{ event.type }})
                </li>
              </ul>
            </div>
            <div>
              <h4 class="font-medium">Scheduled Events</h4>
              <ul class="list-disc pl-5">
                <li v-for="event in scheduledEvents" :key="event.id">
                  {{ event.name }} ({{ event.type }})
                </li>
              </ul>
            </div>
          </div>
        </div>
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

// Team Resource Allocation
const availableResources = ref([
  { 
    id: 1, 
    name: 'John Doe', 
    role: 'Frontend Developer', 
    skill: 'React', 
    avatar: 'https://picsum.photos/200/200?random=1' 
  },
  { 
    id: 2, 
    name: 'Jane Smith', 
    role: 'Backend Developer', 
    skill: 'Node.js', 
    avatar: 'https://picsum.photos/200/200?random=2' 
  },
  { 
    id: 3, 
    name: 'Mike Johnson', 
    role: 'DevOps Engineer', 
    skill: 'Kubernetes', 
    avatar: 'https://picsum.photos/200/200?random=3' 
  },
  { 
    id: 4, 
    name: 'Emily Brown', 
    role: 'UX Designer', 
    skill: 'Figma', 
    avatar: 'https://picsum.photos/200/200?random=4' 
  }
])

const allocatedResources = ref([])

// Product Inventory Management
const availableProducts = ref([
  { 
    id: 1, 
    name: 'Wireless Headphones', 
    category: 'Electronics', 
    price: 129.99, 
    image: 'https://picsum.photos/200/200?random=5' 
  },
  { 
    id: 2, 
    name: 'Smart Watch', 
    category: 'Wearables', 
    price: 199.99, 
    image: 'https://picsum.photos/200/200?random=6' 
  },
  { 
    id: 3, 
    name: 'Bluetooth Speaker', 
    category: 'Audio', 
    price: 79.99, 
    image: 'https://picsum.photos/200/200?random=7' 
  },
  { 
    id: 4, 
    name: 'Fitness Tracker', 
    category: 'Health', 
    price: 89.99, 
    image: 'https://picsum.photos/200/200?random=8' 
  }
])

const selectedProducts = ref([])

// Event Schedule Management
const availableEvents = ref([
  { 
    id: 1, 
    name: 'Tech Conference', 
    type: 'Conference', 
    date: '2023-09-15', 
    time: '09:00 AM' 
  },
  { 
    id: 2, 
    name: 'Hackathon', 
    type: 'Workshop', 
    date: '2023-10-20', 
    time: '10:00 AM' 
  },
  { 
    id: 3, 
    name: 'Startup Pitch', 
    type: 'Networking', 
    date: '2023-11-05', 
    time: '02:00 PM' 
  },
  { 
    id: 4, 
    name: 'AI Seminar', 
    type: 'Seminar', 
    date: '2023-12-10', 
    time: '11:00 AM' 
  }
])

const scheduledEvents = ref([])

// Helper methods
const getSkillSeverity = (skill: string) => {
  switch(skill) {
    case 'React': return 'info'
    case 'Node.js': return 'success'
    case 'Kubernetes': return 'warning'
    case 'Figma': return 'primary'
    default: return 'secondary'
  }
}

const calculateTotalValue = (products: any[]) => {
  return formatCurrency(
    products.reduce((total, product) => total + product.price, 0)
  )
}

const getEventTypeIcon = (type: string) => {
  switch(type) {
    case 'Conference': return 'pi pi-users text-blue-500'
    case 'Workshop': return 'pi pi-desktop text-green-500'
    case 'Networking': return 'pi pi-share-alt text-purple-500'
    case 'Seminar': return 'pi pi-book text-orange-500'
    default: return 'pi pi-calendar text-gray-500'
  }
}

const getEventTypeSeverity = (type: string) => {
  switch(type) {
    case 'Conference': return 'info'
    case 'Workshop': return 'success'
    case 'Networking': return 'warning'
    case 'Seminar': return 'primary'
    default: return 'secondary'
  }
}
</script>

<style scoped>
.card {
  @apply shadow-md rounded-lg p-4 bg-white;
}
</style>
