// app/api/generate-audio/route.ts
// API endpoint to generate TTS audio and upload to Firebase

import { NextRequest, NextResponse } from 'next/server';
import { generateTTSVariants } from '@/lib/azure-tts';
import { uploadAudioVariants, audioExists } from '@/lib/firebase-audio-storage';

export async function POST(request: NextRequest) {
  try {
    const { sentenceId, text } = await request.json();

    if (!sentenceId || !text) {
      return NextResponse.json(
        { error: 'Missing sentenceId or text' },
        { status: 400 }
      );
    }

    // Check if audio already exists (avoid regenerating)
    const exists = await audioExists(sentenceId, 'normal');
    if (exists) {
      return NextResponse.json({
        message: 'Audio already exists',
        cached: true
      });
    }

    console.log(`Generating TTS for sentence: ${sentenceId}`);

    // Generate both normal and slow versions
    const { normal, slow } = await generateTTSVariants(text);

    // Upload to Firebase Storage
    const urls = await uploadAudioVariants(sentenceId, normal, slow);

    console.log(`Audio generated and uploaded for: ${sentenceId}`);

    return NextResponse.json({
      success: true,
      urls,
      sentenceId
    });

  } catch (error: any) {
    console.error('TTS generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate audio', details: error.message },
      { status: 500 }
    );
  }
}

// GET endpoint to check if audio exists
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const sentenceId = searchParams.get('sentenceId');

  if (!sentenceId) {
    return NextResponse.json(
      { error: 'Missing sentenceId' },
      { status: 400 }
    );
  }

  const exists = await audioExists(sentenceId, 'normal');

  return NextResponse.json({ sentenceId, exists });
}