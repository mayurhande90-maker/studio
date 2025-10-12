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
   mimeType: z.string().describe('The MIME type of the image (e.g., "image/jpeg").')
});
export type EnhanceUploadedImageInput = z.infer<typeof EnhanceUploadedImageInputSchema>;


const EnhanceUploadedImageOutputSchema = z.object({
  analysis: z.object({
    productType: z.string().describe('The type of product detected in the image (e.g., "bottle", "box", "shoe").'),
    imageQuality: z.string().describe('A brief assessment of the image quality (e.g., "good lighting", "blurry", "well-lit").'),
    friendlyCaption: z.string().describe('A friendly, one-line caption to show the user based on the image analysis. Examples: "Nice portrait! Let\'s bring out those natural details." or "Clean product shot detected. Ready for a cinematic touch?"')
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
        productType: z.string().describe('The type of product detected in the image (e.g., "bottle", "box", "shoe", "face cream jar", "group photo", "document", "landscape", "old photo", "blurry photo").'),
        imageQuality: z.string().describe('A brief assessment of the image quality (e.g., "good lighting", "blurry", "well-lit", "low resolution").'),
        friendlyCaption: z.string().describe('A friendly, one-line caption to show the user based on the image analysis. Examples: "Nice portrait! Let\'s bring out those natural details.", "Clean product shot detected. Ready for a cinematic touch?", "A bit out of focus — our AI will fix that in seconds.", "Vintage vibes detected — we\'ll colorize this beautifully.", "Perfect upload! Let\'s see what Magicpixa can do."')
    })},
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

    Photo: {{media url=photoDataUri contentType=mimeType}}`
});

// We define a separate flow just for analysis so the client can call it first.
const analyzeImageFlow = ai.defineFlow(
  {
    name: 'analyzeImageFlow',
    inputSchema: EnhanceUploadedImageInputSchema,
    outputSchema: analysisPrompt.output.schema,
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


const enhanceUploadedImageFlow = ai.defineFlow(
  {
    name: 'enhanceUploadedImageFlow',
    inputSchema: EnhanceUploadedImageInputSchema,
    outputSchema: EnhanceUploadedImageOutputSchema,
  },
  async (input) => {
    // 1. Analyze the image first
    const analysis = await analyzeImageFlow(input);

    // 2. Generate the enhanced image
    const { media } = await ai.generate({
      model: 'googleai/gemini-2.5-flash-image-preview',
      prompt: [
        {
          text: `You are an expert product photographer. Generate a hyper-realistic, professionally shot image of the product provided.

**CRITICAL RULE:** Do NOT modify the product itself. The product's packaging, logo, brand name, text, and labels must remain 100% original and unchanged. Only enhance the environment, lighting, background, and overall presentation to make it look like a professional photograph. The final image should be in high-definition (HD) and look photorealistic, not AI-generated.

The product is a: ${analysis.productType}`
        },
        { media: { url: input.photoDataUri, contentType: input.mimeType } }
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
