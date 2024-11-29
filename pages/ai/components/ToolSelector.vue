<template>
  <div class="tool-selector p-4 border rounded-lg dark:border-gray-700">
    <h3 class="text-lg font-semibold mb-3">Available Tools</h3>
    <div class="space-y-3">
      <div class="tool-input">
        <Chips
          v-model="selectedTools"
          :max="5"
          :allowDuplicate="false"
          @add="validateTool"
          @remove="handleRemove"
          class="w-full"
          :placeholder="'Add tools (press enter)'"
        >
          <template #chip="slotProps">
            <div :class="['tool-chip', getToolValidityClass(slotProps.value)]">
              {{ slotProps.value }}
              <span v-if="!isToolValid(slotProps.value)" class="invalid-tooltip">
                Invalid tool
              </span>
            </div>
          </template>
        </Chips>
      </div>

      <div class="available-tools">
        <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">Available tools:</p>
        <div class="flex flex-wrap gap-2">
          <Tag
            v-for="tool in availableTools"
            :key="tool"
            :value="tool"
            :severity="selectedTools.includes(tool) ? 'success' : 'info'"
            @click="addTool(tool)"
            class="cursor-pointer hover:opacity-80 transition-opacity"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { weatherTool, calculatorTool } from '../tools';

const availableTools = ['weather', 'calculator'];

const props = defineProps<{
  modelValue: string[];
}>();

const emit = defineEmits<{
  'update:modelValue': [value: string[]];
}>();

const selectedTools = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});

function isToolValid(tool: string): boolean {
  return availableTools.includes(tool.toLowerCase());
}

function getToolValidityClass(tool: string): string {
  return isToolValid(tool) ? 'valid-tool' : 'invalid-tool';
}

function validateTool(event: { value: string }) {
  const tool = event.value.toLowerCase();
  if (!isToolValid(tool)) {
    // The invalid tool will be shown with a different style
    // User can manually remove it
    return;
  }
}

function handleRemove(event: { value: string }) {
  // No special handling needed for remove
  // The Chips component handles the removal automatically
}

function addTool(tool: string) {
  if (!selectedTools.value.includes(tool)) {
    selectedTools.value = [...selectedTools.value, tool];
  }
}
</script>

<style scoped>
.tool-selector {
  @apply bg-white dark:bg-gray-800 transition-all duration-200;
}

.tool-chip {
  @apply relative flex items-center;
}

.valid-tool {
  @apply text-green-700 dark:text-green-400;
}

.invalid-tool {
  @apply text-red-600 dark:text-red-400;
}

.invalid-tooltip {
  @apply absolute -bottom-6 left-0 text-xs bg-red-100 dark:bg-red-900 
         text-red-600 dark:text-red-400 px-2 py-1 rounded whitespace-nowrap;
}

:deep(.p-chips) {
  @apply w-full;
}

:deep(.p-chips-multiple-container) {
  @apply w-full;
}

:deep(.p-chips .p-chips-multiple-container .p-chips-token) {
  @apply rounded-full px-3 py-1 text-sm;
}

:deep(.p-tag) {
  @apply cursor-pointer transition-all duration-200;
}

:deep(.p-tag:hover) {
  @apply opacity-90;
}
</style>
