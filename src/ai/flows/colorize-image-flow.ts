
'use server';

/**
 * @fileOverview A flow to colorize old or black-and-white images using AI.
 *
 * - colorizeImage - A function that handles the image colorization process.
 * - analyzeImage - A function that analyzes an image before colorization.
 * - ColorizeImageInput - The input type for the colorization/analysis functions.
 * - ColorizeImageOutput - The return type for the colorizeImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ColorizeImageInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A raw photo (likely B&W or vintage), as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
   mimeType: z.string().describe('The MIME type of the image (e.g., "image/jpeg").')
});
export type ColorizeImageInput = z.infer<typeof ColorizeImageInputSchema>;


const ImageAnalysisSchema = z.object({
    imageType: z.string().describe('The type of image detected (e.g., "portrait", "group photo", "landscape", "document", "old photo with scratches").'),
    imageQuality: z.string().describe('A brief assessment of the image quality (e.g., "clear", "blurry", "faded", "high-contrast").'),
    friendlyCaption: z.string().describe('A friendly, one-line caption for the user. Examples: "A classic portrait, ready for a touch of color.", "Looks like a cherished memory. Let\'s bring it to life!", "Beautiful landscape detected. Time to add some color."')
});
export type ImageAnalysis = z.infer<typeof ImageAnalysisSchema>;


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

// We define a separate flow just for analysis so the client can call it first.
const analyzeImageFlow = ai.defineFlow(
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

// We define a new function that the client can import and call.
export async function analyzeVintageImage(input: ColorizeImageInput) {
    return analyzeImageFlow(input);
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
          text: `You are an expert in historical photo restoration and colorization. Your task is to colorize the provided black-and-white or vintage image.

**CRITICAL RULES:**
1.  **Do NOT modify the original content.** The subjects, objects, background, and their arrangements must remain 100% identical to the original photo.
2.  **Apply historically accurate and realistic colors.** Use your knowledge of the era (if discernible) to apply colors that are natural and believable for clothing, skin tones, and environments.
3.  **Handle imperfections smartly.** If the photo has scratches, fading, or blur, your colorization should gracefully incorporate these elements without trying to "fix" them, which might alter the original photo's character. The goal is colorization, not complete restoration or digital alteration.
4.  **Output a hyper-realistic, photorealistic image, not an AI-generated or cartoonish one.** The final result should look like a photograph that was originally taken in color.

The image is a: ${analysis.imageType}`
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
