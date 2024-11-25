<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { ChatOpenAI } from '@langchain/openai';
import { HumanMessage, AIMessage, SystemMessage } from '@langchain/core/messages';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, Timestamp } from 'firebase/firestore';
import { useFirebase } from '~/composables/useFirebase';
import { DynamicStructuredTool } from '@langchain/core/tools';
import { z } from 'zod';
import { AgentExecutor, createOpenAIToolsAgent } from 'langchain/agents';
import { pull } from 'langchain/hub';

interface Message {
  role: 'human' | 'ai' | 'system';
  content: string;
  timestamp: Date | Timestamp;
}

const messages = ref<Message[]>([]);
const newMessage = ref('');
const isLoading = ref(false);
const apiKey = ref('');
const showApiKeyDialog = ref(false);
const agent = ref<AgentExecutor | null>(null);
const error = ref<string | null>(null);

// Get Firestore instance
const { firestore } = useFirebase();

const formatTimestamp = (timestamp: Date | Timestamp): string => {
  const date = timestamp instanceof Timestamp ? timestamp.toDate() : timestamp;
  return date.toLocaleTimeString();
};

// Define tools
const weatherTool = new DynamicStructuredTool({
  name: 'get_current_weather',
  description: 'Get the current weather in a given location',
  schema: z.object({
    location: z.string().describe('The city and state, e.g. San Francisco, CA'),
  }),
  func: async ({ location }) => {
    // Mock weather data for demonstration
    const conditions = ['sunny', 'cloudy', 'rainy', 'windy'];
    const temps = Array.from({ length: 30 }, (_, i) => i + 60); // 60-90°F
    return JSON.stringify({
      location,
      temperature: temps[Math.floor(Math.random() * temps.length)],
      conditions: conditions[Math.floor(Math.random() * conditions.length)],
    });
  },
});

const calculatorTool = new DynamicStructuredTool({
  name: 'calculator',
  description: 'Perform basic arithmetic calculations',
  schema: z.object({
    operation: z.string().describe('The mathematical operation to perform (add, subtract, multiply, divide)'),
    num1: z.number().describe('First number'),
    num2: z.number().describe('Second number'),
  }),
  func: async ({ operation, num1, num2 }) => {
    switch (operation.toLowerCase()) {
      case 'add':
        return `${num1 + num2}`;
      case 'subtract':
        return `${num1 - num2}`;
      case 'multiply':
        return `${num1 * num2}`;
      case 'divide':
        if (num2 === 0) return 'Cannot divide by zero';
        return `${num1 / num2}`;
      default:
        return 'Invalid operation';
    }
  },
});

const tools = [weatherTool, calculatorTool];

onMounted(async () => {
  try {
    const savedKey = window?.localStorage?.getItem('openai_api_key');
    if (savedKey) {
      apiKey.value = savedKey;
      initializeAgent();
    } else {
      showApiKeyDialog.value = true;
    }

    if (!firestore) return;

    // Subscribe to messages
    const messagesRef = collection(firestore, 'chat-messages');
    const q = query(messagesRef, orderBy('timestamp', 'asc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      messages.value = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          ...data,
          timestamp: data.timestamp || new Date(),
        } as Message;
      });
    }, (err) => {
      console.error('Error getting messages:', err);
      error.value = 'Failed to load messages. Please refresh the page.';
    });

    // Cleanup subscription on component unmount
    return () => unsubscribe();
  } catch (e) {
    console.error('Error in onMounted:', e);
    error.value = 'An error occurred while initializing the chat.';
  }
});

const initializeAgent = async () => {
  if (apiKey.value) {
    try {
      const model = new ChatOpenAI({
        openAIApiKey: apiKey.value,
        temperature: 0,
        modelName: 'gpt-4-1106-preview',
      });

      // Get the prompt from LangChain Hub
      const prompt = await pull<any>('hwchase17/openai-tools-agent');

      // Create the agent
      const agentObj = await createOpenAIToolsAgent({
        llm: model,
        tools,
        prompt,
      });

      // Create the executor
      agent.value = AgentExecutor.fromAgentAndTools({
        agent: agentObj,
        tools,
        verbose: true,
      });

      if (window?.localStorage) {
        window.localStorage.setItem('openai_api_key', apiKey.value);
      }
      showApiKeyDialog.value = false;
      error.value = null;
    } catch (e) {
      console.error('Error initializing agent:', e);
      error.value = 'Failed to initialize agent with API key.';
    }
  }
};

const sendMessage = async () => {
  if (!newMessage.value.trim() || isLoading.value || !agent.value || !firestore) return;

  const messageContent = newMessage.value.trim();
  const userMessage = {
    role: 'human' as const,
    content: messageContent,
    timestamp: new Date()
  };

  isLoading.value = true;
  newMessage.value = '';
  error.value = null;

  try {
    // Add user message to Firestore
    const messagesRef = collection(firestore, 'chat-messages');
    await addDoc(messagesRef, {
      ...userMessage,
      timestamp: serverTimestamp()
    });

    // Get AI response using the agent
    const result = await agent.value.invoke({
      input: messageContent,
    });

    // Add AI response to Firestore
    await addDoc(messagesRef, {
      role: 'ai',
      content: result.output,
      timestamp: serverTimestamp()
    });

  } catch (e) {
    console.error('Error:', e);
    error.value = 'Failed to send message. Please try again.';
    
    if (e.toString().includes('API key')) {
      error.value = 'Invalid API key. Please check your OpenAI API key.';
      showApiKeyDialog.value = true;
      agent.value = null;
    } else {
      // Add error message to Firestore
      if (firestore) {
        try {
          const messagesRef = collection(firestore, 'chat-messages');
          await addDoc(messagesRef, {
            role: 'system',
            content: 'Sorry, there was an error processing your message.',
            timestamp: serverTimestamp()
          });
        } catch (firestoreError) {
          console.error('Error saving error message:', firestoreError);
        }
      }
    }
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="card">
    <Dialog
      v-model:visible="showApiKeyDialog"
      modal
      :closable="true"
      header="OpenAI API Key Required"
      :closeOnEscape="false"
      class="z-50"
    >
      <div class="flex flex-col gap-4">
        <div class="space-y-4">
          <div class="text-sm space-y-2">
            <p class="font-semibold mt-4">The API key will be securely stored in your browser's localStorage. You can change it anytime by clicking the key icon again.</p>

            <p class="font-semibold mt-4">To get an OpenAI API key:</p>
            <ol class="list-decimal list-inside space-y-1">
              <li>Go to <a href="https://platform.openai.com/api-keys" target="_blank" class="text-primary hover:underline">OpenAI's API page</a></li>
              <li>Create an account or log in</li>
              <li>Click "Create new secret key"</li>
              <li>Copy the key and paste it below</li>
            </ol>
          </div>
        </div>
        <p class="font-semibold mt-4">Please enter your OpenAI API key to use the chat.</p>

        <InputText
          v-model="apiKey"
          type="password"
          placeholder="sk-..."
          class="w-full"
        />
        <Button
          label="Start Chat"
          @click="initializeAgent"
          :disabled="!apiKey"
          class="w-full"
        />
      </div>
    </Dialog>

    <div class="flex flex-col min-h-screen">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold">AI Chat with Tools</h1>
        <Button
          icon="pi pi-key"
          severity="secondary"
          text
          @click="showApiKeyDialog = true"
          v-tooltip.bottom="'Configure OpenAI API Key'"
        />
      </div>

      <!-- Tool Information -->
      <div class="mb-4 p-4 bg-primary-50 dark:bg-primary-900/30 rounded-lg">
        <h2 class="text-lg font-semibold mb-2">Available Tools:</h2>
        <ul class="list-disc list-inside space-y-1">
          <li><strong>Weather Tool:</strong> Get current weather in any location</li>
          <li><strong>Calculator:</strong> Perform basic arithmetic operations</li>
        </ul>
        <p class="mt-2 text-sm">Try asking things like "What's the weather in New York?" or "Calculate 25 times 13"</p>
      </div>

      <!-- Error Message -->
      <Message v-if="error" severity="error" :closable="false" class="mb-4">{{ error }}</Message>

      <!-- Messages Container -->
      <div class="flex-1 mb-4 bg-white dark:bg-slate-800 rounded-lg p-4">
        <div v-for="(message, index) in messages" :key="index" class="mb-4">
          <div
            :class="{
              'flex gap-4': true,
              'justify-end': message.role === 'human'
            }"
          >
            <div
              :class="{
                'max-w-[80%] rounded-lg p-3': true,
                'bg-primary-50 dark:bg-primary-900/30': message.role === 'human',
                'bg-emerald-50 dark:bg-emerald-900/30': message.role === 'ai',
                'bg-sky-50 dark:bg-sky-900/30': message.role === 'system'
              }"
            >
              <div class="flex items-center gap-2 mb-1">
                <span class="font-semibold">
                  {{ message.role === 'human' ? 'You' : message.role === 'ai' ? 'AI' : 'System' }}
                </span>
                <span class="text-xs text-gray-500">
                  {{ formatTimestamp(message.timestamp) }}
                </span>
              </div>
              <p class="whitespace-pre-wrap">{{ message.content }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Input Area -->
      <div class="sticky bottom-0 bg-white dark:bg-gray-900 pt-4">
        <div class="flex gap-2">
          <InputText
            v-model="newMessage"
            placeholder="Ask about weather or calculations..."
            class="flex-1 !bg-white dark:!bg-gray-900 !border-gray-300 dark:!border-gray-600"
            @keyup.enter="sendMessage"
            :disabled="isLoading || !agent"
          />
          <Button
            icon="pi pi-send"
            @click="sendMessage"
            :loading="isLoading"
            :disabled="!newMessage.trim() || !agent"
          />
        </div>

        <!-- Help text if API key is not set -->
        <div v-if="!agent" class="text-sm text-gray-500 mt-2">
          Click the key icon in the top right to set up your OpenAI API key
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.p-dialog {
  width: 90vw;
  max-width: 500px;
  z-index: 1000;
}

.p-dialog-mask {
  z-index: 999;
}

/* Remove any overlay styles that might be causing issues */
:deep(.p-component-overlay) {
  background-color: rgba(0, 0, 0, 0.4);
}

.p-inputtext {
  color: var(--text-color);
}

.p-inputtext::placeholder {
  color: var(--text-color-secondary);
}

:deep(.p-inputtext:enabled:focus) {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 1px var(--primary-color);
}
</style>
