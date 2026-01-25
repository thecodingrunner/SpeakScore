// app/api/generate-sentence/route.ts
// Generate AI sentences and store in MongoDB

import { NextRequest, NextResponse } from 'next/server';
import { generateValidatedSentence } from '@/lib/ai-sentence-generator';
import { generateTTSVariants } from '@/lib/azure-tts';
import { uploadAudioVariants } from '@/lib/firebase-audio-storage';
import { getSentencesCollection } from '@/lib/mongodb';

export async function POST(request: NextRequest) {
  try {
    const { phoneme, difficulty, scenario, userId } = await request.json();

    // 1. Generate sentence with AI
    const sentence = await generateValidatedSentence({
      phoneme,
      difficulty,
      scenario
    });

    // 2. Generate audio
    const { normal, slow } = await generateTTSVariants(sentence);

    // 3. Create sentence ID
    const sentenceId = `ai_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // 4. Upload audio
    const audioUrls = await uploadAudioVariants(sentenceId, normal, slow);

    // 5. Save to MongoDB
    const sentencesCollection = await getSentencesCollection();
    await sentencesCollection.insertOne({
      id: sentenceId,
      text: sentence,
      phonemes: [phoneme],
      difficulty,
      scenario,
      audioUrls,
      type: 'ai_generated',
      generatedFor: userId,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    return NextResponse.json({
      success: true,
      sentence: {
        id: sentenceId,
        text: sentence,
        audioUrls
      }
    });

  } catch (error: any) {
    console.error('AI generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate sentence', details: error.message },
      { status: 500 }
    );
  }
}