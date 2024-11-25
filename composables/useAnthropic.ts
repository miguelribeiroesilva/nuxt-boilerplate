import { generateCompletion } from '~/utils/anthropic';

export const useAnthropic = () => {
  const isLoading = ref(false);
  const error = ref<Error | null>(null);

  const generate = async (prompt: string) => {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await generateCompletion(prompt);
      return response;
    } catch (e) {
      error.value = e as Error;
      throw e;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    generate,
    isLoading,
    error
  };
};
