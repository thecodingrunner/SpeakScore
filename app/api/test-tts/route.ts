// app/api/test-tts/route.ts
// Test Azure TTS from the browser
// Visit: http://localhost:3000/api/test-tts

import { NextRequest, NextResponse } from 'next/server';
import * as sdk from 'microsoft-cognitiveservices-speech-sdk';

const AZURE_SPEECH_KEY = process.env.AZURE_SPEECH_KEY;
const AZURE_SPEECH_REGION = process.env.AZURE_SPEECH_REGION || 'eastus';

async function generateTTS(text: string): Promise<Buffer> {
  const speechConfig = sdk.SpeechConfig.fromSubscription(
    AZURE_SPEECH_KEY!,
    AZURE_SPEECH_REGION
  );

  speechConfig.speechSynthesisVoiceName = 'en-US-JennyNeural';
  speechConfig.speechSynthesisOutputFormat = 
    sdk.SpeechSynthesisOutputFormat.Audio16Khz32KBitRateMonoMp3;

  const synthesizer = new sdk.SpeechSynthesizer(speechConfig);

  return new Promise((resolve, reject) => {
    synthesizer.speakTextAsync(
      text,
      (result) => {
        if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
          const audioData = Buffer.from(result.audioData);
          synthesizer.close();
          resolve(audioData);
        } else {
          synthesizer.close();
          reject(new Error(`TTS failed: ${result.errorDetails}`));
        }
      },
      (error) => {
        synthesizer.close();
        reject(error);
      }
    );
  });
}

export async function GET(request: NextRequest) {
  try {
    if (!AZURE_SPEECH_KEY) {
      return NextResponse.json(
        { error: 'AZURE_SPEECH_KEY not configured' },
        { status: 500 }
      );
    }

    const text = 'I really like learning English.';
    console.log('🎤 Generating TTS for:', text);

    const audioBuffer = await generateTTS(text);

    console.log('✅ TTS generated successfully!');
    console.log(`📊 Size: ${(audioBuffer.length / 1024).toFixed(2)} KB`);

    // Return audio file
    return new NextResponse(audioBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': audioBuffer.length.toString(),
        'Content-Disposition': 'attachment; filename="test-audio.mp3"'
      }
    });

  } catch (error: any) {
    console.error('❌ TTS error:', error);
    return NextResponse.json(
      { 
        error: 'TTS generation failed',
        details: error.message,
        region: AZURE_SPEECH_REGION,
        hasKey: !!AZURE_SPEECH_KEY
      },
      { status: 500 }
    );
  }
}