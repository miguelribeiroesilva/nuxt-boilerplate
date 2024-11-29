export interface AgentRole {
  name: string;
  description: string;
  systemPrompt: string;
  temperature: number;
  active: boolean;
}

export interface AgentConfig {
  roles: AgentRole[];
  maxTokens: number;
  modelName: string;
  temperature: number;
}

const defaultConfig: AgentConfig = {
  roles: [
    {
      name: 'Planner',
      description: 'Breaks down complex tasks into manageable steps',
      systemPrompt: 'You are a strategic planner. Break down complex tasks into clear, actionable steps.',
      temperature: 0.7,
      active: true
    },
    {
      name: 'Researcher',
      description: 'Gathers and analyzes information',
      systemPrompt: 'You are a thorough researcher. Find and analyze relevant information to support decision-making.',
      temperature: 0.5,
      active: true
    },
    {
      name: 'Executor',
      description: 'Implements solutions and provides results',
      systemPrompt: 'You are an efficient executor. Take the analyzed information and create concrete solutions.',
      temperature: 0.3,
      active: true
    }
  ],
  maxTokens: 2000,
  modelName: 'gpt-3.5-turbo',
  temperature: 0.7
};

export function useAgentConfig() {
  const config = ref<AgentConfig>('agentConfig', () => ({ ...defaultConfig }));

  const updateRole = (role: AgentRole) => {
    const updatedRoles = config.value.roles.map((r: AgentRole) =>
      r.name === role.name ? { ...r, ...role } : r
    );
    config.value = {
      ...config.value,
      roles: updatedRoles
    };
  };

  const addRole = (role: AgentRole) => {
    config.value.roles.push(role);
  };

  const removeRole = (index: number) => {
    config.value.roles.splice(index, 1);
  };

  const updateConfig = (updates: Partial<AgentConfig>) => {
    config.value = {
      ...config.value,
      ...updates
    };
  };

  const resetConfig = () => {
    config.value = { ...defaultConfig };
  };

  const getActiveRoles = () => {
    return config.value.roles.filter((role: AgentRole) => role.active);
  };

  return {
    config,
    updateRole,
    addRole,
    removeRole,
    updateConfig,
    resetConfig,
    getActiveRoles
  };
}
