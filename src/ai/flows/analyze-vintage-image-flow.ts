
'use server';

/**
 * @fileOverview A flow to analyze a vintage or black-and-white photo.
 *
 * - analyzeVintageImage - A function that handles the image analysis.
 */

import {ai} from '@/ai/genkit';
import { ColorizeImageInput, ColorizeImageInputSchema, ImageAnalysis, ImageAnalysisSchema } from './schemas/vintage-image-schemas';

const analysisPrompt = ai.definePrompt({
    name: 'vintageImageAnalysisPrompt',
    input: { schema: ColorizeImageInputSchema },
    output: { schema: ImageAnalysisSchema },
    prompt: `You are an expert image analyst specializing in vintage photography. Analyze the following image.

    Your tasks:
    1.  Determine if the photo is black and white, sepia, or already has color. Set 'isBlackAndWhite' to true if it's B&W or sepia.
    2.  Briefly identify the main subject of the photo (e.g., 'a portrait of a man', 'a group of children', 'a landscape', 'a building').
    3.  Generate a friendly, encouraging one-line caption for the user.
    
    Caption Examples:
    - If B&W Portrait: "A beautiful B&W portrait, ready for color."
    - If B&W Group Photo: "Looks like a classic family photo. Let's bring it to life."
    - If already in color: "This photo is already in color, but we can try to enhance its vibrancy!"
    - General/Uncertain: "An interesting vintage photo. Let's see what colors we can uncover."

    Photo: {{media url=photoDataUri contentType=mimeType}}`
});

const analyzeImageFlow = ai.defineFlow(
  {
    name: 'analyzeImageFlow',
    inputSchema: ColorizeImageInputSchema,
    outputSchema: ImageAnalysisSchema,
  },
  async (input) => {
    const { output } = await analysisPrompt(input);
    return output!;
  }
);

export async function analyzeVintageImage(input: ColorizeImageInput): Promise<ImageAnalysis> {
    return analyzeImageFlow(input);
}
