<template>
  <div>
    <Card class="component-title">
      <template #content>
        <div class="flex-none p-1 bg-white dark:bg-gray-800 border-b dark:border-gray-700">
          <div class="flex items-center gap-2 w-full">
            <BackButton />
            <Button label="Agent Collaboration Demo" severity="info" disabled class="flex-1" />
            <HelpDialog
              title="Agent Collaboration"
              docPath="/docs/agent-collaboration"
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
      </template>
    </Card>

    <Card class="mb-4">
      <template #title>Agent Collaboration</template>
      <template #content>
        <div class="flex-1 overflow-y-auto flex flex-col">
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
                placeholder="Enter your task for the agents..."
              />
            </div>
          </div>
        </div>
      </template>
    </Card>

    <ApiKeyDialog v-if="showApiKeyDialog" @close="showApiKeyDialog = false" />
    <ModelConfigSidebar
      v-model="showSidebar"
      :model="model"
      :config="modelConfig"
      :available-models="availableModels"
      @update:config="updateConfig"
      position="right"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { ChatOpenAI } from '@langchain/openai';
import { RunnableSequence } from '@langchain/core/runnables';
import { ChatPromptTemplate, MessagesPlaceholder } from '@langchain/core/prompts';
import { AIMessage, HumanMessage, SystemMessage } from '@langchain/core/messages';
import Card from 'primevue/card';
import Button from 'primevue/button';
import BackButton from '~/components/BackButton.vue';
import MessagesArea from './components/MessagesArea.vue';
import ChatInput from './components/ChatInput.vue';
import ApiKeyDialog from '~/pages/ai/components/ApiKeyDialog.vue';
import HelpDialog from '~/components/HelpDialog.vue';
import ModelConfigSidebar from '~/pages/ai/components/ModelConfigSidebar.vue';
import { useApiKeyValidation } from '~/composables/useApiKeyValidation';
import '@/assets/css/component-title.css';

// Types
interface Message {
  role: 'user' | 'assistant' | 'error' | 'system';
  content: string;
}

interface Agent {
  name: string;
  systemPrompt: string;
  model: ChatOpenAI | null;
  chain: RunnableSequence | null;
}

// Component state
const messages = ref<Message[]>([]);
const userInput = ref('');
const isLoading = ref(false);
const showApiKeyDialog = ref(false);
const showSidebar = ref(false);

// API Key handling
const { validateApiKey, getStoredApiKey } = useApiKeyValidation();

// Agent definitions
const agents = ref<Record<string, Agent>>({
  mathematician: {
    name: 'Mathematician',
    systemPrompt: 'You are a skilled mathematician. Help solve mathematical aspects of problems.',
    model: null,
    chain: null
  },
  programmer: {
    name: 'Programmer',
    systemPrompt: 'You are an expert programmer. Help implement solutions in code.',
    model: null,
    chain: null
  },
  critic: {
    name: 'Critic',
    systemPrompt: 'You are a thoughtful critic. Review and improve solutions, considering edge cases and potential issues.',
    model: null,
    chain: null
  }
});

// Create agent chain
const createAgentChain = (agent: Agent, model: ChatOpenAI) => {
  const prompt = ChatPromptTemplate.fromMessages([
    ['system', agent.systemPrompt],
    new MessagesPlaceholder('chat_history'),
    ['human', '{input}']
  ]);

  return RunnableSequence.from([prompt, model]);
};

// Determine next agent based on response
const determineNextAgent = (response: string, currentAgent: string): string => {
  const needsMath = /math|calculation|formula|equation|compute/i.test(response);
  const needsCode = /code|implement|function|algorithm/i.test(response);
  const needsReview = /review|improve|consider|edge case/i.test(response);

  if (needsMath && currentAgent !== 'mathematician') return 'mathematician';
  if (needsCode && currentAgent !== 'programmer') return 'programmer';
  if (needsReview && currentAgent !== 'critic') return 'critic';
  return '';
};

// Initialize agents
const initializeAgents = async (apiKey: string) => {
  try {
    for (const [key, agent] of Object.entries(agents.value)) {
      const model = new ChatOpenAI({
        modelName: 'gpt-3.5-turbo',
        temperature: 0.7,
        openAIApiKey: apiKey,
      });

      agent.model = model;
      agent.chain = createAgentChain(agent, model);
    }
    return true;
  } catch (error) {
    console.error('Error initializing agents:', error);
    return false;
  }
};

// Handle sending messages
const handleSendMessage = async () => {
  if (!userInput.value.trim() || isLoading.value) return;

  const apiKey = getStoredApiKey();
  if (!apiKey) {
    showApiKeyDialog.value = true;
    return;
  }

  isLoading.value = true;
  const userMessage = userInput.value;
  userInput.value = '';

  try {
    // Initialize agents if needed
    if (!agents.value.programmer.model) {
      const initialized = await initializeAgents(apiKey);
      if (!initialized) {
        throw new Error('Failed to initialize agents');
      }
    }

    // Add user message to display
    messages.value.push({
      role: 'user',
      content: userMessage,
    });

    let currentAgent = 'programmer';
    let currentInput = userMessage;
    let chatHistory: (HumanMessage | AIMessage | SystemMessage)[] = [];

    // Collaborative loop
    while (currentAgent && chatHistory.length < 6) { // Limit iterations to prevent infinite loops
      const agent = agents.value[currentAgent];

      // Run the agent's chain
      const response = await agent.chain!.invoke({
        input: currentInput,
        chat_history: chatHistory
      });

      // Add agent's response to messages and history
      messages.value.push({
        role: 'assistant',
        content: `${agent.name}: ${response.content}`
      });

      chatHistory.push(new HumanMessage(currentInput));
      chatHistory.push(new AIMessage(response.content));

      // Determine next agent
      const nextAgent = determineNextAgent(response.content, currentAgent);
      if (nextAgent === currentAgent || !nextAgent) break;

      currentAgent = nextAgent;
      currentInput = response.content;
    }

  } catch (error) {
    console.error('Error in collaboration:', error);
    messages.value.push({
      role: 'error',
      content: error instanceof Error ? error.message : 'An error occurred during the collaboration',
    });
  } finally {
    isLoading.value = false;
  }
};

// Initialize on mount
onMounted(async () => {
  const apiKey = getStoredApiKey();
  if (apiKey) {
    try {
      await initializeAgents(apiKey);
    } catch (error) {
      console.error('Error initializing with stored API key:', error);
      showApiKeyDialog.value = true;
    }
  } else {
    showApiKeyDialog.value = true;
  }
});
</script>

<style scoped>
/* Disabled info button styling */
.disabled-info-btn.p-button.p-button-info.p-disabled,
.disabled-info-btn.p-button.p-button-info:disabled {
    background: #1e293b !important;
    color: #94a3b8 !important;
    border-color: #334155 !important;
}

:root.dark .disabled-info-btn.p-button.p-button-info.p-disabled,
:root.dark .disabled-info-btn.p-button.p-button-info:disabled {
    opacity: 1 !important;
}
</style>
