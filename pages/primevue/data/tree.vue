<template>
  <div class="container mx-auto p-4">
    <h1 class="text-3xl font-bold mb-6">PrimeVue Tree Showcase</h1>

    <!-- Organizational Hierarchy -->
    <div class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">Corporate Organizational Hierarchy</h2>
      <div class="card">
        <Tree 
          :value="corporateHierarchy" 
          :expandedKeys="expandedCorpKeys"
          @node-expand="onCorpNodeExpand"
          class="w-full"
        >
          <template #default="slotProps">
            <div class="flex items-center">
              <Avatar 
                :image="slotProps.node.data.avatar" 
                size="large" 
                shape="circle" 
                class="mr-4" 
                v-if="slotProps.node.data.avatar"
              />
              <div>
                <h3 class="font-bold">{{ slotProps.node.label }}</h3>
                <p class="text-sm text-gray-500">{{ slotProps.node.data.title }}</p>
              </div>
              <div class="ml-auto">
                <Tag 
                  :value="slotProps.node.data.department" 
                  :severity="getDepartmentSeverity(slotProps.node.data.department)" 
                />
              </div>
            </div>
          </template>
        </Tree>

        <!-- Hierarchy Selection Summary -->
        <div class="mt-4 p-4 bg-gray-100 rounded-lg">
          <h3 class="font-semibold mb-2">Expanded Nodes</h3>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <h4 class="font-medium">Expanded Nodes</h4>
              <ul class="list-disc pl-5">
                <li v-for="(value, key) in expandedCorpKeys" :key="key">
                  {{ findNodeLabel(corporateHierarchy, key) }}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- File System Explorer -->
    <div class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">File System Explorer</h2>
      <div class="card">
        <Tree 
          :value="fileSystemTree" 
          :expandedKeys="expandedFileKeys"
          selectionMode="multiple"
          v-model:selectionKeys="selectedFiles"
          @node-select="onFileNodeSelect"
          @node-unselect="onFileNodeUnselect"
          class="w-full"
        >
          <template #default="slotProps">
            <div class="flex items-center">
              <i 
                :class="getFileIcon(slotProps.node)" 
                class="mr-2 text-xl"
              ></i>
              <span>{{ slotProps.node.label }}</span>
              <div class="ml-auto text-sm text-gray-500" v-if="slotProps.node.data?.size">
                {{ formatFileSize(slotProps.node.data.size) }}
              </div>
            </div>
          </template>
        </Tree>

        <!-- File Selection Summary -->
        <div class="mt-4 p-4 bg-gray-100 rounded-lg">
          <h3 class="font-semibold mb-2">File Selection</h3>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <h4 class="font-medium">Selected Files</h4>
              <ul class="list-disc pl-5">
                <li v-for="(value, key) in selectedFiles" :key="key">
                  {{ findNodeLabel(fileSystemTree, key) }}
                </li>
              </ul>
            </div>
            <div>
              <h4 class="font-medium">Selection Summary</h4>
              <p>Total Selected: {{ Object.keys(selectedFiles).length }}</p>
              <p>Total Size: {{ calculateSelectedFileSize() }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Product Category Hierarchy -->
    <div>
      <h2 class="text-2xl font-semibold mb-4">Product Category Hierarchy</h2>
      <div class="card">
        <Tree 
          :value="productCategoryTree" 
          :expandedKeys="expandedProductKeys"
          @node-expand="onProductNodeExpand"
          class="w-full"
        >
          <template #default="slotProps">
            <div class="flex items-center">
              <i 
                :class="getProductCategoryIcon(slotProps.node)" 
                class="mr-2 text-xl"
              ></i>
              <div class="flex-grow">
                <h3 class="font-bold">{{ slotProps.node.label }}</h3>
                <p 
                  v-if="slotProps.node.data?.productCount" 
                  class="text-sm text-gray-500"
                >
                  {{ slotProps.node.data.productCount }} Products
                </p>
              </div>
              <div class="ml-auto">
                <Tag 
                  v-if="slotProps.node.data?.status" 
                  :value="slotProps.node.data.status" 
                  :severity="getCategorySeverity(slotProps.node.data.status)" 
                />
              </div>
            </div>
          </template>
        </Tree>

        <!-- Product Category Summary -->
        <div class="mt-4 p-4 bg-gray-100 rounded-lg">
          <h3 class="font-semibold mb-2">Category Insights</h3>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <h4 class="font-medium">Expanded Categories</h4>
              <ul class="list-disc pl-5">
                <li v-for="(value, key) in expandedProductKeys" :key="key">
                  {{ findNodeLabel(productCategoryTree, key) }}
                </li>
              </ul>
            </div>
            <div>
              <h4 class="font-medium">Category Summary</h4>
              <p>Total Categories: {{ countCategories(productCategoryTree) }}</p>
              <p>Total Products: {{ countProducts(productCategoryTree) }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// Corporate Hierarchy
const corporateHierarchy = ref([
  {
    key: 'ceo',
    label: 'Sarah Johnson',
    data: { 
      title: 'Chief Executive Officer', 
      department: 'Executive',
      avatar: 'https://picsum.photos/200/200?random=1'
    },
    children: [
      {
        key: 'cto',
        label: 'Mike Chen',
        data: { 
          title: 'Chief Technology Officer', 
          department: 'Technology',
          avatar: 'https://picsum.photos/200/200?random=2'
        },
        children: [
          {
            key: 'head-engineering',
            label: 'Emily Rodriguez',
            data: { 
              title: 'Head of Engineering', 
              department: 'Engineering',
              avatar: 'https://picsum.photos/200/200?random=3'
            }
          }
        ]
      },
      {
        key: 'cfo',
        label: 'David Kim',
        data: { 
          title: 'Chief Financial Officer', 
          department: 'Finance',
          avatar: 'https://picsum.photos/200/200?random=4'
        }
      }
    ]
  }
])

const expandedCorpKeys = ref({})

const onCorpNodeExpand = (node: any) => {
  expandedCorpKeys.value[node.key] = true
}

// File System Tree
const fileSystemTree = ref([
  {
    key: 'projects',
    label: 'Projects',
    children: [
      {
        key: 'project-a',
        label: 'Project A',
        children: [
          {
            key: 'src',
            label: 'src',
            children: [
              { 
                key: 'app.js', 
                label: 'app.js', 
                data: { size: 1024 } 
              },
              { 
                key: 'index.html', 
                label: 'index.html', 
                data: { size: 512 } 
              }
            ]
          },
          { 
            key: 'readme.md', 
            label: 'README.md', 
            data: { size: 256 } 
          }
        ]
      },
      {
        key: 'project-b',
        label: 'Project B',
        children: [
          { 
            key: 'main.py', 
            label: 'main.py', 
            data: { size: 2048 } 
          }
        ]
      }
    ]
  }
])

const expandedFileKeys = ref({})
const selectedFiles = ref({})

const onFileNodeSelect = (node: any) => {
  console.log('Selected:', node.label)
}

const onFileNodeUnselect = (node: any) => {
  console.log('Unselected:', node.label)
}

// Product Category Tree
const productCategoryTree = ref([
  {
    key: 'electronics',
    label: 'Electronics',
    data: { 
      productCount: 50, 
      status: 'Active' 
    },
    children: [
      {
        key: 'computers',
        label: 'Computers',
        data: { 
          productCount: 20, 
          status: 'Active' 
        },
        children: [
          {
            key: 'laptops',
            label: 'Laptops',
            data: { 
              productCount: 10, 
              status: 'Active' 
            }
          },
          {
            key: 'desktops',
            label: 'Desktops',
            data: { 
              productCount: 10, 
              status: 'Active' 
            }
          }
        ]
      },
      {
        key: 'smartphones',
        label: 'Smartphones',
        data: { 
          productCount: 30, 
          status: 'Active' 
        }
      }
    ]
  }
])

const expandedProductKeys = ref({})

const onProductNodeExpand = (node: any) => {
  expandedProductKeys.value[node.key] = true
}

// Helper Methods
const getDepartmentSeverity = (department: string) => {
  switch(department) {
    case 'Executive': return 'danger'
    case 'Technology': return 'info'
    case 'Engineering': return 'success'
    case 'Finance': return 'warning'
    default: return 'secondary'
  }
}

const getFileIcon = (node: any) => {
  if (node.children) return 'pi pi-folder text-blue-500'
  const ext = node.label.split('.').pop().toLowerCase()
  switch(ext) {
    case 'js': return 'pi pi-file text-yellow-500'
    case 'html': return 'pi pi-file text-red-500'
    case 'py': return 'pi pi-file text-green-500'
    case 'md': return 'pi pi-file text-gray-500'
    default: return 'pi pi-file'
  }
}

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`
  const kb = (bytes / 1024).toFixed(1)
  return `${kb} KB`
}

const calculateSelectedFileSize = () => {
  let totalSize = 0
  const findSelectedFiles = (nodes: any[]) => {
    nodes.forEach(node => {
      if (selectedFiles.value[node.key]) {
        totalSize += node.data?.size || 0
      }
      if (node.children) findSelectedFiles(node.children)
    })
  }
  findSelectedFiles(fileSystemTree.value)
  return formatFileSize(totalSize)
}

const findNodeLabel = (tree: any[], key: string): string => {
  const findNode = (nodes: any[]) => {
    for (const node of nodes) {
      if (node.key === key) return node.label
      if (node.children) {
        const found = findNode(node.children)
        if (found) return found
      }
    }
    return ''
  }
  return findNode(tree)
}

const getProductCategoryIcon = (node: any) => {
  if (node.children) return 'pi pi-folder text-blue-500'
  return 'pi pi-tag text-green-500'
}

const getCategorySeverity = (status: string) => {
  switch(status) {
    case 'Active': return 'success'
    case 'Inactive': return 'danger'
    default: return 'secondary'
  }
}

const countCategories = (tree: any[]) => {
  let count = 0
  const traverse = (nodes: any[]) => {
    nodes.forEach(node => {
      if (node.children) {
        count++
        traverse(node.children)
      }
    })
  }
  traverse(tree)
  return count
}

const countProducts = (tree: any[]) => {
  let count = 0
  const traverse = (nodes: any[]) => {
    nodes.forEach(node => {
      if (node.data?.productCount) {
        count += node.data.productCount
      }
      if (node.children) traverse(node.children)
    })
  }
  traverse(tree)
  return count
}
</script>

<style scoped>
.card {
  @apply shadow-md rounded-lg p-4 bg-white;
}
</style>
