
'use server';

/**
 * @fileOverview A flow to colorize black and white images using AI.
 *
 * - colorizeImage - A function that handles the image colorization process.
 * - ColorizeImageInput - The input type for the colorization function.
 * - ColorizeImageOutput - The return type for the colorizeImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { analyzeVintageImage } from './analyze-vintage-image-flow';
import { ColorizeImageInput, ColorizeImageInputSchema, ImageAnalysisSchema, ImageAnalysis } from './schemas/vintage-image-schemas';


export const ColorizeImageOutputSchema = z.object({
  analysis: ImageAnalysisSchema,
  colorizedPhotoDataUri: z
    .string()
    .describe('The colorized photo, as a data URI in JPG format.'),
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
    // 1. Analyze the image first to get context
    const analysis = await analyzeVintageImage(input);

    // 2. Generate the colorized image
    const { media } = await ai.generate({
      model: 'googleai/gemini-2.5-flash-image-preview',
      prompt: [
        {
          text: `You are an expert in historical photo restoration. Colorize the provided black and white or sepia image with photorealistic, historically-accurate colors.
- Pay close attention to skin tones, clothing, and background details to ensure they are natural and believable for the era.
- Do NOT alter the content of the image. The goal is only to add color.
- The main subject of the photo is: ${analysis.subject}.`
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
