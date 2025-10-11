'use server';

/**
 * @fileOverview A flow to enhance uploaded product images using AI.
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
      "A raw photo of a product, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type EnhanceUploadedImageInput = z.infer<typeof EnhanceUploadedImageInputSchema>;


const EnhanceUploadedImageOutputSchema = z.object({
  analysis: z.object({
    productType: z.string().describe('The type of product detected in the image (e.g., "bottle", "box", "shoe").'),
    imageQuality: z.string().describe('A brief assessment of the image quality (e.g., "good lighting", "blurry", "well-lit").')
  }),
  enhancedPhotoDataUri: z
    .string()
    .describe('The enhanced hyper-realistic photo, as a data URI in JPG format.'),
});
export type EnhanceUploadedImageOutput = z.infer<typeof EnhanceUploadedImageOutputSchema>;

export async function enhanceUploadedImage(
  input: EnhanceUploadedImageInput
): Promise<EnhanceUploadedImageOutput> {
  return enhanceUploadedImageFlow(input);
}


const analysisPrompt = ai.definePrompt({
    name: 'productImageAnalysisPrompt',
    input: { schema: EnhanceUploadedImageInputSchema },
    output: { schema: z.object({
        productType: z.string().describe('The type of product detected in the image (e.g., "bottle", "box", "shoe").'),
        imageQuality: z.string().describe('A brief assessment of the image quality (e.g., "good lighting", "blurry", "well-lit").')
    })},
    prompt: `Analyze the following product image. Identify the product type and assess the image quality.

    Photo: {{media url=photoDataUri}}`
});

const enhanceImagePrompt = ai.definePrompt({
  name: 'enhanceProductImagePrompt',
  input: { schema: z.object({
    photoDataUri: z.string(),
    productType: z.string(),
  }) },
  prompt: `You are an expert product photographer. Generate a hyper-realistic, professionally shot image of the product provided.

  **CRITICAL RULE:** Do NOT modify the product itself. The product's packaging, logo, brand name, text, and labels must remain 100% original and unchanged. Only enhance the environment, lighting, background, and overall presentation to make it look like a professional photograph. The final image should be in high-definition (HD) and look photorealistic, not AI-generated.
  
  The product is a: {{{productType}}}
  
  Original Photo: {{media url=photoDataUri}}
  
  Generate a new image with a beautiful, clean, and professional studio background that complements the product.`,
});


const enhanceUploadedImageFlow = ai.defineFlow(
  {
    name: 'enhanceUploadedImageFlow',
    inputSchema: EnhanceUploadedImageInputSchema,
    outputSchema: EnhanceUploadedImageOutputSchema,
  },
  async (input) => {
    // 1. Analyze the image first
    const analysisResponse = await analysisPrompt(input);
    const analysis = analysisResponse.output!;

    // 2. Generate the enhanced image
    const { media } = await ai.generate({
      model: 'googleai/gemini-2.5-flash-image-preview',
      prompt: [
        {
          text: `You are an expert product photographer. Generate a hyper-realistic, professionally shot image of the product provided.

**CRITICAL RULE:** Do NOT modify the product itself. The product's packaging, logo, brand name, text, and labels must remain 100% original and unchanged. Only enhance the environment, lighting, background, and overall presentation to make it look like a professional photograph. The final image should be in high-definition (HD) and look photorealistic, not AI-generated.

The product is a: ${analysis.productType}`
        },
        { media: { url: input.photoDataUri } }
      ],
      config: {
        // Specify JPG output if the model supports it, otherwise, it will be PNG by default.
        // For Gemini, it's typically PNG, which can be converted on the client.
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });

    return {
      analysis: analysis,
      enhancedPhotoDataUri: media.url!,
    };
  }
);
