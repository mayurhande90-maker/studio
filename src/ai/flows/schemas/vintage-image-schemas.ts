
'use server';

/**
 * @fileOverview Shared Zod schemas for the vintage image analysis and colorization flows.
 */

import { z } from 'genkit';

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
