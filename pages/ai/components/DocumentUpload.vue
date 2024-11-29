<template>
  <div class="document-upload">
    <FileUpload
      mode="basic"
      :auto="true"
      chooseLabel="Upload Document"
      accept=".txt,.pdf,.doc,.docx"
      :maxFileSize="5000000"
      @select="onFileSelect"
      :customUpload="true"
      @uploader="handleFileUpload"
      class="mb-3"
    />
    <small class="block mt-2 text-gray-500">
      Max file size: 5MB. Supported formats: TXT, PDF, DOC
    </small>

    <div v-if="documents.length > 0" class="mt-4">
      <h3 class="text-lg font-semibold mb-2">Uploaded Documents</h3>
      <TransitionGroup
        name="document-list"
        tag="ul"
        class="document-list"
      >
        <li
          v-for="doc in documents"
          :key="doc.id"
          class="document-item"
        >
          <span class="document-name">{{ doc.name }}</span>
          <Button
            icon="pi pi-times"
            text
            severity="danger"
            @click="removeDocument(doc.id)"
            class="remove-button"
          />
        </li>
      </TransitionGroup>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useDocumentStore } from '@/composables/useDocumentStore';

interface Props {
  onUpdate?: (content: string) => void;
}

const props = withDefaults(defineProps<Props>(), {
  onUpdate: undefined,
});

const { documents, addDocument, removeDocument } = useDocumentStore();

const hasDocuments = computed(() => documents.value.length > 0);

// File selection handler
function onFileSelect(event: any) {
  console.log('File selected:', event.files[0].name);
}

// Handle file upload
async function handleFileUpload(event: any) {
  const file = event.files[0];
  const reader = new FileReader();

  reader.onload = async (e) => {
    const content = e.target?.result as string;
    const doc = addDocument(file.name, content);

    if (props.onUpdate) {
      props.onUpdate(content);
    }
  };

  reader.readAsText(file);
}
</script>

<style scoped>
.document-upload {
  @apply w-full;
}

.document-list {
  @apply list-none p-0 space-y-2;
}

.document-item {
  @apply flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm transition-all duration-200;
}

.document-item:hover {
  @apply bg-gray-100 dark:bg-gray-700;
}

.document-name {
  @apply text-gray-700 dark:text-gray-300 truncate flex-1 mr-2;
}

.remove-button {
  @apply opacity-70 hover:opacity-100 transition-opacity duration-200;
}

/* Transition animations */
.document-list-enter-active,
.document-list-leave-active {
  transition: all 0.3s ease;
}

.document-list-enter-from,
.document-list-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

.document-list-move {
  transition: transform 0.3s ease;
}

/* FileUpload customization */
:deep(.p-fileupload-buttonbar) {
  @apply bg-transparent border-none p-0;
}

:deep(.p-fileupload-content) {
  @apply bg-transparent border-none p-0;
}

:deep(.p-button.p-fileupload-choose) {
  @apply w-full justify-center;
}

@media (max-width: 768px) {
  .document-item {
    @apply text-xs p-1.5;
  }
}
</style>
