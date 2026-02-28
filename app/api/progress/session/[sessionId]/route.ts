// app/api/progress/session/[sessionId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getUserLessonSessionsCollection } from '@/lib/mongodb/lessons';
import { getUserSentenceHistoryCollection, getSentencesCollection } from '@/lib/mongodb';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { sessionId } = await params;

    // Fetch the lesson session record
    const sessionsCollection = await getUserLessonSessionsCollection();
    const session = await sessionsCollection.findOne({
      lessonSessionId: sessionId,
      userId,
    });

    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    // Fetch sentence-level history for this session.
    // Prefer the sentenceIds array stored on the session (set since the upsert fix).
    // Fall back to querying by lessonSessionId for older sessions.
    const historyCollection = await getUserSentenceHistoryCollection();
    const sessionSentenceIds: string[] = (session as any).sentenceIds ?? [];
    const sentenceHistories = sessionSentenceIds.length > 0
      ? await historyCollection.find({ userId, sentenceId: { $in: sessionSentenceIds } }).toArray()
      : await historyCollection.find({ userId, lessonSessionId: sessionId }).toArray();

    // Look up sentence texts from sentences collection
    const sentenceIds = sentenceHistories.map(h => h.sentenceId);
    const sentencesCollection = await getSentencesCollection();
    const sentenceDocs = await sentencesCollection
      .find({ id: { $in: sentenceIds } })
      .toArray();
    const sentenceTextMap: Record<string, string> = {};
    sentenceDocs.forEach((s: any) => { sentenceTextMap[s.id] = s.text; });

    // Build per-sentence result objects
    const sentences = sentenceHistories.map(h => {
      const latestAccuracy = h.accuracyScores?.[h.accuracyScores.length - 1] ?? 0;
      const bestAccuracy = h.bestAccuracy ?? Math.max(...(h.accuracyScores || [0]));
      const attempts = h.attempts ?? 1;

      // Phoneme scores — stored as Record<string, number>
      const phonemeScores: { phoneme: string; score: number }[] = Object.entries(
        h.phonemeScores ?? {}
      ).map(([phoneme, score]) => ({ phoneme, score: score as number }));

      return {
        sentenceId: h.sentenceId,
        text: sentenceTextMap[h.sentenceId] ?? null,
        latestAccuracy,
        bestAccuracy,
        attempts,
        phonemeScores,
      };
    });

    return NextResponse.json({
      success: true,
      session: {
        lessonSessionId: session.lessonSessionId,
        lessonId: session.lessonId,
        totalSentences: session.totalSentences,
        averageAccuracy: session.averageAccuracy,
        totalXP: session.totalXP,
        totalDurationSeconds: session.totalDurationSeconds,
        completedAt: session.completedAt,
      },
      sentences,
    });
  } catch (error: any) {
    console.error('Error fetching session detail:', error);
    return NextResponse.json(
      { error: 'Failed to fetch session', details: error.message },
      { status: 500 }
    );
  }
}
