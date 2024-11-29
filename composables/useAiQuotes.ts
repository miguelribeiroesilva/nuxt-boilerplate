import { ref, onMounted, onUnmounted } from 'vue';
import quotes from '~/utils/ai-quotes.json';

interface Quote {
  quote: string;
  author: string;
}

export function useAiQuotes() {
  // Always start with the first quote to avoid hydration mismatch
  const currentQuote = ref<Quote>(quotes[0]);
  let intervalId: NodeJS.Timeout;

  const updateQuote = () => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    currentQuote.value = quotes[randomIndex];
  };

  onMounted(() => {
    // Start with a random quote after initial hydration
    updateQuote();
    // Update quote every 10 seconds
    intervalId = setInterval(updateQuote, 10000);
  });

  onUnmounted(() => {
    // Clean up interval when component is unmounted
    if (intervalId) {
      clearInterval(intervalId);
    }
  });

  return {
    currentQuote
  };
}
