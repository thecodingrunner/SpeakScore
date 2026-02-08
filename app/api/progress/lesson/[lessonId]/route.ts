// app/api/progress/lesson/[lessonId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getUserSentenceHistoryCollection } from '@/lib/mongodb';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ lessonId: string }> }
) {
  try {
    const { userId } = await auth();
    const { lessonId } = await params;
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const historyCollection = await getUserSentenceHistoryCollection();

    // Find all sentences from this lesson
    const lessonHistory = await historyCollection
      .find({
        userId,
        sentenceId: { $regex: `^${lessonId}` }
      })
      .sort({ lastPracticed: -1 })
      .toArray();

    if (lessonHistory.length === 0) {
      return NextResponse.json({ error: 'No data found' }, { status: 404 });
    }

    // Calculate stats
    const totalAttempts = lessonHistory.reduce((sum, h) => sum + h.attempts, 0);
    const totalDuration = Math.round(totalAttempts * 1.5);
    const sentencesCompleted = lessonHistory.length;

    const allAccuracyScores = lessonHistory.flatMap(h => h.accuracyScores);
    const averageAccuracy = Math.round(
      allAccuracyScores.reduce((a, b) => a + b, 0) / allAccuracyScores.length
    );
    const bestAccuracy = Math.max(...allAccuracyScores);
    const worstAccuracy = Math.min(...allAccuracyScores);

    // Calculate XP
    let totalXP = 0;
    lessonHistory.forEach(h => {
      const latestAcc = h.accuracyScores[h.accuracyScores.length - 1];
      if (latestAcc >= 90) totalXP += 50;
      else if (latestAcc >= 80) totalXP += 30;
      else if (latestAcc >= 70) totalXP += 20;
      else totalXP += 10;
    });

    // Phoneme breakdown
    const phonemeData: Record<string, { scores: number[]; attempts: number }> = {};
    lessonHistory.forEach(h => {
      if (h.phonemeScores) {
        Object.entries(h.phonemeScores).forEach(([phoneme, score]) => {
          if (!phonemeData[phoneme]) {
            phonemeData[phoneme] = { scores: [], attempts: 0 };
          }
          phonemeData[phoneme].scores.push(score as number);
          phonemeData[phoneme].attempts++;
        });
      }
    });

    const phonemeBreakdown = Object.entries(phonemeData).map(([phoneme, data]) => {
      const avgScore = Math.round(
        data.scores.reduce((a, b) => a + b, 0) / data.scores.length
      );

      // Determine trend
      const recentScores = data.scores.slice(-3);
      const olderScores = data.scores.slice(0, -3);
      let trend: 'up' | 'down' | 'stable' = 'stable';
      
      if (olderScores.length > 0 && recentScores.length > 0) {
        const recentAvg = recentScores.reduce((a, b) => a + b, 0) / recentScores.length;
        const olderAvg = olderScores.reduce((a, b) => a + b, 0) / olderScores.length;
        if (recentAvg > olderAvg + 5) trend = 'up';
        else if (recentAvg < olderAvg - 5) trend = 'down';
      }

      return {
        phoneme,
        avgScore,
        attempts: data.attempts,
        trend
      };
    }).sort((a, b) => a.avgScore - b.avgScore);

    // Session history
    const sessionHistory = lessonHistory.map(h => {
      const practiceDate = new Date(h.lastPracticed);
      return {
        date: practiceDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        time: practiceDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
        accuracy: h.accuracyScores[h.accuracyScores.length - 1],
        duration: Math.round(h.attempts * 1.5),
        sentencesCompleted: 1
      };
    });

    // Extract lesson name
    const scenarioMap: Record<string, string> = {
      'daily_drill': 'Daily Drill',
      'phoneme_r_vs_l': '/r/ vs /l/ Sounds',
      'phoneme_th_sounds': '/th/ Sounds',
      'phoneme_f_vs_h': '/f/ vs /h/ Sounds',
      'toeic_speaking': 'TOEIC Speaking',
      'phoneme_v_vs_b': '/v/ vs /b/ Sounds',
      'phoneme_word_stress': 'Word Stress',
      'phoneme_silent_letters': 'Silent Letters',
      'business': 'Business Meetings',
      'interview': 'Job Interviews',
      'phone': 'Phone Calls',
    };

    let lessonName = 'Practice Session';
    for (const [key, name] of Object.entries(scenarioMap)) {
      if (lessonId.includes(key)) {
        lessonName = name;
        break;
      }
    }

    return NextResponse.json({
      lessonId,
      lessonName,
      totalSessions: lessonHistory.length,
      totalDuration,
      totalAttempts,
      sentencesCompleted,
      averageAccuracy,
      bestAccuracy,
      worstAccuracy,
      totalXP,
      phonemeBreakdown,
      sessionHistory
    });

  } catch (error: any) {
    console.error('Error fetching lesson analysis:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analysis', details: error.message },
      { status: 500 }
    );
  }
}