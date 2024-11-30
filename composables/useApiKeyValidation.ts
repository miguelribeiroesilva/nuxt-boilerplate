import { ref } from 'vue';

export function useApiKeyValidation() {
  const error = ref<string | null>(null);
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
        error.value = 'Invalid API key. Please check and try again.';
        return false;
      }

      // Store the valid API key
      localStorage.setItem(apiKeyStorage, apiKey);
      error.value = null;
      return true;
    } catch (e) {
      console.error('API validation error:', e);
      error.value = 'Failed to validate API key. Please check your internet connection and try again.';
      return false;
    }
  };

  const getStoredApiKey = (): string | null => {
    try {
      return localStorage.getItem(apiKeyStorage);
    } catch (e) {
      console.error('Error accessing localStorage:', e);
      return null;
    }
  };

  return {
    error,
    validateApiKey,
    getStoredApiKey,
  };
}
