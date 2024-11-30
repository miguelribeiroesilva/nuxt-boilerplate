<template>
  <div class="flex flex-col h-screen bg-white dark:bg-gray-800">
    <div class="flex items-center gap-2 w-full">
      <BackButton />
      <Button label="Chat with Tools" severity="info" disabled class="flex-1" />
      <HelpDialog title="Chat with Tools" docPath="/docs/chat-tools" />

      <Button icon="pi pi-cog" @click="showSidebar = true" text rounded aria-label="Settings" class="p-1" />

    </div>

    <div class="flex-1 mt-4 overflow-hidden">
      <MessagesArea :messages="messages" :is-loading="isLoading" :hide-scrollbar="true" />
    </div>

    <div class="flex-none p-1 border-t dark:border-gray-700">
      <ChatInput v-model="userInput" :is-loading="isLoading" @send-message="sendMessage" />
    </div>

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
const { error, validateApiKey } = useApiKeyValidation();
const initialized = ref(false);

// Get Firestore instance and utils
const { firestore, formatTimestamp } = useFirebase();

const initializeChat = async () => {
  if (await validateApiKey(apiKey.value)) {
    initialized.value = true;
    showApiKeyDialog.value = false;
    error.value = null;
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
      apiKey.value = storedKey;
      await initializeChat();
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
    await initializeChat();
  } catch (e) {
    console.error('Error submitting API key:', e);
    error.value = 'Failed to initialize with the provided API key.';
  }
};
</script>
