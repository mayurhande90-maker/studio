import {genkit, defineSecret} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

// Define the secrets your application needs. This allows you to manage them
// securely in your production environment (e.g., Google Cloud Secret Manager).
defineSecret('GEMINI_API_KEY', 'Your Google AI API Key');
defineSecret('PERPLEXITY_API_KEY', 'Your Perplexity AI API Key');

export const ai = genkit({
  plugins: [
    googleAI({
      // Use the defined secret for the API key.
      apiKey: process.env.GEMINI_API_KEY,
    }),
  ],
  model: 'googleai/gemini-pro',
});
