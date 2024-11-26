<template>
  <div class="flex flex-col h-screen bg-white dark:bg-gray-800">
    <div class="flex-none p-1 bg-white dark:bg-gray-800 border-b dark:border-gray-700">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Chat with Tools</h1>
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
        v-model="userInput"
        :is-loading="isLoading"
        @send-message="sendMessage"
      />
    </div>

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
import { HumanMessage } from '@langchain/core/messages';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';

// Get AI model configuration
const {
  config: modelConfig,
  model,
  showSidebar,
  initializeModel,
  updateConfig,
  availableModels,
} = useAIModel();

// Component state
const messages = ref<any[]>([]);
const userInput = ref('');
const isLoading = ref(false);
const apiKey = ref('');
const showApiKeyDialog = ref(false);
const error = ref<string | null>(null);

// Get Firestore instance and utils
const { firestore, formatTimestamp } = useFirebase();

const validateApiKey = (key: string): boolean => {
  if (!key) return false;
  key = key.trim();

  if (modelConfig.value.provider === 'openai') {
    return key.startsWith('sk-');
  } else if (modelConfig.value.provider === 'anthropic') {
    return /^sk-ant-api\d{2}-/.test(key);
  }
  return false;
};

const initializeChat = async (key: string) => {
  if (!validateApiKey(key)) {
    error.value = 'Invalid API key format. Key should start with "sk-"';
    return;
  }

  try {
    await initializeModel(key);
    if (window?.localStorage) {
      window.localStorage.setItem(`${modelConfig.value.provider}_api_key`, key);
    }
    showApiKeyDialog.value = false;
    error.value = null;
  } catch (e) {
    console.error('Error initializing chat:', e);
    error.value = 'Failed to initialize chat with API key.';
    if (window?.localStorage) {
      window.localStorage.removeItem(`${modelConfig.value.provider}_api_key`);
    }
  }
};

const sendMessage = async () => {
  if (!userInput.value.trim() || isLoading.value || !model.value || !firestore) return;

  const messageContent = userInput.value.trim();
  userInput.value = '';

  try {
    isLoading.value = true;

    // Add user message to Firestore
    await addDoc(collection(firestore, 'messages'), {
      content: messageContent,
      role: 'human',
      timestamp: serverTimestamp(),
    });

    // Get AI response
    const response = await model.value.invoke([
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
      model.value = null;
    }
  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => {
  try {
    const provider = modelConfig.value.provider;
    const savedKey = window?.localStorage?.getItem(`${provider}_api_key`);
    if (savedKey) {
      await initializeChat(savedKey);
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
          id: doc.id,
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

// Watch for model config changes
watch(() => modelConfig.value, async (newConfig, oldConfig) => {
  if (JSON.stringify(newConfig) === JSON.stringify(oldConfig)) return;

  const provider = modelConfig.value.provider;
  const storedKey = window?.localStorage?.getItem(`${provider}_api_key`);
  if (storedKey) {
    try {
      await initializeChat(storedKey);
    } catch (e) {
      console.error('Error updating model config:', e);
      error.value = 'Failed to initialize model with stored API key.';
      showApiKeyDialog.value = true;
    }
  } else {
    showApiKeyDialog.value = true;
  }
}, { deep: true });

const handleApiKeySubmit = async (key: string) => {
  try {
    apiKey.value = key;
    await initializeChat(key);
  } catch (e) {
    console.error('Error submitting API key:', e);
    error.value = 'Failed to initialize with the provided API key.';
  }
};
</script>

<style scoped>
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>
