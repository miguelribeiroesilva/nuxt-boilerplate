<template>
  <div class="flex flex-col h-screen bg-white dark:bg-gray-800">
    <ChatHeader title="Retrieval Agent" :model-name="modelConfig.modelName" :model-status="!!model"
      :on-settings-click="() => showSidebar = true" />

    <Card>
      <template #title>Document Management</template>
      <template #content>
        <div class="flex flex-col gap-4">
          <FileUpload :multiple="true" accept=".txt,.pdf,.doc,.docx" :maxFileSize="1000000" @select="onFileSelect"
            :auto="true">
            <template #empty>
              <p>Drag and drop files here or click to upload.</p>
            </template>
          </FileUpload>
          <ul v-if="documents.length > 0" class="list-none p-0">
            <li v-for="doc in documents" :key="doc.id" class="flex items-center justify-between py-2">
              <span>{{ doc.name }}</span>
              <Button icon="pi pi-trash" text severity="danger" @click="removeDocument(doc.id)" />
            </li>
          </ul>
          <div v-else class="text-gray-500">
            No documents uploaded yet.
          </div>
        </div>
      </template>
    </Card>

    <ChatInterface v-model="newMessage" :messages="messages" :is-loading="isLoading" @send="sendMessage" />

    <ApiKeyDialog v-if="showApiKeyDialog" v-model="showApiKeyDialog" v-model:apiKey="apiKey" :error="error"
      provider="openai" @close="showApiKeyDialog = false" @submit="handleApiKeySubmit" />

    <ModelConfigSidebar :modelValue="showSidebar" @update:modelValue="showSidebar = $event" :model="model"
      :config="modelConfig" :available-models="availableModels" @update:config="updateConfig" position="right" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import { OpenAIEmbeddings } from '@langchain/openai';
import { Document } from '@langchain/core/documents';
import type { Message } from '~/composables/useAgentConfig';
import Card from 'primevue/card';
import FileUpload from 'primevue/fileupload';
import BackButton from '~/components/BackButton.vue';
import ChatInterface from './components/ChatInterface.vue';
import ApiKeyDialog from '~/pages/ai/components/ApiKeyDialog.vue';
import ModelConfigSidebar from './components/ModelConfigSidebar.vue';
import { useApiKeyValidation } from '~/composables/useApiKeyValidation';
import { useAIModel } from '~/composables/useAIModel';

interface UploadedDocument {
  id: string;
  name: string;
  content: string;
}

// Component state
const messages = ref<Message[]>([]);
const newMessage = ref('');
const isLoading = ref(false);
const documents = ref<UploadedDocument[]>([]);
const showApiKeyDialog = ref(false);
const showSidebar = ref(false);
const modelConfig = ref({});
const model = ref(null);
const availableModels = ref([]);
const apiKey = ref('');
const error = ref('');
let vectorStore: MemoryVectorStore | null = null;

// API Key handling
const { validateApiKey, getStoredApiKey } = useApiKeyValidation();
const { config, initializeModel, updateConfig } = useAIModel();

// File handling
const onFileSelect = async (event: any) => {
  const files = event.files;
  if (!files || files.length === 0) return;

  for (const file of files) {
    try {
      const content = await file.text();
      documents.value.push({
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        content
      });
    } catch (e) {
      console.error('Error reading file:', e);
    }
  }

  // Initialize vector store with new documents
  await initializeVectorStore();
};

const removeDocument = (id: string) => {
  documents.value = documents.value.filter(doc => doc.id !== id);
  // Reinitialize vector store with remaining documents
  initializeVectorStore();
};

// Initialize vector store
const initializeVectorStore = async () => {
  try {
    const apiKey = getStoredApiKey();
    if (!apiKey) {
      showApiKeyDialog.value = true;
      return;
    }

    const embeddings = new OpenAIEmbeddings({ openAIApiKey: apiKey });
    const docs = documents.value.map(
      doc => new Document({ pageContent: doc.content, metadata: { name: doc.name } })
    );

    vectorStore = await MemoryVectorStore.fromDocuments(docs, embeddings);
  } catch (e) {
    console.error('Error initializing vector store:', e);
    messages.value.push({
      role: 'error',
      content: 'Failed to initialize document processing. Please check your API key and try again.'
    });
  }
};

// Handle sending messages
const sendMessage = async () => {
  if (!newMessage.value.trim() || isLoading.value || !vectorStore) return;

  // Check for API key
  const apiKey = getStoredApiKey();
  if (!apiKey) {
    showApiKeyDialog.value = true;
    return;
  }

  const question = newMessage.value;
  messages.value.push({
    role: 'human',
    content: question
  });

  newMessage.value = '';
  isLoading.value = true;

  try {
    // Get relevant documents
    const relevantDocs = await vectorStore.similaritySearch(question, 3);

    // Format context from relevant documents
    const context = relevantDocs
      .map(doc => `Content from ${doc.metadata.name}:\n${doc.pageContent}`)
      .join('\n\n');

    // Get AI response using context
    const response = await model.value.invoke([
      new SystemMessage(`You are a helpful assistant. Use the following context to answer questions:\n\n${context}`),
      new HumanMessage(question)
    ]);

    messages.value.push({
      role: 'assistant',
      content: response.content
    });
  } catch (e) {
    console.error('Error:', e);
    messages.value.push({
      role: 'error',
      content: 'Failed to process your request. Please try again.'
    });
  } finally {
    isLoading.value = false;
  }
};

const handleApiKeySubmit = async (apiKey: string) => {
  try {
    const isValid = await validateApiKey(apiKey);
    if (isValid) {
      await initializeModel(apiKey);
      showApiKeyDialog.value = false;
    } else {
      error.value = 'Invalid API key';
    }
  } catch (e) {
    console.error('Error:', e);
    error.value = 'Failed to validate API key';
  }
};

// Initialize on mount
onMounted(async () => {
  const savedKey = getStoredApiKey();
  if (savedKey) {
    const isValid = await validateApiKey(savedKey);
    if (isValid) {
      await initializeModel(savedKey);
    } else {
      showApiKeyDialog.value = true;
    }
  } else {
    showApiKeyDialog.value = true;
  }
});
</script>

<style scoped></style>
