'use server';
/**
 * @fileOverview An AI chat flow for answering questions about waste log data.
 *
 * - chat - A function that handles the chat interaction.
 * - ChatInput - The input type for the chat function.
 * - ChatOutput - The return type for the chat function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {WasteLog} from '@/lib/types';

const ChatInputSchema = z.object({
  history: z.array(z.object({role: z.string(), text: z.string()})),
  question: z.string().describe("The user's question about the waste logs."),
  wasteLogs: z
    .string()
    .describe(
      'A JSON string representation of an array of WasteLog objects.'
    ),
});
export type ChatInput = z.infer<typeof ChatInputSchema>;

const ChatOutputSchema = z.object({
  answer: z.string().describe("The AI-generated answer to the user's question."),
});
export type ChatOutput = z.infer<typeof ChatOutputSchema>;

export async function chat(input: ChatInput): Promise<ChatOutput> {
  return await chatFlow(input);
}

const systemPrompt = `You are an expert AI assistant for "Green Track", a construction waste management application. Your role is to answer questions about waste log data provided to you as a JSON string.

- You must ONLY use the data provided in the 'wasteLogs' JSON array to answer questions. Do not make up information.
- If the data is empty or does not contain the answer, you must state that you don't have enough information to answer.
- Keep your answers concise and directly related to the user's question.
- Perform calculations if necessary (e.g., totals, averages, percentages).
- When asked about dates, the current year is ${new Date().getFullYear()}.
- The user's chat history is provided for context. Use it to understand follow-up questions.
- The waste log data is in the following format:
  \`\`\`json
  {
    "id": "string",
    "materialType": "'Concrete' | 'Wood' | 'Metal' | 'Plastic' | 'Glass' | 'Other'",
    "quantity": "number (in kg)",
    "date": "Date",
    "site": "string",
    "disposalMethod": "'Recycled' | 'Disposed'",
    "binId": "string (optional)",
    "cause": "'Offcut' | 'Packaging' | 'Damage' | 'Rework' | 'Other' (optional)"
  }
  \`\`\`
`;

const prompt = ai.definePrompt({
  name: 'chatPrompt',
  input: {schema: ChatInputSchema},
  output: {schema: ChatOutputSchema},
  system: systemPrompt,
  prompt: `
Data:
{{{wasteLogs}}}

History:
{{#each history}}
- {{role}}: {{text}}
{{/each}}

Question:
{{{question}}}
`,
});

const chatFlow = ai.defineFlow(
  {
    name: 'chatFlow',
    inputSchema: ChatInputSchema,
    outputSchema: ChatOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
