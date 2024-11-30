<template>
  <div>
    <Card class="component-title">
      <template #content>
        <div class="flex-none p-1 bg-white dark:bg-gray-800 border-b dark:border-gray-700">
          <div class="flex items-center gap-2 w-full">
            <BackButton />
            <Button label="ReAct Agent Demo" severity="info" disabled class="flex-1" />
            <HelpDialog
              title="ReAct Agent"
              docPath="/docs/react-agent"
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

    <Card>
      <template #title>ReAct Agent Interaction</template>
      <template #content>
        <div class="flex-1 overflow-y-auto flex flex-col">
          <!-- Messages Display Area -->
          <MessagesArea
            :messages="messages || []"
            :is-loading="isLoading"
            :hide-scrollbar="true"
            class="flex-1"
          />

          <!-- Input Area -->
          <div class="flex-none p-1 border-t dark:border-gray-700">
            <ChatInput
              :model-value="userInput"
              @update:model-value="userInput = $event"
              :is-loading="isLoading"
              @send-message="handleSendMessage"
              :placeholder="'Ask me to solve a problem...'"
            />
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
import { StringOutputParser } from '@langchain/core/output_parsers';
import { PromptTemplate } from '@langchain/core/prompts';
import { StructuredOutputParser } from '@langchain/core/output_parsers';
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
const userInput = ref('');
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
async function handleSendMessage() {
  if (!userInput.value.trim() || isLoading.value) return;

  // Check for API key
  const apiKey = getStoredApiKey();
  if (!apiKey) {
    showApiKeyDialog.value = true;
    return;
  }

  const question = userInput.value;
  messages.value.push({
    role: 'user',
    content: question,
  });

  userInput.value = '';
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

<style scoped>
</style>
