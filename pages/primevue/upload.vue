<template>
  <div class="card">
    <h2 class="text-2xl font-bold mb-4">File Upload Demos</h2>

    <!-- Basic Upload -->
    <div class="mb-8">
      <h3 class="text-xl font-semibold mb-3">Basic Upload</h3>
      <FileUpload
        mode="basic"
        name="basic"
        url="/api/upload"
        accept="image/*"
        :maxFileSize="1000000"
        @upload="onUpload"
      />
    </div>

    <!-- Advanced Upload -->
    <div class="mb-8">
      <h3 class="text-xl font-semibold mb-3">Advanced Upload</h3>
      <FileUpload
        name="advanced"
        url="/api/upload"
        :multiple="true"
        accept="image/*"
        :maxFileSize="1000000"
        @upload="onUpload"
        :customUpload="true"
        @uploader="customUploader"
      >
        <template #header="{ chooseCallback }">
          <div class="flex flex-wrap justify-content-between align-items-center flex-1 gap-2">
            <div class="flex gap-2">
              <Button @click="chooseCallback" icon="pi pi-images" rounded />
            </div>
          </div>
        </template>
        <template #empty>
          <div class="flex align-items-center flex-column">
            <i class="pi pi-image mt-3 p-5" style="font-size: 5em; border-radius: 50%; background-color: var(--surface-b)" />
            <span style="font-size: 1.2em" class="my-5">Drag and Drop Image Here</span>
          </div>
        </template>
      </FileUpload>
    </div>

    <!-- Auto Upload -->
    <div class="mb-8">
      <h3 class="text-xl font-semibold mb-3">Auto Upload</h3>
      <FileUpload
        name="auto"
        url="/api/upload"
        :multiple="true"
        accept="image/*"
        :maxFileSize="1000000"
        @upload="onUpload"
        :auto="true"
      />
    </div>

    <!-- Template Upload -->
    <div class="mb-8">
      <h3 class="text-xl font-semibold mb-3">Template Upload</h3>
      <FileUpload
        name="template"
        @uploader="customUploader"
        :customUpload="true"
        accept="image/*"
        :maxFileSize="1000000"
        :multiple="true"
      >
        <template #header="{ chooseCallback, uploadCallback, clearCallback }">
          <div class="flex flex-wrap justify-content-between align-items-center flex-1 gap-2">
            <div class="flex gap-2">
              <Button @click="chooseCallback" icon="pi pi-images" label="Choose" />
              <Button @click="uploadCallback" icon="pi pi-upload" label="Upload" severity="success" />
              <Button @click="clearCallback" icon="pi pi-times" label="Clear" severity="danger" />
            </div>
          </div>
        </template>
      </FileUpload>
    </div>
  </div>
</template>

<script setup lang="ts">

import { useToast } from 'primevue/usetoast';

definePageMeta({
  layout: 'default'
});

const toast = useToast();

const onUpload = (event: any) => {
  toast.add({
    severity: 'success',
    summary: 'Success',
    detail: 'File Uploaded',
    life: 3000
  });
};

const customUploader = async (event: any) => {
  const { files } = event;

  // Create FormData
  const formData = new FormData();
  for (let file of files) {
    formData.append('file', file);
  }

  try {
    // Simulate upload
    await new Promise(resolve => setTimeout(resolve, 1000));

    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'File(s) Uploaded',
      life: 3000
    });

    // Clear uploaded files
    event.clear();
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Upload Failed',
      life: 3000
    });
  }
};
definePageMeta({
  layout: "fullscreen",
});
</script>

<style scoped>
.card {
  background: var(--surface-card);
  padding: 2rem;
  border-radius: 10px;
  margin: 2rem;
  color: var(--text-color);
}

:deep(.p-fileupload-content) {
  padding: 2rem;
  background: var(--surface-section);
  border-color: var(--surface-border);
}

:deep(.p-fileupload-row) {
  color: var(--text-color);
}

:deep(.p-button) {
  margin-right: 0.5rem;
}

:deep(.p-fileupload-choose) {
  background: var(--primary-color);
}

:deep(.empty-content) {
  color: var(--text-color-secondary);
}
</style>