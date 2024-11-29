<template>
  <Card>
    <template #content>
      <BackButton />
      <Button label="Reflection Agent Demo" severity="info" disabled />
    </template>
  </Card>

  <Card class="mb-4">
    <template #title>Agent Status</template>
    <template #content>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <PerformanceMetrics :metrics="metrics" />
        <AgentStrategy
          v-model:maxReflections="maxReflections"
          v-model:temperature="temperature"
        />
      </div>
    </template>
  </Card>

  <Card>
    <template #title>Agent Interaction</template>
    <template #content>
      <div class="flex flex-col h-[600px]">
        <MessagesArea
          :messages="messages"
          :is-loading="isLoading"
          :hide-scrollbar="true"
          class="flex-1"
        />
        <div class="flex-none p-1 border-t dark:border-gray-700">
          <ChatInput
            v-model="userInput"
            :is-loading="isLoading"
            @send-message="handleSendMessage"
            :placeholder="'Ask a question or describe a task...'"
          />
        </div>
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { ChatOpenAI } from '@langchain/openai';
import { HumanMessage, AIMessage, SystemMessage } from '@langchain/core/messages';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { PromptTemplate } from '@langchain/core/prompts';
import { StructuredOutputParser } from 'langchain/output_parsers';
import PerformanceMetrics from './components/PerformanceMetrics.vue';
import AgentStrategy from './components/AgentStrategy.vue';
import { useAgentMetrics } from '@/composables/useAgentMetrics';

// Component state
const messages = ref<Message[]>([]);
const userInput = ref('');
const isLoading = ref(false);
const maxReflections = ref(3);
const temperature = ref(0.7);

// Get metrics from composable
const { 
  metrics, 
  incrementTotal, 
  incrementSuccesses, 
  incrementReflections 
} = useAgentMetrics();

// Initialize OpenAI model
const model = new ChatOpenAI({
  modelName: 'gpt-3.5-turbo',
  temperature: 0,
});

// Create output parsers
const responseParser = StructuredOutputParser.fromNamesAndDescriptions({
  answer: "The agent's response to the user's question",
  confidence: "A number between 0 and 1 indicating confidence in the answer",
  reasoning: "The reasoning behind the answer",
});

const reflectionParser = StructuredOutputParser.fromNamesAndDescriptions({
  evaluation: "Evaluation of the previous response (good/needs_improvement)",
  critique: "Specific critique of what could be improved",
  improvement: "An improved version of the response",
  confidence: "New confidence score between 0 and 1",
});

// Create prompt templates
const initialPrompt = PromptTemplate.fromTemplate(`
You are a helpful AI assistant with the ability to reflect on and improve your responses.

Question: {question}

Please provide a response in the following format:
answer: Your direct response to the question
confidence: Your confidence in the answer (0-1)
reasoning: Your reasoning process

Response:
`);

const reflectionPrompt = PromptTemplate.fromTemplate(`
You are a reflection module analyzing the following interaction:

Original Question: {question}
Previous Response:
{previousResponse}

Critique this response and provide an improved version in the following format:
evaluation: "good" or "needs_improvement"
critique: Specific aspects that could be improved
improvement: An improved version of the response
confidence: New confidence score (0-1)

Focus on:
1. Accuracy and completeness
2. Clarity and conciseness
3. Logical reasoning
4. Practical applicability

Response:
`);

// Handle sending messages
async function handleSendMessage() {
  if (!userInput.value.trim() || isLoading.value) return;

  const question = userInput.value;
  messages.value.push({
    role: 'user',
    content: question,
  });

  userInput.value = '';
  isLoading.value = true;
  incrementTotal();

  try {
    let currentResponse;
    let currentConfidence = 0;
    let reflectionCount = 0;
    let finalResponse;

    // Initial response
    const initialResult = await model.invoke([
      new HumanMessage(await initialPrompt.format({
        question,
      })),
    ]);

    currentResponse = await responseParser.parse(initialResult.content);
    currentConfidence = currentResponse.confidence;

    // Reflection loop
    while (reflectionCount < maxReflections.value && currentConfidence < 0.9) {
      reflectionCount++;
      incrementReflections();

      // Add reflection message
      messages.value.push({
        role: 'reflection',
        content: `Reflecting on response (Attempt ${reflectionCount})...`,
      });

      // Get reflection
      const reflectionResult = await model.invoke([
        new HumanMessage(await reflectionPrompt.format({
          question,
          previousResponse: JSON.stringify(currentResponse),
        })),
      ]);

      const reflection = await reflectionParser.parse(reflectionResult.content);

      // Update current response if improvement is suggested
      if (reflection.evaluation === 'needs_improvement' && reflection.confidence > currentConfidence) {
        currentResponse = {
          answer: reflection.improvement,
          confidence: reflection.confidence,
          reasoning: currentResponse.reasoning,
        };
        currentConfidence = reflection.confidence;

        messages.value.push({
          role: 'reflection',
          content: `Critique: ${reflection.critique}\nImprovement made.`,
        });
      } else {
        messages.value.push({
          role: 'reflection',
          content: 'Current response deemed satisfactory.',
        });
        break;
      }
    }

    // Final response
    finalResponse = currentResponse;
    messages.value.push({
      role: 'assistant',
      content: `Answer: ${finalResponse.answer}\n\nReasoning: ${finalResponse.reasoning}\n\nConfidence: ${(finalResponse.confidence * 100).toFixed(1)}%`,
    });

    // Update metrics
    if (currentConfidence >= 0.8) {
      incrementSuccesses();
    }

  } catch (error) {
    messages.value.push({
      role: 'error',
      content: 'An error occurred while processing your request.',
    });
    console.error('Error:', error);
  } finally {
    isLoading.value = false;
  }
}

// Watch temperature changes
watch(temperature, (newTemp) => {
  model.temperature = newTemp;
});
</script>
