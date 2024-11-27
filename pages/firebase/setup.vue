<template>
  <div class="card">
    <h1 class="text-3xl font-bold mb-6">Firebase Setup</h1>

    <!-- Configuration Status -->
    <div class="mb-8">
      <h2 class="text-xl font-semibold mb-4">Configuration Status</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div v-for="(value, key) in configStatus" :key="key" class="p-4 rounded-lg" :class="value ? 'bg-green-100 dark:bg-green-900' : 'bg-red-100 dark:bg-red-900'">
          <div class="flex items-center justify-between">
            <span class="font-medium">{{ formatKey(key) }}</span>
            <i :class="value ? 'pi pi-check text-green-600 dark:text-green-400' : 'pi pi-times text-red-600 dark:text-red-400'"></i>
          </div>
        </div>
      </div>
    </div>

    <!-- Current Configuration -->
    <div class="mb-8">
      <h2 class="text-xl font-semibold mb-4">Current Configuration</h2>
      <div class="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
        <pre class="whitespace-pre-wrap break-all"><code>{{ maskedConfig }}</code></pre>
      </div>
    </div>

    <!-- Test Connection -->
    <div class="mb-8">
      <h2 class="text-xl font-semibold mb-4">Test Connection</h2>
      <Button :loading="testing" @click="handleTestConnection" severity="primary" class="mr-2">
        <i class="pi pi-sync mr-2"></i>
        Test Firebase Connection
      </Button>
      <div v-if="testResult" :class="['mt-4 p-4 rounded-lg', testResult.success ? 'bg-green-100 dark:bg-green-900' : 'bg-red-100 dark:bg-red-900']">
        <p class="font-medium" :class="testResult.success ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'">
          {{ testResult.message }}
        </p>
      </div>
    </div>

    <!-- Setup Instructions -->
    <div>
      <h2 class="text-xl font-semibold mb-4">Setup Instructions</h2>
      <div class="space-y-4">
        <div class="p-4 bg-blue-100 dark:bg-blue-900 rounded-lg">
          <h3 class="font-medium mb-2">1. Create a Firebase Project</h3>
          <p>Go to the <a href="https://console.firebase.google.com" target="_blank" class="text-blue-600 dark:text-blue-400 hover:underline">Firebase Console</a> and create a new project.</p>
        </div>
        <div class="p-4 bg-blue-100 dark:bg-blue-900 rounded-lg">
          <h3 class="font-medium mb-2">2. Get Configuration</h3>
          <p>Add a web app to your Firebase project and copy the configuration.</p>
        </div>
        <div class="p-4 bg-blue-100 dark:bg-blue-900 rounded-lg">
          <h3 class="font-medium mb-2">3. Set Environment Variables</h3>
          <p>Add the following variables to your <code>.env</code> file:</p>
          <pre class="mt-2 bg-gray-200 dark:bg-gray-700 p-2 rounded">
FIREBASE_API_KEY=your-api-key
FIREBASE_AUTH_DOMAIN=your-auth-domain
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_STORAGE_BUCKET=your-storage-bucket
FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
FIREBASE_APP_ID=your-app-id</pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const toast = useToast();
const { 
  configStatus,
  maskedConfig,
  formatKey,
  testing,
  testResult,
  testConnection
} = useFirebase();

const handleTestConnection = async () => {
  const result = await testConnection();
  toast.add({
    severity: result.success ? 'success' : 'error',
    summary: result.success ? 'Success' : 'Error',
    detail: result.message,
    life: 3000
  });
};

// Set page metadata
definePageMeta({
  layout: 'default'
});
</script>

<style scoped>
.card {
  background: var(--surface-card);
  padding: 2rem;
  border-radius: 10px;
  margin: 2rem;
}

a {
  color: var(--primary-color);
}

pre {
  font-family: monospace;
}
</style>