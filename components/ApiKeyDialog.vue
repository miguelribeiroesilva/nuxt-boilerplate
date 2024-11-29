<template>
  <Dialog
    v-model:visible="visible"
    modal
    :header="title"
    :style="{ width: '50vw' }"
    :pt="{
      root: { class: 'border-round-lg' },
      header: { class: 'pb-2' },
      content: { class: 'pt-0' },
      footer: { class: 'pt-2 pb-2' }
    }"
  >
    <div class="flex flex-col gap-4">
      <div class="text-lg">
        Please enter your API key to continue. You can get one from:
      </div>
      <div class="flex flex-col gap-2">
        <a
          href="https://console.anthropic.com/account/keys"
          target="_blank"
          class="text-blue-500 hover:text-blue-600 transition-colors"
        >
          Anthropic Console →
        </a>
      </div>
      <div class="flex flex-col gap-2">
        <label for="apiKey" class="font-medium">API Key</label>
        <InputText
          id="apiKey"
          v-model="apiKey"
          type="password"
          class="w-full"
          placeholder="Enter your API key"
          @keyup.enter="saveKey"
        />
      </div>
    </div>
    <template #footer>
      <div class="flex justify-end gap-2">
        <Button
          label="Cancel"
          severity="secondary"
          text
          @click="closeDialog"
        />
        <Button
          label="Save"
          :loading="loading"
          @click="saveKey"
        />
      </div>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRuntimeConfig } from '#app'

const config = useRuntimeConfig()
const visible = ref(true)
const apiKey = ref('')
const loading = ref(false)
const title = ref('API Key Required')

const emit = defineEmits(['close'])

const closeDialog = () => {
  visible.value = false
  emit('close')
}

const saveKey = async () => {
  if (!apiKey.value) return

  loading.value = true
  try {
    // Save the API key to localStorage
    localStorage.setItem('anthropic_api_key', apiKey.value)
    // Update the runtime config
    config.public.anthropicApiKey = apiKey.value
    visible.value = false
    emit('close')
  } catch (error) {
    console.error('Failed to save API key:', error)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
:deep(.p-dialog-header) {
  @apply border-b border-gray-200 dark:border-gray-700;
}

:deep(.p-dialog-footer) {
  @apply border-t border-gray-200 dark:border-gray-700;
}

:deep(.p-dialog-content) {
  @apply bg-white dark:bg-gray-800;
}
</style>
