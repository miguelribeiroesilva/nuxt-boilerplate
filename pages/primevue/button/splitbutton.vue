<template>
  <div class="p-6 space-y-6">
    <div class="card">
      <h2 class="text-xl font-semibold mb-4 dark:text-white">Basic Split Buttons</h2>
      <div class="flex flex-wrap gap-4 items-center">
        <SplitButton 
          label="Save" 
          icon="pi pi-save" 
          :model="saveActions"
        />
        <SplitButton 
          label="Options" 
          severity="secondary" 
          icon="pi pi-cog" 
          :model="configActions"
        />
      </div>
    </div>

    <div class="card">
      <h2 class="text-xl font-semibold mb-4 dark:text-white">Split Button Severities</h2>
      <div class="flex flex-wrap gap-4 items-center">
        <SplitButton 
          label="Primary" 
          severity="primary" 
          :model="primaryActions"
        />
        <SplitButton 
          label="Success" 
          severity="success" 
          :model="successActions"
        />
        <SplitButton 
          label="Info" 
          severity="info" 
          :model="infoActions"
        />
        <SplitButton 
          label="Warning" 
          severity="warning" 
          :model="warningActions"
        />
        <SplitButton 
          label="Danger" 
          severity="danger" 
          :model="dangerActions"
        />
      </div>
    </div>

    <div class="card">
      <h2 class="text-xl font-semibold mb-4 dark:text-white">Split Button Styles</h2>
      <div class="flex flex-wrap gap-4 items-center">
        <SplitButton 
          label="Outlined" 
          outlined 
          :model="outlinedActions"
        />
        <SplitButton 
          label="Raised" 
          raised 
          :model="raisedActions"
        />
        <SplitButton 
          label="Rounded" 
          rounded 
          :model="roundedActions"
        />
      </div>
    </div>

    <div class="card">
      <h2 class="text-xl font-semibold mb-4 dark:text-white">Split Button States</h2>
      <div class="flex flex-wrap gap-4 items-center">
        <SplitButton 
          label="Disabled" 
          disabled 
          :model="disabledActions"
        />
        <SplitButton 
          label="Loading" 
          loading 
          :model="loadingActions"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import SplitButton from 'primevue/splitbutton'

// Action menus for different split buttons
const saveActions = [
  {
    label: 'Update',
    icon: 'pi pi-refresh',
    command: () => console.log('Update clicked')
  },
  {
    label: 'Delete',
    icon: 'pi pi-trash',
    command: () => console.log('Delete clicked')
  }
]

const configActions = [
  {
    label: 'Settings',
    icon: 'pi pi-cog',
    command: () => console.log('Settings clicked')
  },
  {
    label: 'Preferences',
    icon: 'pi pi-sliders-h',
    command: () => console.log('Preferences clicked')
  }
]

// Duplicate action menus for different severities and styles
const primaryActions = [...saveActions]
const successActions = [...configActions]
const infoActions = [...saveActions]
const warningActions = [...configActions]
const dangerActions = [...saveActions]

const outlinedActions = [...configActions]
const raisedActions = [...saveActions]
const roundedActions = [...configActions]

const disabledActions = [...saveActions]
const loadingActions = [...configActions]
</script>

<style scoped>
.card {
  @apply bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-6;
}
</style>
