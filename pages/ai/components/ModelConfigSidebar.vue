<template>
  <Sidebar
    :visible="modelValue"
    @update:visible="$emit('update:modelValue', $event)"
    :position="position"
    class="model-config-sidebar"
    :modal="false"
    :showCloseIcon="false"
  >
    <template #header>
      <div class="flex justify-between items-center w-full">
        <Button label="Model Configuration" severity="info" disabled class="flex-1" />
        <Button
          :icon="position === 'right' ? 'pi pi-angle-right' : 'pi pi-angle-left'"
          text
          rounded
          @click="$emit('update:modelValue', !modelValue)"
          v-tooltip.right="modelValue ? 'Collapse Sidebar' : 'Expand Sidebar'"
        />
      </div>
    </template>

    <div class="p-4">
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

      <!-- Additional Configuration Slot -->
        <div class="mt-6 border-t pt-4">
          <h3 class="text-lg font-medium mb-4">Agent Configuration</h3>
          <AgentConfiguration
            :model-value="agentConfig"
            @update:model-value="handleConfigUpdate"
          />
        </div>
    </div>
  </Sidebar>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import Sidebar from 'primevue/sidebar';
import Button from 'primevue/button';
import Dropdown from 'primevue/dropdown';
import Slider from 'primevue/slider';
import AgentConfiguration from './AgentConfiguration.vue';
import { type ModelConfig, type ModelOption } from '~/composables/useAIModel';

interface Props {
  modelValue: boolean;
  config?: ModelConfig;
  availableModels?: ModelOption[];
  model?: any;
  position?: string;
  agentConfig?: any;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  'update:config': [value: ModelConfig];
  'update:model': [value: any];
  'update:agentConfig': [value: any];
}>();

const defaultConfig: ModelConfig = {
  modelName: 'gpt-3.5-turbo',
  provider: 'openai',
  temperature: 0.7,
  streaming: true,
  maxTokens: 2000,
  topP: 1,
  frequencyPenalty: 0,
  presencePenalty: 0,
};

const localConfig = ref<ModelConfig>(props.config ? { ...props.config } : { ...defaultConfig });
const agentConfig = ref(props.agentConfig || {});

watch(() => props.config, (newConfig) => {
  if (newConfig) {
    localConfig.value = { ...newConfig };
  }
}, { deep: true });

watch(() => props.agentConfig, (newConfig) => {
  if (newConfig) {
    agentConfig.value = { ...newConfig };
  }
}, { deep: true });

const updateConfig = (): void => {
  emit('update:config', { ...localConfig.value });
  emit('update:model', props.model);
};

const handleConfigUpdate = (newConfig: any): void => {
  emit('update:agentConfig', newConfig);
};
</script>

<style scoped>
.model-config-sidebar {
  height: 100vh;
  width: 100vw;
  overflow-y: auto;
}

:deep(.p-sidebar) {
  /* width: var(--sidebar-width) !important; */
  max-width: 100vw;
}

:deep(.p-sidebar-content) {
  padding: 0;
}
</style>
