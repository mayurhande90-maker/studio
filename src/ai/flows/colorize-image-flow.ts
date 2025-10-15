
'use server';

/**
 * @fileOverview A flow to colorize old or black-and-white images using an external API.
 *
 * - colorizeImage - A function that handles the image colorization process.
 * - ColorizeImageInput - The input type for the colorization/analysis functions.
 * - ColorizeImageOutput - The return type for the colorizeImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { analyzeImageFlow } from './analyze-vintage-image-flow';
import { ColorizeImageInputSchema, ImageAnalysisSchema, ColorizeImageInput } from './schemas/vintage-image-schemas';


const ColorizeImageOutputSchema = z.object({
  analysis: ImageAnalysisSchema,
  colorizedPhotoDataUri: z
    .string()
    .describe('The colorized, hyper-realistic photo, as a data URI in JPG format.'),
});
export type ColorizeImageOutput = z.infer<typeof ColorizeImageOutputSchema>;

export async function colorizeImage(
  input: ColorizeImageInput
): Promise<ColorizeImageOutput> {
  return colorizeImageFlow(input);
}

const colorizeImageFlow = ai.defineFlow(
  {
    name: 'colorizeImageFlow',
    inputSchema: ColorizeImageInputSchema,
    outputSchema: ColorizeImageOutputSchema,
  },
  async (input) => {
    // 1. Analyze the image first
    const analysis = await analyzeImageFlow(input);

    // 2. Generate the colorized image
    const { media } = await ai.generate({
      model: 'googleai/gemini-2.5-flash-image-preview',
      prompt: [
        {
          text: `You are an expert in photo restoration and colorization. Colorize the following black-and-white or vintage image.

**CRITICAL RULE:** The final image should be hyper-realistic and look like a real color photograph. Avoid any AI-generated or cartoonish look. The colors should be natural and historically plausible for the era if it's a vintage photo. The image is a: ${analysis.imageType}`
        },
        { media: { url: input.photoDataUri, contentType: input.mimeType } }
      ],
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });

    return {
      analysis: analysis,
      colorizedPhotoDataUri: media.url!,
    };
  }
);
