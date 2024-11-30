<template>
  <div class="flex flex-col h-screen bg-white dark:bg-gray-800">
    <header>
      <div class="flex items-center gap-2 w-full px-0">
        <BackButton />
        <Button label="Reflection Agent" severity="info" disabled class="flex-1" />
        <HelpDialog title="Reflection Agent" docPath="/docs/reflection-agent" />
        <Button icon="pi pi-cog" @click="showSidebar = true" text rounded aria-label="Settings" class="p-1" />
      </div>
    </header>

    <ChatInterface 
      v-model="newMessage"
      :messages="messages"
      :is-loading="isLoading"
      @send="sendMessage"
    />

    <ApiKeyDialog v-if="showApiKeyDialog" v-model="showApiKeyDialog" provider="openai" @close="showApiKeyDialog = false" />
    <ModelConfigSidebar
      v-model="showSidebar"
      :model="model"
      :config="modelConfig"
      :available-models="availableModels"
      @update:config="updateConfig"
      position="right"
    />
    <AgentStatus
      :metrics="metrics"
      :maxReflections="maxReflections"
      :temperature="temperature"
      @update:maxReflections="maxReflections = $event"
      @update:temperature="temperature = $event"
    />
  </div>
</template>

<script setup lang="ts">
import '@/assets/css/component-title.css';
import { watch, onMounted } from 'vue';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import BackButton from '~/components/BackButton.vue';
import ApiKeyDialog from '~/pages/ai/components/ApiKeyDialog.vue';
import AgentStatus from './components/AgentStatus.vue';
import ModelConfigSidebar from './components/ModelConfigSidebar.vue';
import ChatInterface from './components/ChatInterface.vue';
import { useReflectionAgent } from '~/composables/useReflectionAgent';

const {
  // State
  messages,
  isLoading,
  showApiKeyDialog,
  showSidebar,
  newMessage,
  maxReflections,
  temperature,
  modelConfig,
  model,
  availableModels,
  metrics,

  // Methods
  sendMessage,
  initialize,
  updateConfig
} = useReflectionAgent();

// Watch temperature changes
watch(temperature, (newTemp) => {
  if (model) {
    updateConfig({ temperature: newTemp });
  }
});

// Initialize on mount
onMounted(initialize);
</script>

<style scoped></style>
