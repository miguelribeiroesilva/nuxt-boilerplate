<template>
  <div class="card">
    <DataTable
      ref="dataTableRef"
      v-model:selection="selectedProducts"
      :value="safeProducts"
      :filters="filters"
      :paginator="true"
      :rows="10"
      :rowsPerPageOptions="[5, 10, 20, 50]"
      dataKey="id"
      :globalFilterFields="['name', 'code', 'category', 'inventoryStatus']"
      filterDisplay="row"
      selectionMode="multiple"
      paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
      :currentPageReportTemplate="'Showing {first} to {last} of {totalRecords} products'"
    >
      <template #header>
        <div class="flex justify-content-between align-items-center">
          <h5 class="m-0">Product Catalog</h5>
          <Button icon="pi pi-file-export" label="Export" @click="handleExportCSV" />
        </div>
      </template>

      <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>

      <Column field="code" header="Code" :sortable="true">
        <template #filter="{ filterModel }">
          <InputText
            type="text"
            v-model="filterModel.value"
            placeholder="Search by code"
          />
        </template>
      </Column>

      <Column field="name" header="Name" :sortable="true">
        <template #filter="{ filterModel }">
          <InputText
            type="text"
            v-model="filterModel.value"
            placeholder="Search by name"
          />
        </template>
      </Column>

      <Column header="Image">
        <template #body="{ data }">
          <img
            :src="`/images/product/${data.image}`"
            :alt="data.name"
            class="w-6rem shadow-2 border-round"
          />
        </template>
      </Column>

      <Column field="price" header="Price" :sortable="true">
        <template #body="{ data }">
          {{ formatCurrency(data.price) }}
        </template>
      </Column>

      <Column field="category" header="Category" :sortable="true">
        <template #filter="{ filterModel }">
          <InputText
            type="text"
            v-model="filterModel.value"
            placeholder="Search by category"
          />
        </template>
      </Column>

      <Column field="inventoryStatus" header="Status" :sortable="true">
        <template #body="{ data }">
          <Tag
            :value="data.inventoryStatus"
            :severity="getSeverity(data.inventoryStatus)"
          />
        </template>
        <template #filter="{ filterModel }">
          <Dropdown
            v-model="filterModel.value"
            :options="statuses"
            optionLabel="label"
            optionValue="value"
            placeholder="Select a Status"
          />
        </template>
      </Column>

      <Column header="Representative" :sortable="true">
        <template #body="{ data }">
          <div class="flex align-items-center">
            <img
              :alt="data.representative.name"
              :src="`/images/avatar/${data.representative.image}`"
              class="w-6rem shadow-2 mr-2"
              style="width: 40px"
            />
            <span>{{ data.representative.name }}</span>
          </div>
        </template>
        <template #filter="{ filterModel }">
          <MultiSelect
            v-model="filterModel.value"
            :options="representatives"
            optionLabel="name"
            placeholder="Select a Representative"
          />
        </template>
      </Column>

      <Column header="Actions">
        <template #body="{ data }">
          <Button
            icon="pi pi-pencil"
            class="p-button-rounded p-button-text mr-2"
            @click="editProduct(data)"
          />
          <Button
            icon="pi pi-trash"
            class="p-button-rounded p-button-text p-button-danger"
            @click="deleteProduct(data)"
          />
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, computed, toValue, isRef, isReactive, isProxy } from 'vue'
import { FilterMatchMode } from 'primevue/api'
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import InputText from 'primevue/inputtext'
import Dropdown from 'primevue/dropdown'
import MultiSelect from 'primevue/multiselect'
import Tag from 'primevue/tag'
import Button from 'primevue/button'

// Utility function for comprehensive logging
const safeLog = (label, obj) => {
  try {
    console.log(`[SAFE LOG] ${label}:`, {
      type: typeof obj,
      isRef: isRef(obj),
      isReactive: isReactive(obj),
      isProxy: isProxy(obj),
      value: toValue(obj),
      stringValue: JSON.stringify(toValue(obj), null, 2)
    })
  } catch (error) {
    console.error(`Logging error for ${label}:`, error)
  }
}

// Reactive references with explicit initialization
const dataTableRef = ref(null)
const products = ref([
  {
    id: 1,
    code: 'f230fh0g3',
    name: 'Bamboo Watch',
    description: 'Product Description',
    image: 'bamboo-watch.jpg',
    price: 65,
    category: 'Accessories',
    quantity: 24,
    inventoryStatus: 'INSTOCK',
    rating: 5,
    representative: {
      name: 'Amy Elsner',
      image: 'amyelsner.png'
    }
  },
  {
    id: 2,
    code: 'h456wer53',
    name: 'Blue T-Shirt',
    description: 'Classic Blue T-Shirt',
    image: 'blue-tshirt.jpg',
    price: 29,
    category: 'Clothing',
    quantity: 50,
    inventoryStatus: 'INSTOCK',
    rating: 4,
    representative: {
      name: 'Anna Fali',
      image: 'annafali.png'
    }
  },
  {
    id: 3,
    code: 'a456der32',
    name: 'Gaming Laptop',
    description: 'High Performance Gaming Laptop',
    image: 'gaming-laptop.jpg',
    price: 1299,
    category: 'Electronics',
    quantity: 10,
    inventoryStatus: 'LOWSTOCK',
    rating: 5,
    representative: {
      name: 'Asiya Javayant',
      image: 'asiyajavayant.png'
    }
  },
  {
    id: 4,
    code: 'b123qwe45',
    name: 'Wireless Headphones',
    description: 'Noise Cancelling Wireless Headphones',
    image: 'wireless-headphones.jpg',
    price: 199,
    category: 'Electronics',
    quantity: 5,
    inventoryStatus: 'OUTOFSTOCK',
    rating: 4,
    representative: {
      name: 'Onyama Lingua',
      image: 'onyamalinga.png'
    }
  },
  {
    id: 5,
    code: 'c789poi67',
    name: 'Smart Watch',
    description: 'Advanced Fitness Tracking Smart Watch',
    image: 'smart-watch.jpg',
    price: 249,
    category: 'Accessories',
    quantity: 15,
    inventoryStatus: 'LOWSTOCK',
    rating: 4,
    representative: {
      name: 'Ivan Cooper',
      image: 'ivancooper.png'
    }
  }
])
const selectedProducts = ref([])

// Safe computed property for products
const safeProducts = computed(() => {
  try {
    const currentProducts = toValue(products)
    return Array.isArray(currentProducts) ? currentProducts : []
  } catch (error) {
    console.error('Error in safeProducts computation:', error)
    return []
  }
})

// Filters configuration
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  code: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  category: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  inventoryStatus: { value: null, matchMode: FilterMatchMode.EQUALS }
})

// Statuses and representatives data
const statuses = [
  { label: 'In Stock', value: 'INSTOCK' },
  { label: 'Low Stock', value: 'LOWSTOCK' },
  { label: 'Out of Stock', value: 'OUTOFSTOCK' }
]

const representatives = [
  { name: 'Amy Elsner', image: 'amyelsner.png' },
  { name: 'Anna Fali', image: 'annafali.png' },
  { name: 'Asiya Javayant', image: 'asiyajavayant.png' },
  { name: 'Onyama Lingua', image: 'onyamalinga.png' },
  { name: 'Ivan Cooper', image: 'ivancooper.png' }
]

// Edit product handler with comprehensive error handling
const editProduct = (product) => {
  console.group('Edit Product Debug')
  try {
    // Comprehensive logging and debugging
    console.log('Edit Product Called')
    safeLog('Incoming Product', product)
    safeLog('Products Ref', products)

    // Validate inputs with multiple checks
    if (!product) {
      console.error('Attempted to edit undefined product')
      console.groupEnd()
      return
    }

    // Ensure products is a valid array
    const currentProducts = toValue(products)
    if (!Array.isArray(currentProducts)) {
      console.error('Products is not an array', currentProducts)
      console.groupEnd()
      return
    }

    // Find the product to edit
    const productIndex = currentProducts.findIndex(p => {
      // Defensive comparison
      if (!p || !product) return false
      return p.id === product.id
    })

    // Log detailed product search results
    console.log('Product Search Results:', {
      searchId: product.id,
      foundIndex: productIndex,
      totalProducts: currentProducts.length
    })

    // Handle product not found
    if (productIndex === -1) {
      console.error('Product not found for editing:', product)
      console.groupEnd()
      return
    }

    // Log the current product details
    console.log('Current Product Details:', currentProducts[productIndex])

    // Placeholder for edit logic
    console.log('Preparing to edit product')

    // Optional: Create a copy of the product for editing
    const productToEdit = { ...currentProducts[productIndex] }

    console.log('Product Copy for Editing:', productToEdit)
  } catch (error) {
    // Comprehensive error logging
    console.error('Comprehensive error in editProduct:', error)
    console.error('Error Details:', {
      product,
      productsType: typeof products,
      productsValue: toValue(products)
    })
  } finally {
    console.groupEnd()
  }
}

// Delete product handler
const deleteProduct = (product) => {
  console.group('Delete Product Debug')
  try {
    // Comprehensive logging
    console.log('Delete Product Called')
    safeLog('Incoming Product', product)
    safeLog('Products Ref', products)

    // Validate inputs
    if (!product) {
      console.error('Attempted to delete undefined product')
      console.groupEnd()
      return
    }

    // Ensure products is a valid array
    const currentProducts = toValue(products)
    if (!Array.isArray(currentProducts)) {
      console.error('Products is not an array', currentProducts)
      products.value = []
      console.groupEnd()
      return
    }

    // Safe filtering
    const initialLength = currentProducts.length
    const filteredProducts = currentProducts.filter(p => {
      // Defensive checks
      if (!p || !product) return false
      return p.id !== product.id
    })

    // Update products
    products.value = filteredProducts

    // Log results
    console.log('Deletion Results:', {
      initialCount: initialLength,
      finalCount: filteredProducts.length,
      deletedProductId: product.id
    })
  } catch (error) {
    // Comprehensive error logging
    console.error('Comprehensive error in deleteProduct:', error)
    console.error('Error Details:', {
      product,
      productsType: typeof products,
      productsValue: toValue(products)
    })
  } finally {
    console.groupEnd()
  }
}

// Utility functions with extensive error handling
const formatCurrency = (value) => {
  try {
    const numValue = Number(value)
    return isNaN(numValue)
      ? '$0.00'
      : numValue.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
  } catch (error) {
    console.error('Error formatting currency:', error)
    return '$0.00'
  }
}

// Export CSV handler with comprehensive error handling
const handleExportCSV = async () => {
  try {
    // Wait for next tick to ensure DOM is updated
    await nextTick()

    // Multiple layers of null checks
    if (!dataTableRef.value) {
      console.error('DataTable reference is not available')
      return
    }

    // Verify exportCSV method exists before calling
    if (typeof dataTableRef.value.exportCSV !== 'function') {
      console.error('exportCSV method is not a function')
      return
    }

    dataTableRef.value.exportCSV()
  } catch (error) {
    console.error('Comprehensive error in handleExportCSV:', error)
  }
}

const getSeverity = (status) => {
  try {
    switch (status) {
      case 'INSTOCK':
        return 'success'
      case 'LOWSTOCK':
        return 'warning'
      case 'OUTOFSTOCK':
        return 'danger'
      default:
        return 'info'
    }
  } catch (error) {
    console.error('Error getting severity:', error)
    return 'info'
  }
}
</script>

<style scoped>
.card {
  padding: 1rem;
}
</style>
