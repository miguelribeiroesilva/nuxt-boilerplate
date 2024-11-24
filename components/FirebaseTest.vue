<template>
  <div>
    <h2>Firebase Test Component</h2>
    <p v-if="error" class="error">{{ error }}</p>
    <p v-else-if="initialized" class="success">Firebase successfully initialized!</p>
    <p v-else>Checking Firebase initialization...</p>
  </div>
</template>

<script setup lang="ts">
const { app } = useFirebase()
const initialized = ref(false)
const error = ref('')

onMounted(async () => {
  try {
    if (app) {
      initialized.value = true
    }
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'An error occurred initializing Firebase'
    console.error('Firebase initialization error:', e)
  }
})
</script>

<style scoped>
.error {
  color: red;
  font-weight: bold;
}

.success {
  color: green;
  font-weight: bold;
}
</style>
