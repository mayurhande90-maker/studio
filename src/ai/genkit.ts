'use server';

// import {genkit, defineSecret} from 'genkit';
// import {googleAI} from '@genkit-ai/google-genai';

// defineSecret('GEMINI_API_KEY', 'Your Google AI API Key');

export const ai = {
  // The genkit plugin has been temporarily disabled because
  // the package @genkit-ai/google-genai is not available during build.
  // Re-enable this by restoring the imports above once you have
  // a valid package/version or switch to a supported SDK.
  plugins: [],
  logLevel: 'debug',
  enableTracingAndMetrics: true,
};
