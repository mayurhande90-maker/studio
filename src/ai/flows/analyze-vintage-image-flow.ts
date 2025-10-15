
'use server';

/**
 * @fileOverview A flow to analyze old or black-and-white images.
 *
 * - analyzeVintageImage - A function that analyzes an image before colorization.
 * - ColorizeImageInput - The input type for the analysis function.
 * - ImageAnalysis - The return type for the analysis function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const ColorizeImageInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A raw photo (likely B&W or vintage), as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
   mimeType: z.string().describe('The MIME type of the image (e.g., "image/jpeg").')
});
export type ColorizeImageInput = z.infer<typeof ColorizeImageInputSchema>;


export const ImageAnalysisSchema = z.object({
    imageType: z.string().describe('The type of image detected (e.g., "portrait", "group photo", "landscape", "document", "old photo with scratches").'),
    imageQuality: z.string().describe('A brief assessment of the image quality (e.g., "clear", "blurry", "faded", "high-contrast").'),
    friendlyCaption: z.string().describe('A friendly, one-line caption for the user. Examples: "A classic portrait, ready for a touch of color.", "Looks like a cherished memory. Let\'s bring it to life!", "Beautiful landscape detected. Time to add some color."')
});
export type ImageAnalysis = z.infer<typeof ImageAnalysisSchema>;

const analysisPrompt = ai.definePrompt({
    name: 'vintageImageAnalysisPrompt',
    input: { schema: ColorizeImageInputSchema },
    output: { schema: ImageAnalysisSchema},
    prompt: `You are an expert image analyst specializing in vintage and black-and-white photos. Analyze the following image. Identify the image type, assess its quality (note any fading, blur, or scratches), and generate a friendly, encouraging one-line caption for the user.

    Here are some examples for the friendly caption based on image type:
    - If it's a portrait: "A classic portrait, ready for a touch of color."
    - If it's a group photo: "Looks like a cherished memory. Let's bring it to life!"
    - If it's a landscape: "Beautiful landscape detected. Time to add some color."
    - If it has damage: "A precious moment, we'll do our best to restore and colorize it."
    - If you are not sure: "What a classic! Let's see how we can colorize this for you."

    Photo: {{media url=photoDataUri contentType=mimeType}}`
});

export const analyzeImageFlow = ai.defineFlow(
  {
    name: 'analyzeColorizerImageFlow',
    inputSchema: ColorizeImageInputSchema,
    outputSchema: ImageAnalysisSchema,
  },
  async (input) => {
    const { output } = await analysisPrompt(input);
    return output!;
  }
);

export async function analyzeVintageImage(input: ColorizeImageInput) {
    return analyzeImageFlow(input);
}
