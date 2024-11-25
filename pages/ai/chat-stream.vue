<script setup lang="ts">
import { ref, onMounted, watch, nextTick, onUnmounted, computed } from 'vue'; // Update Vue import to ensure compatibility with Nuxt 3
import { ChatOpenAI } from '@langchain/openai';
import { HumanMessage, AIMessage, SystemMessage } from '@langchain/core/messages';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, Timestamp, updateDoc } from 'firebase/firestore';
import { useFirebase } from '~/composables/useFirebase';
import { useAIModel } from '~/composables/useAIModel';
import ApiKeyDialog from './components/ApiKeyDialog.vue';
import ModelConfigSidebar from './components/ModelConfigSidebar.vue';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Message from 'primevue/message';

interface Message {
  id?: string;
  role: 'human' | 'ai' | 'system';
  content: string;
  timestamp: Date | Timestamp;
}

// Get Firestore instance and utils
const { firestore, formatTimestamp } = useFirebase();

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
const messages = ref<Message[]>([]);
const newMessage = ref('');
const isLoading = ref(false);
const apiKeys = ref({
  openai: '',
  anthropic: ''
});
const showApiKeyDialog = ref(false);
const error = ref<string | null>(null);
const currentStreamingContent = ref('');
const currentStreamingMessageId = ref<string | null>(null); // Track current streaming message

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

const messagesContainer = ref<HTMLElement | null>(null);

const validateApiKey = (key: string): boolean => {
  console.log(key);
  if (!key) return false;
  key = key.trim();

  if (modelConfig.value.provider === 'openai') {
    return key.startsWith('sk-');
  } else if (modelConfig.value.provider === 'anthropic') {
    // Matches sk-ant-api followed by version number (e.g., 01, 02, 03) and a hyphen
    return /^sk-ant-api\d{2}-/.test(key);
  }
  return false;
};

const loadStoredApiKey = () => {
  const provider = modelConfig.value.provider;
  const storedKey = window?.localStorage?.getItem(`${provider}_api_key`);
  if (storedKey) {
    apiKeys.value[provider] = storedKey;
    return storedKey;
  }
  return null;
};

const initializeChat = async (key: string) => {
  const provider = modelConfig.value.provider;

  if (!validateApiKey(key)) {
    const prefix = provider === 'openai' ? 'sk-' : 'sk-ant-api[VERSION]-';
    error.value = provider === 'openai'
      ? `Invalid API key format. Key should start with "${prefix}"`
      : 'Invalid Anthropic API key format. Key should start with "sk-ant-api" followed by version number (e.g., "sk-ant-api01-")';
    showApiKeyDialog.value = true;
    window.localStorage.removeItem(`${provider}_api_key`);
    return;
  }

  try {
    await initializeModel(key);
    window?.localStorage?.setItem(`${provider}_api_key`, key);
    apiKeys.value[provider] = key;
    showApiKeyDialog.value = false;
    error.value = null;
  } catch (e) {
    console.error('Error initializing model:', e);
    error.value = 'Failed to initialize model. Please check your API key.';
    showApiKeyDialog.value = true;
    window.localStorage.removeItem(`${provider}_api_key`);
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
      await initializeChat(storedKey);
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
  if (!key) {
    error.value = 'API key is required';
    return;
  }

  await initializeChat(key);
};

const autoResize = (e: Event) => {
  const textarea = e.target as HTMLTextAreaElement;
  textarea.style.height = 'auto';
  textarea.style.height = `${Math.min(textarea.scrollHeight, 160)}px`; // 160px is 10rem
};

const scrollToBottom = () => {
  if (messagesContainer.value) {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth'
    });
  }
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

<template>
  <main class="relative min-h-screen">
    <!-- Error Message -->
    <Message v-if="error" severity="error" :closable="false" class="m-4">{{ error }}</Message>

    <!-- Chat Messages -->
    <div ref="messagesContainer" class="px-4 py-2 space-y-4 bg-white dark:bg-gray-800 pb-[80px]">
      <div v-for="message in messages" :key="message.id" :class="[
        'max-w-3xl mx-auto p-4 rounded-lg max-w-[80%]',
        message.role === 'human' ? 'ml-auto bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-700 dark:text-white'
      ]">
        <div class="prose max-w-none dark:prose-invert">
          <p class="whitespace-pre-wrap">{{ message.content }}</p>
        </div>
      </div>
      <div v-if="isLoading" class="max-w-3xl mx-auto p-4 rounded-lg bg-gray-100 dark:bg-gray-700 mr-auto max-w-[80%]">
        <div class="animate-pulse flex space-x-4">
          <div class="flex-1 space-y-4 py-1">
            <div class="h-4 bg-gray-200 dark:bg-gray-600 rounded w-3/4"></div>
            <div class="space-y-2">
              <div class="h-4 bg-gray-200 dark:bg-gray-600 rounded"></div>
              <div class="h-4 bg-gray-200 dark:bg-gray-600 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Input Area -->
    <div class="absolute bottom-0 left-0 right-0 border-t border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-800 shadow-lg">
      <div class="max-w-3xl mx-auto">
        <div class="flex gap-4">
          <InputText
            v-model="newMessage"
            @keyup.enter="sendMessage"
            placeholder="Type your message..."
            class="flex-1"
          />
          <Button
            icon="pi pi-send"
            @click="sendMessage"
            :disabled="!newMessage.trim() || isLoading"
          />
        </div>
      </div>
    </div>

    <!-- Config Button -->
    <Button
      icon="pi pi-cog"
      class="fixed top-25 left-10 p-button-rounded p-button-text"
      @click="showSidebar = true"
    />

    <!-- Sidebar and Dialogs -->
    <ModelConfigSidebar
      v-model="showSidebar"
      :config="modelConfig"
      :availableModels="availableModels"
      @update:config="updateConfig($event)"
    />

    <!-- API Key Dialog -->
    <ApiKeyDialog
      v-model="showApiKeyDialog"
      :apiKey="apiKeys[modelConfig?.provider || 'openai']"
      :error="error"
      :provider="modelConfig?.provider || 'openai'"
      :loading="isLoading"
      @submit="handleApiKeySubmit"
      @update:apiKey="apiKeys[modelConfig?.provider || 'openai'] = $event"
    />
  </main>
</template>

<style scoped>
:deep(.p-inputtext) {
  width: 100%;
  background: var(--surface-ground);
  color: var(--text-color);
}

:deep(.p-inputtext::placeholder) {
  color: var(--text-color-secondary);
  opacity: 0.7;
}

/* Hide scrollbar for Chrome, Safari and Opera */
.overflow-y-auto::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
.overflow-y-auto {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}
</style>
