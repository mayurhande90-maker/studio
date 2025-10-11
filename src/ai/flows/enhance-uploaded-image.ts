'use server';

/**
 * @fileOverview A flow to enhance uploaded images using AI to improve clarity, detail, and color balance.
 *
 * - enhanceUploadedImage - A function that handles the image enhancement process.
 * - EnhanceUploadedImageInput - The input type for the enhanceUploadedImage function.
 * - EnhanceUploadedImageOutput - The return type for the enhanceUploadedImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EnhanceUploadedImageInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo to be enhanced, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type EnhanceUploadedImageInput = z.infer<typeof EnhanceUploadedImageInputSchema>;

const EnhanceUploadedImageOutputSchema = z.object({
  enhancedPhotoDataUri: z
    .string()
    .describe('The enhanced photo, as a data URI in base64 format.'),
});
export type EnhanceUploadedImageOutput = z.infer<typeof EnhanceUploadedImageOutputSchema>;

export async function enhanceUploadedImage(
  input: EnhanceUploadedImageInput
): Promise<EnhanceUploadedImageOutput> {
  return enhanceUploadedImageFlow(input);
}

const enhanceImagePrompt = ai.definePrompt({
  name: 'enhanceImagePrompt',
  input: {schema: EnhanceUploadedImageInputSchema},
  output: {schema: EnhanceUploadedImageOutputSchema},
  prompt: `You are an AI image enhancer. You will enhance the image provided to improve its clarity, detail, and color balance.

Original Photo: {{media url=photoDataUri}}

Please provide the enhanced image as a data URI in base64 format.
`,
});

const enhanceUploadedImageFlow = ai.defineFlow(
  {
    name: 'enhanceUploadedImageFlow',
    inputSchema: EnhanceUploadedImageInputSchema,
    outputSchema: EnhanceUploadedImageOutputSchema,
  },
  async input => {
    const {media} = await ai.generate({
        model: 'googleai/gemini-2.5-flash-image-preview',
        prompt: [
          {media: {url: input.photoDataUri}},
          {text: 'enhance this photo.'},
        ],
        config: {
          responseModalities: ['TEXT', 'IMAGE'], // MUST provide both TEXT and IMAGE, IMAGE only won't work
        },
      });
    return {enhancedPhotoDataUri: media.url!};
  }
);
