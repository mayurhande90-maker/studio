
import { analyzeImage, EnhanceUploadedImageInput } from '@/ai/flows/analyze-image-flow';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const maxDuration = 60; // Set timeout to 60 seconds

export async function POST(req: NextRequest) {
  try {
    const input: EnhanceUploadedImageInput = await req.json();

    // Validate input
    if (!input.photoDataUri || !input.mimeType) {
      return NextResponse.json({ error: 'Missing photoDataUri or mimeType in request body' }, { status: 400 });
    }

    const result = await analyzeImage(input);

    return NextResponse.json(result);

  } catch (error: any) {
    console.error('API Route Error:', error);
    
    // Check for Genkit-specific error structure or other known error types
    const errorMessage = error.cause?.message || error.message || 'An unexpected error occurred during image analysis.';
    
    // Ensure a proper error response is sent
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
