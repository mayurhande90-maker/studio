
import { colorizeImage, ColorizeImageInput } from '@/ai/flows/colorize-image-flow';
import { NextRequest, NextResponse } from 'next/server';

export const maxDuration = 120; // Set timeout to 120 seconds

export async function POST(req: NextRequest) {
  try {
    const input: ColorizeImageInput = await req.json();

    // Validate input
    if (!input.photoDataUri || !input.mimeType) {
      return NextResponse.json({ error: 'Missing photoDataUri or mimeType in request body' }, { status: 400 });
    }

    const result = await colorizeImage(input);

    return NextResponse.json(result);

  } catch (error: any) {
    console.error('API Route Error:', error);
    
    const errorMessage = error.cause?.message || error.message || 'An unexpected error occurred during image colorization.';
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
