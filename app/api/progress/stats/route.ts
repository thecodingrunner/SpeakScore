// app/api/progress/stats/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getUserProgressCollection, getUserSentenceHistoryCollection } from '@/lib/mongodb';
import { getUserLessonSessionsCollection } from '@/lib/mongodb/lessons';

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const timeRange = searchParams.get('range') || 'week';

    console.log(`📊 Fetching progress stats for range: ${timeRange}`);

    const userProgressCollection = await getUserProgressCollection();
    const historyCollection = await getUserSentenceHistoryCollection();

    const userProgress = await userProgressCollection.findOne({ userId });

    if (!userProgress) {
      return NextResponse.json({
        success: true,
        stats: {
          totalPracticeTime: 0,
          averageAccuracy: 0,
          streak: 0,
          lessonsCompleted: 0,
          xpEarned: 0,
          level: 'beginner'
        },
        weeklyData: [],
        pronunciationBreakdown: [],
        recentSessions: [],
        lessonSessions: []
      });
    }

    // Calculate date range
    const now = new Date();
    const startDate = new Date();
    
    if (timeRange === 'week') {
      startDate.setDate(now.getDate() - 7);
    } else if (timeRange === 'month') {
      startDate.setMonth(now.getMonth() - 1);
    } else {
      startDate.setFullYear(2020);
    }

    // Get practice history in date range
    const practiceHistory = await historyCollection
      .find({
        userId: userId,
        lastPracticed: { $gte: startDate }
      })
      .sort({ lastPracticed: -1 })
      .toArray();

    console.log(`   Found ${practiceHistory.length} practices in range`);

    // Calculate overall stats
    const totalAccuracy = practiceHistory.reduce((sum, h) => {
      const avgAccuracy = h.accuracyScores.reduce((a: number, b: number) => a + b, 0) / h.accuracyScores.length;
      return sum + avgAccuracy;
    }, 0);
    const averageAccuracy = practiceHistory.length > 0
      ? Math.round(totalAccuracy / practiceHistory.length)
      : 0;

    // Use actual lesson session duration instead of estimates
    const sessionsCollection = await getUserLessonSessionsCollection();
    const lessonSessionsInRange = await sessionsCollection
      .find({ userId, completedAt: { $gte: startDate } })
      .toArray();
    const totalPracticeTime = lessonSessionsInRange.reduce(
      (sum, s) => sum + (s.totalDurationSeconds || 0), 0
    ) / 60;

    // Calculate weekly data
    const weeklyData = calculateWeeklyData(practiceHistory, lessonSessionsInRange, timeRange);

    // Calculate pronunciation breakdown
    const pronunciationBreakdown = calculatePhonemeBreakdown(practiceHistory);

    // Get recent sessions grouped by lesson
    const lessonSessions = await getLessonSessions(userId, 10);

    return NextResponse.json({
      success: true,
      stats: {
        totalPracticeTime: Math.round(totalPracticeTime),
        averageAccuracy,
        streak: userProgress.streak || 0,
        lessonsCompleted: userProgress.completedSentences?.length || 0,
        xpEarned: userProgress.xp || 0,
        level: userProgress.level || 'beginner'
      },
      weeklyData,
      pronunciationBreakdown,
      lessonSessions
    });

  } catch (error: any) {
    console.error('Error fetching progress stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats', details: error.message },
      { status: 500 }
    );
  }
}

function calculateWeeklyData(practiceHistory: any[], lessonSessions: any[], timeRange: string) {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const weeklyData = [];

  const numDays = timeRange === 'week' ? 7 : timeRange === 'month' ? 30 : 90;

  for (let i = numDays - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);

    const nextDate = new Date(date);
    nextDate.setDate(nextDate.getDate() + 1);

    const dayPractice = practiceHistory.filter(h => {
      const practiceDate = new Date(h.lastPracticed);
      return practiceDate >= date && practiceDate < nextDate;
    });

    // Use actual duration from lesson sessions for this day
    const daySessions = lessonSessions.filter(s => {
      const d = new Date(s.completedAt);
      return d >= date && d < nextDate;
    });
    const minutes = Math.round(
      daySessions.reduce((sum, s) => sum + (s.totalDurationSeconds || 0), 0) / 60
    );

    let accuracy = 0;
    if (dayPractice.length > 0) {
      const totalAcc = dayPractice.reduce((sum, h) => {
        const avg = h.accuracyScores.reduce((a: number, b: number) => a + b, 0) / h.accuracyScores.length;
        return sum + avg;
      }, 0);
      accuracy = Math.round(totalAcc / dayPractice.length);
    }

    weeklyData.push({
      day: days[date.getDay()],
      date: date.toISOString().split('T')[0],
      minutes,
      accuracy,
      sessions: daySessions.length
    });
  }

  return weeklyData;
}

function calculatePhonemeBreakdown(practiceHistory: any[]) {
  const phonemeStats: Record<string, { scores: number[]; count: number }> = {};

  practiceHistory.forEach(history => {
    if (history.phonemeScores) {
      Object.entries(history.phonemeScores).forEach(([phoneme, score]) => {
        if (!phonemeStats[phoneme]) {
          phonemeStats[phoneme] = { scores: [], count: 0 };
        }
        phonemeStats[phoneme].scores.push(score as number);
        phonemeStats[phoneme].count++;
      });
    }
  });

  const breakdown = Object.entries(phonemeStats).map(([phoneme, data]) => {
    const avgScore = Math.round(
      data.scores.reduce((sum, score) => sum + score, 0) / data.scores.length
    );
    
    const recentScores = data.scores.slice(-5);
    const olderScores = data.scores.slice(0, -5);
    let trend = 'stable';
    
    if (olderScores.length > 0 && recentScores.length > 0) {
      const recentAvg = recentScores.reduce((a, b) => a + b, 0) / recentScores.length;
      const olderAvg = olderScores.reduce((a, b) => a + b, 0) / olderScores.length;
      const change = Math.round(recentAvg - olderAvg);
      trend = change > 0 ? `+${change}%` : `${change}%`;
    }

    return {
      name: phoneme,
      score: avgScore,
      trend,
      practiceCount: data.count,
      color: avgScore >= 85 ? 'success' : avgScore >= 70 ? 'warning' : 'error'
    };
  });

  return breakdown.sort((a, b) => a.score - b.score);
}

// Helper function to extract lesson name from sentenceId
function extractLessonName(sentenceId: string): string {
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

  for (const [key, name] of Object.entries(scenarioMap)) {
    if (sentenceId.includes(key)) {
      return name;
    }
  }

  return 'Practice Session';
}

async function getLessonSessions(userId: string, limit: number) {
  const collection = await getUserLessonSessionsCollection();

  const sessions = await collection
    .find({ userId })
    .sort({ completedAt: -1 })
    .limit(limit)
    .toArray();

  return sessions.map(session => {
    const practiceDate = new Date(session.completedAt);
    const now = new Date();

    const nowMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const practiceMidnight = new Date(
      practiceDate.getFullYear(),
      practiceDate.getMonth(),
      practiceDate.getDate()
    );

    const diffDays = Math.floor(
      (nowMidnight.getTime() - practiceMidnight.getTime()) / (1000 * 60 * 60 * 24)
    );

    let dateLabel = 'Today';
    if (diffDays === 1) dateLabel = 'Yesterday';
    else if (diffDays > 1) dateLabel = `${diffDays} days ago`;

    return {
      id: session.lessonSessionId,
      lessonId: session.lessonId,
      lessonName: extractLessonName(session.lessonId),
      date: dateLabel,
      time: practiceDate.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit'
      }),
      accuracy: session.averageAccuracy,
      duration: session.totalDurationSeconds,
      xp: session.totalXP,
      sentencesCompleted: session.totalSentences,
      totalAttempts: null, // optional if you store it
      phonemeScores: null, // optional if you store aggregated phonemes
      lastPracticed: session.completedAt
    };
  });
}

// NEW: Get lesson sessions grouped by lesson/scenario
// async function getLessonSessions(historyCollection: any, userId: string, limit: number) {
//   const allHistory = await historyCollection
//     .find({ userId })
//     .sort({ lastPracticed: -1 })
//     .toArray();

//   // Group by lesson
//   const lessonGroups: Record<string, any[]> = {};

//   allHistory.forEach((history: any) => {
//     const lessonId = history.sentenceId.split('_sentence_')[0] || history.sentenceId;
    
//     if (!lessonGroups[lessonId]) {
//       lessonGroups[lessonId] = [];
//     }
//     lessonGroups[lessonId].push(history);
//   });

//   // Convert to lesson sessions
//   const lessonSessions = Object.entries(lessonGroups)
//     .map(([lessonId, histories]) => {
//       // Calculate lesson-level stats
//       const totalAttempts = histories.reduce((sum, h) => sum + h.attempts, 0);
//       const allAccuracyScores = histories.flatMap(h => h.accuracyScores);
//       const avgAccuracy = allAccuracyScores.length > 0
//         ? Math.round(allAccuracyScores.reduce((a, b) => a + b, 0) / allAccuracyScores.length)
//         : 0;
      
//       const duration = Math.round(totalAttempts * 1.5);
//       const sentencesCompleted = histories.length;
//       const mostRecentPractice = histories[0].lastPracticed;

//       // Calculate XP based on average accuracy
//       let xp = 10 * sentencesCompleted;
//       if (avgAccuracy >= 90) xp = 50 * sentencesCompleted;
//       else if (avgAccuracy >= 80) xp = 30 * sentencesCompleted;
//       else if (avgAccuracy >= 70) xp = 20 * sentencesCompleted;

//       // Aggregate phoneme scores
//       const phonemeScores: Record<string, number[]> = {};
//       histories.forEach(h => {
//         if (h.phonemeScores) {
//           Object.entries(h.phonemeScores).forEach(([phoneme, score]) => {
//             if (!phonemeScores[phoneme]) {
//               phonemeScores[phoneme] = [];
//             }
//             phonemeScores[phoneme].push(score as number);
//           });
//         }
//       });

//       // Average phoneme scores
//       const avgPhonemeScores: Record<string, number> = {};
//       Object.entries(phonemeScores).forEach(([phoneme, scores]) => {
//         avgPhonemeScores[phoneme] = Math.round(
//           scores.reduce((a, b) => a + b, 0) / scores.length
//         );
//       });

//       // Date formatting
//       const practiceDate = new Date(mostRecentPractice);
//       const now = new Date();
//       const nowMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
//       const practiceMidnight = new Date(practiceDate.getFullYear(), practiceDate.getMonth(), practiceDate.getDate());
//       const diffDays = Math.floor((nowMidnight.getTime() - practiceMidnight.getTime()) / (1000 * 60 * 60 * 24));
      
//       let dateLabel = 'Today';
//       if (diffDays === 1) dateLabel = 'Yesterday';
//       else if (diffDays > 1) dateLabel = `${diffDays} days ago`;

//       return {
//         id: lessonId,
//         lessonId,
//         lessonName: extractLessonName(lessonId),
//         date: dateLabel,
//         time: practiceDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
//         accuracy: avgAccuracy,
//         duration,
//         xp,
//         sentencesCompleted,
//         totalAttempts,
//         phonemeScores: avgPhonemeScores,
//         lastPracticed: mostRecentPractice
//       };
//     })
//     .sort((a, b) => new Date(b.lastPracticed).getTime() - new Date(a.lastPracticed).getTime())
//     .slice(0, limit);

//   return lessonSessions;
// }