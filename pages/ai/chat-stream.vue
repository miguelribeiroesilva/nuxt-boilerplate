<template>
  <main class="flex flex-col h-screen bg-white dark:bg-gray-800">
    <div class="flex-none p-1 bg-white dark:bg-gray-800 border-b dark:border-gray-700">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Streaming Chat</h1>
    </div>

    <div class="flex-1 mt-4 overflow-hidden">
      <div v-if="messages.length === 0 && !isLoading" class="flex flex-col items-center justify-center h-full">
        <div class="max-w-2xl text-center text-gray-600 dark:text-gray-400">
          <blockquote class="italic">
            "{{ currentQuote.text }}"
          </blockquote>
          <p class="mt-2 font-semibold">- {{ currentQuote.author }}</p>
        </div>
      </div>

      <div v-else class="space-y-4">
        <MessagesArea
          :messages="messages"
          :is-loading="isLoading"
          :hide-scrollbar="true"
        />
      </div>

      <!-- Loading indicator -->
      <div v-if="isLoading" class="flex items-start space-x-4">
        <div class="flex-shrink-0">
          <div class="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
            AI
          </div>
        </div>
        <div class="flex-1">
          <div class="animate-pulse">
            <div class="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
              <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              <div class="space-y-2 mt-2">
                <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
              </div>
            </div>
          </div>
          <div class="mt-2 text-sm text-gray-500 italic">
            "{{ currentQuote.text }}"
            <span class="block mt-1 text-xs">- {{ currentQuote.author }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="flex-none p-1 border-t dark:border-gray-700">
      <ChatInput
        v-model="newMessage"
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
  </main>
</template>

<script setup lang="ts">
import { collection, query, orderBy, onSnapshot, updateDoc, Timestamp, serverTimestamp, addDoc } from 'firebase/firestore'
import ModelConfigSidebar from './components/ModelConfigSidebar.vue'
import MessagesArea from './components/MessagesArea.vue'
import ChatInput from './components/ChatInput.vue'
import { useAiQuotes } from '~/composables/useAiQuotes'

interface Message {
  id?: string
  role: 'human' | 'ai' | 'system'
  content: string
  timestamp: Date | Timestamp
}

// Get Firestore instance and utils
const { firestore, formatTimestamp } = useFirebase()

// Get AI model configuration
const {
  config: modelConfig,
  model,
  showSidebar,
  initializeModel,
  updateConfig,
  availableModels,
} = useAIModel()

// Component state
const messages = ref<Message[]>([])
const newMessage = ref('')
const isLoading = ref(false)
const apiKey = ref('');
const { error, validateApiKey } = useApiKeyValidation();
const initialized = ref(false)
const apiKeys = ref({
  openai: '',
  anthropic: ''
})
const showApiKeyDialog = ref(false)
const currentStreamingContent = ref('')
const currentStreamingMessageId = ref<string | null>(null) // Track current streaming message

// Dynamic system message based on model
const systemMessage = computed(() => {
  const selectedModel = availableModels.value.find(m => m.value === modelConfig.value.modelName);
  if (selectedModel) {
    if (selectedModel.provider === 'anthropic') {
      return `You are Claude ${selectedModel.label}, an AI assistant created by Anthropic. You are helpful, direct, and aim to provide accurate and nuanced responses.`;
    } else {
      return `You are OpenAI ${selectedModel.label}, an AI assistant created by OpenAI. You are helpful, creative, and aim to provide accurate and engaging responses.`;
    }
  }
  return 'Welcome to the chat!';
});

const { currentQuote, getRandomQuote } = useAiQuotes()

// Update the loading state to show new quotes
watch(isLoading, (newValue) => {
  if (newValue) {
    getRandomQuote();
  }
});

const loadStoredApiKey = () => {
  const provider = modelConfig.value.provider;
  const storedKey = window?.localStorage?.getItem(`${provider}_api_key`);
  if (storedKey) {
    apiKeys.value[provider] = storedKey;
    return storedKey;
  }
  return null;
};

const initializeChat = async () => {
  if (await validateApiKey(apiKey.value)) {
    initialized.value = true;
    showApiKeyDialog.value = false;
    error.value = null;
    try {
      await initializeModel(apiKey.value);
      window?.localStorage?.setItem(`${modelConfig.value.provider}_api_key`, apiKey.value);
      apiKeys.value[modelConfig.value.provider] = apiKey.value;
    } catch (e) {
      console.error('Error initializing model:', e);
      error.value = 'Failed to initialize model. Please check your API key.';
      showApiKeyDialog.value = true;
      window.localStorage.removeItem(`${modelConfig.value.provider}_api_key`);
    }
  }
};

// Watch for model config changes
watch(() => modelConfig.value, async (newConfig, oldConfig) => {
  // Skip if configs are the same
  if (JSON.stringify(newConfig) === JSON.stringify(oldConfig)) return;

  const storedKey = loadStoredApiKey();
  if (storedKey) {
    try {
      await initializeModel(storedKey);
    } catch (e) {
      console.error('Error updating model config:', e);
      error.value = 'Failed to initialize model with stored API key.';
      showApiKeyDialog.value = true;
    }
  } else {
    showApiKeyDialog.value = true;
  }
}, { deep: true });

// Watch for new messages and scroll
watch([messages, currentStreamingContent], () => {
  nextTick(() => {
    scrollToBottom();
  });
});

let unsubscribe: (() => void) | undefined;

onMounted(async () => {
  if (!firestore) return;

  const q = query(collection(firestore, 'messages'), orderBy('timestamp', 'asc'));
  unsubscribe = onSnapshot(q, (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      const messageData = change.doc.data() as any;
      const message: Message = {
        id: change.doc.id,
        role: messageData.role,
        content: messageData.content,
        timestamp: messageData.timestamp instanceof Timestamp
          ? formatTimestamp(messageData.timestamp)
          : null
      };

      if (change.type === 'added') {
        // Only add if it's not the currently streaming message
        if (currentStreamingMessageId.value !== change.doc.id) {
          messages.value.push(message);
        }
      } else if (change.type === 'modified') {
        // Only update if it's not the currently streaming message
        if (currentStreamingMessageId.value !== change.doc.id) {
          const index = messages.value.findIndex(m => m.id === change.doc.id);
          if (index !== -1) {
            messages.value[index] = message;
          }
        }
      } else if (change.type === 'removed') {
        const index = messages.value.findIndex(m => m.id === change.doc.id);
        if (index !== -1) {
          messages.value.splice(index, 1);
        }
      }
    });
  });

  try {
    const storedKey = loadStoredApiKey();
    if (storedKey) {
      await initializeChat();
    } else {
      showApiKeyDialog.value = true;
    }
  } catch (e) {
    console.error('Error in onMounted:', e);
    error.value = 'Failed to initialize chat.';
    showApiKeyDialog.value = true;
  }
});

onUnmounted(() => {
  if (unsubscribe) {
    unsubscribe();
  }
});

const handleApiKeySubmit = async (key: string) => {
  apiKey.value = key;
  await initializeChat();
};

const scrollToBottom = () => {
  window.scrollTo({
    top: document.documentElement.scrollHeight,
    behavior: 'smooth'
  });
};

const sendMessage = async () => {
  if (!newMessage.value.trim() || isLoading.value || !model.value || !firestore) return;

  const messageContent = newMessage.value.trim();
  newMessage.value = ''; // Clear input immediately
  currentStreamingContent.value = ''; // Reset streaming content

  try {
    isLoading.value = true;

    // Add user message to messages array and Firestore
    const userMessage = {
      role: 'human',
      content: messageContent,
      timestamp: serverTimestamp(),
    };

    await addDoc(collection(firestore, 'messages'), userMessage);

    // Add initial AI message to Firestore
    const aiMessageRef = await addDoc(collection(firestore, 'messages'), {
      role: 'ai',
      content: '',
      timestamp: serverTimestamp(),
    });

    // Set current streaming message ID
    currentStreamingMessageId.value = aiMessageRef.id;

    // Add message to local state for immediate display
    messages.value.push({
      id: aiMessageRef.id,
      role: 'ai',
      content: '',
      timestamp: new Date().toISOString()
    });

    // Create chat history with system message
    const chatHistory = [
      new SystemMessage(systemMessage.value),
      ...messages.value
        .filter(msg => msg.id !== aiMessageRef.id && msg.role !== 'system')
        .map(msg => msg.role === 'human' ? new HumanMessage(msg.content) : new AIMessage(msg.content))
    ];

    // Add current message
    chatHistory.push(new HumanMessage(messageContent));

    // Get AI response
    if (model.value) {
      const stream = await model.value.stream(chatHistory);
      let accumulatedContent = '';

      try {
        for await (const chunk of stream) {
          if (chunk.content) {
            accumulatedContent += chunk.content;

            // Update local state directly
            const index = messages.value.findIndex(m => m.id === aiMessageRef.id);
            if (index !== -1) {
              messages.value[index].content = accumulatedContent;
            }

            // Update Firestore (but don't rely on real-time updates for this message)
            await updateDoc(aiMessageRef, {
              content: accumulatedContent,
            });
          }
        }
      } catch (streamError) {
        console.error('Streaming error:', streamError);
        error.value = `Error during streaming: ${streamError.message}`;
        throw streamError;
      } finally {
        // Clear current streaming message ID
        currentStreamingMessageId.value = null;
      }
    }
  } catch (e) {
    console.error('Error:', e);
    error.value = 'Failed to send message. Please try again.';

    if (e.toString().includes('API key')) {
      error.value = 'Invalid API key. Please check your OpenAI API key.';
      showApiKeyDialog.value = true;
      model.value = null;
    }
  } finally {
    isLoading.value = false;
    currentStreamingContent.value = '';
  }
};

watch(() => messages.value.length, () => {
  nextTick(() => {
    scrollToBottom();
  });
});

watch(() => messages.value[messages.value.length - 1]?.content, () => {
  nextTick(() => {
    scrollToBottom();
  });
});
</script>
