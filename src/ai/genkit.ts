'use server';

import {genkit, defineSecret, getSecret} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

// These secrets are now read from environment variables.
// Ensure they are set in your deployment environment.
defineSecret('GEMINI_API_KEY', 'Your Google AI API Key');
defineSecret('PERPLEXITY_API_KEY', 'Your Perplexity AI API Key');

export const ai = genkit({
  plugins: [
    googleAI({
      // Use the API key from environment variables.
      apiKey: process.env.GEMINI_API_KEY || getSecret('GEMINI_API_KEY'),
    }),
  ],
  logLevel: 'debug',
  enableTracingAndMetrics: true,
});
