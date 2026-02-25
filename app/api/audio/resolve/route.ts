// app/api/audio/resolve/route.ts
// On-demand audio resolution: returns cached URL or generates + caches via Azure TTS

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { resolveAudioUrl } from '@/lib/firebase-audio-storage';

type VoiceGender = 'female' | 'male';
type VoiceAccent = 'american' | 'british';
type AudioSpeed = 'normal' | 'slow';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { sentenceId, text, gender, accent, speed } = await request.json();

    // Validate required fields
    if (!sentenceId || !text) {
      return NextResponse.json(
        { error: 'Missing sentenceId or text' },
        { status: 400 }
      );
    }

    // Validate and default voice params
    const validGenders: VoiceGender[] = ['female', 'male'];
    const validAccents: VoiceAccent[] = ['american', 'british'];
    const validSpeeds: AudioSpeed[] = ['normal', 'slow'];

    const resolvedGender: VoiceGender = validGenders.includes(gender) ? gender : 'female';
    const resolvedAccent: VoiceAccent = validAccents.includes(accent) ? accent : 'american';
    const resolvedSpeed: AudioSpeed = validSpeeds.includes(speed) ? speed : 'normal';

    console.log(`🔊 Resolving audio: ${sentenceId} [${resolvedGender}-${resolvedAccent}-${resolvedSpeed}]`);

    const url = await resolveAudioUrl(
      sentenceId,
      text,
      resolvedGender,
      resolvedAccent,
      resolvedSpeed
    );

    return NextResponse.json({
      success: true,
      url,
      sentenceId,
      voice: {
        gender: resolvedGender,
        accent: resolvedAccent,
        speed: resolvedSpeed,
      },
    });

  } catch (error: any) {
    console.error('❌ Audio resolve error:', error);
    return NextResponse.json(
      { error: 'Failed to resolve audio', details: error.message },
      { status: 500 }
    );
  }
}