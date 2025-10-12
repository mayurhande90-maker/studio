
import { enhanceUploadedImage, EnhanceUploadedImageInput } from '@/ai/flows/enhance-uploaded-image';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const input: EnhanceUploadedImageInput = await req.json();

    // Validate input
    if (!input.photoDataUri || !input.mimeType) {
      return NextResponse.json({ error: 'Missing photoDataUri or mimeType in request body' }, { status: 400 });
    }

    const result = await enhanceUploadedImage(input);

    return NextResponse.json(result);

  } catch (error: any) {
    console.error('API Route Error:', error);
    
    // Check for Genkit-specific error structure or other known error types
    const errorMessage = error.cause?.message || error.message || 'An unexpected error occurred during image generation.';
    
    // Ensure a proper error response is sent
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

    