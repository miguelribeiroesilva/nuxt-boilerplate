<template>
  <div class="agent-configuration space-y-4">
    <!-- Global Settings -->
    <div class="global-settings p-4 border rounded-lg dark:border-gray-700">
      <h3 class="text-lg font-semibold mb-3">Global Settings</h3>
      <div class="space-y-3">
        <div class="form-group">
          <label class="text-sm mb-1 block">Model</label>
          <Dropdown
            v-model="localConfig.modelName"
            :options="modelOptions"
            class="w-full"
            @change="handleConfigUpdate"
          />
        </div>

        <div class="form-group">
          <label class="text-sm mb-1 block">
            Default Temperature: {{ localConfig.temperature.toFixed(1) }}
          </label>
          <Slider
            v-model="localConfig.temperature"
            :min="0"
            :max="1"
            :step="0.1"
            class="w-full"
            @change="handleConfigUpdate"
          />
        </div>

        <div class="form-group">
          <label class="text-sm mb-1 block">Max Tokens</label>
          <InputNumber
            v-model="localConfig.maxTokens"
            :min="100"
            :max="4000"
            :step="100"
            class="w-full"
            @change="handleConfigUpdate"
          />
        </div>
      </div>
    </div>

    <!-- Agent Roles -->
    <div class="agent-roles space-y-3">
      <div class="flex items-center justify-between mb-2">
        <h3 class="text-lg font-semibold">Agent Roles</h3>
        <Button
          label="Add Role"
          icon="pi pi-plus"
          @click="addNewRole"
          size="small"
        />
      </div>

      <TransitionGroup name="role-list" tag="div" class="space-y-3">
        <AgentRoleCard
          v-for="(role, index) in localConfig.roles"
          :key="role.name"
          :role="role"
          @update="updates => handleRoleUpdate(index, updates)"
          @remove="handleRoleRemove(index)"
        />
      </TransitionGroup>
    </div>

    <!-- Action Buttons -->
    <div class="flex justify-end gap-2">
      <Button
        label="Reset"
        icon="pi pi-refresh"
        severity="secondary"
        text
        @click="handleReset"
      />
      <Button
        label="Apply"
        icon="pi pi-check"
        @click="applyConfig"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import type { AgentConfig, AgentRole } from '@/composables/useAgentConfig';
import { useAgentConfig } from '@/composables/useAgentConfig';
import AgentRoleCard from './AgentRoleCard.vue';

const modelOptions = [
  'gpt-3.5-turbo',
  'gpt-4',
  'gpt-4-turbo'
];

const props = defineProps<{
  modelValue: AgentConfig;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: AgentConfig];
}>();

const { updateRole: updateAgentRole, addRole, removeRole, resetConfig } = useAgentConfig();
const localConfig = ref<AgentConfig>({ ...props.modelValue });

watch(() => props.modelValue, (newValue) => {
  localConfig.value = { ...newValue };
}, { deep: true });

function addNewRole() {
  const newRole: AgentRole = {
    name: `Agent ${localConfig.value.roles.length + 1}`,
    description: 'New agent role',
    systemPrompt: 'You are a helpful assistant.',
    temperature: localConfig.value.temperature,
    active: true
  };
  localConfig.value.roles.push(newRole);
  handleConfigUpdate();
}

function applyConfig() {
  emit('update:modelValue', localConfig.value);
}

function handleRoleUpdate(index: number, updates: Partial<AgentRole>) {
  if (localConfig.value.roles[index]) {
    localConfig.value.roles[index] = {
      ...localConfig.value.roles[index],
      ...updates
    };
    handleConfigUpdate();
  }
}

function handleRoleRemove(index: number) {
  localConfig.value.roles.splice(index, 1);
  handleConfigUpdate();
}

function handleConfigUpdate() {
  emit('update:modelValue', localConfig.value);
}

function handleReset() {
  localConfig.value = { ...props.modelValue };
  emit('update:modelValue', localConfig.value);
}
</script>

<style scoped>
.agent-configuration {
  @apply w-full;
}

.role-list-move,
.role-list-enter-active,
.role-list-leave-active {
  transition: all 0.3s ease;
}

.role-list-enter-from,
.role-list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.role-list-leave-active {
  position: absolute;
}
</style>