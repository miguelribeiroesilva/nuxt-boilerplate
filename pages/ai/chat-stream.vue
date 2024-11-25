<script setup lang="ts">
import { ref, onMounted, watch, nextTick, onUnmounted } from 'vue';
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
const apiKey = ref('');
const showApiKeyDialog = ref(false);
const error = ref<string | null>(null);
const currentStreamingContent = ref('');
const systemMessage = 'Welcome to the chat!';
const messagesContainer = ref<HTMLElement | null>(null);

const validateApiKey = (key: string): boolean => {
  if (!key) return false;
  return key.startsWith('sk-') && key.length > 20;
};

const initializeChat = async (key: string) => {
  if (!validateApiKey(key)) {
    error.value = 'Invalid API key format. Key should start with "sk-"';
    showApiKeyDialog.value = true;
    window.localStorage.removeItem('openai_api_key');
    return;
  }

  try {
    await initializeModel(key);
    window?.localStorage?.setItem('openai_api_key', key);
    showApiKeyDialog.value = false;
    error.value = null;
  } catch (e) {
    console.error('Error initializing model:', e);
    error.value = 'Failed to initialize model. Please check your API key.';
    showApiKeyDialog.value = true;
    window.localStorage.removeItem('openai_api_key');
  }
};

// Watch for model config changes
watch(() => modelConfig.value, async () => {
  if (apiKey.value) {
    try {
      await updateConfig(modelConfig.value, apiKey.value);
    } catch (e) {
      console.error('Error updating model config:', e);
      error.value = 'Failed to update model configuration.';
    }
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
  try {
    const savedKey = window?.localStorage?.getItem('openai_api_key');
    if (savedKey) {
      apiKey.value = savedKey; // Set the key first
      await initializeChat(savedKey);
    } else {
      await nextTick();
      showApiKeyDialog.value = true;
    }

    // Set up Firestore listener
    if (firestore) {
      const messagesRef = collection(firestore, 'messages');
      const q = query(messagesRef, orderBy('timestamp', 'asc'));

      unsubscribe = onSnapshot(q, (snapshot) => {
        messages.value = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          timestamp: (doc.data().timestamp as Timestamp)?.toDate() || new Date(),
        })) as Message[];
      });
    }
  } catch (error) {
    console.error('Error in onMounted:', error);
    error.value = 'An error occurred while initializing the chat.';
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

  apiKey.value = key; // Set the key first
  await initializeChat(key);
};

const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
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

    // Create chat history with system message
    const chatHistory = [
      new SystemMessage(systemMessage),
      ...messages.value
        .filter(msg => msg.id !== aiMessageRef.id)
        .map(msg => msg.role === 'human' ? new HumanMessage(msg.content) : new AIMessage(msg.content))
    ];

    // Add current message
    chatHistory.push(new HumanMessage(messageContent));

    // Get AI response
    if (model.value) {
      const stream = await model.value.stream(chatHistory);

      try {
        for await (const chunk of stream) {
          if (chunk.content) {
            currentStreamingContent.value += chunk.content;
            // Update Firestore with current content
            await updateDoc(aiMessageRef, {
              content: currentStreamingContent.value,
            });
          }
        }
      } catch (streamError) {
        console.error('Streaming error:', streamError);
        throw streamError;
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
</script>

<template>
  <main class="h-screen flex flex-col p-4">
    <!-- Error Message -->
    <Message v-if="error" severity="error" :closable="false" class="mb-4">{{ error }}</Message>

    <!-- Messages Area -->
    <div class="flex-1 overflow-y-auto mb-4 p-4 bg-white dark:bg-gray-800 rounded-lg" ref="messagesContainer">
      <div v-for="message in messages" :key="message.id" class="mb-4">
        <div :class="[
          'p-4 rounded-lg max-w-[80%]',
          message.role === 'human' ? 'ml-auto bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-700'
        ]">
          {{ message.content }}
        </div>
      </div>
      <div v-if="currentStreamingContent" class="mb-4">
        <div class="p-4 rounded-lg max-w-[80%] bg-gray-100 dark:bg-gray-700">
          {{ currentStreamingContent }}
        </div>
      </div>
    </div>

    <!-- Input Area -->
    <div class="flex gap-2 bg-white dark:bg-gray-800 p-4 rounded-lg">
      <InputText
        v-model="newMessage"
        placeholder="Type a message"
        class="flex-1"
        @keyup.enter="sendMessage"
      />
      <Button
        icon="pi pi-send"
        @click="sendMessage"
        :disabled="isLoading || !newMessage.trim()"
      />
    </div>

    <!-- Loading Indicator -->
    <div v-if="isLoading" class="absolute bottom-20 left-1/2 transform -translate-x-1/2">
      <i class="pi pi-spin pi-spinner mr-2"></i>
      <span>AI is thinking...</span>
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

    <ApiKeyDialog
      v-model="showApiKeyDialog"
      :apiKey="apiKey"
      :error="error"
      @submit="handleApiKeySubmit"
      @update:apiKey="apiKey = $event"
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
</style>
