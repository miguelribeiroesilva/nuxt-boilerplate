<template>
  <div class="flex flex-col h-screen bg-white dark:bg-gray-800">
    <div class="flex-none p-1 bg-white dark:bg-gray-800 border-b dark:border-gray-700">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">AI Chat</h1>
    </div>

    <div class="flex-1 mt-4 overflow-hidden">
      <MessagesArea
        :messages="messages"
        :is-loading="isLoading"
        :hide-scrollbar="true"
      />
    </div>

    <div class="flex-none p-1 border-t dark:border-gray-700">
      <ChatInput
        v-model="newMessage"
        :is-loading="isLoading"
        @send-message="sendMessage"
      />
    </div>

    <ApiKeyDialog
      v-model="showApiKeyDialog"
      v-model:apiKey="apiKey"
      :error="error"
      provider="openai"
      @submit="handleApiKeySubmit"
    />

    <ModelConfigSidebar
      v-model="showSidebar"
      :model="model"
      :config="modelConfig"
      :available-models="availableModels"
      @update:config="updateConfig"
    />
  </div>
</template>

<script setup lang="ts">
import { ChatOpenAI } from '@langchain/openai';
import { HumanMessage, AIMessage, SystemMessage } from '@langchain/core/messages';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, Timestamp } from 'firebase/firestore';

interface Message {
  role: 'human' | 'ai' | 'system';
  content: string;
  timestamp: Date | Timestamp;
}

// Component state
const messages = ref<Message[]>([]);
const newMessage = ref('');
const isLoading = ref(false);
const apiKey = ref('');
const { error, validateApiKey } = useApiKeyValidation();
const initialized = ref(false);
const showApiKeyDialog = ref(false);
const chat = ref<ChatOpenAI | null>(null);
const showSidebar = ref(false);
const model = ref('');
const modelConfig = ref({});
const availableModels = ref([]);

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

      // Test the API key with a simple request
      await chat.value.invoke([new HumanMessage('test')]);

      if (window?.localStorage) {
        window.localStorage.setItem('openai_api_key', apiKey.value);
      }
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
  if (!newMessage.value.trim() || isLoading.value || !chat.value || !firestore) return;

  const messageContent = newMessage.value.trim();
  newMessage.value = '';

  try {
    isLoading.value = true;

    // Add user message to Firestore
    await addDoc(collection(firestore, 'messages'), {
      content: messageContent,
      role: 'human',
      timestamp: serverTimestamp(),
    });

    // Get AI response
    const response = await chat.value.invoke([
      new SystemMessage('You are a helpful AI assistant.'),
      new HumanMessage(messageContent)
    ]);

    // Add AI response to Firestore
    await addDoc(collection(firestore, 'messages'), {
      content: response.content,
      role: 'ai',
      timestamp: serverTimestamp(),
    });

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
    const savedKey = window?.localStorage?.getItem('openai_api_key');
    if (savedKey) {
      apiKey.value = savedKey;
      await initializeChat();
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
        return {
          content: data.content,
          role: data.role,
          timestamp: data.timestamp ? formatTimestamp(data.timestamp) : 'Just now',
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
    await initializeChat();
  } catch (e) {
    console.error('Error submitting API key:', e);
    error.value = 'Failed to initialize with the provided API key.';
  }
};

const updateConfig = (config: any) => {
  modelConfig.value = config;
};

definePageMeta({
  layout: "fullscreen",
});
</script>
