import { DynamicStructuredTool } from '@langchain/core/tools';
import { z } from 'zod';

export const weatherTool = new DynamicStructuredTool({
  name: 'get_current_weather',
  description: 'Get the current weather in a given location',
  schema: z.object({
    location: z.string().describe('The city and state, e.g. San Francisco, CA'),
  }),
  func: async ({ location }) => {
    // Mock weather data
    const weatherConditions = ['sunny', 'cloudy', 'rainy', 'snowy'];
    const condition = weatherConditions[Math.floor(Math.random() * weatherConditions.length)];
    const temperature = Math.floor(Math.random() * 35) + 10; // Random temp between 10-45°C

    return JSON.stringify({
      location,
      temperature: `${temperature}°C`,
      condition,
      humidity: `${Math.floor(Math.random() * 60) + 40}%`, // Random humidity between 40-100%
    });
  },
});
