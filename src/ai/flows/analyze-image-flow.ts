
'use server';

/**
 * @fileOverview A flow to analyze uploaded product images using AI.
 *
 * - analyzeImage - A function that analyzes an image.
 * - EnhanceUploadedImageInput - The input type for the analysis function.
 * - ProductImageAnalysis - The return type for the analysis function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const EnhanceUploadedImageInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A raw photo of a product, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
   mimeType: z.string().describe('The MIME type of the image (e.g., "image/jpeg").')
});
export type EnhanceUploadedImageInput = z.infer<typeof EnhanceUploadedImageInputSchema>;


export const ProductImageAnalysisSchema = z.object({
    productType: z.string().describe('The type of product detected in the image (e.g., "bottle", "box", "shoe", "face cream jar", "group photo", "document", "landscape", "old photo", "blurry photo").'),
    imageQuality: z.string().describe('A brief assessment of the image quality (e.g., "good lighting", "blurry", "well-lit", "low resolution").'),
    friendlyCaption: z.string().describe('A friendly, one-line caption to show the user based on the image analysis. Examples: "Nice portrait! Let\'s bring out those natural details.", "Clean product shot detected. Ready for a cinematic touch?", "A bit out of focus — our AI will fix that in seconds.", "Vintage vibes detected — we\'ll colorize this beautifully.", "Perfect upload! Let\'s see what Magicpixa can do."')
});
export type ProductImageAnalysis = z.infer<typeof ProductImageAnalysisSchema>;


const analysisPrompt = ai.definePrompt({
    name: 'productImageAnalysisPrompt',
    inputSchema: EnhanceUploadedImageInputSchema,
    outputSchema: ProductImageAnalysisSchema,
    prompt: `You are an expert image analyst. Analyze the following product image. Identify the product type, assess the image quality, and generate a friendly, encouraging one-line caption for the user.

    Here are some examples for the friendly caption based on image type:
    - If it's a portrait of a person: "Nice portrait! Let's bring out those natural details."
    - If it's a product: "Clean product shot detected. Ready for a cinematic touch?"
    - If it's a group photo: "Looks like a group picture — we’ll balance lighting for everyone."
    - If it's a document: "Text detected — optimizing clarity and readability."
    - If it's a landscape: "Beautiful view! Let's enhance those colors."
    - If it's an old or B&W image: "Vintage vibes detected — we'll colorize this beautifully."
    - If it's blurry: "A bit out of focus — our AI will fix that in seconds."
    - If you are not sure: "Perfect upload! Let's see what Magicpixa can do."

    Photo: {{media url=photoDataUri}}`
});

export const analyzeImageFlow = ai.defineFlow(
  {
    name: 'analyzeImageFlow',
    inputSchema: EnhanceUploadedImageInputSchema,
    outputSchema: ProductImageAnalysisSchema,
  },
  async (input) => {
    const { output } = await analysisPrompt(input);
    return output!;
  }
);

// We define a new function that the client can import and call.
export async function analyzeImage(input: EnhanceUploadedImageInput) {
    return analyzeImageFlow(input);
}
