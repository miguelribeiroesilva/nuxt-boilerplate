<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-6">PrimeVue SpeedDial Showcase</h1>

    <!-- Basic SpeedDial -->
    <div class="mb-6">
      <h2 class="text-xl font-semibold mb-3">Basic SpeedDial</h2>
      <div class="flex justify-center">
        <SpeedDial 
          :model="basicActions" 
          type="linear" 
        />
      </div>
    </div>

    <!-- SpeedDial Positions -->
    <div class="mb-6">
      <h2 class="text-xl font-semibold mb-3">SpeedDial Positions</h2>
      <div class="grid grid-cols-3 gap-4 h-64 relative">
        <SpeedDial 
          :model="positionActions" 
          position="top-left" 
          class="absolute top-0 left-0" 
        />
        <SpeedDial 
          :model="positionActions" 
          position="top-right" 
          class="absolute top-0 right-0" 
        />
        <SpeedDial 
          :model="positionActions" 
          position="bottom-left" 
          class="absolute bottom-0 left-0" 
        />
        <SpeedDial 
          :model="positionActions" 
          position="bottom-right" 
          class="absolute bottom-0 right-0" 
        />
      </div>
    </div>

    <!-- SpeedDial Styles -->
    <div class="mb-6">
      <h2 class="text-xl font-semibold mb-3">SpeedDial Styles</h2>
      <div class="flex flex-wrap justify-center gap-4">
        <SpeedDial 
          :model="styleActions" 
          type="linear" 
          direction="up" 
        />
        <SpeedDial 
          :model="styleActions" 
          type="linear" 
          direction="down" 
        />
        <SpeedDial 
          :model="styleActions" 
          type="linear" 
          direction="left" 
        />
        <SpeedDial 
          :model="styleActions" 
          type="linear" 
          direction="right" 
        />
      </div>
    </div>

    <!-- Circular SpeedDial -->
    <div class="mb-6">
      <h2 class="text-xl font-semibold mb-3">Circular SpeedDial</h2>
      <div class="flex flex-wrap justify-center gap-4">
        <SpeedDial 
          :model="circularActions" 
          type="circle" 
          direction="up" 
        />
        <SpeedDial 
          :model="circularActions" 
          type="circle" 
          direction="down" 
        />
        <SpeedDial 
          :model="circularActions" 
          type="circle" 
          direction="left" 
        />
        <SpeedDial 
          :model="circularActions" 
          type="circle" 
          direction="right" 
        />
      </div>
    </div>

    <!-- Tooltip SpeedDial -->
    <div class="mb-6">
      <h2 class="text-xl font-semibold mb-3">SpeedDial with Tooltips</h2>
      <div class="flex justify-center">
        <SpeedDial 
          :model="tooltipActions" 
          type="linear" 
          direction="up" 
        />
      </div>
    </div>

    <!-- Conditional SpeedDial -->
    <div class="mb-6">
      <h2 class="text-xl font-semibold mb-3">Conditional SpeedDial</h2>
      <div class="flex justify-center">
        <SpeedDial 
          :model="conditionalActions" 
          type="linear" 
          direction="up" 
        />
      </div>
    </div>

    <!-- Interactive Demo -->
    <div class="mb-6">
      <h2 class="text-xl font-semibold mb-3">Interactive SpeedDial</h2>
      <div class="flex justify-center items-center flex-col">
        <div class="mb-4">
          <Button 
            :label="isSpeedDialVisible ? 'Hide' : 'Show'" 
            @click="toggleSpeedDial" 
          />
        </div>
        <SpeedDial 
          v-if="isSpeedDialVisible"
          :model="interactiveActions" 
          type="linear" 
          direction="up" 
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useToast } from 'primevue/usetoast'

const toast = useToast()

// State for interactive demo
const isSpeedDialVisible = ref(false)

// Toggle SpeedDial visibility
const toggleSpeedDial = () => {
  isSpeedDialVisible.value = !isSpeedDialVisible.value
}

// Action handler
const handleAction = (label: string) => {
  toast.add({ 
    severity: 'info', 
    summary: 'Action Triggered', 
    detail: `${label} action selected` 
  })
}

// Basic actions
const basicActions = ref([
  {
    label: 'Add',
    icon: 'pi pi-plus',
    command: () => handleAction('Add')
  },
  {
    label: 'Edit',
    icon: 'pi pi-pencil',
    command: () => handleAction('Edit')
  },
  {
    label: 'Delete',
    icon: 'pi pi-trash',
    command: () => handleAction('Delete')
  }
])

// Position actions
const positionActions = ref([
  {
    label: 'Share',
    icon: 'pi pi-share-alt',
    command: () => handleAction('Share')
  },
  {
    label: 'Print',
    icon: 'pi pi-print',
    command: () => handleAction('Print')
  }
])

// Style actions
const styleActions = ref([
  {
    label: 'Save',
    icon: 'pi pi-save',
    command: () => handleAction('Save')
  },
  {
    label: 'Undo',
    icon: 'pi pi-undo',
    command: () => handleAction('Undo')
  }
])

// Circular actions
const circularActions = ref([
  {
    label: 'Email',
    icon: 'pi pi-envelope',
    command: () => handleAction('Email')
  },
  {
    label: 'Download',
    icon: 'pi pi-download',
    command: () => handleAction('Download')
  }
])

// Tooltip actions
const tooltipActions = ref([
  {
    label: 'Add',
    icon: 'pi pi-plus',
    tooltip: 'Create New Item',
    command: () => handleAction('Add')
  },
  {
    label: 'Update',
    icon: 'pi pi-refresh',
    tooltip: 'Refresh Data',
    command: () => handleAction('Update')
  }
])

// Conditional actions
const conditionalActions = ref([
  {
    label: 'Action 1',
    icon: 'pi pi-bolt',
    visible: true,
    command: () => handleAction('Action 1')
  },
  {
    label: 'Action 2',
    icon: 'pi pi-star',
    visible: false,
    command: () => handleAction('Action 2')
  }
])

// Interactive actions
const interactiveActions = ref([
  {
    label: 'Create',
    icon: 'pi pi-plus',
    command: () => handleAction('Create')
  },
  {
    label: 'Update',
    icon: 'pi pi-pencil',
    command: () => handleAction('Update')
  },
  {
    label: 'Delete',
    icon: 'pi pi-trash',
    command: () => handleAction('Delete')
  }
])
</script>

<style scoped>
.h-64 {
  height: 16rem;
}
</style>
