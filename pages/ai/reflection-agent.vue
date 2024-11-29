<template>
  <div>
    <Card class="mb-4">
      <template #content>
        <BackButton />
        <Button label="Reflection Agent Demo" severity="info" disabled />
      </template>
    </Card>

    <Card class="mb-4">
      <template #title>Agent Status</template>
      <template #content>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <PerformanceMetrics :metrics="metrics" />
          <AgentStrategy
            v-model:maxReflections="maxReflections"
            v-model:temperature="temperature"
          />
        </div>
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
              :placeholder="'Ask a question or describe a task...'"
            />
          </div>
        </div>
      </template>
    </Card>

    <ApiKeyDialog
      v-if="showApiKeyDialog"
      @close="showApiKeyDialog = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { ChatOpenAI } from '@langchain/openai';
import { HumanMessage, AIMessage, SystemMessage } from '@langchain/core/messages';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { PromptTemplate } from '@langchain/core/prompts';
import { StructuredOutputParser } from '@langchain/core/output_parsers';
import Card from 'primevue/card';
import Button from 'primevue/button';
import BackButton from '~/components/BackButton.vue';
import MessagesArea from './components/MessagesArea.vue';
import ChatInput from './components/ChatInput.vue';
import ApiKeyDialog from '~/components/ApiKeyDialog.vue';
import PerformanceMetrics from './components/PerformanceMetrics.vue';
import AgentStrategy from './components/AgentStrategy.vue';
import { useAgentMetrics } from '~/composables/useAgentMetrics';
import { useApiKeyValidation } from '~/composables/useApiKeyValidation';

// Types
interface Message {
  role: 'user' | 'assistant' | 'error' | 'system';
  content: string;
}

// Component state
const messages = ref<Message[]>([]);
const userInput = ref('');
const isLoading = ref(false);
const maxReflections = ref(3);
const temperature = ref(0.7);
const showApiKeyDialog = ref(false);

// Get metrics from composable
const { 
  metrics, 
  incrementTotal, 
  incrementSuccesses, 
  incrementReflections 
} = useAgentMetrics();

// API Key handling
const { validateApiKey, getStoredApiKey } = useApiKeyValidation();

// Initialize OpenAI model
let model: ChatOpenAI | null = null;

const initializeModel = async (apiKey: string) => {
  try {
    model = new ChatOpenAI({
      modelName: 'gpt-3.5-turbo',
      temperature: temperature.value,
      openAIApiKey: apiKey,
    });
    return true;
  } catch (error) {
    console.error('Error initializing model:', error);
    return false;
  }
};

// Create output parsers
const responseParser = StructuredOutputParser.fromNamesAndDescriptions({
  answer: "The agent's response to the user's question",
  confidence: "A number between 0 and 1 indicating confidence in the answer",
  reasoning: "The reasoning behind the answer",
});

const reflectionParser = StructuredOutputParser.fromNamesAndDescriptions({
  evaluation: "Evaluation of the previous response (good/needs_improvement)",
  critique: "Specific critique of what could be improved",
  improvement: "An improved version of the response",
  confidence: "New confidence score between 0 and 1",
});

// Create prompt templates
const initialPrompt = PromptTemplate.fromTemplate(`
You are a helpful AI assistant with the ability to reflect on and improve your responses.

Question: {question}

Please provide a response in the following format:
answer: Your direct response to the question
confidence: Your confidence in the answer (0-1)
reasoning: Your reasoning process
`);

const reflectionPrompt = PromptTemplate.fromTemplate(`
Review the following response to the question: {question}

Response: {previous_response}

Please evaluate this response and provide improvements in the following format:
evaluation: Whether the response is good or needs improvement
critique: Specific aspects that could be improved
improvement: An improved version of the response
confidence: Your confidence in the improved response (0-1)
`);

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
  incrementTotal();

  try {
    // Ensure model is initialized
    if (!model) {
      const initialized = await initializeModel(apiKey);
      if (!initialized) {
        throw new Error('Failed to initialize model');
      }
    }

    // Get initial response
    const response = await model!.invoke([
      new SystemMessage(initialPrompt.template),
      new HumanMessage(question)
    ]);

    const parsedResponse = await responseParser.parse(response.content);
    let currentResponse = parsedResponse;
    let reflectionCount = 0;

    // Reflection loop
    while (reflectionCount < maxReflections.value && currentResponse.confidence < 0.9) {
      reflectionCount++;
      incrementReflections();

      const reflection = await model!.invoke([
        new SystemMessage(reflectionPrompt.template),
        new HumanMessage(JSON.stringify({
          question,
          previous_response: currentResponse
        }))
      ]);

      const parsedReflection = await reflectionParser.parse(reflection.content);
      
      if (parsedReflection.evaluation === 'good') {
        break;
      }

      currentResponse = {
        answer: parsedReflection.improvement,
        confidence: parsedReflection.confidence,
        reasoning: currentResponse.reasoning + '\n\nImproved after reflection: ' + parsedReflection.critique
      };
    }

    // Add final response to messages
    messages.value.push({
      role: 'assistant',
      content: `Answer: ${currentResponse.answer}\n\nReasoning: ${currentResponse.reasoning}\n\nConfidence: ${currentResponse.confidence}`
    });

    incrementSuccesses();
  } catch (error) {
    console.error('Error:', error);
    messages.value.push({
      role: 'error',
      content: 'An error occurred while processing your request.'
    });
  } finally {
    isLoading.value = false;
  }
}

// Watch temperature changes
watch(temperature, (newTemp) => {
  if (model) {
    model.temperature = newTemp;
  }
});

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
</script>
