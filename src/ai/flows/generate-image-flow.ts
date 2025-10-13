
'use server';

/**
 * @fileOverview A flow to generate content from multiple AI providers.
 *
 * - generateImageFlow - A function that calls Gemini and Perplexity with a given prompt.
 * - GenerateImageInput - The input type for the flow.
 * - GenerateImageOutput - The return type for the flow.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

// Define input schema
const GenerateImageInputSchema = z.object({
  prompt: z.string().describe('The text prompt for content generation.'),
});
export type GenerateImageInput = z.infer<typeof GenerateImageInputSchema>;

// Define output schema
const GenerateImageOutputSchema = z.object({
  gemini_output: z.any().describe('The output from the Gemini API.'),
  perplexity_output: z.any().describe('The output from the Perplexity API.'),
});
export type GenerateImageOutput = z.infer<typeof GenerateImageOutputSchema>;


export async function generateImage(input: GenerateImageInput): Promise<GenerateImageOutput> {
    return generateImageFlow(input);
}


// Define the multi-provider generation flow
const generateImageFlow = ai.defineFlow(
  {
    name: 'generateImageFlow',
    inputSchema: GenerateImageInputSchema,
    outputSchema: GenerateImageOutputSchema,
  },
  async (input) => {
    // 1. Call Google Gemini API
    const geminiModel = googleAI.model('gemini-pro');
    const geminiResponse = await ai.generate({
        model: geminiModel,
        prompt: input.prompt,
    });
    const geminiData = geminiResponse.output;

    // 2. Call Perplexity API
    // Note: Genkit does not have a native Perplexity plugin. We use fetch directly.
    const perplexityResponse = await fetch("https://api.perplexity.ai/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.PERPLEXITY_API_KEY}`
        },
        body: JSON.stringify({
          model: "llama-3.1-sonar-large-128k-online",
          messages: [{ role: "user", content: input.prompt }]
        })
      });
    
    if (!perplexityResponse.ok) {
        const errorText = await perplexityResponse.text();
        throw new Error(`Perplexity API call failed: ${errorText}`);
    }

    const perplexityData = await perplexityResponse.json();

    // 3. Combine results
    return {
      gemini_output: geminiData,
      perplexity_output: perplexityData,
    };
  }
);
