'use server';

import {genkit, type Plugin} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';
import {next} from '@genkit-ai/next';
import {firebase} from '@genkit-ai/firebase';
import {devLogger, prodLogger} from 'genkit/logging';

const plugins: Plugin<any>[] = [
  next(),
  googleAI({
    apiVersion: 'v1beta',
  }),
  firebase(),
];

if (process.env.NODE_ENV === 'development') {
  plugins.push(devLogger());
} else {
  plugins.push(prodLogger());
}

export const ai = genkit({
  plugins,
  flowStateStore: 'firebase',
  traceStore: 'firebase',
  enableTracing: true,
});
