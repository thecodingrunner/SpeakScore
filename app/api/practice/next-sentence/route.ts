// app/api/practice/next-sentence/route.ts
// Get next sentence for practice

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getNextPracticeSentence } from '@/lib/sentence-selector';

export async function POST(request: NextRequest) {
  try {
    // Get authenticated user
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { scenario } = await request.json();

    if (!scenario) {
      return NextResponse.json(
        { error: 'Scenario is required' },
        { status: 400 }
      );
    }

    // Get next sentence
    const sentence = await getNextPracticeSentence(userId, scenario);

    if (!sentence) {
      return NextResponse.json(
        { error: 'No sentences available' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      sentence: {
        id: sentence.id,
        text: sentence.text,
        phonemes: sentence.phonemes,
        difficulty: sentence.difficulty,
        audioUrls: sentence.audioUrls,
        scenario: sentence.scenario
      }
    });

  } catch (error: any) {
    console.error('Error fetching next sentence:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sentence', details: error.message },
      { status: 500 }
    );
  }
}