<template>
  <div class="inline-block">
    <Button
      icon="pi pi-question-circle"
      @click="visible = true"
      text
      rounded
      aria-label="Help"
      class="p-1 help-button"
    />
    <Dialog
      v-model:visible="visible"
      :modal="true"
      :header="title"
      class="help-dialog"
      :pt="{
        root: { class: 'help-dialog-root' },
        header: { class: 'help-dialog-header' },
        content: { class: 'help-dialog-content' },
        closeButton: { class: 'help-dialog-close' },
        closeIcon: { class: 'help-dialog-close-icon' }
      }"
    >
      <ContentDoc :path="docPath" class="prose" />
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import '@/assets/css/markdown.css';

defineProps<{
  title: string;
  docPath: string;
}>();

const visible = ref(false);
</script>

<style>
/* Help button styling */
.help-button.p-button.p-button-text:not(:disabled) {
  color: #64748b !important;
  background: transparent !important;
  border: none !important;
}

.help-button.p-button.p-button-text:not(:disabled):hover {
  background: #f1f5f9 !important;
  color: #0f172a !important;
}

.help-button.p-button:focus {
  box-shadow: none !important;
  outline: none !important;
}

:root.dark .help-button.p-button.p-button-text:not(:disabled) {
  color: #94a3b8 !important;
}

:root.dark .help-button.p-button.p-button-text:not(:disabled):hover {
  background: #334155 !important;
  color: #f1f5f9 !important;
}

/* Light mode dialog styling */
.help-dialog {
  max-width: 90vw;
  width: 600px;
}

.help-dialog .help-dialog-root.p-dialog {
  background: #ffffff;
  color: #213547;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
}

.help-dialog .help-dialog-header.p-dialog-header {
  background: #ffffff !important;
  color: #18181b;
  border-bottom: 1px solid #e2e8f0;
  padding: 1rem 1.5rem;
}

.help-dialog .help-dialog-content.p-dialog-content {
  background: #ffffff !important;
  padding: 0.75rem !important;
}

.help-dialog .p-dialog-title {
  font-weight: 600;
}

/* Close button styling */
.help-dialog button.p-dialog-header-icon {
  width: 2rem !important;
  height: 2rem !important;
  border-radius: 0.375rem !important;
  color: #64748b !important;
  transition: all 0.2s ease;
  border: none !important;
  background: transparent !important;
}

.help-dialog button.p-dialog-header-icon:hover {
  background-color: #f1f5f9 !important;
  color: #0f172a !important;
}

.help-dialog button.p-dialog-header-icon:focus {
  box-shadow: none !important;
  outline: none !important;
}

.help-dialog button.p-dialog-header-icon .p-dialog-header-close-icon {
  width: 1rem;
  height: 1rem;
  color: inherit;
}

/* Dark mode dialog styling */
:root.dark .help-dialog .help-dialog-root.p-dialog {
  background: #1e293b;
  color: #e2e8f0;
  border: 1px solid #334155;
}

:root.dark .help-dialog .help-dialog-header.p-dialog-header {
  background: #1e293b !important;
  color: #f1f5f9;
  border-bottom: 1px solid #334155;
}

:root.dark .help-dialog .help-dialog-content.p-dialog-content {
  background: #1e293b !important;
}

:root.dark .help-dialog button.p-dialog-header-icon {
  color: #94a3b8 !important;
}

:root.dark .help-dialog button.p-dialog-header-icon:hover {
  background-color: #334155 !important;
  color: #f1f5f9 !important;
}
</style>
