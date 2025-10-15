
import { config } from 'dotenv';
config();

import '@/ai/flows/enhance-uploaded-image.ts';
import '@/ai/flows/generate-image-flow.ts';
import '@/ai/flows/colorize-image-flow.ts';
import '@/ai/flows/analyze-vintage-image-flow.ts';
import '@/ai/flows/schemas/vintage-image-schemas.ts';
