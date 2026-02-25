// app/api/generate-sentence/route.ts
// Generate AI sentences with deduplication check
// Audio is NOT generated here — it's resolved on-demand when played

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { generateValidatedSentence } from '@/lib/ai-sentence-generator';
import { getSentencesCollection } from '@/lib/mongodb';

export async function POST(request: NextRequest) {
  try {
    // Authentication (optional - can be called server-side)
    const { userId: authUserId } = await auth();
    
    const { phoneme, difficulty, scenario, userId } = await request.json();
    
    // Use authenticated user or provided user
    const targetUserId = authUserId || userId;

    if (!targetUserId) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 401 }
      );
    }

    console.log(`🎨 Generating AI sentence for phoneme: ${phoneme}, difficulty: ${difficulty}, scenario: ${scenario}`);

    const sentencesCollection = await getSentencesCollection();

    // DEDUPLICATION CHECK: Look for existing similar sentence
    const existingSimilar = await sentencesCollection.findOne({
      type: 'ai_generated',
      scenario: scenario,
      phonemes: { $in: [phoneme] },
      difficulty: difficulty
    });

    if (existingSimilar) {
      console.log(`♻️  Found existing similar AI sentence: ${existingSimilar.id}, reusing it`);
      
      // Increment usage count
      await sentencesCollection.updateOne(
        { id: existingSimilar.id },
        { 
          $inc: { usageCount: 1 },
          $set: { lastUsed: new Date() }
        }
      );

      return NextResponse.json({
        success: true,
        sentence: {
          id: existingSimilar.id,
          text: existingSimilar.text,
        },
        reused: true
      });
    }

    // No existing similar sentence - generate new one
    console.log(`🆕 No similar AI sentence found, generating fresh content`);

    // 1. Generate sentence with AI
    const sentence = await generateValidatedSentence({
      phoneme,
      difficulty,
      scenario
    });

    console.log(`   Generated text: "${sentence}"`);

    // 2. Create sentence ID
    const sentenceId = `ai_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // 3. Save to MongoDB — text only, no audioUrls
    // Audio is generated on-demand when a user plays the sentence
    await sentencesCollection.insertOne({
      id: sentenceId,
      text: sentence,
      phonemes: [phoneme],
      difficulty,
      scenario,
      type: 'ai_generated',
      generatedFor: targetUserId,
      usageCount: 1,
      lastUsed: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    });

    console.log(`   ✅ Saved to MongoDB with ID: ${sentenceId}`);

    return NextResponse.json({
      success: true,
      sentence: {
        id: sentenceId,
        text: sentence,
      },
      reused: false
    });

  } catch (error: any) {
    console.error('❌ AI generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate sentence', details: error.message },
      { status: 500 }
    );
  }
}