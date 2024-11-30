<template>
  <div class="card">
    <BackButton />
    <Button severity="info" disabled class="flex-1">Data Import</Button>

    <!-- Import Form -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <!-- Collection Selection -->
      <div class="p-4 rounded-lg bg-gray-100 dark:bg-gray-800">
        <h3 class="font-semibold mb-4">Import Settings</h3>
        <form @submit.prevent="handleImport" class="space-y-4">
          <div class="space-y-4">
            <!-- Collection Type -->
            <div class="p-field">
              <label class="block text-sm font-medium mb-1">Collection Type</label>
              <Dropdown
                v-model="importForm.collectionType"
                :options="collectionTypes"
                optionLabel="label"
                optionValue="value"
                placeholder="Select Collection"
                class="w-full"
                :class="{ 'p-invalid': submitted && !importForm.collectionType }"
              />
              <small v-if="submitted && !importForm.collectionType" class="p-error">
                Collection type is required
              </small>
            </div>

            <!-- Number of Records -->
            <div class="p-field">
              <label class="block text-sm font-medium mb-1">Number of Records</label>
              <InputNumber
                v-model="importForm.count"
                :min="1"
                :max="100"
                class="w-full"
                :class="{ 'p-invalid': submitted && !importForm.count }"
              />
              <small v-if="submitted && !importForm.count" class="p-error">
                Number of records is required
              </small>
            </div>

            <!-- Include Images -->
            <div class="p-field-checkbox">
              <Checkbox
                v-model="importForm.includeImages"
                :binary="true"
                inputId="includeImages"
              />
              <label for="includeImages" class="ml-2">Include Images</label>
            </div>

            <!-- Clear Existing -->
            <div class="p-field-checkbox">
              <Checkbox
                v-model="importForm.clearExisting"
                :binary="true"
                inputId="clearExisting"
              />
              <label for="clearExisting" class="ml-2">Clear Existing Data</label>
              <small class="block text-yellow-500 dark:text-yellow-400 mt-1" v-if="importForm.clearExisting">
                Warning: This will delete all existing data in the selected collection
              </small>
            </div>
          </div>

          <Button
            type="submit"
            :loading="importing"
            severity="primary"
            class="w-full"
          >
            Import Data
          </Button>
        </form>
      </div>

      <!-- Preview -->
      <div class="p-4 rounded-lg bg-gray-100 dark:bg-gray-800">
        <h3 class="font-semibold mb-4">Preview</h3>
        <div v-if="previewData" class="space-y-4">
          <div class="overflow-y-auto max-h-96">
            <pre class="text-sm">{{ JSON.stringify(previewData, null, 2) }}</pre>
          </div>
        </div>
        <div v-else class="text-center text-gray-500 dark:text-gray-400 py-8">
          Configure import settings to see preview
        </div>
      </div>
    </div>

    <!-- Import Progress -->
    <div v-if="importProgress.total > 0" class="mb-6">
      <h3 class="font-semibold mb-2">Import Progress</h3>
      <ProgressBar
        :value="(importProgress.current / importProgress.total) * 100"
        :showValue="true"
      />
      <div class="text-sm text-gray-600 dark:text-gray-400 mt-2">
        Imported {{ importProgress.current }} of {{ importProgress.total }} records
      </div>
    </div>

    <!-- Import History -->
    <div>
      <h3 class="font-semibold mb-4">Import History</h3>

      <!-- Loading State -->
      <div v-if="loadingHistory" class="text-center py-4">
        <ProgressSpinner style="width: 50px; height: 50px" />
        <p class="mt-2 text-gray-600">Loading import history...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="historyError" class="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
        <div class="flex items-center">
          <i class="pi pi-exclamation-triangle text-red-500 mr-2"></i>
          <span class="text-red-600 dark:text-red-400">{{ historyError }}</span>
        </div>
      </div>

      <!-- Data Table -->
      <DataTable
        v-else
        :value="importHistory"
        :paginator="true"
        :rows="5"
        stripedRows
        class="p-datatable-sm"
      >
        <Column field="timestamp" header="Date" sortable>
          <template #body="{ data }">
            {{ new Date(data.timestamp).toLocaleString() }}
          </template>
        </Column>
        <Column field="collection" header="Collection" sortable />
        <Column field="count" header="Records" sortable />
        <Column field="status" header="Status" sortable>
          <template #body="{ data }">
            <Tag :severity="data.status === 'completed' ? 'success' : 'danger'">
              {{ data.status }}
            </Tag>
          </template>
        </Column>
        <Column field="duration" header="Duration" sortable>
          <template #body="{ data }">
            {{ data.duration }}s
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useToast } from 'primevue/usetoast'
import { onMounted } from 'vue'

const toast = useToast()
const faker = useFaker()
const { setDocument, deleteDocument, getCollection } = useFirestore()

// Collection Types
const collectionTypes = [
  { label: 'Users', value: 'users' },
  { label: 'Products', value: 'products' },
  { label: 'Categories', value: 'categories' }
]

// Form State
const importForm = ref({
  collectionType: '',
  count: 10,
  includeImages: true,
  clearExisting: false
})

const submitted = ref(false)
const importing = ref(false)
const importProgress = ref({
  current: 0,
  total: 0
})

// Import History
const importHistory = ref([])
const loadingHistory = ref(false)
const historyError = ref('')

// Initialize import history
onMounted(async () => {
  loadingHistory.value = true
  historyError.value = ''

  try {
    const historyCollection = await getCollection('importHistory')
    importHistory.value = historyCollection || []
  } catch (error: any) {
    console.error('Error loading import history:', error)
    historyError.value = 'Unable to load import history. Please check your permissions.'
    toast.add({
      severity: 'error',
      summary: 'Access Denied',
      detail: 'You do not have permission to view the import history. Please contact your administrator.',
      life: 5000
    })
    importHistory.value = []
  } finally {
    loadingHistory.value = false
  }
})

// Preview Data
const previewData = computed(() => {
  if (!importForm.value.collectionType) return null

  switch (importForm.value.collectionType) {
    case 'users':
      return faker.generateUser(importForm.value.includeImages)
    case 'products':
      return faker.generateProduct(importForm.value.includeImages)
    case 'categories':
      return faker.generateCategory(importForm.value.includeImages)
    default:
      return null
  }
})

// Generate Data Based on Collection Type
const generateData = (type: string) => {
  switch (type) {
    case 'users':
      return faker.generateUser(importForm.value.includeImages)
    case 'products':
      return faker.generateProduct(importForm.value.includeImages)
    case 'categories':
      return faker.generateCategory(importForm.value.includeImages)
    default:
      return null
  }
}

// Handle Import
const handleImport = async () => {
  submitted.value = true

  if (!importForm.value.collectionType || !importForm.value.count) {
    return
  }

  try {
    importing.value = true
    const startTime = Date.now()

    // Clear existing data if requested
    if (importForm.value.clearExisting) {
      const existingDocs = await getCollection(importForm.value.collectionType)
      for (const doc of existingDocs) {
        await deleteDocument(importForm.value.collectionType, doc.id)
      }
    }

    // Reset progress
    importProgress.value = {
      current: 0,
      total: importForm.value.count
    }

    // Generate and import data
    for (let i = 0; i < importForm.value.count; i++) {
      const data = generateData(importForm.value.collectionType)
      await setDocument(importForm.value.collectionType, data.id.toString(), data)
      importProgress.value.current++
    }

    // Calculate duration
    const duration = ((Date.now() - startTime) / 1000).toFixed(2)

    // Add to history
    importHistory.value.unshift({
      timestamp: Date.now(),
      collection: importForm.value.collectionType,
      count: importForm.value.count,
      status: 'completed',
      duration
    })

    toast.add({
      severity: 'success',
      summary: 'Import Complete',
      detail: `Successfully imported ${importForm.value.count} records`,
      life: 3000
    })
  } catch (error: any) {
    importHistory.value.unshift({
      timestamp: Date.now(),
      collection: importForm.value.collectionType,
      count: importProgress.value.current,
      status: 'failed',
      duration: 0
    })

    toast.add({
      severity: 'error',
      summary: 'Import Failed',
      detail: error.message,
      life: 3000
    })
  } finally {
    importing.value = false
    submitted.value = false
  }
}
definePageMeta({
  layout: "fullscreen"
});
</script>

<style scoped>
pre {
  white-space: pre-wrap;
  word-wrap: break-word;
}

</style>
