
'use server';
/**
 * @fileOverview Shared Zod schemas for the vintage image colorization feature.
 */
import { z } from 'zod';

// Input schema for both analysis and colorization
export const ColorizeImageInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A raw photo of a product, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
   mimeType: z.string().describe('The MIME type of the image (e.g., "image/jpeg").')
});
export type ColorizeImageInput = z.infer<typeof ColorizeImageInputSchema>;


// Schema for the analysis of the vintage photo
export const ImageAnalysisSchema = z.object({
    isBlackAndWhite: z.boolean().describe("Determine if the photo is black and white or sepia-toned."),
    subject: z.string().describe("Briefly describe the main subject of the photo (e.g., 'a portrait of a woman', 'a family photo', 'a street scene')."),
    friendlyCaption: z.string().describe("A friendly, one-line caption to show the user based on the analysis. Examples: 'A beautiful B&W portrait, ready for color.', 'Looks like a classic family photo. Let's bring it to life.', 'This photo is already in color, but we can enhance it for you!'")
});
export type ImageAnalysis = z.infer<typeof ImageAnalysisSchema>;
