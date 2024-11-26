<template>
  <Dialog
    :visible="modelValue"
    @update:visible="$emit('update:modelValue', $event)"
    modal
    :closable="false"
    :closeOnEscape="false"
    :header="provider === 'openai' ? 'OpenAI API Key Required' : 'Anthropic API Key Required'"
    class="api-key-dialog"
  >
    <div class="p-fluid">
      <div class="p-field">
        <span class="p-float-label">
          <InputText
            id="apiKey"
            type="password"
            v-model="localApiKey"
            class="w-full"
            @keyup.enter="handleSubmit"
          />
          <label for="apiKey">{{ provider === 'openai' ? 'OpenAI' : 'Anthropic' }} API Key</label>
        </span>
      </div>
      <small class="p-error" v-if="props.error">{{ props.error }}</small>
      <div class="mt-4">
        <p class="text-sm mb-2">
          To use this chat, you need an {{ provider === 'openai' ? 'OpenAI' : 'Anthropic' }} API key. You can get one from:
        </p>
        <a
          :href="provider === 'openai' ? 'https://platform.openai.com/api-keys' : 'https://console.anthropic.com/settings/keys'"
          target="_blank"
          rel="noopener noreferrer"
          class="text-sm text-primary hover:underline"
        >
          {{ provider === 'openai' ? 'https://platform.openai.com/api-keys' : 'https://console.anthropic.com/settings/keys' }}
        </a>
      </div>
    </div>
    <template #footer>
      <Button
        label="Submit"
        @click="handleSubmit"
        :loading="loading"
        :disabled="!localApiKey"
        class="p-button-primary"
      />
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';

interface Props {
  modelValue: boolean;
  apiKey: string;
  error: string | null;
  provider: 'openai' | 'anthropic';
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  apiKey: '',
  error: null,
  provider: 'openai',
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'update:apiKey', value: string): void;
  (e: 'submit', value: string): void;
}>();

const loading = ref(false);
const localApiKey = ref(props.apiKey);

watch(() => props.apiKey, (newValue) => {
  localApiKey.value = newValue;
});

const handleSubmit = async () => {
  if (!localApiKey.value) return;
  
  loading.value = true;
  try {
    emit('update:apiKey', localApiKey.value);
    emit('submit', localApiKey.value);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.api-key-dialog {
  width: 90vw;
  max-width: 500px;
}

:deep(.p-dialog-header) {
  padding: 1.5rem;
  background-color: var(--surface-section);
  border-bottom: 1px solid var(--surface-border);
}

:deep(.p-dialog-content) {
  padding: 2rem;
  background-color: var(--surface-section);
}

:deep(.p-dialog-footer) {
  padding: 1.5rem;
  background-color: var(--surface-section);
  border-top: 1px solid var(--surface-border);
}

:deep(.p-dialog-mask) {
  backdrop-filter: blur(4px);
}

.p-float-label {
  margin-bottom: 1rem;
}

:deep(.p-inputtext) {
  width: 100%;
}

.text-primary {
  color: var(--primary-color);
}
</style>
