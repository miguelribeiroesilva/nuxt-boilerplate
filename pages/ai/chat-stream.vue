<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { ChatOpenAI } from '@langchain/openai';
import { HumanMessage, AIMessage } from '@langchain/core/messages';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, Timestamp, updateDoc } from 'firebase/firestore';
import { useFirebase } from '~/composables/useFirebase';
import ApiKeyDialog from './components/ApiKeyDialog.vue';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Message from 'primevue/message';

interface Message {
  id?: string;
  role: 'human' | 'ai' | 'system';
  content: string;
  timestamp: Date | Timestamp;
}

// Component state
const messages = ref<Message[]>([]);
const newMessage = ref('');
const isLoading = ref(false);
const apiKey = ref('');
const showApiKeyDialog = ref(false);
const model = ref<ChatOpenAI | null>(null);
const error = ref<string | null>(null);
const currentStreamingContent = ref('');

// Get Firestore instance and utils
const { firestore, formatTimestamp } = useFirebase();

const validateApiKey = (key: string): boolean => {
  return key.startsWith('sk-') && key.length > 20;
};

const initializeChat = async (key: string) => {
  if (!key) {
    error.value = 'API key is required';
    return;
  }

  if (!validateApiKey(key)) {
    error.value = 'Invalid API key format. Key should start with "sk-"';
    return;
  }

  try {
    model.value = new ChatOpenAI({
      openAIApiKey: key.trim(),
      temperature: 0.7,
      streaming: true,
    });

    // Test the API key with a simple request
    await model.value.invoke([new HumanMessage('test')]);

    if (window?.localStorage) {
      window.localStorage.setItem('openai_api_key', key);
    }
    showApiKeyDialog.value = false;
    error.value = null;
  } catch (e) {
    console.error('Error initializing chat:', e);
    error.value = 'Failed to initialize chat with API key.';
    model.value = null;
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
          role: data.role,
          content: data.content,
          timestamp: data.timestamp,
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
  apiKey.value = key;
  await initializeChat(key);
};

const sendMessage = async () => {
  if (!newMessage.value.trim() || isLoading.value || !model.value || !firestore) return;

  const messageContent = newMessage.value.trim();
  newMessage.value = ''; // Clear input immediately
  currentStreamingContent.value = ''; // Reset streaming content

  try {
    isLoading.value = true;

    // Add user message to Firestore
    const userMessageRef = await addDoc(collection(firestore, 'messages'), {
      role: 'human',
      content: messageContent,
      timestamp: serverTimestamp(),
    });

    // Add initial AI message
    const aiMessageRef = await addDoc(collection(firestore, 'messages'), {
      role: 'ai',
      content: '',
      timestamp: serverTimestamp(),
    });

    // Create chat history
    const chatHistory = messages.value
      .filter(msg => msg.role === 'human' || msg.role === 'ai')
      .map(msg => msg.role === 'human' ? new HumanMessage(msg.content) : new AIMessage(msg.content));

    // Add current message
    chatHistory.push(new HumanMessage(messageContent));

    // Stream the response
    const stream = await model.value.stream(chatHistory);

    // Process the stream
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

  } catch (e) {
    console.error('Error:', e);
    error.value = 'Failed to send message. Please try again.';

    if (e.toString().includes('API key')) {
      error.value = 'Invalid API key. Please check your OpenAI API key.';
      showApiKeyDialog.value = true;
      model.value = null;
    } else {
      // Add error message to Firestore
      await addDoc(collection(firestore, 'messages'), {
        role: 'system',
        content: 'Error: Failed to process message. Please try again.',
        timestamp: serverTimestamp(),
      });
    }
  } finally {
    isLoading.value = false;
    currentStreamingContent.value = '';
  }
};
</script>

<template>
  <div class="card">
    <!-- API Key Dialog -->
    <ApiKeyDialog
      v-model="showApiKeyDialog"
      v-model:apiKey="apiKey"
      :error="error"
      @submit="handleApiKeySubmit"
    />

    <div class="flex flex-col min-h-screen">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold">Streaming Chat</h1>
        <Button
          icon="pi pi-key"
          severity="secondary"
          text
          @click="showApiKeyDialog = true"
          v-tooltip.bottom="'Configure OpenAI API Key'"
        />
      </div>

      <!-- Error Message -->
      <Message v-if="error" severity="error" :closable="false" class="mb-4">{{ error }}</Message>

      <!-- Messages Container -->
      <div class="flex-1 mb-4 bg-white dark:bg-slate-800 rounded-lg p-4 overflow-y-auto">
        <div v-for="message in messages" :key="message.id" class="mb-4">
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
            placeholder="Type a message..."
            class="flex-1"
            @keyup.enter="sendMessage"
            :disabled="isLoading || !model"
          />
          <Button
            icon="pi pi-send"
            @click="sendMessage"
            :loading="isLoading"
            :disabled="!newMessage.trim() || !model"
          />
        </div>

        <!-- Help text if API key is not set -->
        <div v-if="!model" class="text-sm text-gray-500 mt-2">
          Click the key icon in the top right to set up your OpenAI API key
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card {
  padding: 1.5rem;
  height: 100vh;
}

.min-h-screen {
  min-height: calc(100vh - 3rem);
}
</style>
