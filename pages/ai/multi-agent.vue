<template>
  <div class="flex flex-col h-screen bg-white dark:bg-gray-800">
    <header>
      <div class="flex items-center gap-2 w-full px-0">
        <BackButton />
        <Button label="Multi-Agent" severity="info" disabled class="flex-1" />
        <HelpDialog title="Multi-Agent" docPath="/docs/multi-agent" />
        <Button icon="pi pi-cog" @click="showSidebar = true" text rounded aria-label="Settings" class="p-1" />
      </div>
    </header>

    <ChatInterface 
      v-model="newMessage"
      :messages="messages"
      :is-loading="isLoading"
      @send="sendMessage"
    />

    <ApiKeyDialog 
      v-if="showApiKeyDialog"
      v-model="showApiKeyDialog"
      v-model:apiKey="apiKey"
      :error="error"
      provider="openai"
      @close="showApiKeyDialog = false"
      @submit="handleApiKeySubmit"
    />

    <ModelConfigSidebar
      v-model="showSidebar"
      :model="model"
      :config="modelConfig"
      :available-models="availableModels"
      :agent-config="agentConfig"
      @update:config="updateConfig"
      @update:agent-config="handleConfigUpdate"
      position="right"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { ChatOpenAI } from '@langchain/openai';
import { HumanMessage, AIMessage, SystemMessage } from '@langchain/core/messages';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { PromptTemplate } from '@langchain/core/prompts';
import Card from 'primevue/card';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import BackButton from '~/components/BackButton.vue';
import MessagesArea from './components/MessagesArea.vue';
import ApiKeyDialog from '~/pages/ai/components/ApiKeyDialog.vue';
import HelpDialog from '~/components/HelpDialog.vue';
import ModelConfigSidebar from '~/pages/ai/components/ModelConfigSidebar.vue';
import ChatInterface from '~/pages/ai/components/ChatInterface.vue';

import '@/assets/css/component-title.css';

import { useAgentConfig } from '~/composables/useAgentConfig';
import { useApiKeyValidation } from '~/composables/useApiKeyValidation';
import { useAIModel } from '~/composables/useAIModel';

// Component state
const messages = ref([]);
const newMessage = ref('');
const isLoading = ref(false);
const showApiKeyDialog = ref(false);
const showSidebar = ref(false);
const apiKey = ref('');
const error = ref('');

// Initialize agent configuration
const { config: agentConfig, getActiveRoles } = useAgentConfig() as { config: any, getActiveRoles: any };

// API Key handling
const { validateApiKey, getStoredApiKey } = useApiKeyValidation();

// Initialize OpenAI models for each role
let models = new Map<string, ChatOpenAI>();

// Update models when configuration changes
async function handleConfigUpdate() {
  // Check for API key
  const apiKey = getStoredApiKey();
  if (!apiKey) {
    showApiKeyDialog.value = true;
    return;
  }

  try {
    // Clear existing models
    models.clear();

    // Create new models for each active role
    getActiveRoles().forEach((role: { name: string; temperature: any; }) => {
      models.set(role.name, new ChatOpenAI({
        modelName: agentConfig?.modelName || 'gpt-3.5-turbo',
        temperature: role.temperature,
        maxTokens: agentConfig?.maxTokens || 2000,
        openAIApiKey: apiKey,
      }));
    });
  } catch (error) {
    console.error('Error updating models:', error);
    messages.value.push({
      role: 'error',
      content: 'Failed to update agent configuration.'
    });
  }
}

// Handle sending messages
const sendMessage = async () => {
  if (!newMessage.value.trim() || isLoading.value) return;

  // Check for API key
  const apiKey = getStoredApiKey();
  if (!apiKey) {
    showApiKeyDialog.value = true;
    return;
  }

  const task = newMessage.value;
  messages.value.push({
    role: 'user',
    content: task,
  });

  newMessage.value = '';
  isLoading.value = true;

  try {
    let context = '';
    const activeRoles = getActiveRoles();

    // Ensure models are initialized
    if (models.size === 0) {
      await handleConfigUpdate();
    }

    for (const role of activeRoles) {
      const model = models.get(role.name);
      if (!model) continue;

      messages.value.push({
        role: 'system',
        content: `${role.name} is analyzing the task...`,
      });

      const response = await model.invoke([
        new SystemMessage(role.systemPrompt),
        new HumanMessage(`${task}\n\nPrevious context: ${context}`),
      ]);

      context += `\n\n${role.name}'s contribution:\n${response.content}`;

      messages.value.push({
        role: 'assistant',
        content: `${role.name}: ${response.content}`,
      });
    }
  } catch (error) {
    console.error('Error:', error);
    messages.value.push({
      role: 'error',
      content: `Error processing your request: ${error instanceof Error ? error.message : 'Unknown error'}`
    });
  } finally {
    isLoading.value = false;
  }
}

// Initialize on mount
onMounted(async () => {
  const apiKey = getStoredApiKey();
  if (apiKey) {
    try {
      await handleConfigUpdate();
    } catch (error) {
      console.error('Error initializing models with stored API key:', error);
      showApiKeyDialog.value = true;
    }
  } else {
    showApiKeyDialog.value = true;
  }
});

// Model config sidebar
const model = ref(null);
const modelConfig = ref({});
const availableModels = ref([]);
const updateConfig = () => {};

const handleApiKeySubmit = async (apiKey: string) => {
  try {
    await validateApiKey(apiKey);
    showApiKeyDialog.value = false;
  } catch (error) {
    error.value = 'Invalid API key';
  }
}
</script>

<style scoped>
</style>
