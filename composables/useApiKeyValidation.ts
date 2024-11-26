export const useApiKeyValidation = () => {
  const error = ref<string | null>(null);
  const runtimeConfig = useRuntimeConfig();
  const apiKeyStorage = 'openai_api_key';

  const validateApiKey = async (apiKey: string): Promise<boolean> => {
    try {
      if (!apiKey) {
        error.value = 'Please enter an API key.';
        return false;
      }

      const response = await fetch('https://api.openai.com/v1/models', {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
        },
      });

      if (!response.ok) {
        error.value = 'Invalid API key.';
        return false;
      }

      // Store the valid API key
      localStorage.setItem(apiKeyStorage, apiKey);
      error.value = null;
      return true;
    } catch (e) {
      error.value = 'Failed to initialize with the provided API key.';
      return false;
    }
  };

  const getStoredApiKey = (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(apiKeyStorage);
  };

  const clearApiKey = () => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(apiKeyStorage);
  };

  return {
    error,
    validateApiKey,
    getStoredApiKey,
    clearApiKey
  };
};
