// app/api/progress/stats/route.ts
// FIXED: Better date calculations for "Yesterday" display

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getUserProgressCollection, getUserSentenceHistoryCollection } from '@/lib/mongodb';

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
        recentSessions: []
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
    const totalAttempts = practiceHistory.reduce((sum, h) => sum + h.attempts, 0);
    const totalAccuracy = practiceHistory.reduce((sum, h) => {
      const avgAccuracy = h.accuracyScores.reduce((a: number, b: number) => a + b, 0) / h.accuracyScores.length;
      return sum + avgAccuracy;
    }, 0);
    const averageAccuracy = practiceHistory.length > 0 
      ? Math.round(totalAccuracy / practiceHistory.length)
      : 0;

    const totalPracticeTime = totalAttempts * 1.5;

    // Calculate weekly data
    const weeklyData = calculateWeeklyData(practiceHistory, timeRange);

    // Calculate pronunciation breakdown
    const pronunciationBreakdown = calculatePhonemeBreakdown(practiceHistory);

    // Get recent sessions
    const recentSessions = await getRecentSessions(historyCollection, userId, 10);

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
      recentSessions
    });

  } catch (error: any) {
    console.error('Error fetching progress stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats', details: error.message },
      { status: 500 }
    );
  }
}

function calculateWeeklyData(practiceHistory: any[], timeRange: string) {
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

    const attempts = dayPractice.reduce((sum, h) => sum + h.attempts, 0);
    const minutes = Math.round(attempts * 1.5);
    
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
      sessions: dayPractice.length
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

async function getRecentSessions(historyCollection: any, userId: string, limit: number) {
  const recentHistory = await historyCollection
    .find({ userId })
    .sort({ lastPracticed: -1 })
    .limit(limit)
    .toArray();

  return recentHistory.map((history: any) => {
    const latestAccuracy = history.accuracyScores[history.accuracyScores.length - 1] || 0;
    const duration = Math.round(history.attempts * 1.5);

    let xp = 10;
    if (latestAccuracy >= 90) xp = 50;
    else if (latestAccuracy >= 80) xp = 30;
    else if (latestAccuracy >= 70) xp = 20;

    // ✅ FIX: Better date calculation for "Yesterday"
    const practiceDate = new Date(history.lastPracticed);
    const now = new Date();
    
    // Compare dates at midnight
    const nowMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const practiceMidnight = new Date(practiceDate.getFullYear(), practiceDate.getMonth(), practiceDate.getDate());
    const diffDays = Math.floor((nowMidnight.getTime() - practiceMidnight.getTime()) / (1000 * 60 * 60 * 24));
    
    let dateLabel = 'Today';
    if (diffDays === 1) dateLabel = 'Yesterday';
    else if (diffDays > 1) dateLabel = `${diffDays} days ago`;

    return {
      id: history._id.toString(),
      date: dateLabel,
      time: practiceDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
      sentenceId: history.sentenceId,
      lesson: 'Practice Session',
      accuracy: latestAccuracy,
      duration,
      xp,
      attempts: history.attempts
    };
  });
}