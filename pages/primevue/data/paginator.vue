<template>
  <div class="container mx-auto p-4">
    <h1 class="text-3xl font-bold mb-6">PrimeVue Paginator Showcase</h1>

    <!-- Basic Paginator with Products -->
    <div class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">Basic Product Pagination</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div 
          v-for="product in paginatedProducts" 
          :key="product.id" 
          class="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition-shadow"
        >
          <img 
            :src="product.image" 
            :alt="product.name" 
            class="w-full h-48 object-cover rounded-t-lg mb-4"
          />
          <div class="px-2">
            <h3 class="font-bold text-lg mb-2">{{ product.name }}</h3>
            <p class="text-gray-600 mb-2">{{ product.category }}</p>
            <div class="flex justify-between items-center">
              <span class="text-primary font-semibold">
                {{ formatCurrency(product.price) }}
              </span>
              <Button 
                icon="pi pi-shopping-cart" 
                severity="secondary" 
                size="small"
              />
            </div>
          </div>
        </div>
      </div>

      <Paginator 
        :rows="productsPerPage" 
        :totalRecords="allProducts.length"
        :first="productFirstPage"
        @page="onProductPageChange"
        class="mt-4"
      >
        <template #start>
          <span class="text-gray-600">
            Showing {{ productStartIndex }} to {{ productEndIndex }} of {{ allProducts.length }} products
          </span>
        </template>
        <template #end>
          <div class="flex items-center space-x-2">
            <span>Products per page:</span>
            <Dropdown 
              v-model="productsPerPage" 
              :options="[6, 9, 12, 15]" 
              placeholder="Select Page Size"
              class="w-32"
            />
          </div>
        </template>
      </Paginator>
    </div>

    <!-- Advanced Paginator with Custom Template -->
    <div class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">Advanced User Management</h2>
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-gray-100">
              <th class="p-3">ID</th>
              <th class="p-3">Name</th>
              <th class="p-3">Email</th>
              <th class="p-3">Role</th>
              <th class="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr 
              v-for="user in paginatedUsers" 
              :key="user.id" 
              class="border-b hover:bg-gray-50 transition-colors"
            >
              <td class="p-3">{{ user.id }}</td>
              <td class="p-3">
                <div class="flex items-center">
                  <Avatar 
                    :image="user.avatar" 
                    size="large" 
                    shape="circle" 
                    class="mr-3" 
                  />
                  {{ user.name }}
                </div>
              </td>
              <td class="p-3">{{ user.email }}</td>
              <td class="p-3">
                <Tag 
                  :value="user.role" 
                  :severity="getRoleSeverity(user.role)" 
                />
              </td>
              <td class="p-3">
                <div class="flex space-x-2">
                  <Button 
                    icon="pi pi-pencil" 
                    severity="info" 
                    size="small" 
                    outlined
                  />
                  <Button 
                    icon="pi pi-trash" 
                    severity="danger" 
                    size="small" 
                    outlined
                  />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <Paginator 
        :rows="usersPerPage" 
        :totalRecords="allUsers.length"
        :first="userFirstPage"
        @page="onUserPageChange"
        class="mt-4"
      >
        <template #left>
          <Button 
            icon="pi pi-filter" 
            severity="secondary" 
            text 
            label="Filter" 
            class="mr-2"
          />
          <Button 
            icon="pi pi-download" 
            severity="secondary" 
            text 
            label="Export" 
          />
        </template>
        <template #right>
          <span class="text-gray-600 mr-4">
            Total Users: {{ allUsers.length }}
          </span>
        </template>
      </Paginator>
    </div>

    <!-- Compact Paginator with Dynamic Content -->
    <div>
      <h2 class="text-2xl font-semibold mb-4">Compact Blog Posts</h2>
      <div class="space-y-4 mb-4">
        <div 
          v-for="post in paginatedPosts" 
          :key="post.id" 
          class="bg-white shadow-md rounded-lg p-4"
        >
          <h3 class="font-bold text-lg mb-2">{{ post.title }}</h3>
          <p class="text-gray-600 mb-2">{{ post.excerpt }}</p>
          <div class="flex justify-between items-center">
            <div class="flex items-center space-x-2">
              <Avatar 
                :image="post.authorAvatar" 
                size="small" 
                shape="circle" 
              />
              <span class="text-sm text-gray-500">{{ post.author }}</span>
            </div>
            <Button 
              label="Read More" 
              severity="secondary" 
              size="small" 
              outlined
            />
          </div>
        </div>
      </div>

      <Paginator 
        :rows="postsPerPage" 
        :totalRecords="allPosts.length"
        :first="postFirstPage"
        @page="onPostPageChange"
        template="FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

// Currency formatter
const formatCurrency = (value: number) => {
  return value.toLocaleString('en-US', { 
    style: 'currency', 
    currency: 'USD' 
  })
}

// Products Pagination
const allProducts = ref([
  { id: 1, name: 'Wireless Headphones', category: 'Electronics', price: 129.99, image: 'https://picsum.photos/200/200?random=1' },
  { id: 2, name: 'Smart Watch', category: 'Wearables', price: 199.99, image: 'https://picsum.photos/200/200?random=2' },
  { id: 3, name: 'Bluetooth Speaker', category: 'Audio', price: 79.99, image: 'https://picsum.photos/200/200?random=3' },
  { id: 4, name: 'Fitness Tracker', category: 'Health', price: 89.99, image: 'https://picsum.photos/200/200?random=4' },
  { id: 5, name: 'Portable Charger', category: 'Accessories', price: 49.99, image: 'https://picsum.photos/200/200?random=5' },
  { id: 6, name: 'Noise Cancelling Earbuds', category: 'Audio', price: 149.99, image: 'https://picsum.photos/200/200?random=6' },
  { id: 7, name: 'Gaming Mouse', category: 'Electronics', price: 69.99, image: 'https://picsum.photos/200/200?random=7' },
  { id: 8, name: 'Laptop Stand', category: 'Accessories', price: 39.99, image: 'https://picsum.photos/200/200?random=8' },
  { id: 9, name: 'External SSD', category: 'Storage', price: 119.99, image: 'https://picsum.photos/200/200?random=9' },
  { id: 10, name: 'Wireless Keyboard', category: 'Electronics', price: 99.99, image: 'https://picsum.photos/200/200?random=10' },
  { id: 11, name: 'Webcam', category: 'Electronics', price: 79.99, image: 'https://picsum.photos/200/200?random=11' },
  { id: 12, name: 'Smart Home Hub', category: 'Smart Home', price: 129.99, image: 'https://picsum.photos/200/200?random=12' },
])

const productsPerPage = ref(6)
const productFirstPage = ref(0)

const paginatedProducts = computed(() => {
  const start = productFirstPage.value
  const end = start + productsPerPage.value
  return allProducts.value.slice(start, end)
})

const productStartIndex = computed(() => productFirstPage.value + 1)
const productEndIndex = computed(() => Math.min(productFirstPage.value + productsPerPage.value, allProducts.value.length))

const onProductPageChange = (event: any) => {
  productFirstPage.value = event.first
  productsPerPage.value = event.rows
}

// Users Pagination
const allUsers = ref([
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', avatar: 'https://picsum.photos/200/200?random=13' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Manager', avatar: 'https://picsum.photos/200/200?random=14' },
  { id: 3, name: 'Mike Johnson', email: 'mike@example.com', role: 'Developer', avatar: 'https://picsum.photos/200/200?random=15' },
  { id: 4, name: 'Emily Brown', email: 'emily@example.com', role: 'Designer', avatar: 'https://picsum.photos/200/200?random=16' },
  { id: 5, name: 'David Wilson', email: 'david@example.com', role: 'Analyst', avatar: 'https://picsum.photos/200/200?random=17' },
  { id: 6, name: 'Sarah Lee', email: 'sarah@example.com', role: 'Tester', avatar: 'https://picsum.photos/200/200?random=18' },
  { id: 7, name: 'Alex Chen', email: 'alex@example.com', role: 'Developer', avatar: 'https://picsum.photos/200/200?random=19' },
  { id: 8, name: 'Lisa Wong', email: 'lisa@example.com', role: 'Manager', avatar: 'https://picsum.photos/200/200?random=20' },
])

const usersPerPage = ref(5)
const userFirstPage = ref(0)

const paginatedUsers = computed(() => {
  const start = userFirstPage.value
  const end = start + usersPerPage.value
  return allUsers.value.slice(start, end)
})

const onUserPageChange = (event: any) => {
  userFirstPage.value = event.first
  usersPerPage.value = event.rows
}

// Blog Posts Pagination
const allPosts = ref([
  { 
    id: 1, 
    title: 'Introduction to Vue 3', 
    excerpt: 'Explore the new features of Vue 3 and how they improve web development.',
    author: 'John Doe',
    authorAvatar: 'https://picsum.photos/200/200?random=21'
  },
  { 
    id: 2, 
    title: 'State Management in Modern Web Apps', 
    excerpt: 'Learn about different state management techniques in modern web applications.',
    author: 'Jane Smith',
    authorAvatar: 'https://picsum.photos/200/200?random=22'
  },
  { 
    id: 3, 
    title: 'Responsive Design Principles', 
    excerpt: 'Best practices for creating responsive and mobile-friendly websites.',
    author: 'Mike Johnson',
    authorAvatar: 'https://picsum.photos/200/200?random=23'
  },
  { 
    id: 4, 
    title: 'Performance Optimization Techniques', 
    excerpt: 'Strategies to improve the performance of your web applications.',
    author: 'Emily Brown',
    authorAvatar: 'https://picsum.photos/200/200?random=24'
  },
  { 
    id: 5, 
    title: 'Understanding TypeScript', 
    excerpt: 'A comprehensive guide to TypeScript and its benefits in web development.',
    author: 'David Wilson',
    authorAvatar: 'https://picsum.photos/200/200?random=25'
  },
])

const postsPerPage = ref(3)
const postFirstPage = ref(0)

const paginatedPosts = computed(() => {
  const start = postFirstPage.value
  const end = start + postsPerPage.value
  return allPosts.value.slice(start, end)
})

const onPostPageChange = (event: any) => {
  postFirstPage.value = event.first
  postsPerPage.value = event.rows
}

// Helper methods
const getRoleSeverity = (role: string) => {
  switch(role) {
    case 'Admin': return 'danger'
    case 'Manager': return 'warning'
    case 'Developer': return 'info'
    case 'Designer': return 'success'
    default: return 'secondary'
  }
}
</script>

<style scoped>
.card {
  @apply shadow-md rounded-lg p-4 bg-white;
}
</style>
