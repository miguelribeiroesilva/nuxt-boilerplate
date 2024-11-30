<template>
  <div>
    <div class="flex-none p-1 bg-white dark:bg-gray-800 border-b dark:border-gray-700">
      <div class="flex items-center gap-2 w-full">
        <BackButton />
        <Button label="Multi-Agent Demo" severity="info" disabled class="flex-1" />
        <HelpDialog
          title="Multi-Agent System"
          docPath="/docs/multi-agent"
        />
        <Button
          icon="pi pi-cog"
          @click="showSidebar = true"
          text
          rounded
          aria-label="Settings"
          class="p-1"
        />
      </div>
    </div>

    <div class="flex-1 overflow-y-auto flex flex-col">
      <Card>
        <template #title>Agent Interaction</template>
        <template #content>
          <div class="flex flex-col h-[600px]">
            <MessagesArea
              :messages="messages"
              :is-loading="isLoading"
              :hide-scrollbar="true"
              class="flex-1"
            />
            <div class="flex-none p-1 border-t dark:border-gray-700">
              <ChatInput
                v-model="userInput"
                :is-loading="isLoading"
                @send-message="handleSendMessage"
                :placeholder="'Describe your task...'"
              />
            </div>
          </div>
        </template>
      </Card>
      <ApiKeyDialog v-if="showApiKeyDialog" @close="showApiKeyDialog = false" />
    </div>

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
import Button from 'primevue/button';
import BackButton from '~/components/BackButton.vue';
import MessagesArea from './components/MessagesArea.vue';
import ChatInput from './components/ChatInput.vue';
import ApiKeyDialog from '~/pages/ai/components/ApiKeyDialog.vue';
import HelpDialog from '~/components/HelpDialog.vue';
import ModelConfigSidebar from '~/pages/ai/components/ModelConfigSidebar.vue';

import '@/assets/css/component-title.css';

import { useAgentConfig } from '~/composables/useAgentConfig';
import { useApiKeyValidation } from '~/composables/useApiKeyValidation';

// Component state
const messages = ref([]);
const userInput = ref('');
const isLoading = ref(false);
const showApiKeyDialog = ref(false);
const showSidebar = ref(false);

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
async function handleSendMessage() {
  if (!userInput.value.trim() || isLoading.value) return;

  // Check for API key
  const apiKey = getStoredApiKey();
  if (!apiKey) {
    showApiKeyDialog.value = true;
    return;
  }

  const task = userInput.value;
  messages.value.push({
    role: 'user',
    content: task,
  });

  userInput.value = '';
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
</script>

<style scoped>
</style>
