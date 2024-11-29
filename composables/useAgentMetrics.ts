export interface AgentMetrics {
  total: number;
  successes: number;
  totalReflections: number;
}

export function useAgentMetrics() {
  const metrics = ref<AgentMetrics>({
    total: 0,
    successes: 0,
    totalReflections: 0,
  });

  const incrementTotal = () => {
    metrics.value.total++;
  };

  const incrementSuccesses = () => {
    metrics.value.successes++;
  };

  const incrementReflections = () => {
    metrics.value.totalReflections++;
  };

  const resetMetrics = () => {
    metrics.value = {
      total: 0,
      successes: 0,
      totalReflections: 0,
    };
  };

  return {
    metrics,
    incrementTotal,
    incrementSuccesses,
    incrementReflections,
    resetMetrics,
  };
}
