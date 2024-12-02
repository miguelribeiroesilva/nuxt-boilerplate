<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-6">PrimeVue DataView Showcase</h1>

    <!-- Basic DataView -->
    <div class="mb-6">
      <h2 class="text-xl font-semibold mb-3">Basic DataView</h2>
      <DataView
        :value="products"
        :layout="layout"
      >
        <template #header>
          <div class="flex justify-between items-center">
            <DataViewLayoutOptions v-model="layout" />
          </div>
        </template>

        <template #list="slotProps">
          <div class="grid grid-cols-1 gap-4">
            <div
              v-for="item in slotProps.items"
              :key="item.id"
              class="flex p-4 border rounded-lg"
            >
              <img
                :src="item.image"
                :alt="item.name"
                class="w-24 h-24 object-cover mr-4"
              />
              <div>
                <h3 class="text-lg font-semibold">{{ item.name }}</h3>
                <p class="text-gray-500">{{ item.category }}</p>
                <p class="font-bold text-primary">{{ formatCurrency(item.price) }}</p>
              </div>
            </div>
          </div>
        </template>

        <template #grid="slotProps">
          <div class="grid grid-cols-3 gap-4">
            <div
              v-for="item in slotProps.items"
              :key="item.id"
              class="border rounded-lg p-4 text-center"
            >
              <img
                :src="item.image"
                :alt="item.name"
                class="w-full h-48 object-cover mb-4"
              />
              <h3 class="text-lg font-semibold">{{ item.name }}</h3>
              <p class="text-gray-500 mb-2">{{ item.category }}</p>
              <p class="font-bold text-primary">{{ formatCurrency(item.price) }}</p>
              <div class="mt-3">
                <Button label="Add to Cart" icon="pi pi-shopping-cart" />
              </div>
            </div>
          </div>
        </template>
      </DataView>
    </div>

    <!-- Paginated DataView -->
    <div class="mb-6">
      <h2 class="text-xl font-semibold mb-3">Paginated DataView</h2>
      <DataView
        :value="paginatedProducts"
        :layout="layout"
        :paginator="true"
        :rows="6"
      >
        <template #header>
          <div class="flex justify-between items-center">
            <DataViewLayoutOptions v-model="layout" />
          </div>
        </template>

        <template #list="slotProps">
          <div class="grid grid-cols-1 gap-4">
            <div
              v-for="item in slotProps.items"
              :key="item.id"
              class="flex p-4 border rounded-lg items-center"
            >
              <img
                :src="item.image"
                :alt="item.name"
                class="w-24 h-24 object-cover mr-4"
              />
              <div class="flex-grow">
                <h3 class="text-lg font-semibold">{{ item.name }}</h3>
                <p class="text-gray-500">{{ item.category }}</p>
                <p class="font-bold text-primary">{{ formatCurrency(item.price) }}</p>
              </div>
              <div>
                <Button
                  icon="pi pi-heart"
                  severity="secondary"
                  class="mr-2"
                />
                <Button
                  icon="pi pi-shopping-cart"
                  severity="success"
                />
              </div>
            </div>
          </div>
        </template>

        <template #grid="slotProps">
          <div class="grid grid-cols-3 gap-4">
            <div
              v-for="item in slotProps.items"
              :key="item.id"
              class="border rounded-lg p-4 text-center"
            >
              <img
                :src="item.image"
                :alt="item.name"
                class="w-full h-48 object-cover mb-4"
              />
              <h3 class="text-lg font-semibold">{{ item.name }}</h3>
              <p class="text-gray-500 mb-2">{{ item.category }}</p>
              <p class="font-bold text-primary mb-3">{{ formatCurrency(item.price) }}</p>
              <div class="flex justify-center space-x-2">
                <Button
                  icon="pi pi-heart"
                  severity="secondary"
                />
                <Button
                  label="Add to Cart"
                  icon="pi pi-shopping-cart"
                />
              </div>
            </div>
          </div>
        </template>
      </DataView>
    </div>

    <!-- Sortable DataView -->
    <div class="mb-6">
      <h2 class="text-xl font-semibold mb-3">Sortable DataView</h2>
      <DataView
        :value="sortableProducts"
        :layout="layout"
        :sortOrder="sortOrder"
        :sortField="sortField"
        @sort="onSort"
      >
        <template #header>
          <div class="flex justify-between items-center">
            <DataViewLayoutOptions v-model="layout" />
            <Dropdown
              v-model="sortKey"
              :options="sortOptions"
              placeholder="Sort By"
              @change="onSortChange"
            />
          </div>
        </template>

        <template #list="slotProps">
          <div class="grid grid-cols-1 gap-4">
            <div
              v-for="item in slotProps.items"
              :key="item.id"
              class="flex p-4 border rounded-lg"
            >
              <img
                :src="item.image"
                :alt="item.name"
                class="w-24 h-24 object-cover mr-4"
              />
              <div>
                <h3 class="text-lg font-semibold">{{ item.name }}</h3>
                <p class="text-gray-500">{{ item.category }}</p>
                <p class="font-bold text-primary">{{ formatCurrency(item.price) }}</p>
              </div>
            </div>
          </div>
        </template>

        <template #grid="slotProps">
          <div class="grid grid-cols-3 gap-4">
            <div
              v-for="item in slotProps.items"
              :key="item.id"
              class="border rounded-lg p-4 text-center"
            >
              <img
                :src="item.image"
                :alt="item.name"
                class="w-full h-48 object-cover mb-4"
              />
              <h3 class="text-lg font-semibold">{{ item.name }}</h3>
              <p class="text-gray-500 mb-2">{{ item.category }}</p>
              <p class="font-bold text-primary">{{ formatCurrency(item.price) }}</p>
            </div>
          </div>
        </template>
      </DataView>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

// Format currency helper
const formatCurrency = (value: number) => {
  return value.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD'
  })
}

// Layout state
const layout = ref('grid')

// Basic products
const products = ref([
  {
    id: 1,
    name: 'Wireless Headphones',
    category: 'Electronics',
    price: 129.99,
    image: 'https://picsum.photos/300/300?random=1'
  },
  {
    id: 2,
    name: 'Smart Watch',
    category: 'Electronics',
    price: 199.99,
    image: 'https://picsum.photos/300/300?random=2'
  },
  {
    id: 3,
    name: 'Leather Jacket',
    category: 'Clothing',
    price: 249.99,
    image: 'https://picsum.photos/300/300?random=3'
  },
  {
    id: 4,
    name: 'Running Shoes',
    category: 'Clothing',
    price: 89.99,
    image: 'https://picsum.photos/300/300?random=4'
  }
])

// Paginated products (more items)
const paginatedProducts = ref([
  ...products.value,
  {
    id: 5,
    name: 'Bluetooth Speaker',
    category: 'Electronics',
    price: 79.99,
    image: 'https://picsum.photos/300/300?random=5'
  },
  {
    id: 6,
    name: 'Fitness Tracker',
    category: 'Electronics',
    price: 59.99,
    image: 'https://picsum.photos/300/300?random=6'
  },
  {
    id: 7,
    name: 'Leather Wallet',
    category: 'Accessories',
    price: 49.99,
    image: 'https://picsum.photos/300/300?random=7'
  }
])

// Sorting for sortable DataView
const sortKey = ref(null)
const sortOrder = ref(null)
const sortField = ref(null)

// Sort options
const sortOptions = ref([
  { label: 'Price High to Low', value: '!price' },
  { label: 'Price Low to High', value: 'price' },
  { label: 'Name', value: 'name' }
])

// Sortable products
const sortableProducts = ref([...paginatedProducts.value])

// Sort change handler
const onSortChange = (event) => {
  const value = event.value.value
  const sortValue = event.value

  if (value.indexOf('!') === 0) {
    sortOrder.value = -1
    sortField.value = value.substring(1, value.length)
  } else {
    sortOrder.value = 1
    sortField.value = value
  }
}

// Sort method
const onSort = (event) => {
  const { sortField, sortOrder } = event
}
</script>

<style scoped>
/* Optional custom styles */
:deep(.p-dataview-header) {
  @apply flex justify-between items-center mb-4;
}
</style>
