<template>
  <div class="agent-role-card p-4 border rounded-lg dark:border-gray-700">
    <div class="flex items-start justify-between mb-3">
      <div>
        <h3 class="text-lg font-semibold">{{ role.name }}</h3>
        <p class="text-sm text-gray-600 dark:text-gray-400">{{ role.description }}</p>
      </div>
      <div class="flex items-center gap-2">
        <InputSwitch
          v-model="isActive"
          class="mt-1"
          @change="updateActive"
        />
        <Button
          icon="pi pi-trash"
          text
          severity="danger"
          @click="$emit('remove')"
          class="remove-button"
        />
      </div>
    </div>

    <div class="space-y-3">
      <div class="form-group">
        <label class="text-sm mb-1 block">System Prompt</label>
        <Textarea
          v-model="localPrompt"
          rows="3"
          class="w-full"
          @change="updatePrompt"
        />
      </div>

      <div class="form-group">
        <label class="text-sm mb-1 block">
          Temperature: {{ role.temperature.toFixed(1) }}
        </label>
        <Slider
          v-model="localTemp"
          :min="0"
          :max="1"
          :step="0.1"
          class="w-full"
          @change="updateTemperature"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import type { AgentRole } from '@/composables/useAgentConfig';

const props = defineProps<{
  role: AgentRole;
}>();

const emit = defineEmits<{
  'update': [updates: Partial<AgentRole>];
  'remove': [];
}>();

const isActive = ref(props.role.active);
const localPrompt = ref(props.role.systemPrompt);
const localTemp = ref(props.role.temperature);

watch(() => props.role, (newRole) => {
  isActive.value = newRole.active;
  localPrompt.value = newRole.systemPrompt;
  localTemp.value = newRole.temperature;
}, { deep: true });

function updateActive(value: boolean) {
  emit('update', { active: value });
}

function updatePrompt() {
  emit('update', { systemPrompt: localPrompt.value });
}

function updateTemperature() {
  emit('update', { temperature: localTemp.value });
}
</script>

<style scoped>
.agent-role-card {
  @apply bg-white dark:bg-gray-800 transition-all duration-200;
}

.form-group {
  @apply transition-all duration-200;
}

:deep(.p-inputswitch.p-inputswitch-checked .p-inputswitch-slider) {
  @apply bg-green-500;
}

:deep(.p-slider .p-slider-range) {
  @apply bg-blue-500;
}

:deep(.p-slider:not(.p-disabled) .p-slider-handle:hover) {
  @apply bg-blue-600;
}

.remove-button {
  @apply opacity-70 hover:opacity-100 transition-opacity duration-200;
}

:deep(.p-inputtextarea) {
  @apply w-full text-sm;
}

@media (max-width: 768px) {
  .agent-role-card {
    @apply text-sm;
  }
}
</style>
