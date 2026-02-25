// app/api/user/onboarding/route.ts
// GET: check if user has completed onboarding
// POST: save onboarding data and mark as complete

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getUserProgressCollection } from '@/lib/mongodb';

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userProgressCollection = await getUserProgressCollection();
    const userProgress = await userProgressCollection.findOne({ userId });

    const completed = userProgress?.onboardingCompleted === true;

    return NextResponse.json({
      success: true,
      completed,
    });

  } catch (error: any) {
    console.error('Error checking onboarding status:', error);
    return NextResponse.json(
      { error: 'Failed to check onboarding status', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { voiceGender, voiceAccent, learningGoals, level } = body;

    // Validation
    const validGenders = ['female', 'male'];
    const validAccents = ['american', 'british'];
    const validLevels = ['beginner', 'intermediate', 'advanced'];
    const validGoals = ['conversation', 'toeic', 'business', 'interview', 'phone', 'pronunciation'];

    if (!validGenders.includes(voiceGender)) {
      return NextResponse.json({ error: 'Invalid voice gender' }, { status: 400 });
    }
    if (!validAccents.includes(voiceAccent)) {
      return NextResponse.json({ error: 'Invalid voice accent' }, { status: 400 });
    }
    if (!validLevels.includes(level)) {
      return NextResponse.json({ error: 'Invalid level' }, { status: 400 });
    }
    if (!Array.isArray(learningGoals) || learningGoals.length === 0) {
      return NextResponse.json({ error: 'At least one learning goal required' }, { status: 400 });
    }
    if (!learningGoals.every((g: string) => validGoals.includes(g))) {
      return NextResponse.json({ error: 'Invalid learning goal' }, { status: 400 });
    }

    const userProgressCollection = await getUserProgressCollection();
    const now = new Date();

    await userProgressCollection.updateOne(
      { userId },
      {
        $set: {
          // Voice preferences (used by TTS system)
          'settings.language.practiceVoiceGender': voiceGender,
          'settings.language.practiceVoiceAccent': voiceAccent,

          // Learning profile
          'settings.learningGoals': learningGoals,
          level: level,

          // Mark onboarding as complete
          onboardingCompleted: true,
          onboardingCompletedAt: now,
          updatedAt: now,
        },
        $setOnInsert: {
          userId,
          xp: 0,
          streak: 0,
          dailyGoal: 10,
          completedSentences: [],
          weakPhonemes: [],
          createdAt: now,
        },
      },
      { upsert: true }
    );

    console.log(`✅ Onboarding complete for user ${userId}: ${voiceGender} ${voiceAccent} voice, ${level} level, goals: ${learningGoals.join(', ')}`);

    return NextResponse.json({
      success: true,
      message: 'Onboarding completed successfully',
    });

  } catch (error: any) {
    console.error('Error saving onboarding data:', error);
    return NextResponse.json(
      { error: 'Failed to save onboarding data', details: error.message },
      { status: 500 }
    );
  }
}