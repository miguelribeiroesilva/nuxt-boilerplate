import { ref } from 'vue';
import { HumanMessage, AIMessage, SystemMessage } from '@langchain/core/messages';
import type { Message } from './useAgentConfig';
import { useAgentMetrics } from './useAgentMetrics';
import { useApiKeyValidation } from './useApiKeyValidation';
import { useAIModel } from './useAIModel';

export const useReflectionAgent = () => {
  // Component state
  const messages = ref<Message[]>([]);
  const isLoading = ref(false);
  const showApiKeyDialog = ref(false);
  const showSidebar = ref(false);
  const newMessage = ref('');
  const maxReflections = ref(3);
  const temperature = ref(0.7);

  // Get dependencies
  const {
    config: modelConfig,
    model,
    initializeModel,
    updateConfig,
    availableModels
  } = useAIModel();

  const { validateApiKey, getStoredApiKey } = useApiKeyValidation();
  const { metrics } = useAgentMetrics();

  // Convert Langchain messages to our Message type
  function convertMessage(msg: HumanMessage | AIMessage | SystemMessage): Message {
    if (msg instanceof HumanMessage) {
      return { role: 'human', content: msg.content };
    } else if (msg instanceof AIMessage) {
      return { role: 'assistant', content: msg.content };
    } else if (msg instanceof SystemMessage) {
      return { role: 'system', content: msg.content };
    }
    throw new Error('Unsupported message type');
  }

  // Handle sending messages
  const sendMessage = async () => {
    if (!newMessage.value.trim() || isLoading.value || !model.value) {
      return;
    }

    const messageContent = newMessage.value.trim();
    newMessage.value = '';
    isLoading.value = true;

    try {
      // Add user message
      messages.value.push({
        role: 'human',
        content: messageContent
      });

      // Get AI response
      const response = await model.value.invoke([
        new SystemMessage('You are a helpful AI assistant.'),
        ...messages.value.map(msg => 
          msg.role === 'human' ? new HumanMessage(msg.content) : new AIMessage(msg.content)
        )
      ]);

      // Add AI response
      messages.value.push({
        role: 'assistant',
        content: response.content
      });

    } catch (e) {
      console.error('Error:', e);
      messages.value.push({
        role: 'error',
        content: 'Failed to get response. Please try again.'
      });

      if (e instanceof Error && e.message.includes('API key')) {
        showApiKeyDialog.value = true;
        model.value = null;
      }
    } finally {
      isLoading.value = false;
    }
  };

  // Initialize agent
  const initialize = async () => {
    const savedKey = getStoredApiKey();
    if (savedKey) {
      const isValid = await validateApiKey(savedKey);
      if (isValid) {
        await initializeModel(savedKey);
      } else {
        showApiKeyDialog.value = true;
      }
    } else {
      showApiKeyDialog.value = true;
    }
  };

  return {
    // State
    messages,
    isLoading,
    showApiKeyDialog,
    showSidebar,
    newMessage,
    maxReflections,
    temperature,
    modelConfig,
    model,
    availableModels,
    metrics,

    // Methods
    sendMessage,
    initialize,
    updateConfig,
    convertMessage
  };
};
