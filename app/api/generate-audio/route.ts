// app/api/generate-audio/route.ts
// API endpoint to generate TTS audio and upload to Firebase
// Supports voice gender and accent preferences

import { NextRequest, NextResponse } from 'next/server';
import { generateTTS } from '@/lib/azure-tts';
import { uploadAudioToStorage, audioExists } from '@/lib/firebase-audio-storage';

type VoiceGender = 'female' | 'male';
type VoiceAccent = 'american' | 'british';
type AudioSpeed = 'normal' | 'slow';

export async function POST(request: NextRequest) {
  try {
    const { sentenceId, text, gender = 'female', accent = 'american' } = await request.json();

    if (!sentenceId || !text) {
      return NextResponse.json(
        { error: 'Missing sentenceId or text' },
        { status: 400 }
      );
    }

    const resolvedGender: VoiceGender = gender === 'male' ? 'male' : 'female';
    const resolvedAccent: VoiceAccent = accent === 'british' ? 'british' : 'american';

    // Check if both variants already exist
    const [normalExists, slowExists] = await Promise.all([
      audioExists(sentenceId, resolvedGender, resolvedAccent, 'normal'),
      audioExists(sentenceId, resolvedGender, resolvedAccent, 'slow'),
    ]);

    if (normalExists && slowExists) {
      return NextResponse.json({
        message: 'Audio already exists',
        cached: true
      });
    }

    console.log(`Generating TTS for sentence: ${sentenceId} [${resolvedGender}-${resolvedAccent}]`);

    const urls: { normal?: string; slow?: string } = {};

    // Generate missing variants
    if (!normalExists) {
      const normalBuffer = await generateTTS({ text, gender: resolvedGender, accent: resolvedAccent, speed: 1.0 });
      urls.normal = await uploadAudioToStorage(sentenceId, normalBuffer, resolvedGender, resolvedAccent, 'normal');
    }

    if (!slowExists) {
      const slowBuffer = await generateTTS({ text, gender: resolvedGender, accent: resolvedAccent, speed: 0.75 });
      urls.slow = await uploadAudioToStorage(sentenceId, slowBuffer, resolvedGender, resolvedAccent, 'slow');
    }

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

// GET endpoint to check if audio exists for a specific voice combo
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const sentenceId = searchParams.get('sentenceId');
  const gender = (searchParams.get('gender') || 'female') as VoiceGender;
  const accent = (searchParams.get('accent') || 'american') as VoiceAccent;
  const speed = (searchParams.get('speed') || 'normal') as AudioSpeed;

  if (!sentenceId) {
    return NextResponse.json(
      { error: 'Missing sentenceId' },
      { status: 400 }
    );
  }

  const exists = await audioExists(sentenceId, gender, accent, speed);

  return NextResponse.json({ sentenceId, exists, voice: { gender, accent, speed } });
}