<template>
  <div class="container mx-auto p-4">
    <h1 class="text-3xl font-bold mb-6">PrimeVue TreeTable Showcase</h1>

    <!-- Organizational Hierarchy -->
    <div class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">Company Organizational Structure</h2>
      <TreeTable 
        :value="organizationalData" 
        :expandedKeys="expandedOrgKeys"
        @node-expand="onOrgNodeExpand"
      >
        <Column field="name" header="Name" expander>
          <template #body="slotProps">
            <div class="flex items-center">
              <Avatar 
                :image="slotProps.node.data.avatar" 
                size="large" 
                shape="circle" 
                class="mr-3"
              />
              <div>
                <h3 class="font-bold">{{ slotProps.node.data.name }}</h3>
                <p class="text-sm text-gray-500">{{ slotProps.node.data.title }}</p>
              </div>
            </div>
          </template>
        </Column>
        <Column field="department" header="Department">
          <template #body="slotProps">
            <Tag 
              :value="slotProps.node.data.department" 
              :severity="getDepartmentSeverity(slotProps.node.data.department)" 
            />
          </template>
        </Column>
        <Column field="salary" header="Salary">
          <template #body="slotProps">
            {{ formatCurrency(slotProps.node.data.salary) }}
          </template>
        </Column>
        <Column header="Actions">
          <template #body="slotProps">
            <div class="flex space-x-2">
              <Button 
                icon="pi pi-pencil" 
                severity="info" 
                text 
                rounded 
                size="small"
              />
              <Button 
                icon="pi pi-trash" 
                severity="danger" 
                text 
                rounded 
                size="small"
              />
            </div>
          </template>
        </Column>
      </TreeTable>
    </div>

    <!-- Project Budget Hierarchy -->
    <div class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">Project Budget Breakdown</h2>
      <TreeTable 
        :value="projectBudgetData" 
        :expandedKeys="expandedBudgetKeys"
        @node-expand="onBudgetNodeExpand"
      >
        <Column field="name" header="Project/Category" expander />
        <Column field="budget" header="Allocated Budget">
          <template #body="slotProps">
            <span 
              :class="{
                'font-bold text-primary': slotProps.node.children,
                'text-gray-600': !slotProps.node.children
              }"
            >
              {{ formatCurrency(slotProps.node.data.budget) }}
            </span>
          </template>
        </Column>
        <Column field="status" header="Status">
          <template #body="slotProps">
            <Tag 
              :value="slotProps.node.data.status" 
              :severity="getStatusSeverity(slotProps.node.data.status)" 
            />
          </template>
        </Column>
        <Column header="Progress">
          <template #body="slotProps">
            <ProgressBar 
              v-if="slotProps.node.data.progress !== undefined"
              :value="slotProps.node.data.progress" 
            />
          </template>
        </Column>
      </TreeTable>
    </div>

    <!-- Product Inventory Hierarchy -->
    <div>
      <h2 class="text-2xl font-semibold mb-4">Product Inventory Management</h2>
      <TreeTable 
        :value="productInventoryData" 
        :expandedKeys="expandedInventoryKeys"
        @node-expand="onInventoryNodeExpand"
        selectionMode="multiple"
        v-model:selectionKeys="selectedProducts"
      >
        <Column field="name" header="Product" expander>
          <template #body="slotProps">
            <div class="flex items-center">
              <img 
                v-if="slotProps.node.data.image"
                :src="slotProps.node.data.image" 
                :alt="slotProps.node.data.name"
                class="w-12 h-12 object-cover mr-3 rounded"
              />
              <div>
                <h3 class="font-bold">{{ slotProps.node.data.name }}</h3>
                <p 
                  v-if="slotProps.node.data.category" 
                  class="text-sm text-gray-500"
                >
                  {{ slotProps.node.data.category }}
                </p>
              </div>
            </div>
          </template>
        </Column>
        <Column field="price" header="Price">
          <template #body="slotProps">
            {{ formatCurrency(slotProps.node.data.price) }}
          </template>
        </Column>
        <Column field="stock" header="Stock">
          <template #body="slotProps">
            <Tag 
              :value="slotProps.node.data.stock" 
              :severity="getStockSeverity(slotProps.node.data.stock)" 
            />
          </template>
        </Column>
      </TreeTable>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// Utility Functions
const formatCurrency = (value: number) => {
  return value.toLocaleString('en-US', { 
    style: 'currency', 
    currency: 'USD' 
  })
}

// Organizational Hierarchy Data
const organizationalData = ref([
  {
    key: 'ceo',
    data: { 
      name: 'Sarah Johnson', 
      title: 'Chief Executive Officer', 
      department: 'Executive', 
      salary: 250000,
      avatar: 'https://picsum.photos/200/200?random=1'
    },
    children: [
      {
        key: 'cto',
        data: { 
          name: 'Mike Chen', 
          title: 'Chief Technology Officer', 
          department: 'Technology', 
          salary: 200000,
          avatar: 'https://picsum.photos/200/200?random=2'
        },
        children: [
          {
            key: 'head-engineering',
            data: { 
              name: 'Emily Rodriguez', 
              title: 'Head of Engineering', 
              department: 'Engineering', 
              salary: 150000,
              avatar: 'https://picsum.photos/200/200?random=3'
            }
          }
        ]
      }
    ]
  }
])

const expandedOrgKeys = ref({})

const onOrgNodeExpand = (node: any) => {
  expandedOrgKeys.value[node.key] = true
}

// Project Budget Data
const projectBudgetData = ref([
  {
    key: 'total-budget',
    data: { 
      name: 'Total Company Budget', 
      budget: 5000000,
      status: 'Approved',
      progress: 75
    },
    children: [
      {
        key: 'tech-projects',
        data: { 
          name: 'Technology Projects', 
          budget: 2000000,
          status: 'In Progress',
          progress: 60
        },
        children: [
          {
            key: 'ai-project',
            data: { 
              name: 'AI Development', 
              budget: 750000,
              status: 'Active',
              progress: 45
            }
          }
        ]
      }
    ]
  }
])

const expandedBudgetKeys = ref({})

const onBudgetNodeExpand = (node: any) => {
  expandedBudgetKeys.value[node.key] = true
}

// Product Inventory Data
const productInventoryData = ref([
  {
    key: 'electronics',
    data: { 
      name: 'Electronics', 
      category: 'Product Category'
    },
    children: [
      {
        key: 'smartphones',
        data: { 
          name: 'Smartphones', 
          category: 'Mobile Devices',
          price: 599.99,
          stock: 'High',
          image: 'https://picsum.photos/200/200?random=4'
        },
        children: [
          {
            key: 'iphone',
            data: { 
              name: 'iPhone 13', 
              category: 'Apple', 
              price: 799.99,
              stock: 'Medium',
              image: 'https://picsum.photos/200/200?random=5'
            }
          }
        ]
      }
    ]
  }
])

const expandedInventoryKeys = ref({})
const selectedProducts = ref({})

const onInventoryNodeExpand = (node: any) => {
  expandedInventoryKeys.value[node.key] = true
}

// Helper Methods for Styling
const getDepartmentSeverity = (department: string) => {
  switch(department) {
    case 'Executive': return 'danger'
    case 'Technology': return 'info'
    case 'Engineering': return 'success'
    default: return 'secondary'
  }
}

const getStatusSeverity = (status: string) => {
  switch(status) {
    case 'Approved': return 'success'
    case 'In Progress': return 'warning'
    case 'Active': return 'info'
    default: return 'secondary'
  }
}

const getStockSeverity = (stock: string) => {
  switch(stock) {
    case 'High': return 'success'
    case 'Medium': return 'warning'
    case 'Low': return 'danger'
    default: return 'secondary'
  }
}
</script>

<style scoped>
.card {
  @apply shadow-md rounded-lg p-4 bg-white;
}
</style>
