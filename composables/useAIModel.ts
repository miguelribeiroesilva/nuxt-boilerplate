import { ref } from 'vue';
import { BaseChatModel } from '@langchain/core/language_models/chat_models';
import { ChatOpenAI } from '@langchain/openai';
import { ChatAnthropic } from '@langchain/anthropic';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';

export interface ModelConfig {
  modelName: string;
  provider: 'openai' | 'anthropic';
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
  provider: 'openai' | 'anthropic';
  maxTokens?: number;
  description?: string;
}

// Default models with their specifications
export const defaultModels: ModelOption[] = [
  {
    label: 'GPT-4 Turbo',
    value: 'gpt-4-1106-preview',
    provider: 'openai',
    maxTokens: 4096,
    description: 'Most capable GPT-4 model, better at tasks like writing, analysis, and coding'
  },
  {
    label: 'GPT-4',
    value: 'gpt-4',
    provider: 'openai',
    maxTokens: 8192,
    description: 'More capable than any GPT-3.5 model, better at complex tasks'
  },
  {
    label: 'GPT-3.5 Turbo',
    value: 'gpt-3.5-turbo',
    provider: 'openai',
    maxTokens: 4096,
    description: 'Most capable GPT-3.5 model, optimized for chat at 1/10th the cost of GPT-4'
  },
  {
    label: 'Claude 3 Opus',
    value: 'claude-3-opus-20240229',
    provider: 'anthropic',
    maxTokens: 4096,
    description: 'Most capable Claude model, best for complex tasks'
  },
  {
    label: 'Claude 3 Sonnet',
    value: 'claude-3-sonnet-20240229',
    provider: 'anthropic',
    maxTokens: 4096,
    description: 'Balanced model for most tasks'
  },
  {
    label: 'Claude 3 Haiku',
    value: 'claude-3-haiku-20240229',
    provider: 'anthropic',
    maxTokens: 4096,
    description: 'Fastest and most compact Claude model'
  }
];

// Default configuration
export const defaultConfig: ModelConfig = {
  modelName: 'gpt-3.5-turbo',
  provider: 'openai',
  temperature: 0.7,
  streaming: true,
  maxTokens: 4096,
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
  const config = ref<ModelConfig>({ ...defaultConfig });
  const model = ref<BaseChatModel | null>(null);
  const showSidebar = ref(false);
  const availableModels = ref<ModelOption[]>(defaultModels);

  function loadConfig(): ModelConfig {
    try {
      const savedConfig = window?.localStorage?.getItem('ai_model_config');
      if (savedConfig) {
        const parsedConfig = JSON.parse(savedConfig);
        // Validate all required fields are present and set provider if missing
        const isValid = Object.keys(defaultConfig).every(key => key in parsedConfig);
        if (isValid) {
          // Ensure provider is set based on the model if it's missing
          if (!parsedConfig.provider) {
            const selectedModel = defaultModels.find(m => m.value === parsedConfig.modelName);
            if (selectedModel) {
              parsedConfig.provider = selectedModel.provider;
            }
          }
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
      const selectedModel = defaultModels.find(m => m.value === config.value.modelName);
      if (!selectedModel) {
        throw new Error('Invalid model selected');
      }

      const modelConfig = {
        modelName: config.value.modelName,
        temperature: config.value.temperature,
        streaming: true, // Force streaming to be true
        maxTokens: config.value.maxTokens,
        topP: config.value.topP,
        frequencyPenalty: config.value.frequencyPenalty,
        presencePenalty: config.value.presencePenalty,
      };

      if (selectedModel.provider === 'openai') {
        model.value = new ChatOpenAI({
          openAIApiKey: apiKey,
          ...modelConfig,
        });
      } else if (selectedModel.provider === 'anthropic') {
        model.value = new ChatAnthropic({
          anthropicApiKey: apiKey,
          modelName: modelConfig.modelName,
          temperature: modelConfig.temperature,
          maxTokens: modelConfig.maxTokens,
        });
      }

      // Test the connection
      const response = await model.value.invoke([
        new SystemMessage(selectedModel.provider === 'openai'
          ? "You are an AI assistant created by OpenAI."
          : "You are Claude, an AI assistant created by Anthropic."),
        new HumanMessage("Hello")
      ]);
    } catch (e) {
      console.error('Error initializing model:', e);
      throw e;
    }
  };

  const updateConfig = (newConfig: Partial<ModelConfig>) => {
    // Update the provider based on the selected model if modelName changes
    if (newConfig.modelName) {
      const selectedModel = defaultModels.find(m => m.value === newConfig.modelName);
      if (selectedModel) {
        newConfig.provider = selectedModel.provider;
      }
    }

    config.value = {
      ...config.value,
      ...newConfig,
    };
    saveConfig(config.value);
  };

  const resetConfig = () => {
    config.value = { ...defaultConfig };
    saveConfig(config.value);
  };

  return {
    config,
    model,
    showSidebar,
    availableModels,
    defaultConfig,
    initializeModel,
    updateConfig,
    resetConfig,
  };
};
