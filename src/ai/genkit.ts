'use server';

import {genkit, type Plugin} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import {next} from '@genkit-ai/next';
import {devLogger, prodLogger} from 'genkit/logging';

const plugins: Plugin<any>[] = [
  next(),
  googleAI({
    apiVersion: 'v1beta',
  }),
];

if (process.env.NODE_ENV === 'development') {
  plugins.push(devLogger());
} else {
  plugins.push(prodLogger());
}

export const ai = genkit({
  plugins,
  enableTracing: true,
});
