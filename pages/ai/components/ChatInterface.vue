<template>
  <div class="flex-1 overflow-y-auto flex flex-col">
    <div class="flex-1 p-4">
      <MessagesArea :messages="messages" :is-loading="isLoading" :hide-scrollbar="true" />
    </div>
    <div class="p-4 bg-white dark:bg-gray-800 border-t dark:border-gray-700">
      <div class="flex gap-2 max-w-3xl mx-auto">
        <InputText v-model="localMessage" placeholder="Type a message..." class="flex-1" :disabled="isLoading"
          @keyup.enter="handleSend" />
        <Button icon="pi pi-send" :loading="isLoading" :disabled="!localMessage.trim()" @click="handleSend" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import MessagesArea from './MessagesArea.vue';

interface Props {
  messages: any[];
  isLoading: boolean;
  modelValue: string;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'send'): void;
}>();

const localMessage = ref('');

watch(() => props.modelValue, (newVal) => {
  localMessage.value = newVal;
});

watch(localMessage, (newVal) => {
  emit('update:modelValue', newVal);
});

const handleSend = () => {
  if (!localMessage.value.trim() || props.isLoading) return;
  emit('send');
};
</script>
