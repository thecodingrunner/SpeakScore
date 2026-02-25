// lib/firebase-audio-storage.ts
import { getStorage } from 'firebase-admin/storage';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { generateTTS } from '@/lib/azure-tts';

// Initialize Firebase Admin
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  });
}

const storage = getStorage();

type VoiceGender = 'female' | 'male';
type VoiceAccent = 'american' | 'british';
type AudioSpeed = 'normal' | 'slow';

/**
 * Build the storage path for a specific audio variant
 * Format: audio/sentences/{sentenceId}/{gender}-{accent}-{speed}.mp3
 */
function buildAudioPath(
  sentenceId: string,
  gender: VoiceGender,
  accent: VoiceAccent,
  speed: AudioSpeed
): string {
  return `audio/sentences/${sentenceId}/${gender}-${accent}-${speed}.mp3`;
}

/**
 * Build the public URL for a file in Firebase Storage
 */
function buildPublicUrl(bucketName: string, filePath: string): string {
  return `https://storage.googleapis.com/${bucketName}/${filePath}`;
}

/**
 * Upload audio buffer to Firebase Storage
 */
export async function uploadAudioToStorage(
  sentenceId: string,
  audioBuffer: Buffer,
  gender: VoiceGender,
  accent: VoiceAccent,
  speed: AudioSpeed
): Promise<string> {
  const filePath = buildAudioPath(sentenceId, gender, accent, speed);
  const bucket = storage.bucket();
  const file = bucket.file(filePath);

  await file.save(audioBuffer, {
    metadata: {
      contentType: 'audio/mpeg',
      cacheControl: 'public, max-age=31536000',
    },
  });

  await file.makePublic();

  return buildPublicUrl(bucket.name, filePath);
}

/**
 * Check if a specific audio variant exists in storage
 */
export async function audioExists(
  sentenceId: string,
  gender: VoiceGender,
  accent: VoiceAccent,
  speed: AudioSpeed
): Promise<boolean> {
  try {
    const filePath = buildAudioPath(sentenceId, gender, accent, speed);
    const bucket = storage.bucket();
    const file = bucket.file(filePath);
    const [exists] = await file.exists();
    return exists;
  } catch (error) {
    return false;
  }
}

/**
 * Resolve audio URL for a specific sentence + voice combo.
 * Returns cached URL if it exists, otherwise generates via Azure TTS,
 * uploads to Firebase, and returns the new URL.
 *
 * This is the core of the on-demand audio system.
 */
export async function resolveAudioUrl(
  sentenceId: string,
  text: string,
  gender: VoiceGender,
  accent: VoiceAccent,
  speed: AudioSpeed
): Promise<string> {
  const filePath = buildAudioPath(sentenceId, gender, accent, speed);
  const bucket = storage.bucket();
  const file = bucket.file(filePath);

  // 1. Check if this variant already exists
  const [exists] = await file.exists();

  if (exists) {
    return buildPublicUrl(bucket.name, filePath);
  }

  // 2. Generate via Azure TTS
  const ttsSpeed = speed === 'slow' ? 0.75 : 1.0;
  const audioBuffer = await generateTTS({
    text,
    gender,
    accent,
    speed: ttsSpeed,
  });

  // 3. Upload to Firebase
  await file.save(audioBuffer, {
    metadata: {
      contentType: 'audio/mpeg',
      cacheControl: 'public, max-age=31536000',
    },
  });

  await file.makePublic();

  return buildPublicUrl(bucket.name, filePath);
}

/**
 * Resolve both normal and slow URLs for a voice combo.
 * Generates any missing variants on the fly.
 */
export async function resolveAudioVariants(
  sentenceId: string,
  text: string,
  gender: VoiceGender,
  accent: VoiceAccent
): Promise<{ normal: string; slow: string }> {
  const [normalUrl, slowUrl] = await Promise.all([
    resolveAudioUrl(sentenceId, text, gender, accent, 'normal'),
    resolveAudioUrl(sentenceId, text, gender, accent, 'slow'),
  ]);

  return { normal: normalUrl, slow: slowUrl };
}

// ─── Legacy helpers (kept for backward compatibility during migration) ───

/**
 * @deprecated Use uploadAudioToStorage with voice params instead
 */
export async function uploadAudioVariants(
  sentenceId: string,
  normalBuffer: Buffer,
  slowBuffer: Buffer
): Promise<{ normal: string; slow: string }> {
  const [normalUrl, slowUrl] = await Promise.all([
    uploadAudioToStorage(sentenceId, normalBuffer, 'female', 'american', 'normal'),
    uploadAudioToStorage(sentenceId, slowBuffer, 'female', 'american', 'slow'),
  ]);

  return { normal: normalUrl, slow: slowUrl };
}