import Anthropic from '@anthropic-ai/sdk';

export const createAnthropicClient = () => {
  const config = useRuntimeConfig();
  
  if (!config.public.anthropicApiKey) {
    throw new Error('Anthropic API key is not configured');
  }

  return new Anthropic({
    apiKey: config.public.anthropicApiKey,
  });
};

export const generateCompletion = async (prompt: string) => {
  const anthropic = createAnthropicClient();
  
  try {
    const completion = await anthropic.messages.create({
      model: "claude-3-opus-20240229",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: prompt
        }
      ]
    });
    
    return completion.content[0].text;
  } catch (error) {
    console.error('Error generating completion:', error);
    throw error;
  }
};
