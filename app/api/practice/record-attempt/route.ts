// app/api/practice/record-attempt/route.ts
// Record a practice attempt

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { recordPracticeAttempt } from '@/lib/sentence-selector';

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

    const { sentenceId, accuracy, phonemeScores } = await request.json();

    // Validate input
    if (!sentenceId || accuracy === undefined || !phonemeScores) {
      return NextResponse.json(
        { error: 'Missing required fields: sentenceId, accuracy, phonemeScores' },
        { status: 400 }
      );
    }

    if (accuracy < 0 || accuracy > 100) {
      return NextResponse.json(
        { error: 'Accuracy must be between 0 and 100' },
        { status: 400 }
      );
    }

    // Record the attempt
    await recordPracticeAttempt(userId, sentenceId, accuracy, phonemeScores);

    return NextResponse.json({
      success: true,
      message: 'Practice attempt recorded',
      xpEarned: calculateXP(accuracy)
    });

  } catch (error: any) {
    console.error('Error recording practice attempt:', error);
    return NextResponse.json(
      { error: 'Failed to record attempt', details: error.message },
      { status: 500 }
    );
  }
}

function calculateXP(accuracy: number): number {
  if (accuracy >= 90) return 50;
  if (accuracy >= 80) return 30;
  if (accuracy >= 70) return 20;
  return 10;
}