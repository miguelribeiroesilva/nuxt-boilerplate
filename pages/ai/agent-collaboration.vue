<template>
  <div>
      <ChatHeader
    title="Agent Collaboration"
    :model-name="modelConfig.modelName"
    :model-status="!!model"
    :on-settings-click="() => showSidebar = true"
  />


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
import InputText from 'primevue/inputtext';

import ApiKeyDialog from '~/pages/ai/components/ApiKeyDialog.vue';
import ModelConfigSidebar from '~/pages/ai/components/ModelConfigSidebar.vue';
import ChatInterface from './components/ChatInterface.vue';
import { useApiKeyValidation } from '~/composables/useApiKeyValidation';
import { useAIModel } from '~/composables/useAIModel';
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
const newMessage = ref('');
const isLoading = ref(false);
const showApiKeyDialog = ref(false);
const showSidebar = ref(false);
const apiKey = ref('');
const error = ref('');

// Model configuration
const model = ref('gpt-3.5-turbo');
const modelConfig = ref({
  temperature: 0.7,
  maxTokens: 1000
});
const availableModels = ref(['gpt-3.5-turbo', 'gpt-4']);

const updateConfig = (newConfig: any) => {
  modelConfig.value = { ...newConfig };
};

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
      const llm = new ChatOpenAI({
        modelName: model.value,
        temperature: modelConfig.value.temperature,
        maxTokens: modelConfig.value.maxTokens,
        openAIApiKey: apiKey,
      });

      agent.model = llm;
      agent.chain = createAgentChain(agent, llm);
    }
    return true;
  } catch (error) {
    console.error('Error initializing agents:', error);
    return false;
  }
};

// Handle sending messages
  /**
   * Handle sending a message by the user. This function will kick off the
   * collaboration loop, where the agents will be called in sequence until
   * a condition is met.
   *
   * The flow of the collaboration is as follows:
   * 1. The user sends a message, which is added to the list of messages.
   * 2. The programmer agent is called with the user's message as input.
   * 3. The programmer agent's response is added to the list of messages.
   * 4. The response is analyzed to determine the next agent to call.
   * 5. If the next agent is not the same as the current agent, the loop
   *    is repeated with the new agent.
   * 6. The loop is limited to 6 iterations to prevent infinite loops.
   *
   * @returns {Promise<void>}
   */
const sendMessage = async () => {
  if (!newMessage.value.trim() || isLoading.value) return;

  const apiKey = getStoredApiKey();
  if (!apiKey) {
    showApiKeyDialog.value = true;
    return;
  }

  isLoading.value = true;
  const userMessage = newMessage.value;
  newMessage.value = '';

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

const handleApiKeySubmit = async (apiKey: string) => {
  try {
    await validateApiKey(apiKey);
    await initializeAgents(apiKey);
  } catch (error) {
    console.error('Error handling API key submit:', error);
    error.value = error.message;
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
