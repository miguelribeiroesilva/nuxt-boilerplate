<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-6">PrimeVue Fieldset Showcase</h1>

    <!-- Basic Fieldset -->
    <div class="mb-6">
      <h2 class="text-xl font-semibold mb-3">Basic Fieldset</h2>
      <Fieldset legend="User Information">
        <div class="space-y-2">
          <p><strong>Name:</strong> John Doe</p>
          <p><strong>Email:</strong> john.doe@example.com</p>
          <p><strong>Role:</strong> Developer</p>
        </div>
      </Fieldset>
    </div>

    <!-- Toggleable Fieldset -->
    <div class="mb-6">
      <h2 class="text-xl font-semibold mb-3">Toggleable Fieldset</h2>
      <Fieldset legend="Account Settings" :toggleable="true">
        <div class="space-y-3">
          <div class="flex items-center">
            <Checkbox v-model="notificationsEnabled" :binary="true" class="mr-2" />
            <label>Enable Notifications</label>
          </div>
          <div class="flex items-center">
            <Checkbox v-model="darkModeEnabled" :binary="true" class="mr-2" />
            <label>Dark Mode</label>
          </div>
        </div>
      </Fieldset>
    </div>

    <!-- Fieldset with Custom Icons -->
    <div class="mb-6">
      <h2 class="text-xl font-semibold mb-3">Fieldset with Custom Icons</h2>
      <Fieldset 
        legend="Project Details" 
        :toggleable="true"
        toggleIcon="pi pi-folder-open"
        collapseIcon="pi pi-folder"
      >
        <div class="space-y-2">
          <p><strong>Project Name:</strong> Enterprise Dashboard</p>
          <p><strong>Status:</strong> In Progress</p>
          <p><strong>Team Members:</strong> 5</p>
        </div>
      </Fieldset>
    </div>

    <!-- Multiple Fieldsets -->
    <div class="mb-6">
      <h2 class="text-xl font-semibold mb-3">Multiple Fieldsets</h2>
      <div class="grid md:grid-cols-3 gap-4">
        <Fieldset legend="Personal">
          <div class="space-y-2">
            <i class="pi pi-user text-primary text-2xl block text-center mb-2"></i>
            <p class="text-center">Personal information management</p>
          </div>
        </Fieldset>
        <Fieldset legend="Security">
          <div class="space-y-2">
            <i class="pi pi-lock text-primary text-2xl block text-center mb-2"></i>
            <p class="text-center">Account security settings</p>
          </div>
        </Fieldset>
        <Fieldset legend="Preferences">
          <div class="space-y-2">
            <i class="pi pi-cog text-primary text-2xl block text-center mb-2"></i>
            <p class="text-center">User preferences and customization</p>
          </div>
        </Fieldset>
      </div>
    </div>

    <!-- Fieldset with Complex Content -->
    <div class="mb-6">
      <h2 class="text-xl font-semibold mb-3">Fieldset with Complex Content</h2>
      <Fieldset legend="Advanced Profile" :toggleable="true">
        <div class="grid md:grid-cols-2 gap-4">
          <div>
            <h3 class="text-lg font-semibold mb-2">Contact Information</h3>
            <div class="space-y-2">
              <p><i class="pi pi-phone mr-2 text-primary"></i>+1 (555) 123-4567</p>
              <p><i class="pi pi-envelope mr-2 text-primary"></i>john.doe@example.com</p>
              <p><i class="pi pi-map-marker mr-2 text-primary"></i>San Francisco, CA</p>
            </div>
          </div>
          <div>
            <h3 class="text-lg font-semibold mb-2">Professional Details</h3>
            <div class="space-y-2">
              <p><strong>Position:</strong> Senior Developer</p>
              <p><strong>Department:</strong> Engineering</p>
              <p><strong>Experience:</strong> 7+ years</p>
            </div>
          </div>
        </div>
      </Fieldset>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// State for toggleable checkboxes
const notificationsEnabled = ref(false)
const darkModeEnabled = ref(true)
</script>

<style scoped>
.card {
  @apply shadow-md rounded-lg p-4 mb-4;
}
</style>
