// app/api/practice/record-partial/route.ts
import { NextResponse } from 'next/server'
import { getUserLessonSessionsCollection } from '@/lib/mongodb/lessons'
import { auth } from '@clerk/nextjs/server'

export async function POST(request: Request) {
  const { userId } = await auth()

  if (!userId) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  const {
    lessonSessionId,
    lessonId,
    sentencesCompleted,
    totalSentences,
    averageAccuracy,
    totalDurationSeconds,
  } = await request.json()

  if (!lessonSessionId || !lessonId) {
    return NextResponse.json(
      { error: 'Missing required fields' },
      { status: 400 }
    )
  }

  const collection = await getUserLessonSessionsCollection()

  // Upsert keyed on lessonSessionId, but NEVER overwrite a completed lesson.
  // This handles repeated visibilitychange fires gracefully —
  // each ping just updates the partial record with latest progress.
  await collection.updateOne(
    {
      userId,
      lessonSessionId,
      completedAt: { $exists: false }, // don't touch it if already completed
    },
    {
      $set: {
        lessonId,
        sentencesCompleted,
        totalSentences,
        averageAccuracy,
        totalDurationSeconds,
        partial: true,
        lastUpdatedAt: new Date(),
      },
      $setOnInsert: {
        userId,
        lessonSessionId,
        startedAt: new Date(),
      },
    },
    { upsert: true }
  )

  return NextResponse.json({ success: true })
}