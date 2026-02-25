import { NextResponse } from 'next/server'
import { getUserLessonSessionsCollection } from '@/lib/mongodb/lessons'
import { auth } from '@clerk/nextjs/server';

export async function POST(request: Request) {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

  const {
    lessonSessionId,
    lessonId,
    totalSentences,
    averageAccuracy,
    totalXP,
    totalDurationSeconds
  } = await request.json()

  const collection = await getUserLessonSessionsCollection()

  await collection.insertOne({
    userId,
    lessonSessionId,
    lessonId,
    totalSentences,
    averageAccuracy,
    totalXP,
    totalDurationSeconds,
    completedAt: new Date()
  })

  return NextResponse.json({ success: true })
}