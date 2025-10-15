
'use server';

/**
 * @fileOverview A flow to colorize old or black-and-white images using an external API.
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

    const apiUrl = process.env.IMAGE_PROCESSING_API_URL;
    const apiKey = process.env.IMAGE_PROCESSING_API_KEY;

    if (!apiUrl || !apiKey) {
        throw new Error("Image processing API URL or key is not configured.");
    }
    
    // 2. Call the external Image Processing API
    const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          image: input.photoDataUri,
          task: 'colorize' 
        })
      });
    
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Image Processing API call failed: ${errorText}`);
    }

    const result = await response.json();
    
    // Assuming the API returns a JSON with a 'dataUri' field for the colorized image.
    // You may need to adjust this based on your API's actual response structure.
    const colorizedUri = result.dataUri;

    if (!colorizedUri) {
        throw new Error("Invalid response from Image Processing API.");
    }

    return {
      analysis: analysis,
      colorizedPhotoDataUri: colorizedUri,
    };
  }
);
