<template>
  <div>
    <header>
      <div class="flex items-center gap-2 w-full px-0">
        <BackButton />
        <Button label="Firebase Storage" severity="info" disabled class="flex-1" />
      </div>
    </header>

    <Card>
      <template #title>
        <div class="flex items-center justify-between">
          <span>Upload Files</span>
          <div class="flex items-center gap-2">
            <div class="p-float-label flex-grow">
              <InputText 
                id="currentPath" 
                v-model="inputPath" 
                class="w-full" 
                placeholder="Storage Path"
                @keyup.enter="updateCurrentPath"
              />
              <label for="currentPath">Current Path</label>
            </div>
            <Button 
              icon="pi pi-search" 
              severity="secondary" 
              @click="updateCurrentPath"
            />
          </div>
        </div>
      </template>
      <template #content>
        <div 
          @dragover.prevent="onDragOver" 
          @dragleave.prevent="onDragLeave"
          @drop.prevent="onDrop"
          class="border-2 border-dashed p-4 text-center transition-all duration-300 ease-in-out 
                 bg-gray-50 dark:bg-gray-800 
                 border-gray-300 dark:border-gray-600
                 text-gray-600 dark:text-gray-300"
          :class="isDragging ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30' : ''"
        >
          <input 
            type="file" 
            ref="fileInput" 
            @change="onFileSelect" 
            accept="image/*,.pdf,.doc,.docx" 
            multiple 
            class="hidden"
          />
          <div v-if="!isDragging" class="flex flex-col items-center justify-center">
            <i class="pi pi-cloud-upload text-4xl text-gray-400 dark:text-gray-500 mb-4"></i>
            <p class="mb-2">
              Drag and drop files here or 
              <span 
                @click="triggerFileInput" 
                class="text-blue-600 dark:text-blue-400 cursor-pointer hover:underline"
              >
                browse
              </span>
            </p>
            <p class="text-xs text-gray-500 dark:text-gray-400">
              Supports: Images, PDF, DOC (max 10MB per file)
            </p>
          </div>
          <div v-else class="text-blue-600 dark:text-blue-400">
            Drop files to upload
          </div>
        </div>

        <div class="mt-4 flex justify-center">
          <Button 
            @click="triggerFileInput" 
            icon="pi pi-upload" 
            label="Save File" 
            severity="secondary"
          />
        </div>

        <!-- Custom Metadata -->
        <div class="space-y-1 mt-4">
          <label class="block text-sm font-medium">Custom Metadata (Optional)</label>
          <div v-for="(value, index) in uploadForm.metadata" :key="index" class="flex gap-2">
            <div class="p-float-label flex-1">
              <InputText :id="'key-' + index" v-model="uploadForm.metadata[index].key" class="w-full" />
              <label :for="'key-' + index">Key</label>
            </div>
            <div class="p-float-label flex-1">
              <InputText :id="'value-' + index" v-model="uploadForm.metadata[index].value" class="w-full" />
              <label :for="'value-' + index">Value</label>
            </div>
            <Button type="button" icon="pi pi-times" severity="danger" text @click="removeMetadata(index)" />
          </div>
          <Button type="button" icon="pi pi-plus" label="Add Metadata" text @click="addMetadata" />
        </div>

        <Button 
          type="button" 
          @click="handleUpload" 
          :loading="uploading" 
          :disabled="!uploadForm.file" 
          severity="primary" 
          class="w-full mt-4"
        >
          Save File
        </Button>

        <!-- Preview -->
        <div v-if="uploadForm.file"
          class="p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50 flex flex-col items-center justify-center mt-4">
          <h3 class="text-sm font-medium mb-2">Preview</h3>
          <!-- Image Preview -->
          <div v-if="isImage" class="mb-2">
            <img 
              :src="previewUrl" 
              alt="File Preview" 
              class="max-h-40 max-w-full object-contain rounded"
            />
          </div>
          <!-- File Details -->
          <div class="text-sm text-gray-600 dark:text-gray-400">
            <p><strong>Name:</strong> {{ uploadForm.file.name }}</p>
            <p><strong>Size:</strong> {{ formatFileSize(uploadForm.file.size) }}</p>
            <p><strong>Type:</strong> {{ uploadForm.file.type || 'Unknown' }}</p>
          </div>
        </div>

        <!-- File Browser -->
        <div>
          <div class="flex items-center justify-between mb-2 mt-4">
            <h3>File Browser</h3>
            <div class="flex items-center gap-2">
              <Button 
                icon="pi pi-refresh" 
                severity="secondary" 
                text 
                @click="refreshFiles"
              />
            </div>
          </div>

          <!-- Files Table -->
          <DataTable :value="files" :loading="loading" :paginator="true" :rows="10" stripedRows class="p-datatable-sm">
            <!-- Preview -->
            <Column header="Preview" class="w-24">
              <template #body="{ data }">
                <div v-if="isImageFile(data.name)" class="w-16 h-16">
                  <Image :src="data.downloadURL" :alt="data.name" preview :pt="{
                    image: { class: 'w-16 h-16 object-cover rounded' }
                  }" />
                </div>
                <i v-else class="pi pi-file text-xl" />
              </template>
            </Column>

            <!-- Name -->
            <Column field="name" header="Name" sortable>
              <template #body="{ data }">
                <div class="flex items-center gap-2">
                  <i :class="getFileIcon(data.name)" />
                  <span>{{ data.name }}</span>
                </div>
              </template>
            </Column>

            <!-- Path -->
            <Column field="fullPath" header="Path" sortable />

            <!-- Actions -->
            <Column header="Actions" class="w-24">
              <template #body="{ data }">
                <div class="flex items-center gap-2">
                  <Button icon="pi pi-download" text rounded @click="downloadFile(data)" v-tooltip.top="'Download'" />
                  <Button icon="pi pi-trash" text rounded severity="danger" @click="handleDeleteFile(data)"
                    v-tooltip.top="'Delete'" :loading="deleting" :disabled="deleting" />
                  <Button icon="pi pi-copy" text rounded @click="copyToClipboard(data.downloadURL)" v-tooltip.top="'Copy URL'" />
                </div>
              </template>
            </Column>
          </DataTable>
        </div>

      </template>
    </Card>

  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue';
import { useToast } from 'primevue/usetoast';
import Dialog from 'primevue/dialog';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Card from 'primevue/card';
import Button from 'primevue/button';
import Image from 'primevue/image';
import InputText from 'primevue/inputtext';
import { useFirebase } from '~/composables/useFirebase';
import { getDownloadURL, ref as storageRef, getBlob, uploadBytes } from 'firebase/storage';

const { 
  uploadFile, 
  deleteFile, 
  listFiles, 
  loading, 
  error, 
  downloadFile: firebaseDownloadFile 
} = useFirebase();
const toast = useToast();

// State
const files = ref([]);
const inputPath = ref('images');
const currentPath = ref('images');
const uploading = ref(false);
const deleting = ref(false);
const previewUrl = ref('');
const isDragging = ref(false);
const fileInput = ref<HTMLInputElement | null>(null);
const lastUploadedFileURL = ref('');

// Upload Form
const uploadForm = ref({
  file: null as File | null,
  folder: currentPath.value,
  metadata: [{ key: '', value: '' }]
});

const onFileSelect = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    uploadForm.value.file = input.files[0];
    
    // If it's an image, create a preview
    if (uploadForm.value.file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        previewUrl.value = e.target?.result as string;
      };
      reader.readAsDataURL(uploadForm.value.file);
    }
    
    // Show toast notification
    toast.add({
      severity: 'info', 
      summary: 'File Selected', 
      detail: `${uploadForm.value.file.name} ready to upload`, 
      life: 3000
    });
  }
};

const onDragOver = (event: DragEvent) => {
  event.preventDefault();
  isDragging.value = true;
};

const onDragLeave = (event: DragEvent) => {
  event.preventDefault();
  isDragging.value = false;
};

const onDrop = (event: DragEvent) => {
  event.preventDefault();
  isDragging.value = false;
  
  const files = event.dataTransfer?.files;
  if (files && files.length > 0) {
    // Select the first file
    uploadForm.value.file = files[0];
    
    // If it's an image, create a preview
    if (uploadForm.value.file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        previewUrl.value = e.target?.result as string;
      };
      reader.readAsDataURL(uploadForm.value.file);
    }
    
    // Optional: Show a toast or update UI to confirm file selection
    toast.add({
      severity: 'info', 
      summary: 'File Selected', 
      detail: `${uploadForm.value.file.name} ready to upload`, 
      life: 3000
    });
  }
};

const triggerFileInput = () => {
  if (fileInput.value) {
    fileInput.value.click();
  }
};

const isImage = computed(() => {
  return uploadForm.value.file?.type.startsWith('image/') || false;
});

const addMetadata = () => {
  uploadForm.value.metadata.push({ key: '', value: '' });
};

const removeMetadata = (index: number) => {
  uploadForm.value.metadata.splice(index, 1);
};

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const isImageFile = (filename: string) => {
  return /\.(jpg|jpeg|png|gif|webp)$/i.test(filename);
};

const getFileIcon = (filename: string) => {
  if (isImageFile(filename)) return 'pi pi-image';
  if (/\.pdf$/i.test(filename)) return 'pi pi-file-pdf';
  if (/\.(doc|docx)$/i.test(filename)) return 'pi pi-file-word';
  return 'pi pi-file';
};

const updateCurrentPath = () => {
  const sanitizedPath = inputPath.value.trim().replace(/^\/+|\/+$/g, '');
  
  // Only update and refresh if path has changed
  if (sanitizedPath !== currentPath.value) {
    currentPath.value = sanitizedPath || 'images';
    inputPath.value = currentPath.value;
    
    refreshFiles();
  }
};

const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text).then(() => {
    toast.add({
      severity: 'success', 
      summary: 'Copied', 
      detail: 'Download URL copied to clipboard', 
      life: 2000
    });
  }).catch(err => {
    toast.add({
      severity: 'error', 
      summary: 'Copy Failed', 
      detail: 'Unable to copy URL', 
      life: 3000
    });
  });
};

const downloadFile = async (file: any) => {
  try {
    // Validate file object
    if (!file || !file.fullPath) {
      throw new Error('Invalid file object or missing file path');
    }

    // Use the Firebase composable download method
    await firebaseDownloadFile(
      file.fullPath, 
      file.name, 
      (severity, summary, detail) => {
        toast.add({
          severity, 
          summary, 
          detail,
          life: severity === 'success' ? 2000 : 3000
        });
      }
    );
  } catch (err: any) {
    console.error('Download error:', err);
  }
};

const handleDeleteFile = async (file: any) => {
  try {
    if (!file) return;

    deleting.value = true;
    await deleteFile(file.fullPath);
    await refreshFiles();

    toast.add({
      severity: 'success',
      summary: 'Deleted',
      detail: 'File deleted successfully',
      life: 3000,
    });
  } catch (err: any) {
    toast.add({
      severity: 'error',
      summary: 'Delete Failed',
      detail: err.message,
      life: 3000
    });
  } finally {
    deleting.value = false;
  }
};

const handleUpload = async () => {
  try {
    uploading.value = true;
    
    // Validate file
    if (!uploadForm.value.file) {
      toast.add({
        severity: 'warn', 
        summary: 'No File Selected', 
        detail: 'Please select a file to upload',
        life: 3000
      });
      return;
    }

    // Prepare upload metadata
    const metadata = uploadForm.value.metadata
      .filter(m => m.key && m.value)
      .reduce((acc, curr) => {
        acc[curr.key] = curr.value;
        return acc;
      }, {} as Record<string, string>);

    // Upload file
    const uploadPath = `${uploadForm.value.folder}/${uploadForm.value.file.name}`;
    const fileRef = storageRef(storage, uploadPath);
    const uploadResult = await uploadBytes(fileRef, uploadForm.value.file, { customMetadata: metadata });
    
    // Get download URL
    const downloadURL = await getDownloadURL(uploadResult.ref);
    lastUploadedFileURL.value = downloadURL;

    // Success toast
    toast.add({
      severity: 'success', 
      summary: 'Upload Successful', 
      detail: `File uploaded to ${uploadPath}`,
      life: 3000
    });

    // Reset form
    uploadForm.value = {
      file: null,
      folder: currentPath.value || 'images',
      metadata: [{ key: '', value: '' }]
    };
    previewUrl.value = '';

    // Refresh files
    await refreshFiles();
  } catch (err: any) {
    // Error handling
    toast.add({
      severity: 'error', 
      summary: 'Upload Failed', 
      detail: err.message,
      life: 3000
    });
  } finally {
    uploading.value = false;
  }
};

const refreshFiles = async () => {
  try {
    loading.value = true;
    // Sanitize path, default to 'images' if empty
    const path = currentPath.value || 'images';
    files.value = await listFiles(path);
    
    // Update toast with current path
    toast.add({
      severity: 'info', 
      summary: 'Files Refreshed', 
      detail: `Loaded files from ${path}`, 
      life: 2000
    });
  } catch (err: any) {
    toast.add({
      severity: 'error', 
      summary: 'Error Loading Files', 
      detail: err.message,
      life: 3000
    });
  } finally {
    loading.value = false;
  }
};

// Lifecycle hook to load initial files
onMounted(() => {
  refreshFiles();
});
</script>

<style scoped></style>
