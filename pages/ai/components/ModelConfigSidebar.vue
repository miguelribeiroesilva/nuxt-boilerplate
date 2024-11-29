<template>
  <Sidebar
    :visible="modelValue"
    @update:visible="$emit('update:modelValue', $event)"
    position="left"
    class="model-config-sidebar"
    :modal="false"
    :showCloseIcon="false"
  >
    <template #header>
      <div class="flex justify-between items-center w-full">
        <Button label="Model Configuration" severity="info" disabled />
        <Button
          icon="pi pi-angle-left"
          text
          rounded
          @click="$emit('update:modelValue', !modelValue)"
          v-tooltip.right="modelValue ? 'Collapse Sidebar' : 'Expand Sidebar'"
        />
      </div>
    </template>

    <div class="p-1">
      <!-- Model Selection -->
      <div class="mb-6">
        <h3 class="text-lg font-medium mb-2">Model</h3>
        <Dropdown
          v-model="localConfig.modelName"
          :options="availableModels"
          optionLabel="label"
          optionValue="value"
          class="w-full"
          @change="updateConfig"
        />
      </div>

      <!-- Temperature -->
      <div class="mb-6">
        <div class="flex justify-between items-center mb-2">
          <h3 class="text-lg font-medium">Temperature</h3>
          <span class="text-sm text-gray-500">{{ localConfig.temperature }}</span>
        </div>
        <Slider
          v-model="localConfig.temperature"
          :min="0"
          :max="2"
          :step="0.1"
          class="w-full"
          @change="updateConfig"
        />
        <small class="text-gray-500">Controls randomness: 0 is focused, 2 is more creative</small>
      </div>

      <!-- Max Tokens -->
      <div class="mb-6">
        <div class="flex justify-between items-center mb-2">
          <h3 class="text-lg font-medium">Max Tokens</h3>
          <span class="text-sm text-gray-500">{{ localConfig.maxTokens }}</span>
        </div>
        <Slider
          v-model="localConfig.maxTokens"
          :min="100"
          :max="4000"
          :step="100"
          class="w-full"
          @change="updateConfig"
        />
        <small class="text-gray-500">Maximum length of the response</small>
      </div>

      <!-- Top P -->
      <div class="mb-6">
        <div class="flex justify-between items-center mb-2">
          <h3 class="text-lg font-medium">Top P</h3>
          <span class="text-sm text-gray-500">{{ localConfig.topP }}</span>
        </div>
        <Slider
          v-model="localConfig.topP"
          :min="0"
          :max="1"
          :step="0.05"
          class="w-full"
          @change="updateConfig"
        />
        <small class="text-gray-500">Controls diversity via nucleus sampling</small>
      </div>

      <!-- Frequency Penalty -->
      <div class="mb-6">
        <div class="flex justify-between items-center mb-2">
          <h3 class="text-lg font-medium">Frequency Penalty</h3>
          <span class="text-sm text-gray-500">{{ localConfig.frequencyPenalty }}</span>
        </div>
        <Slider
          v-model="localConfig.frequencyPenalty"
          :min="0"
          :max="2"
          :step="0.1"
          class="w-full"
          @change="updateConfig"
        />
        <small class="text-gray-500">Reduces repetition of token sequences</small>
      </div>

      <!-- Presence Penalty -->
      <div class="mb-6">
        <div class="flex justify-between items-center mb-2">
          <h3 class="text-lg font-medium">Presence Penalty</h3>
          <span class="text-sm text-gray-500">{{ localConfig.presencePenalty }}</span>
        </div>
        <Slider
          v-model="localConfig.presencePenalty"
          :min="0"
          :max="2"
          :step="0.1"
          class="w-full"
          @change="updateConfig"
        />
        <small class="text-gray-500">Encourages discussing new topics</small>
      </div>

      <!-- Reset Button -->
      <div class="mt-8">
        <Button
          label="Reset to Defaults"
          icon="pi pi-refresh"
          severity="secondary"
          text
          class="w-full"
          @click="resetConfig"
        />
      </div>
    </div>
  </Sidebar>
</template>

<script setup lang="ts">
import Sidebar from 'primevue/sidebar';
import Button from 'primevue/button';
import Dropdown from 'primevue/dropdown';
import Slider from 'primevue/slider';
import { type ModelConfig, type ModelOption } from '~/composables/useAIModel';

interface Props {
  modelValue: boolean;
  config?: ModelConfig;
  availableModels?: ModelOption[];
  model?: any;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  'update:config': [value: ModelConfig];
  'update:model': [value: any];
}>();

const { defaultConfig } = useAIModel();
const localConfig = ref<ModelConfig>(props.config ? { ...props.config } : { ...defaultConfig });

watch(() => props.config, (newConfig) => {
  if (newConfig) {
    localConfig.value = { ...newConfig };
  }
}, { deep: true });

const updateConfig = () => {
  emit('update:config', { ...localConfig.value });
  emit('update:model', props.model); // Emit model updates as well
};

const resetConfig = () => {
  localConfig.value = { ...defaultConfig };
  emit('update:config', { ...defaultConfig });
};
</script>
