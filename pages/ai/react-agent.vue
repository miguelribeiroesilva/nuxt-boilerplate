<template>
  <header>
    <div class="flex items-center gap-2 w-full px-0">
      <BackButton />
      <Button label="ReAct Agent" severity="info" disabled class="flex-1" />
      <HelpDialog title="ReAct Agent" docPath="/docs/react-agent" />
      <Button icon="pi pi-cog" @click="showSidebar = true" text rounded aria-label="Settings" class="p-1" />
    </div>
  </header>

  <ChatInterface 
    v-model="newMessage"
    :messages="messages"
    :is-loading="isLoading"
    @send="sendMessage"
  />

  <ApiKeyDialog v-model="showApiKeyDialog" @close="showApiKeyDialog = false" />

  <ModelConfigSidebar v-model="showSidebar" :model="model" :config="modelConfig" :available-models="availableModels"
    @update:config="updateConfig" position="right" />

</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { ChatOpenAI } from '@langchain/openai';
import { RunnableSequence } from '@langchain/core/runnables';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { PromptTemplate } from '@langchain/core/prompts';
import { StructuredOutputParser } from '@langchain/core/output_parsers';
import Card from 'primevue/card';
import Button from 'primevue/button';
import BackButton from '~/components/BackButton.vue';
import ChatInterface from './components/ChatInterface.vue';
import ApiKeyDialog from '~/pages/ai/components/ApiKeyDialog.vue';
import HelpDialog from '~/components/HelpDialog.vue';
import ModelConfigSidebar from '~/pages/ai/components/ModelConfigSidebar.vue';
import { useApiKeyValidation } from '~/composables/useApiKeyValidation';
import '@/assets/css/component-title.css';

// Types
interface Message {
  role: 'user' | 'error' | 'assistant' | 'human' | 'ai';
  content: string;
}

interface ThoughtAction {
  thought: string;
  action: string;
  actionInput: string;
}

// Component state
const messages = ref<Message[]>([]);
const newMessage = ref('');
const isLoading = ref(false);
const showApiKeyDialog = ref(false);
const apiKeyError = ref<string | null>(null);
const showSidebar = ref(false);
const modelConfig = ref({});
const availableModels = ref([]);

// API Key handling
const { validateApiKey, getStoredApiKey } = useApiKeyValidation();

// Initialize OpenAI model
let model: ChatOpenAI | null = null;
let chain: RunnableSequence | null = null;

// Create output parser for structured thoughts and actions
const outputParser = StructuredOutputParser.fromNamesAndDescriptions({
  thought: "The agent's thought process",
  action: "The action to take",
  actionInput: "The input to the action"
});

// Create prompt template for ReAct agent
const promptTemplate = PromptTemplate.fromTemplate(`
Answer the following question by breaking it down into steps:

Question: {question}

Format your response as follows:
thought: Think about what needs to be done
action: The next action to take
actionInput: Input for the action

Response:
`);

const initializeModel = async (apiKey: string) => {
  try {
    // Initialize the model
    model = new ChatOpenAI({
      modelName: 'gpt-3.5-turbo',
      temperature: 0,
      openAIApiKey: apiKey,
    });

    // Create the chain only after model is initialized
    chain = RunnableSequence.from([
      promptTemplate,
      model,
      new StringOutputParser(),
      outputParser,
    ]);

    return true;
  } catch (error) {
    console.error('Error initializing model:', error);
    return false;
  }
};

// Handle sending messages
async function sendMessage() {
  if (!newMessage.value.trim() || isLoading.value) return;

  // Check for API key
  const apiKey = getStoredApiKey();
  if (!apiKey) {
    showApiKeyDialog.value = true;
    return;
  }

  const question = newMessage.value;
  messages.value.push({
    role: 'user',
    content: question,
  });

  newMessage.value = '';
  isLoading.value = true;

  try {
    // Ensure model and chain are initialized
    if (!model || !chain) {
      const initialized = await initializeModel(apiKey);
      if (!initialized) {
        throw new Error('Failed to initialize model');
      }
    }

    // Call the ReAct chain
    const result = await chain!.invoke({
      question,
    });

    // Format and display the agent's response
    const response = `Thought: ${result.thought}\nAction: ${result.action}\nAction Input: ${result.actionInput}`;

    messages.value.push({
      role: 'assistant',
      content: response,
    });
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

// Initialize on mount
onMounted(async () => {
  const apiKey = getStoredApiKey();
  if (apiKey) {
    try {
      await initializeModel(apiKey);
    } catch (error) {
      console.error('Error initializing model with stored API key:', error);
      showApiKeyDialog.value = true;
    }
  } else {
    showApiKeyDialog.value = true;
  }
});

function updateConfig(config: any) {
  modelConfig.value = config;
}
</script>
