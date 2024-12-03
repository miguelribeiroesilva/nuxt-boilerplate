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
        <Button label="Configuration" severity="info" disabled class="flex-1" />
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
        <h3 class="text-lg font-medium mb-4">Agent Roles</h3>
        <div class="agent-roles space-y-3">
          <div class="flex items-center justify-between mb-2">
            <Button
              label="Add Role"
              icon="pi pi-plus"
              @click="addNewRole"
              size="small"
            />
          </div>

          <TransitionGroup name="role-list" tag="div" class="space-y-3">
            <div
              v-for="(role, index) in agentConfig.roles"
              :key="role.name"
              class="border rounded-lg p-3 dark:border-gray-700"
            >
              <div class="flex justify-between items-center mb-2">
                <input
                  v-model="role.name"
                  class="text-sm font-semibold w-full"
                  @change="handleRoleUpdate(index, { name: role.name })"
                />
                <Button
                  icon="pi pi-trash"
                  text
                  rounded
                  severity="danger"
                  @click="handleRoleRemove(index)"
                />
              </div>
              <textarea
                v-model="role.systemPrompt"
                class="w-full text-xs border rounded p-2 mt-2"
                placeholder="System prompt"
                @change="handleRoleUpdate(index, { systemPrompt: role.systemPrompt })"
              ></textarea>
              <div class="flex items-center mt-2">
                <label class="text-xs mr-2">Temperature:</label>
                <Slider
                  v-model="role.temperature"
                  :min="0"
                  :max="1"
                  :step="0.1"
                  class="flex-1"
                  @change="handleRoleUpdate(index, { temperature: role.temperature })"
                />
                <span class="text-xs ml-2">{{ role.temperature.toFixed(1) }}</span>
              </div>
            </div>
          </TransitionGroup>
        </div>
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
import TransitionGroup from 'vue';
import type { ModelConfig, ModelOption } from '~/composables/useAIModel';
import type { AgentRole } from '~/composables/useAgentConfig';

interface AgentConfig {
  roles: AgentRole[];
  maxTokens: number;
  modelName: string;
  temperature: number;
}

interface Props {
  modelValue: boolean;
  config?: ModelConfig;
  availableModels?: ModelOption[];
  model?: any;
  position?: string;
  agentConfig?: AgentConfig;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  'update:config': [value: ModelConfig];
  'update:model': [value: any];
  'update:agentConfig': [value: AgentConfig];
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
const agentConfig = ref<AgentConfig>(props.agentConfig || {
  roles: [],
  maxTokens: 2000,
  modelName: 'gpt-3.5-turbo',
  temperature: 0.7
});

// const modelOptions = [
//   { label: 'GPT-3.5 Turbo', value: 'gpt-3.5-turbo' },
//   { label: 'GPT-4', value: 'gpt-4' },
//   { label: 'GPT-4 Turbo', value: 'gpt-4-turbo' }
// ];

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

const addNewRole = () => {
  const newRole: AgentRole = {
    name: `Agent ${agentConfig.value.roles.length + 1}`,
    description: 'New agent role',
    systemPrompt: 'You are a helpful assistant.',
    temperature: agentConfig.value.temperature,
    active: true
  };
  agentConfig.value.roles.push(newRole);
  emit('update:agentConfig', { ...agentConfig.value });
};

const handleRoleUpdate = (index: number, updates: Partial<AgentRole>) => {
  if (agentConfig.value.roles[index]) {
    agentConfig.value.roles[index] = {
      ...agentConfig.value.roles[index],
      ...updates
    };
    emit('update:agentConfig', { ...agentConfig.value });
  }
};

const handleRoleRemove = (index: number) => {
  agentConfig.value.roles.splice(index, 1);
  emit('update:agentConfig', { ...agentConfig.value });
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
