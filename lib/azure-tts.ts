// lib/azure-tts.ts
// Azure Text-to-Speech service for generating pronunciation audio

import * as sdk from 'microsoft-cognitiveservices-speech-sdk';

const AZURE_SPEECH_KEY = process.env.AZURE_SPEECH_KEY!;
const AZURE_SPEECH_REGION = process.env.AZURE_SPEECH_REGION!;

type VoiceGender = 'female' | 'male';
type VoiceAccent = 'american' | 'british';

interface TTSOptions {
  text: string;
  gender?: VoiceGender;
  accent?: VoiceAccent;
  speed?: number; // 0.5 to 2.0
  pitch?: number; // -50 to 50
}

/**
 * Voice mapping: gender + accent → Azure Neural voice name
 */
const VOICE_MAP: Record<string, string> = {
  'female-american': 'en-US-JennyNeural',
  'male-american':   'en-US-GuyNeural',
  'female-british':  'en-GB-SoniaNeural',
  'male-british':    'en-GB-OllieMultilingualNeural',
};

/**
 * Accent → SSML xml:lang
 */
const LANG_MAP: Record<VoiceAccent, string> = {
  american: 'en-US',
  british:  'en-GB',
};

/**
 * Generate audio from text using Azure TTS
 * Returns audio buffer that can be uploaded to Firebase Storage
 */
export async function generateTTS({
  text,
  gender = 'female',
  accent = 'american',
  speed = 1.0,
  pitch = 0
}: TTSOptions): Promise<Buffer> {
  
  const speechConfig = sdk.SpeechConfig.fromSubscription(
    AZURE_SPEECH_KEY,
    AZURE_SPEECH_REGION
  );

  const voiceKey = `${gender}-${accent}`;
  const voiceName = VOICE_MAP[voiceKey];

  if (!voiceName) {
    throw new Error(`Unknown voice combination: ${voiceKey}`);
  }

  speechConfig.speechSynthesisVoiceName = voiceName;

  // Output to memory (we'll upload to Firebase)
  speechConfig.speechSynthesisOutputFormat = 
    sdk.SpeechSynthesisOutputFormat.Audio16Khz32KBitRateMonoMp3;

  const synthesizer = new sdk.SpeechSynthesizer(speechConfig);

  const xmlLang = LANG_MAP[accent];

  // Build SSML for precise control
  const ssml = `
    <speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="${xmlLang}">
      <voice name="${voiceName}">
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
export async function generateSlowTTS(
  text: string,
  gender: VoiceGender = 'female',
  accent: VoiceAccent = 'american'
): Promise<Buffer> {
  return generateTTS({ text, gender, accent, speed: 0.75 });
}

/**
 * Generate both normal and slow versions for a specific voice combo
 */
export async function generateTTSVariants(
  text: string,
  gender: VoiceGender = 'female',
  accent: VoiceAccent = 'american'
): Promise<{
  normal: Buffer;
  slow: Buffer;
}> {
  const [normal, slow] = await Promise.all([
    generateTTS({ text, gender, accent }),
    generateSlowTTS(text, gender, accent)
  ]);

  return { normal, slow };
}