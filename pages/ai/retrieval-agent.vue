<template>
  <div>
    <Card>
      <template #content>
        <BackButton />
        <Button label="Retrieval Agent Demo" severity="info" disabled />
      </template>
    </Card>

    <Card class="mb-4">
      <template #title>Document Upload</template>
      <template #content>
        <FileUpload
          mode="basic"
          name="demo[]"
          url="/api/upload"
          accept=".txt,.pdf,.doc,.docx"
          :maxFileSize="5000000"
          @select="onFileSelect"
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
          <!-- Messages Display Area -->
          <MessagesArea
            :messages="messages"
            :is-loading="isLoading"
            :hide-scrollbar="true"
            class="flex-1"
          />

          <!-- Input Area -->
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
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
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

export default defineComponent({
  name: 'RetrievalAgent',
  components: {
    Card,
    Button,
    FileUpload,
    BackButton,
    MessagesArea,
    ChatInput
  },
  setup() {
    // Component state
    const messages = ref<Message[]>([]);
    const userInput = ref('');
    const isLoading = ref(false);
    const documents = ref<UploadedDocument[]>([]);
    let vectorStore: MemoryVectorStore | null = null;

    // Initialize OpenAI components
    const model = new ChatOpenAI({
      modelName: 'gpt-3.5-turbo',
      temperature: 0,
    });

    const embeddings = new OpenAIEmbeddings();

    // Text splitter for document chunking
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });

    // Create the retriever chain
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

      isLoading.value = true;
      try {
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
      await updateVectorStore();

      messages.value.push({
        role: 'system',
        content: 'Document removed. Vector store updated.',
      });
    };

    // Update vector store with current documents
    const updateVectorStore = async () => {
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

      const question = userInput.value;
      messages.value.push({
        role: 'user',
        content: question,
      });

      userInput.value = '';
      isLoading.value = true;

      try {
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
          model,
          new StringOutputParser()
        ]);

        // Invoke the chain
        const response = await chain.invoke({ context, question });

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

    // Lifecycle hook for initialization if needed
    onMounted(() => {
      // Any initialization logic can go here
    });

    return {
      messages,
      userInput,
      isLoading,
      documents,
      onFileSelect,
      removeDocument,
      handleSendMessage
    };
  }
});
</script>
