<template>
  <div class="flex flex-col h-screen bg-white dark:bg-gray-800">
    <div class="flex-none p-1 bg-white dark:bg-gray-800 border-b dark:border-gray-700">
      <div class="flex items-center gap-2 w-full">
        <BackButton />
        <Button label="AI Chat" severity="info" disabled class="flex-1" />
        <HelpDialog
          title="AI Chat"
          docPath="/docs/chat"
        />
        <Button
          icon="pi pi-cog"
          @click="showSidebar = true"
          text
          rounded
          aria-label="Settings"
          class="p-1"
        />
      </div>
    </div>

    <div class="flex-1 overflow-y-auto flex flex-col">
      <div class="flex-1 p-4">
        <MessagesArea
          :messages="messages"
          :is-loading="isLoading"
          :hide-scrollbar="true"
        />
      </div>

      <div class="p-4 bg-white dark:bg-gray-800 border-t dark:border-gray-700">
        <div class="flex gap-2 max-w-3xl mx-auto">
          <InputText
            v-model="newMessage"
            placeholder="Type a message..."
            class="flex-1"
            :disabled="isLoading"
            @keyup.enter="sendMessage"
          />
          <Button
            icon="pi pi-send"
            :loading="isLoading"
            :disabled="!newMessage.trim()"
            @click="sendMessage"
          />
        </div>
      </div>
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
      position="right"
    />
  </div>
</template>

<script setup lang="ts">
import { ChatOpenAI } from '@langchain/openai';
import { HumanMessage, AIMessage, SystemMessage } from '@langchain/core/messages';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, Timestamp } from 'firebase/firestore';

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

    if (savedKey) {
      apiKey.value = savedKey;
      const isValid = await validateApiKey(savedKey);
      if (isValid) {
        await initializeChat();
      } else {
        showApiKeyDialog.value = true;
      }
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
          timestamp: data.timestamp instanceof Timestamp 
            ? data.timestamp.toDate() 
            : new Date(), // Default to current date if timestamp is invalid
        } as Message;
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
