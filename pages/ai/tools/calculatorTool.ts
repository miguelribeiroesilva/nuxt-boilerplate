import { DynamicStructuredTool } from '@langchain/core/tools';
import { z } from 'zod';

export const calculatorTool = new DynamicStructuredTool({
  name: 'calculator',
  description: 'Perform basic arithmetic calculations',
  schema: z.object({
    operation: z.string().describe('The arithmetic operation to perform (add, subtract, multiply, divide)'),
    a: z.number().describe('First number'),
    b: z.number().describe('Second number'),
  }),
  func: async ({ operation, a, b }) => {
    let result: number;
    
    switch (operation.toLowerCase()) {
      case 'add':
        result = a + b;
        break;
      case 'subtract':
        result = a - b;
        break;
      case 'multiply':
        result = a * b;
        break;
      case 'divide':
        if (b === 0) throw new Error('Cannot divide by zero');
        result = a / b;
        break;
      default:
        throw new Error(`Unknown operation: ${operation}`);
    }

    return JSON.stringify({
      operation,
      result: result.toString(),
      expression: `${a} ${operation} ${b} = ${result}`,
    });
  },
});
