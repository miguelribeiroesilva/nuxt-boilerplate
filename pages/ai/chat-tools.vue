<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { ChatOpenAI } from '@langchain/openai';
import { HumanMessage } from '@langchain/core/messages';
import { ChatPromptTemplate, MessagesPlaceholder } from '@langchain/core/prompts';
import { AgentExecutor, createOpenAIFunctionsAgent } from 'langchain/agents';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, Timestamp } from 'firebase/firestore';
import { useFirebase } from '~/composables/useFirebase';
import { weatherTool } from './tools/weatherTool';
import { calculatorTool } from './tools/calculatorTool';
import ApiKeyDialog from './components/ApiKeyDialog.vue';

// Initialize tools array
const tools = [weatherTool, calculatorTool];

// Component state
const messages = ref<any[]>([]);
const newMessage = ref('');
const isLoading = ref(false);
const apiKey = ref('');
const showApiKeyDialog = ref(false);
const agent = ref<AgentExecutor | null>(null);
const error = ref<string | null>(null);

// Get Firestore instance and utils
const { firestore, formatTimestamp } = useFirebase();

const validateApiKey = (key: string): boolean => {
  return key.startsWith('sk-') && key.length > 20;
};

const initializeAgent = async (key: string) => {
  if (!key) {
    error.value = 'API key is required';
    return;
  }

  if (!validateApiKey(key)) {
    error.value = 'Invalid API key format. Key should start with "sk-"';
    return;
  }

  try {
    const model = new ChatOpenAI({
      openAIApiKey: key.trim(),
      temperature: 0.7,
    });

    // Test the API key with a simple request
    await model.invoke([new HumanMessage('test')]);

    // Create prompt template
    const prompt = ChatPromptTemplate.fromMessages([
      ["system", "You are a helpful AI assistant that can use tools to help answer questions. For the calculator, you can perform basic arithmetic operations (add, subtract, multiply, divide). For weather, you can check the current weather in any location."],
      ["human", "{input}"],
      new MessagesPlaceholder("agent_scratchpad"),
    ]);

    // Create agent with tools
    const agentObj = await createOpenAIFunctionsAgent({
      llm: model,
      tools,
      prompt,
    });

    // Create agent executor
    agent.value = AgentExecutor.fromAgentAndTools({
      agent: agentObj,
      tools,
      verbose: true,
    });

    if (window?.localStorage) {
      window.localStorage.setItem('openai_api_key', key);
    }
    showApiKeyDialog.value = false;
    error.value = null;
  } catch (e) {
    console.error('Error initializing agent:', e);
    error.value = 'Failed to initialize agent with API key.';
    agent.value = null;
    if (window?.localStorage) {
      window.localStorage.removeItem('openai_api_key');
    }
  }
};

onMounted(async () => {
  try {
    const savedKey = window?.localStorage?.getItem('openai_api_key');
    if (savedKey) {
      apiKey.value = savedKey;
      await initializeAgent(savedKey);
    } else {
      showApiKeyDialog.value = true;
    }

    if (!firestore) return;

    // Subscribe to messages
    const messagesRef = collection(firestore, 'messages');
    const q = query(messagesRef, orderBy('timestamp', 'asc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      messages.value = snapshot.docs.map(doc => {
        const data = doc.data();
        const timestamp = data.timestamp;
        return {
          id: doc.id,
          content: data.content,
          role: data.role,
          timestamp: timestamp ? formatTimestamp(timestamp) : 'Just now',
        };
      });
    });

    // Cleanup subscription on component unmount
    return () => unsubscribe();
  } catch (e) {
    console.error('Error in onMounted:', e);
    error.value = 'An error occurred while initializing the chat.';
  }
});

const handleApiKeySubmit = async (key: string) => {
  try {
    apiKey.value = key;
    await initializeAgent(key);
  } catch (e) {
    console.error('Error submitting API key:', e);
    error.value = 'Failed to initialize with the provided API key.';
  }
};

const sendMessage = async () => {
  if (!newMessage.value.trim() || isLoading.value || !agent.value || !firestore) return;

  const messageContent = newMessage.value.trim();
  const userMessage = {
    content: messageContent,
    role: 'human',
    timestamp: serverTimestamp(),
  };

  try {
    isLoading.value = true;
    newMessage.value = '';

    // Add user message to Firestore
    await addDoc(collection(firestore, 'messages'), userMessage);

    // Get AI response
    const response = await agent.value.invoke({
      input: messageContent,
    });

    // Add AI response to Firestore
    await addDoc(collection(firestore, 'messages'), {
      content: response.output,
      role: 'ai',
      timestamp: serverTimestamp(),
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
        await addDoc(collection(firestore, 'messages'), {
          content: 'Error: Failed to process message. Please try again.',
          role: 'system',
          timestamp: serverTimestamp(),
        });
      }
    }
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="chat-container">
    <div class="chat-content">
      <!-- API Key Dialog -->
      <ApiKeyDialog
        v-model="showApiKeyDialog"
        v-model:apiKey="apiKey"
        :error="error"
        provider="openai"
        @submit="handleApiKeySubmit"
      />

      <!-- Header with API Key Button -->
      <div class="flex justify-between items-center mb-4">
        <h1 class="text-xl font-semibold">AI Chat with Tools</h1>
        <Button
          icon="pi pi-key"
          severity="secondary"
          text
          @click="showApiKeyDialog = true"
          v-tooltip.bottom="'Configure OpenAI API Key'"
        />
      </div>

      <!-- Tool Information -->
      <div class="mb-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <h2 class="text-lg font-semibold mb-2">Available Tools:</h2>
        <ul class="list-disc list-inside space-y-1">
          <li><strong>Weather:</strong> Get current weather in any location</li>
          <li><strong>Calculator:</strong> Perform basic arithmetic operations</li>
        </ul>
        <p class="mt-2 text-sm">Try asking things like "What's the weather in New York?" or "Calculate 25 times 13"</p>
      </div>

      <!-- Error Message -->
      <Message v-if="error" severity="error" :closable="false" class="mb-4">{{ error }}</Message>

      <!-- Chat Messages -->
      <div class="messages-container">
        <div v-for="message in messages" :key="message.id" class="message-wrapper">
          <div :class="['message', message.role === 'human' ? 'user-message' : 'ai-message']">
            <div class="message-content">
              {{ message.content }}
            </div>
            <div class="message-timestamp">
              {{ message.timestamp }}
            </div>
          </div>
        </div>
      </div>

      <!-- Input Area -->
      <div class="input-area">
        <div class="p-inputgroup">
          <InputText
            v-model="newMessage"
            placeholder="Ask about weather or calculations..."
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
.chat-container {
  height: 100%;
  padding: 1rem;
  display: flex;
  flex-direction: column;
}

.chat-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  margin-bottom: 1rem;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background-color: var(--surface-ground);
  border-radius: 0.5rem;
}

.message-wrapper {
  display: flex;
  flex-direction: column;
}

.message {
  max-width: 80%;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  position: relative;
}

.user-message {
  align-self: flex-end;
  background-color: var(--primary-color);
  color: white;
}

.ai-message {
  align-self: flex-start;
  background-color: var(--surface-200);
  color: var(--text-color);
}

.message-content {
  margin-bottom: 0.25rem;
  white-space: pre-wrap;
}

.message-timestamp {
  font-size: 0.75rem;
  opacity: 0.7;
}

.input-area {
  margin-top: auto;
  padding: 1rem;
  background-color: var(--surface-card);
  border-radius: 0.5rem;
}
</style>
