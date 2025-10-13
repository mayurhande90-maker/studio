
import { generateImage, GenerateImageInput } from '@/ai/flows/generate-image-flow';
import { NextRequest, NextResponse } from 'next/server';

export const maxDuration = 120; // Set timeout to 120 seconds

export async function POST(req: NextRequest) {
  try {
    const input: GenerateImageInput = await req.json();

    // Validate input
    if (!input.prompt) {
      return NextResponse.json({ error: 'Missing prompt in request body' }, { status: 400 });
    }

    const result = await generateImage(input);

    return NextResponse.json({ success: true, result: result });

  } catch (error: any) {
    console.error('API Route Error:', error);
    
    const errorMessage = error.cause?.message || error.message || 'An unexpected error occurred during image generation.';
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
