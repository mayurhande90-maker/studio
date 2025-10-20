
'use server';

/**
 * @fileOverview A flow to enhance uploaded product images using AI.
 *
 * - enhanceUploadedImage - A function that handles the image enhancement process.
 * - EnhanceUploadedImageInput - The input type for the enhancement function.
 * - EnhanceUploadedImageOutput - The return type for the enhanceUploadedImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { analyzeImageFlow, ProductImageAnalysisSchema, ProductImageAnalysis, EnhanceUploadedImageInputSchema } from './analyze-image-flow';
export type { EnhanceUploadedImageInput } from './analyze-image-flow';


const PostGenerationAnalysisSchema = z.object({
    description: z.string().describe("A one-sentence description of the generated image, explaining what was done. Example: 'We\'ve placed your product in a professional studio setting with cinematic lighting.'"),
    marketingTip: z.string().describe("A short, actionable marketing tip for the user. Example: 'Use this on your product listings or social media to boost engagement!'")
});


const EnhanceUploadedImageOutputSchema = z.object({
  analysis: ProductImageAnalysisSchema,
  enhancedPhotoDataUri: z
    .string()
    .describe('The enhanced hyper-realistic photo, as a data URI in JPG format.'),
  postGenerationAnalysis: PostGenerationAnalysisSchema,
});
export type EnhanceUploadedImageOutput = z.infer<typeof EnhanceUploadedImageOutputSchema>;

export async function enhanceUploadedImage(
  input: z.infer<typeof EnhanceUploadedImageInputSchema>
): Promise<EnhanceUploadedImageOutput> {
  return enhanceUploadedImageFlow(input);
}


const postGenerationPrompt = ai.definePrompt({
    name: 'postGenerationAnalysisPrompt',
    input: { schema: z.object({ productType: z.string() }) },
    output: { schema: PostGenerationAnalysisSchema },
    prompt: `You are a marketing expert. An AI has just generated a professional image of a user's product, which is a "{{productType}}". 
    
    Generate a one-sentence description of the new image and a short, actionable marketing tip.
    
    Example Output:
    {
      "description": "We've placed your {{productType}} in a professional studio setting with cinematic lighting to make it stand out.",
      "marketingTip": "Use this stunning image on your product listings, social media ads, or website hero banner to grab attention and boost sales!"
    }`
});


const enhanceUploadedImageFlow = ai.defineFlow(
  {
    name: 'enhanceUploadedImageFlow',
    inputSchema: EnhanceUploadedImageInputSchema,
    outputSchema: EnhanceUploadedImageOutputSchema,
  },
  async (input) => {
    // 1. Analyze the image first
    const analysis: ProductImageAnalysis = await analyzeImageFlow(input);
    if (!analysis) {
        throw new Error("Initial image analysis failed. Please try a different image.");
    }

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
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });

    if (!media || !media.url) {
        throw new Error(
            'The AI model failed to generate an image. This may be due to a content policy violation or a temporary issue. Please try again with a different image.'
        );
    }

    // 3. Generate post-generation analysis and marketing tips
    const { output: postGenAnalysis } = await postGenerationPrompt({ productType: analysis.productType });
    if (!postGenAnalysis) {
        throw new Error("Failed to generate post-generation marketing analysis.");
    }

    return {
      analysis: analysis,
      enhancedPhotoDataUri: media.url,
      postGenerationAnalysis: postGenAnalysis,
    };
  }
);
