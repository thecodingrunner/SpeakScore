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
    totalDurationSeconds,
    sentenceIds
  } = await request.json()

  const collection = await getUserLessonSessionsCollection()

  // Upsert so repeated calls (e.g. back-button then summary) don't create duplicate records
  await collection.updateOne(
    { userId, lessonSessionId },
    {
      $set: {
        userId,
        lessonSessionId,
        lessonId,
        totalSentences,
        averageAccuracy,
        totalXP,
        totalDurationSeconds,
        sentenceIds: Array.isArray(sentenceIds) ? sentenceIds : [],
        completedAt: new Date()
      }
    },
    { upsert: true }
  )

  return NextResponse.json({ success: true })
}