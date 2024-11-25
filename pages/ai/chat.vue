<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { ChatOpenAI } from '@langchain/openai';
import { HumanMessage, AIMessage, SystemMessage } from '@langchain/core/messages';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, Timestamp } from 'firebase/firestore';
import { useFirebase } from '~/composables/useFirebase';

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
const chat = ref<ChatOpenAI | null>(null);
const error = ref<string | null>(null);

// Get Firestore instance
const { firestore } = useFirebase();

const formatTimestamp = (timestamp: Date | Timestamp): string => {
  const date = timestamp instanceof Timestamp ? timestamp.toDate() : timestamp;
  return date.toLocaleTimeString();
};

onMounted(async () => {
  try {
    const savedKey = window?.localStorage?.getItem('openai_api_key');
    if (savedKey) {
      apiKey.value = savedKey;
      initializeChat();
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

const initializeChat = () => {
  if (apiKey.value) {
    try {
      chat.value = new ChatOpenAI({
        openAIApiKey: apiKey.value,
        temperature: 0.7
      });
      if (window?.localStorage) {
        window.localStorage.setItem('openai_api_key', apiKey.value);
      }
      showApiKeyDialog.value = false;
      error.value = null;
    } catch (e) {
      console.error('Error initializing chat:', e);
      error.value = 'Failed to initialize chat with API key.';
    }
  }
};

const formatMessages = () => {
  return messages.value.map(msg => {
    switch (msg.role) {
      case 'human':
        return new HumanMessage(msg.content);
      case 'ai':
        return new AIMessage(msg.content);
      case 'system':
        return new SystemMessage(msg.content);
    }
  });
};

const sendMessage = async () => {
  if (!newMessage.value.trim() || isLoading.value || !chat.value || !firestore) return;

  const userMessage = {
    role: 'human' as const,
    content: newMessage.value,
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

    const formattedMessages = formatMessages();
    const response = await chat.value.call(formattedMessages);

    // Add AI response to Firestore
    await addDoc(messagesRef, {
      role: 'ai',
      content: response.content,
      timestamp: serverTimestamp()
    });

  } catch (e) {
    console.error('Error:', e);
    error.value = 'Failed to send message. Please try again.';
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
          @click="initializeChat"
          :disabled="!apiKey"
          class="w-full"
        />
      </div>
    </Dialog>

    <div class="flex flex-col min-h-screen">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold">AI Chat</h1>
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
            placeholder="Type your message..."
            class="flex-1 !bg-white dark:!bg-gray-900 !border-gray-300 dark:!border-gray-600"
            @keyup.enter="sendMessage"
            :disabled="isLoading || !chat"
          />
          <Button
            icon="pi pi-send"
            @click="sendMessage"
            :loading="isLoading"
            :disabled="!newMessage.trim() || !chat"
          />
        </div>

        <!-- Help text if API key is not set -->
        <div v-if="!chat" class="text-sm text-gray-500 mt-2">
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
