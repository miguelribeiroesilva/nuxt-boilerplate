<template>
  <Dialog
    :visible="modelValue"
    @update:visible="$emit('update:modelValue', $event)"
    modal
    :closable="false"
    :closeOnEscape="false"
    header="OpenAI API Key Required"
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
          <label for="apiKey">OpenAI API Key</label>
        </span>
      </div>
      <small class="p-error" v-if="props.error">{{ props.error }}</small>
      <div class="mt-4">
        <p class="text-sm mb-2">
          To use this chat, you need an OpenAI API key. You can get one from:
        </p>
        <a
          href="https://platform.openai.com/api-keys"
          target="_blank"
          rel="noopener noreferrer"
          class="text-sm text-primary hover:underline"
        >
          https://platform.openai.com/api-keys
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
import { ref, watch } from 'vue';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';

interface Props {
  modelValue: boolean;
  apiKey: string;
  error?: string | null;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  apiKey: '',
  error: null,
});

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  'update:apiKey': [value: string];
  'submit': [value: string];
}>();

const localApiKey = ref(props.apiKey);
const loading = ref(false);

watch(() => props.apiKey, (newValue) => {
  localApiKey.value = newValue;
});

const handleSubmit = async () => {
  if (!localApiKey.value) return;

  loading.value = true;
  emit('update:apiKey', localApiKey.value);
  emit('submit', localApiKey.value);
  loading.value = false;
};
</script>

<style scoped>
.api-key-dialog {
  width: 90vw;
  max-width: 500px;
}

@media screen and (min-width: 768px) {
  .api-key-dialog {
    width: 500px;
  }
}

:deep(.p-dialog-header) {
  padding: 1.5rem 1.5rem 0.5rem 1.5rem;
}

:deep(.p-dialog-content) {
  padding: 0 1.5rem 1.5rem 1.5rem;
}

:deep(.p-dialog-footer) {
  padding: 0 1.5rem 1.5rem 1.5rem;
}

.p-field {
  margin-bottom: 1rem;
}

.p-float-label {
  margin-top: 1rem;
}

:deep(.p-inputtext) {
  width: 100%;
}

:deep(.p-button) {
  width: 100%;
}
</style>
