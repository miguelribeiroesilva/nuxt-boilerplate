<template>
  <ChatHeader
    title="AI Chat"
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

  <ModelConfigSidebar v-model="showSidebar" :model="model" :config="modelConfig" :available-models="availableModels"
    @update:config="updateConfig" position="right" />

</template>

<script setup lang="ts">
import { ChatOpenAI } from '@langchain/openai';
import { HumanMessage, AIMessage, SystemMessage } from '@langchain/core/messages';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, Timestamp } from 'firebase/firestore';
import ChatInterface from './components/ChatInterface.vue';

import ApiKeyDialog from '~/pages/ai/components/ApiKeyDialog.vue';
import ModelConfigSidebar from '~/pages/ai/components/ModelConfigSidebar.vue';
import ChatHeader from '~/pages/ai/components/ChatHeader.vue';

interface Message {
  role: 'user' | 'error' | 'human' | 'ai' | 'assistant';
  content: string;
  timestamp: Date | Timestamp;
}

// Component state
const messages = ref<Message[]>([]);
const newMessage = ref('');
const isLoading = ref(false);
const apiKey = ref('');
const { error, validateApiKey, getStoredApiKey } = useApiKeyValidation();
const initialized = ref(false);
const showApiKeyDialog = ref(false);
const chat = ref<ChatOpenAI | null>(null);
const { config: modelConfig, model, showSidebar, initializeModel, updateConfig, availableModels } = useAIModel();

// Get Firestore instance and utils
const { firestore, formatTimestamp } = useFirebase();

const initializeChat = async () => {
  if (await validateApiKey(apiKey.value)) {
    initialized.value = true;

    try {
      // Initialize the chat model
      chat.value = new ChatOpenAI({
        openAIApiKey: apiKey.value.trim(),
        temperature: 0.7,
      });

      showApiKeyDialog.value = false;
      error.value = null;
    } catch (e) {
      console.error('Error initializing chat:', e);
      error.value = 'Failed to initialize chat with API key.';
      chat.value = null;
      if (window?.localStorage) {
        window.localStorage.removeItem('openai_api_key');
      }
    }
  }
};

const sendMessage = async () => {
  if (!newMessage.value.trim() || isLoading.value || !chat.value) {
    return;
  }

  const messageContent = newMessage.value.trim();
  newMessage.value = '';
  isLoading.value = true;

  try {
    // Add user message locally first
    messages.value.push({
      role: 'human',
      content: messageContent,
      timestamp: new Date(),
    });

    // Get AI response
    const response = await chat.value.invoke([
      new SystemMessage('You are a helpful AI assistant.'),
      ...messages.value.map(msg =>
        msg.role === 'human' ? new HumanMessage(msg.content) : new AIMessage(msg.content)
      )
    ]);

    // Add AI response locally
    messages.value.push({
      role: 'ai',
      content: Array.isArray(response.content)
        ? (response.content[0] as { text?: string }).text || ''
        : String(response.content),
      timestamp: new Date(),
    });

    // If Firestore is available, store messages
    if (firestore) {
      await addDoc(collection(firestore, 'messages'), {
        content: String(messageContent),
        role: 'human',
        timestamp: serverTimestamp(),
      });

      await addDoc(collection(firestore, 'messages'), {
        content: Array.isArray(response.content)
          ? (response.content[0] as { text?: string }).text || ''
          : String(response.content),
        role: 'ai',
        timestamp: serverTimestamp(),
      });
    }
  } catch (e) {
    console.error('Error:', e);
    error.value = 'Failed to send message. Please try again.';

    if (e.toString().includes('API key')) {
      error.value = 'Invalid API key. Please check your API key.';
      showApiKeyDialog.value = true;
      chat.value = null;
    }
  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => {
  try {
    const savedKey = getStoredApiKey();

    // If a saved API key exists, attempt to initialize the model
    if (savedKey) {
      apiKey.value = savedKey;
      
      // Attempt to initialize the model
      const initializedModel = await initializeModel(savedKey);
      
      // Check if model initialization was successful
      if (initializedModel) {
        // Optional: Test the model with a simple message
        try {
          await initializedModel.invoke([
            new SystemMessage('You are a helpful AI assistant.'),
            new HumanMessage('Hello, can you confirm you are working?')
          ]);
        } catch (testError) {
          console.error('Model test failed:', testError);
          initializedModel = null;
        }
      }
    }

    // Set up Firestore messages listener
    const messagesRef = collection(firestore, 'chat_messages');
    const q = query(messagesRef, orderBy('timestamp', 'asc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          const messageData = change.doc.data() as Message;
          messages.value.push({
            ...messageData,
            timestamp: formatTimestamp(messageData.timestamp)
          });
        }
      });
    });

    // Cleanup subscription on component unmount
    return () => unsubscribe();
  } catch (e) {
    console.error('Error during chat initialization:', e);
    error.value = 'Failed to initialize chat. Please try again.';
  }
});

const handleApiKeySubmit = async (key: string) => {
  try {
    apiKey.value = key;
    await initializeChat();
  } catch (e) {
    console.error('Error submitting API key:', e);
    error.value = 'Failed to initialize chat with API key.';
  }
};

</script>
