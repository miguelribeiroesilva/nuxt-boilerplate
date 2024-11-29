<template>
  <div id="performance-metrics" class="p-4 border rounded-lg dark:border-gray-700">
    <h3 class="text-lg font-semibold mb-2">Performance Metrics</h3>
    <div class="space-y-2">
      <div class="flex justify-between">
        <span>Success Rate:</span>
        <span>{{ ((metrics.successes / (metrics.total || 1)) * 100).toFixed(1) }}%</span>
      </div>
      <div class="flex justify-between">
        <span>Average Reflections:</span>
        <span>{{ (metrics.totalReflections / (metrics.total || 1)).toFixed(1) }}</span>
      </div>
      <div class="flex justify-between">
        <span>Total Interactions:</span>
        <span>{{ metrics.total }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Metrics {
  total: number;
  successes: number;
  totalReflections: number;
}

defineProps<{
  metrics: Metrics;
}>();
</script>

<style scoped>
.performance-metrics {
  @apply w-full transition-all duration-200;
}
</style>
