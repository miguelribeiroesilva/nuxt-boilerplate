<template>
  <div class="px-4 py-2 space-y-4 bg-white dark:bg-gray-800 pb-[80px] flex items-center gap-2">
    <Textarea
      v-model="localMessage"
      :placeholder="placeholder"
      @keyup.enter="handleSend"
      :disabled="disabled"
      class="flex-1 min-h-[40px] max-h-[160px] !p-2 resize-none"
      rows="1"
      @input="handleInput"
      autoresize
    />
    <Button
      icon="pi pi-send"
      @click="handleSend"
      :loading="loading"
      :disabled="!localMessage.trim() || disabled"
    />
  </div>
</template>

<script setup lang="ts">
import Button from 'primevue/button';
import Textarea from 'primevue/textarea';

const props = withDefaults(defineProps<{
  modelValue: string;
  placeholder?: string;
  disabled?: boolean;
  loading?: boolean;
}>(), {
  modelValue: '',
  placeholder: '',
  disabled: false,
  loading: false
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'send-message'): void;
  (e: 'input', event: Event): void;
}>();

const localMessage = ref(props.modelValue || '');

// Watch for external changes
watch(() => props.modelValue, (newValue) => {
  localMessage.value = newValue;
});

// Watch for local changes
watch(localMessage, (newValue) => {
  emit('update:modelValue', newValue);
});

const handleInput = (e: Event) => {
  const target = e.target as HTMLTextAreaElement;
  target.style.height = 'auto';
  target.style.height = `${target.scrollHeight}px`;
  emit('input', e);
};

const handleSend = () => {
  if (!localMessage.value.trim() || props.disabled) return;
  emit('send-message');
  localMessage.value = '';
};
</script>
