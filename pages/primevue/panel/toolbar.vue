<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-6">PrimeVue Toolbar Showcase</h1>

    <!-- Basic Toolbar -->
    <div class="mb-6">
      <h2 class="text-xl font-semibold mb-3">Basic Toolbar</h2>
      <Toolbar>
        <template #start>
          <Button icon="pi pi-plus" severity="success" />
          <Button icon="pi pi-print" class="ml-2" severity="secondary" />
        </template>
        <template #end>
          <Button icon="pi pi-search" />
          <Button icon="pi pi-filter" class="ml-2" severity="secondary" />
        </template>
      </Toolbar>
    </div>

    <!-- Toolbar with Text and Icons -->
    <div class="mb-6">
      <h2 class="text-xl font-semibold mb-3">Toolbar with Text and Icons</h2>
      <Toolbar>
        <template #start>
          <div class="flex items-center">
            <Button label="New" icon="pi pi-plus" severity="success" />
            <Button label="Upload" icon="pi pi-upload" severity="info" class="ml-2" />
          </div>
        </template>
        <template #end>
          <div class="flex items-center">
            <span class="mr-2">View:</span>
            <Button icon="pi pi-table" severity="secondary" class="mr-2" />
            <Button icon="pi pi-list" severity="secondary" />
          </div>
        </template>
      </Toolbar>
    </div>

    <!-- Complex Toolbar with Dropdown and Input -->
    <div class="mb-6">
      <h2 class="text-xl font-semibold mb-3">Complex Toolbar</h2>
      <Toolbar>
        <template #start>
          <div class="flex items-center space-x-2">
            <Dropdown 
              v-model="selectedCategory" 
              :options="categories" 
              placeholder="Select Category" 
              class="w-48" 
            />
            <InputText 
              v-model="searchTerm" 
              placeholder="Search..." 
              class="w-64" 
            />
          </div>
        </template>
        <template #end>
          <div class="flex items-center space-x-2">
            <ToggleButton 
              v-model="gridView" 
              onIcon="pi pi-table" 
              offIcon="pi pi-list" 
              class="mr-2" 
            />
            <Button 
              label="Advanced Filter" 
              icon="pi pi-filter" 
              severity="secondary" 
            />
          </div>
        </template>
      </Toolbar>
    </div>

    <!-- Responsive Toolbar -->
    <div class="mb-6">
      <h2 class="text-xl font-semibold mb-3">Responsive Toolbar</h2>
      <Toolbar>
        <template #start>
          <div class="flex flex-wrap items-center gap-2">
            <Button 
              v-for="action in responsiveActions" 
              :key="action.label"
              :label="action.label"
              :icon="action.icon"
              :severity="action.severity"
              class="mb-2"
            />
          </div>
        </template>
        <template #end>
          <div class="flex flex-wrap items-center gap-2">
            <SplitButton 
              label="Actions" 
              icon="pi pi-bolt"
              :model="actionItems"
            />
          </div>
        </template>
      </Toolbar>
    </div>

    <!-- Toolbar with Context Menu -->
    <div class="mb-6">
      <h2 class="text-xl font-semibold mb-3">Toolbar with Context Menu</h2>
      <Toolbar>
        <template #start>
          <div class="flex items-center">
            <Button 
              icon="pi pi-bars" 
              @click="toggleMenu" 
              class="mr-2" 
            />
            <Menu 
              ref="menu" 
              :model="menuItems" 
              popup 
            />
            <span class="font-semibold">Document</span>
          </div>
        </template>
        <template #end>
          <div class="flex items-center space-x-2">
            <Button icon="pi pi-save" severity="success" />
            <Button icon="pi pi-undo" severity="secondary" />
            <Button icon="pi pi-redo" severity="secondary" />
          </div>
        </template>
      </Toolbar>
    </div>

    <!-- Full-Width Toolbar -->
    <div class="mb-6">
      <h2 class="text-xl font-semibold mb-3">Full-Width Toolbar</h2>
      <Toolbar class="w-full">
        <template #start>
          <div class="flex items-center">
            <img 
              src="/logo.png" 
              alt="Logo" 
              class="h-8 mr-4" 
            />
            <h2 class="text-lg font-bold">Application Name</h2>
          </div>
        </template>
        <template #end>
          <div class="flex items-center space-x-2">
            <Button icon="pi pi-user" severity="secondary" />
            <Button icon="pi pi-cog" severity="secondary" />
            <Button icon="pi pi-sign-out" severity="danger" />
          </div>
        </template>
      </Toolbar>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// Dropdown options
const categories = ref([
  'Electronics', 
  'Clothing', 
  'Books', 
  'Furniture'
])
const selectedCategory = ref(null)
const searchTerm = ref('')

// Grid/List view toggle
const gridView = ref(true)

// Responsive actions
const responsiveActions = ref([
  { label: 'Create', icon: 'pi pi-plus', severity: 'success' },
  { label: 'Edit', icon: 'pi pi-pencil', severity: 'secondary' },
  { label: 'Delete', icon: 'pi pi-trash', severity: 'danger' }
])

// SplitButton actions
const actionItems = ref([
  {
    label: 'Update',
    icon: 'pi pi-refresh',
    command: () => {}
  },
  {
    label: 'Delete',
    icon: 'pi pi-times',
    command: () => {}
  }
])

// Context Menu
const menu = ref(null)
const menuItems = ref([
  {
    label: 'New',
    icon: 'pi pi-plus',
    command: () => {}
  },
  {
    label: 'Open',
    icon: 'pi pi-folder-open',
    command: () => {}
  },
  {
    label: 'Save',
    icon: 'pi pi-save',
    command: () => {}
  }
])

// Toggle menu method
const toggleMenu = (event) => {
  menu.value.toggle(event)
}
</script>

<style scoped>
.card {
  @apply shadow-md rounded-lg p-4 mb-4;
}
</style>
