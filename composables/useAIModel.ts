import { ref } from 'vue';
import { BaseChatModel } from '@langchain/core/language_models/chat_models';
import { ChatOpenAI } from '@langchain/openai';

export interface ModelConfig {
  modelName: string;
  temperature: number;
  streaming: boolean;
  maxTokens: number;
  topP: number;
  frequencyPenalty: number;
  presencePenalty: number;
}

export interface ModelOption {
  label: string;
  value: string;
  maxTokens?: number;
  description?: string;
}

// Default models with their specifications
const defaultModels: ModelOption[] = [
  { 
    label: 'GPT-4 Turbo', 
    value: 'gpt-4-1106-preview',
    maxTokens: 4096,
    description: 'Most capable GPT-4 model, better at tasks like writing, analysis, and coding'
  },
  { 
    label: 'GPT-4', 
    value: 'gpt-4',
    maxTokens: 8192,
    description: 'More capable than any GPT-3.5 model, better at complex tasks'
  },
  { 
    label: 'GPT-3.5 Turbo', 
    value: 'gpt-3.5-turbo',
    maxTokens: 4096,
    description: 'Most capable GPT-3.5 model, optimized for chat at 1/10th the cost of GPT-4'
  }
];

export const defaultConfig: ModelConfig = {
  modelName: 'gpt-3.5-turbo',
  temperature: 0.7,
  streaming: true,
  maxTokens: 2000,
  topP: 1,
  frequencyPenalty: 0,
  presencePenalty: 0,
};

// System message to provide context to the AI
const systemMessage = `You are a helpful AI assistant that provides accurate, informative responses. 
You have access to up-to-date information and can help with a wide range of tasks. 
When asked about data or statistics, you should provide the most recent information available to you.
If you're not sure about something, you should acknowledge that and suggest reliable sources for verification.`;

export const useAIModel = () => {
  const config = ref<ModelConfig>(loadConfig());
  const model = ref<BaseChatModel | null>(null);
  const showSidebar = ref(false);
  const availableModels = ref<ModelOption[]>(defaultModels);

  function loadConfig(): ModelConfig {
    try {
      const savedConfig = window?.localStorage?.getItem('ai_model_config');
      if (savedConfig) {
        const parsedConfig = JSON.parse(savedConfig);
        // Validate all required fields are present
        const isValid = Object.keys(defaultConfig).every(key => key in parsedConfig);
        if (isValid) {
          return parsedConfig;
        }
      }
    } catch (e) {
      console.error('Error loading model config:', e);
    }
    return { ...defaultConfig };
  }

  function saveConfig(newConfig: ModelConfig) {
    try {
      window?.localStorage?.setItem('ai_model_config', JSON.stringify(newConfig));
    } catch (e) {
      console.error('Error saving model config:', e);
    }
  }

  const initializeModel = async (apiKey: string) => {
    try {
      model.value = new ChatOpenAI({
        openAIApiKey: apiKey,
        modelName: config.value.modelName,
        temperature: config.value.temperature,
        streaming: config.value.streaming,
        maxTokens: config.value.maxTokens,
        topP: config.value.topP,
        frequencyPenalty: config.value.frequencyPenalty,
        presencePenalty: config.value.presencePenalty,
      });
      return true;
    } catch (e) {
      console.error('Error initializing model:', e);
      model.value = null;
      return false;
    }
  };

  const updateConfig = async (newConfig: ModelConfig, apiKey: string) => {
    config.value = { ...newConfig };
    saveConfig(newConfig);
    return await initializeModel(apiKey);
  };

  const resetConfig = () => {
    config.value = { ...defaultConfig };
  };

  return {
    config,
    model,
    showSidebar,
    availableModels,
    initializeModel,
    updateConfig,
    resetConfig,
  };
};
