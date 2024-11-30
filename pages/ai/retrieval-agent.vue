<template>
  <div>
    <Card class="component-title">
      <template #content>
        <BackButton />
        <Button label="Retrieval Agent Demo" severity="info" disabled class="flex-1" />
      </template>
    </Card>

    <Card class="mb-4">
      <template #title>Document Upload</template>
      <template #content>
        <FileUpload
          mode="basic"
          name="demo[]"
          :customUpload="true"
          @uploader="onFileSelect"
          accept=".txt,.pdf,.doc,.docx"
          :maxFileSize="5000000"
        />
        <small class="block mt-2 text-gray-500">
          Max file size: 5MB. Supported formats: TXT, PDF, DOC
        </small>
        <div v-if="documents.length > 0" class="mt-4">
          <h3 class="text-lg font-semibold mb-2">Uploaded Documents</h3>
          <ul class="list-disc pl-5">
            <li v-for="doc in documents" :key="doc.id" class="text-sm">
              {{ doc.name }}
              <Button
                icon="pi pi-times"
                text
                severity="danger"
                @click="removeDocument(doc.id)"
                class="ml-2"
              />
            </li>
          </ul>
        </div>
      </template>
    </Card>

    <Card>
      <template #title>Retrieval Agent Interaction</template>
      <template #content>
        <div class="flex flex-col h-[600px]">
          <MessagesArea
            :messages="messages"
            :is-loading="isLoading"
            :hide-scrollbar="true"
            class="flex-1"
          />
          <div class="flex-none p-1 border-t dark:border-gray-700">
            <ChatInput
              v-model="userInput"
              :is-loading="isLoading"
              @send-message="handleSendMessage"
              :placeholder="documents.length ? 'Ask about the uploaded documents...' : 'Please upload documents first'"
              :disabled="documents.length === 0"
            />
          </div>
        </div>
      </template>
    </Card>

    <ApiKeyDialog v-if="showApiKeyDialog" @close="showApiKeyDialog = false" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { v4 as uuidv4 } from 'uuid';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import { OpenAIEmbeddings } from '@langchain/openai';
import { ChatOpenAI } from '@langchain/openai';
import { PromptTemplate } from '@langchain/core/prompts';
import { RunnableSequence } from '@langchain/core/runnables';
import { StringOutputParser } from '@langchain/core/output_parsers';
import Card from 'primevue/card';
import Button from 'primevue/button';
import FileUpload from 'primevue/fileupload';
import BackButton from '~/components/BackButton.vue';
import MessagesArea from './components/MessagesArea.vue';
import ChatInput from './components/ChatInput.vue';
import ApiKeyDialog from '~/pages/ai/components/ApiKeyDialog.vue';
import { useApiKeyValidation } from '~/composables/useApiKeyValidation';
import '@/assets/css/component-title.css';

// Types
interface Message {
  role: 'user' | 'assistant' | 'error' | 'system';
  content: string;
}

interface UploadedDocument {
  id: string;
  name: string;
  content: string;
}

// Component state
const messages = ref<Message[]>([]);
const userInput = ref('');
const isLoading = ref(false);
const documents = ref<UploadedDocument[]>([]);
const showApiKeyDialog = ref(false);
let vectorStore: MemoryVectorStore | null = null;

// API Key handling
const { validateApiKey, getStoredApiKey } = useApiKeyValidation();

// Initialize OpenAI components
let model: ChatOpenAI | null = null;
let embeddings: OpenAIEmbeddings | null = null;

const initializeModel = async (apiKey: string) => {
  try {
    model = new ChatOpenAI({
      modelName: 'gpt-3.5-turbo',
      temperature: 0,
      openAIApiKey: apiKey,
    });

    embeddings = new OpenAIEmbeddings({
      openAIApiKey: apiKey,
    });

    return true;
  } catch (error) {
    console.error('Error initializing model:', error);
    return false;
  }
};

// Text splitter for document chunking
const textSplitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1000,
  chunkOverlap: 200,
});

// Create the retriever prompt
const retrieverPrompt = PromptTemplate.fromTemplate(`Answer the following question based on the provided context:

Context: {context}

Question: {question}

Think through this step by step:
1. Analyze the context provided
2. Identify relevant information
3. Formulate a comprehensive answer

Answer:`);

// Handle file upload
const onFileSelect = async (event: { files: File[] }) => {
  const { files } = event;
  if (!files || files.length === 0) return;

  // Check for API key
  const apiKey = getStoredApiKey();
  if (!apiKey) {
    showApiKeyDialog.value = true;
    return;
  }

  isLoading.value = true;
  try {
    // Initialize model and embeddings if needed
    if (!model || !embeddings) {
      const initialized = await initializeModel(apiKey);
      if (!initialized) {
        throw new Error('Failed to initialize model');
      }
    }

    for (const file of files) {
      const content = await file.text();
      const document: UploadedDocument = {
        id: uuidv4(),
        name: file.name,
        content: content
      };
      documents.value.push(document);
    }
    await updateVectorStore();
    messages.value.push({
      role: 'system',
      content: `${files.length} document(s) uploaded successfully.`
    });
  } catch (error) {
    console.error('File upload error:', error);
    messages.value.push({
      role: 'error',
      content: `Error uploading file: ${error instanceof Error ? error.message : 'Unknown error'}`
    });
  } finally {
    isLoading.value = false;
  }
};

// Remove document
const removeDocument = async (id: string) => {
  documents.value = documents.value.filter(doc => doc.id !== id);
  if (documents.value.length > 0) {
    await updateVectorStore();
    messages.value.push({
      role: 'system',
      content: 'Document removed. Vector store updated.',
    });
  } else {
    vectorStore = null;
    messages.value.push({
      role: 'system',
      content: 'All documents removed.',
    });
  }
};

// Update vector store with current documents
const updateVectorStore = async () => {
  if (!embeddings) {
    throw new Error('Embeddings not initialized');
  }

  // Combine all documents and split into chunks
  const allText = documents.value.map(doc => doc.content).join('\n\n');
  const chunks = await textSplitter.createDocuments([allText]);

  // Create new vector store
  vectorStore = await MemoryVectorStore.fromDocuments(
    chunks,
    embeddings
  );
};

// Handle sending messages
const handleSendMessage = async () => {
  if (!userInput.value.trim() || isLoading.value || !vectorStore) return;

  // Check for API key
  const apiKey = getStoredApiKey();
  if (!apiKey) {
    showApiKeyDialog.value = true;
    return;
  }

  const question = userInput.value;
  messages.value.push({
    role: 'user',
    content: question,
  });

  userInput.value = '';
  isLoading.value = true;

  try {
    // Ensure model is initialized
    if (!model) {
      const initialized = await initializeModel(apiKey);
      if (!initialized) {
        throw new Error('Failed to initialize model');
      }
    }

    // Retrieve relevant documents
    const retriever = vectorStore.asRetriever(4); // Get top 4 relevant chunks
    const relevantDocs = await retriever.invoke(question);

    // Prepare context
    const context = relevantDocs.map(doc => doc.pageContent).join('\n\n');

    // Create retrieval chain
    const chain = RunnableSequence.from([
      {
        context: () => context,
        question: () => question
      },
      retrieverPrompt,
      model!,
      new StringOutputParser()
    ]);

    // Invoke the chain
    const response = await chain.invoke({});

    // Add assistant response to messages
    messages.value.push({
      role: 'assistant',
      content: response
    });
  } catch (error) {
    console.error('Error processing message:', error);
    messages.value.push({
      role: 'error',
      content: `Error processing your request: ${error instanceof Error ? error.message : 'Unknown error'}`
    });
  } finally {
    isLoading.value = false;
  }
};

// Initialize on mount
onMounted(async () => {
  const apiKey = getStoredApiKey();
  if (apiKey) {
    try {
      await initializeModel(apiKey);
    } catch (error) {
      console.error('Error initializing model with stored API key:', error);
      showApiKeyDialog.value = true;
    }
  } else {
    showApiKeyDialog.value = true;
  }
});
</script>

<style scoped>
</style>
