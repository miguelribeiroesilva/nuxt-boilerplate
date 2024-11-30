<template>
  <Card class="mb-4">
    <template #title>Agent Status</template>
    <template #content>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <PerformanceMetrics :metrics="metrics" />
        <AgentStrategy
          :maxReflections="maxReflections"
          :temperature="temperature"
          @update:maxReflections="$emit('update:maxReflections', $event)"
          @update:temperature="$emit('update:temperature', $event)"
        />
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import Card from 'primevue/card';
import PerformanceMetrics from './PerformanceMetrics.vue';
import AgentStrategy from './AgentStrategy.vue';
import type { AgentMetrics } from '~/composables/useAgentMetrics';

defineProps<{
  metrics: AgentMetrics;
  maxReflections: number;
  temperature: number;
}>();

defineEmits<{
  (e: 'update:maxReflections', value: number): void;
  (e: 'update:temperature', value: number): void;
}>();
</script>
