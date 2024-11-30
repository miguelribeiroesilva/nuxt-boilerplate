<template>
  <div class="card">
    <BackButton />
    <Button severity="info" disabled class="flex-1">Firebase</Button>

    <!-- Configuration Status -->
    <div class="mb-4">
      <h3 class="mb-2">Configuration Status</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
        <div v-for="(value, key) in configStatus" :key="key" class="p-2 rounded-lg" :class="value ? 'bg-green-50 dark:bg-green-900/30' : 'bg-red-50 dark:bg-red-900/30'">
          <div class="flex items-center justify-between">
            <span class="font-medium">{{ formatKey(key) }}</span>
            <i :class="value ? 'pi pi-check text-green-600/70 dark:text-green-400/70' : 'pi pi-times text-red-600/70 dark:text-red-400/70'"></i>
          </div>
        </div>
      </div>
    </div>

    <!-- Current Configuration -->
    <div class="mb-4">
      <h3 class="mb-2">Current Configuration</h3>
      <div class="bg-gray-50 dark:bg-gray-800/50 p-2 rounded-lg">
        <pre class="whitespace-pre-wrap break-all text-sm"><code>{{ maskedConfig }}</code></pre>
      </div>
    </div>

    <!-- Test Connection -->
    <div class="mb-4">
      <h3 class="mb-2">Test Connection</h3>
      <Button :loading="testing" @click="handleTestConnection" severity="primary" class="mr-2">
        <i class="pi pi-sync mr-2"></i>
        Test Firebase Connection
      </Button>
      <div v-if="testResult" :class="['mt-2 p-2 rounded-lg', testResult.success ? 'bg-green-50 dark:bg-green-900/30' : 'bg-red-50 dark:bg-red-900/30']">
        <p class="font-medium text-sm" :class="testResult.success ? 'text-green-600/90 dark:text-green-400/90' : 'text-red-600/90 dark:text-red-400/90'">
          {{ testResult.message }}
        </p>
      </div>
    </div>

    <!-- Setup Instructions -->
    <div>
      <h3 class="mb-2">Setup Instructions</h3>
      <div class="space-y-2">
        <div class="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
          <h3 class="font-medium mb-1">1. Create a Firebase Project</h3>
          <p class="text-sm">Go to the <a href="https://console.firebase.google.com" target="_blank" class="text-blue-600/90 dark:text-blue-400/90 hover:underline">Firebase Console</a> and create a new project.</p>
        </div>
        <div class="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
          <h3 class="font-medium mb-1">2. Get Configuration</h3>
          <p class="text-sm">Add a web app to your Firebase project and copy the configuration.</p>
        </div>
        <div class="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
          <h3 class="font-medium mb-1">3. Set Environment Variables</h3>
          <p class="text-sm">Add the following variables to your <code>.env</code> file:</p>
          <pre class="mt-1 bg-gray-200 dark:bg-gray-700 p-1 rounded">
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


</script>
