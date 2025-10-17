'use server';

import {genkit, defineSecret} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

// Define the secret for clarity, but rely on process.env for the actual value.
defineSecret('GEMINI_API_KEY', 'Your Google AI API Key');

export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: process.env.GEMINI_API_KEY,
    }),
  ],
  logLevel: 'debug',
  enableTracingAndMetrics: true,
});
