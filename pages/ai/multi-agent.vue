<template>
  <Card>
    <template #content>
      <BackButton />
      <Button label="Multi-Agent Demo" severity="info" disabled />
    </template>
  </Card>

  <Card class="mb-4">
    <template #title>Agent Configuration</template>
    <template #content>
      <AgentConfiguration
        v-model="agentConfig"
        @update:modelValue="handleConfigUpdate"
      />
    </template>
  </Card>

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
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { ChatOpenAI } from '@langchain/openai';
import { HumanMessage, AIMessage, SystemMessage } from '@langchain/core/messages';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { PromptTemplate } from '@langchain/core/prompts';
import AgentConfiguration from './components/AgentConfiguration.vue';
import { useAgentConfig } from '@/composables/useAgentConfig';

// Component state
const messages = ref<Message[]>([]);
const userInput = ref('');
const isLoading = ref(false);

// Initialize agent configuration
const { config: agentConfig, getActiveRoles } = useAgentConfig();

// Initialize OpenAI models for each role
const models = new Map<string, ChatOpenAI>();

// Update models when configuration changes
function handleConfigUpdate() {
  // Clear existing models
  models.clear();
  
  // Create new models for each active role
  getActiveRoles().forEach(role => {
    models.set(role.name, new ChatOpenAI({
      modelName: agentConfig.value.modelName,
      temperature: role.temperature,
      maxTokens: agentConfig.value.maxTokens,
    }));
  });
}

// Initial model setup
handleConfigUpdate();

// Handle sending messages
async function handleSendMessage() {
  if (!userInput.value.trim() || isLoading.value) return;

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
    messages.value.push({
      role: 'error',
      content: 'An error occurred while processing your request.',
    });
    console.error('Error:', error);
  } finally {
    isLoading.value = false;
  }
}
</script>
