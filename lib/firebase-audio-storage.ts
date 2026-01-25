// lib/firebase-audio-storage.ts
// Upload and manage TTS audio files in Firebase Storage

import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { initializeApp, getApps } from 'firebase/app';

// Initialize Firebase (add to your firebase config)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase if not already initialized
if (!getApps().length) {
  initializeApp(firebaseConfig);
}

const storage = getStorage();

interface UploadAudioOptions {
  sentenceId: string;
  audioBuffer: Buffer;
  variant?: 'normal' | 'slow';
}

/**
 * Upload TTS audio to Firebase Storage
 * Returns the public download URL
 */
export async function uploadAudioToStorage({
  sentenceId,
  audioBuffer,
  variant = 'normal'
}: UploadAudioOptions): Promise<string> {
  
  // Organize by sentence ID: audio/sentences/{sentenceId}/normal.mp3
  const fileName = `audio/sentences/${sentenceId}/${variant}.mp3`;
  const storageRef = ref(storage, fileName);

  // Upload with metadata
  const metadata = {
    contentType: 'audio/mpeg',
    cacheControl: 'public, max-age=31536000', // Cache for 1 year
  };

  await uploadBytes(storageRef, audioBuffer, metadata);

  // Get public download URL
  const downloadURL = await getDownloadURL(storageRef);
  
  return downloadURL;
}

/**
 * Upload both normal and slow versions
 */
export async function uploadAudioVariants(
  sentenceId: string,
  normalBuffer: Buffer,
  slowBuffer: Buffer
): Promise<{ normal: string; slow: string }> {
  
  const [normalUrl, slowUrl] = await Promise.all([
    uploadAudioToStorage({ sentenceId, audioBuffer: normalBuffer, variant: 'normal' }),
    uploadAudioToStorage({ sentenceId, audioBuffer: slowBuffer, variant: 'slow' })
  ]);

  return { normal: normalUrl, slow: slowUrl };
}

/**
 * Check if audio already exists (to avoid regenerating)
 */
export async function audioExists(sentenceId: string, variant: 'normal' | 'slow' = 'normal'): Promise<boolean> {
  try {
    const fileName = `audio/sentences/${sentenceId}/${variant}.mp3`;
    const storageRef = ref(storage, fileName);
    await getDownloadURL(storageRef);
    return true;
  } catch (error) {
    return false;
  }
}