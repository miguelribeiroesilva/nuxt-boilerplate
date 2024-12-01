<template>
  <div id="current-strategy" class="p-4 border rounded-lg dark:border-gray-700">
    <h3 class="text-lg font-semibold mb-2">Current Strategy</h3>
    <div class="space-y-2">
      <div class="flex items-center gap-2">
        <span>Max Reflections:</span>
        <InputNumber
          :modelValue="maxReflections"
          @update:modelValue="$emit('update:maxReflections', $event)"
          :min="1"
          :max="5"
          showButtons
          class="w-24"
        />
      </div>
      <div class="flex items-center gap-2">
        <span>Temperature:</span>
        <Slider
          :modelValue="temperature"
          @update:modelValue="$emit('update:temperature', $event)"
          :min="0"
          :max="1"
          :step="0.1"
          class="w-32"
        />
        <span class="text-sm">{{ temperature.toFixed(1) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import InputNumber from 'primevue/inputnumber';
import Slider from 'primevue/slider';

defineProps<{
  maxReflections: number;
  temperature: number;
}>();

defineEmits<{
  'update:maxReflections': [value: number];
  'update:temperature': [value: number];
}>();
</script>

<style scoped>
.current-strategy {
  @apply w-full transition-all duration-200;
}

:deep(.p-slider) {
  height: 0.5rem;
}

:deep(.p-slider .p-slider-handle) {
  height: 1.2rem;
  width: 1.2rem;
  margin-top: -0.6rem;
  margin-left: -0.6rem;
}
</style>
