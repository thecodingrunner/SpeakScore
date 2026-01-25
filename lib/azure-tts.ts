// lib/azure-tts.ts
// Azure Text-to-Speech service for generating pronunciation audio

import * as sdk from 'microsoft-cognitiveservices-speech-sdk';

const AZURE_SPEECH_KEY = process.env.AZURE_SPEECH_KEY!;
const AZURE_SPEECH_REGION = process.env.AZURE_SPEECH_REGION!;

interface TTSOptions {
  text: string;
  voice?: 'female' | 'male';
  speed?: number; // 0.5 to 2.0
  pitch?: number; // -50 to 50
}

/**
 * Generate audio from text using Azure TTS
 * Returns audio buffer that can be uploaded to Firebase Storage
 */
export async function generateTTS({
  text,
  voice = 'female',
  speed = 1.0,
  pitch = 0
}: TTSOptions): Promise<Buffer> {
  
  const speechConfig = sdk.SpeechConfig.fromSubscription(
    AZURE_SPEECH_KEY,
    AZURE_SPEECH_REGION
  );

  // Use high-quality neural voices
  // Female: en-US-JennyNeural (natural, clear)
  // Male: en-US-GuyNeural (professional, clear)
  speechConfig.speechSynthesisVoiceName = 
    voice === 'female' ? 'en-US-JennyNeural' : 'en-US-GuyNeural';

  // Output to memory (we'll upload to Firebase)
  speechConfig.speechSynthesisOutputFormat = 
    sdk.SpeechSynthesisOutputFormat.Audio16Khz32KBitRateMonoMp3;

  const synthesizer = new sdk.SpeechSynthesizer(speechConfig);

  // Build SSML for precise control
  const ssml = `
    <speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="en-US">
      <voice name="${speechConfig.speechSynthesisVoiceName}">
        <prosody rate="${speed}" pitch="${pitch}%">
          ${text}
        </prosody>
      </voice>
    </speak>
  `;

  return new Promise((resolve, reject) => {
    synthesizer.speakSsmlAsync(
      ssml,
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

/**
 * Generate slow version for learning (0.75x speed)
 */
export async function generateSlowTTS(text: string): Promise<Buffer> {
  return generateTTS({ text, speed: 0.75 });
}

/**
 * Generate both normal and slow versions
 */
export async function generateTTSVariants(text: string): Promise<{
  normal: Buffer;
  slow: Buffer;
}> {
  const [normal, slow] = await Promise.all([
    generateTTS({ text }),
    generateSlowTTS(text)
  ]);

  return { normal, slow };
}