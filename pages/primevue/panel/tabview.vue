<template>
  <div class="card">
    <h1 class="text-2xl font-bold mb-4">PrimeVue TabView Showcase</h1>

    <!-- Basic TabView -->
    <div class="mb-6">
      <h2 class="text-xl font-semibold mb-3">Basic TabView</h2>
      <TabView>
        <TabPanel header="Profile">
          <p>User profile information goes here.</p>
        </TabPanel>
        <TabPanel header="Settings">
          <p>Application settings and preferences.</p>
        </TabPanel>
        <TabPanel header="Notifications">
          <p>Manage your notification preferences.</p>
        </TabPanel>
      </TabView>
    </div>

    <!-- Disabled Tab -->
    <div class="mb-6">
      <h2 class="text-xl font-semibold mb-3">TabView with Disabled Tab</h2>
      <TabView>
        <TabPanel header="Active Tab" :disabled="false">
          <p>This tab is active and accessible.</p>
        </TabPanel>
        <TabPanel header="Disabled Tab" :disabled="true">
          <p>This tab is currently disabled.</p>
        </TabPanel>
      </TabView>
    </div>

    <!-- Dynamic Tabs -->
    <div class="mb-6">
      <h2 class="text-xl font-semibold mb-3">Dynamic Tabs</h2>
      <TabView>
        <TabPanel v-for="(tab, index) in dynamicTabs" :key="index" :header="tab.title">
          <p>{{ tab.content }}</p>
          <Button 
            severity="danger" 
            @click="removeTab(index)" 
            class="mt-2"
          >
            Remove Tab
          </Button>
        </TabPanel>
      </TabView>
      <Button 
        @click="addTab" 
        severity="success" 
        class="mt-2"
      >
        Add New Tab
      </Button>
    </div>

    <!-- Scrollable Tabs -->
    <div class="mb-6">
      <h2 class="text-xl font-semibold mb-3">Scrollable Tabs</h2>
      <TabView :scrollable="true">
        <TabPanel v-for="n in 10" :key="n" :header="`Tab ${n}`">
          <p>Content for Tab {{ n }}</p>
        </TabPanel>
      </TabView>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const dynamicTabs = ref([
  { title: 'First Tab', content: 'Content of the first dynamic tab' },
  { title: 'Second Tab', content: 'Content of the second dynamic tab' }
])

const addTab = () => {
  const newTabIndex = dynamicTabs.value.length + 1
  dynamicTabs.value.push({
    title: `Tab ${newTabIndex}`,
    content: `Dynamic content for Tab ${newTabIndex}`
  })
}

const removeTab = (index: number) => {
  dynamicTabs.value.splice(index, 1)
}
</script>

<style scoped>
.card {
  @apply p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md;
}
</style>
