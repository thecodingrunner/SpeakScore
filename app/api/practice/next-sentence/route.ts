// app/api/practice/next-sentence/route.ts
// Get next sentence for practice with AI generation support
// Audio is resolved on-demand by the client via /api/audio/resolve

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getNextPracticeSentence } from '@/lib/sentence-selector';
import { getUserProgressCollection } from '@/lib/mongodb';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { scenario, excludeSentenceIds } = await request.json();

    if (!scenario) {
      return NextResponse.json(
        { error: 'Scenario is required' },
        { status: 400 }
      );
    }

    const sessionExclusions: string[] = Array.isArray(excludeSentenceIds) ? excludeSentenceIds : [];

    // Get next sentence
    const sentence = await getNextPracticeSentence(userId, scenario, sessionExclusions);

    if (!sentence) {
      // No sentence found - need to generate AI sentence
      console.log(`⚠️ No sentence found, generating AI sentence for ${userId}`);
      
      const userProgressCollection = await getUserProgressCollection();
      const userProgress = await userProgressCollection.findOne({ userId });
      
      const targetPhoneme = userProgress?.weakPhonemes?.[0] || '/r/';
      const difficulty = userProgress?.level || 'beginner';
      
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      const generateResponse = await fetch(`${baseUrl}/api/generate-sentence`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phoneme: targetPhoneme,
          difficulty,
          scenario,
          userId
        })
      });

      if (!generateResponse.ok) {
        const errorData = await generateResponse.json();
        console.error('Failed to generate AI sentence:', errorData);
        return NextResponse.json(
          { error: 'Failed to generate practice sentence' },
          { status: 500 }
        );
      }

      const generatedData = await generateResponse.json();
      
      console.log(`✅ Generated new AI sentence: ${generatedData.sentence.id}`);
      
      return NextResponse.json({
        success: true,
        sentence: {
          id: generatedData.sentence.id,
          text: generatedData.sentence.text,
          phonemes: [targetPhoneme],
          difficulty,
          scenario
        },
        generated: true
      });
    }

    // Return existing sentence (text + metadata, no audio URLs)
    return NextResponse.json({
      success: true,
      sentence: {
        id: sentence.id,
        text: sentence.text,
        phonemes: sentence.phonemes,
        difficulty: sentence.difficulty,
        scenario: sentence.scenario
      },
      generated: false
    });

  } catch (error: any) {
    console.error('Error fetching next sentence:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sentence', details: error.message },
      { status: 500 }
    );
  }
}