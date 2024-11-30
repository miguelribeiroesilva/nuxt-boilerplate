<template>
  <div>
    <Card class="first-card">
      <template #content>
        <BackButton />
        <Button label="Firebase Storage Demo" severity="info" disabled class="flex-1" />
      </template>
    </Card>
    <Card>
      <template #title>Upload Files</template>
      <template #content>
        <form @submit.prevent="handleUpload" class="space-y-2">
          <div class="p-float-label">
            <InputText id="folder" v-model="uploadForm.folder" class="w-full"
              :class="{ 'p-invalid': submitted && !uploadForm.folder }" />
            <label for="folder">Folder Path</label>
          </div>

          <!-- File Input -->
          <div class="space-y-1">
            <label class="block text-sm font-medium">File</label>
            <FileUpload mode="basic" :auto="true" chooseLabel="Choose File" @select="onFileSelect" :maxFileSize="10000000"
              accept="image/*,.pdf,.doc,.docx" />
            <small class="text-xs text-gray-500 dark:text-gray-400">
              Max file size: 10MB. Supported formats: Images, PDF, DOC
            </small>
          </div>

          <!-- Custom Metadata -->
          <div class="space-y-1">
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

          <Button type="submit" :loading="uploading" :disabled="!uploadForm.file" severity="primary" class="w-full">
            Upload File
          </Button>
        </form>
        <!-- Preview -->
        <div v-if="uploadForm.file"
          class="p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50 flex flex-col items-center justify-center">
          <h3 class="text-sm font-medium mb-2">Preview</h3>
          <!-- Image Preview -->
          <div v-if="isImage" class="mb-2">
            <Image :src="previewUrl" :alt="uploadForm.file.name" preview class="max-w-full h-auto rounded-lg" :pt="{
              image: { class: 'max-h-[200px] object-contain' }
            }" />
          </div>
          <!-- File Info -->
          <div class="w-full space-y-1">
            <div class="flex items-center justify-between">
              <span class="font-medium">Name:</span>
              <span>{{ uploadForm.file.name }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="font-medium">Size:</span>
              <span>{{ formatFileSize(uploadForm.file.size) }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="font-medium">Type:</span>
              <span>{{ uploadForm.file.type || 'Unknown' }}</span>
            </div>
          </div>
        </div>
        <!-- File Browser -->
        <div>
          <div class="flex items-center justify-between mb-2">
            <h3>File Browser</h3>
            <div class="flex items-center gap-2">
              <span class="p-float-label">
                <InputText id="path" v-model="currentPath" class="w-48" />
                <label for="path">Current Path</label>
              </span>
              <Button icon="pi pi-refresh" @click="refreshFiles" :loading="loading" text />
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
                  <Button icon="pi pi-trash" text rounded severity="danger" @click="confirmDelete(data)"
                    v-tooltip.top="'Delete'" />
                </div>
              </template>
            </Column>
          </DataTable>
        </div>

      </template>
    </Card>

    <Dialog v-model:visible="deleteDialog.visible" modal header="Confirm Delete" :style="{ width: '450px' }">
      <div class="space-y-4">
        <p>Are you sure you want to delete this file?</p>
        <div class="font-medium">{{ deleteDialog.file?.name }}</div>
      </div>
      <template #footer>
        <Button label="No" icon="pi pi-times" text @click="deleteDialog.visible = false" />
        <Button label="Delete" icon="pi pi-trash" severity="danger" @click="handleDeleteFile" :loading="loading" />
      </template>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import '@/assets/css/component-title.css';
import Image from 'primevue/image';
const { uploadFile, deleteFile: deleteStorageFile, listFiles, loading, error } = useStorage();
const toast = useToast();



// State
const files = ref<any[]>([]);
const currentPath = ref('');
const submitted = ref(false);
const uploading = ref(false);
const deleting = ref(false);
const previewUrl = ref('');

// Upload Form
const uploadForm = ref({
  folder: '',
  file: null as File | null,
  metadata: [{ key: '', value: '' }]
});

// Delete Dialog
const deleteDialog = ref({
  visible: false,
  file: null as any
});

// Computed
const isImage = computed(() => {
  if (!uploadForm.value.file) return false;
  return uploadForm.value.file.type.startsWith('image/');
});

// Methods
const onFileSelect = (event: any) => {
  const file = event.files[0];
  if (file) {
    uploadForm.value.file = file;
    if (isImage.value) {
      const reader = new FileReader();
      reader.onload = (e) => {
        previewUrl.value = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }
};

const handleUpload = async () => {
  submitted.value = true;
  if (!uploadForm.value.file || !uploadForm.value.folder) return;

  try {
    uploading.value = true;
    // Convert metadata array to object
    const metadata = uploadForm.value.metadata.reduce((acc, { key, value }) => {
      if (key && value) acc[key] = value;
      return acc;
    }, {} as Record<string, string>);

    // Create file path
    const path = `${uploadForm.value.folder.replace(/^\/+|\/+$/g, '')}/${uploadForm.value.file.name}`;

    const result = await uploadFile(path, uploadForm.value.file, metadata);

    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'File uploaded successfully',
      life: 3000
    });

    // Reset form
    uploadForm.value = {
      folder: '',
      file: null,
      metadata: [{ key: '', value: '' }]
    };
    previewUrl.value = '';
    submitted.value = false;

    // Refresh files
    refreshFiles();
  } catch (error: any) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: error.message,
      life: 3000
    });
  } finally {
    uploading.value = false;
  }
};

const refreshFiles = async () => {
  try {
    const path = currentPath.value.replace(/^\/+|\/+$/g, '') || '/';
    const result = await listFiles(path);
    files.value = result;
  } catch (error: any) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: error.message,
      life: 3000
    });
  }
};

const downloadFile = (file: any) => {
  const link = document.createElement('a');
  link.href = file.downloadURL;
  link.download = file.name;
  link.click();
};

const confirmDelete = (file: any) => {
  deleteDialog.value = {
    visible: true,
    file
  };
};

const handleDeleteFile = async () => {
  try {
    if (!deleteDialog.value.file) return;

    await deleteStorageFile(deleteDialog.value.file.fullPath);
    await refreshFiles();

    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'File deleted successfully',
      life: 3000,
    });

    deleteDialog.value.visible = false;
    deleteDialog.value.file = null;
  } catch (err: any) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: err.message || 'Failed to delete file',
      life: 3000,
    });
  }
};

const addMetadata = () => {
  uploadForm.value.metadata.push({ key: '', value: '' });
};

const removeMetadata = (index: number) => {
  uploadForm.value.metadata.splice(index, 1);
};

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
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

// Watch for errors
watch(error, (newError) => {
  if (newError) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: newError,
      life: 3000
    });
  }
});

// Initial load
onMounted(() => {
  refreshFiles();
});
</script>

<style scoped>
</style>
