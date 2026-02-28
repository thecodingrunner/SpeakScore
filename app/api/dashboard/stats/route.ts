// app/api/dashboard/stats/route.ts
// Get all dashboard statistics

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

    const userProgressCollection = await getUserProgressCollection();
    const historyCollection = await getUserSentenceHistoryCollection();

    // Get user progress
    const userProgress = await userProgressCollection.findOne({ userId });

    if (!userProgress) {
      // New user - return default stats
      return NextResponse.json({
        success: true,
        user: {
          streak: 0,
          accuracyScore: 0,
          level: 'beginner',
          xp: 0,
          xpToNextLevel: 500,
          dailyGoal: 10,
          dailyProgress: 0,
          completedSentences: 0
        },
        todayStats: {
          practiceTime: 0,
          accuracy: 0,
          xpEarned: 0
        },
        recentAchievements: []
      });
    }

    // Calculate today's stats
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayPractices = await historyCollection
      .find({
        userId,
        lastPracticed: { $gte: today }
      })
      .toArray();

    // Today's practice time from actual lesson session durations
    const lessonSessionsCollection = await getUserLessonSessionsCollection();
    const todayLessonSessions = await lessonSessionsCollection
      .find({ userId, completedAt: { $gte: today } })
      .toArray();
    const todayPracticeTime = todayLessonSessions.reduce(
      (sum, s) => sum + (s.totalDurationSeconds || 0), 0
    ) / 60;

    // Today's average accuracy
    let todayAccuracy = 0;
    if (todayPractices.length > 0) {
      const totalAcc = todayPractices.reduce((sum, p) => {
        const avgAcc = p.accuracyScores.reduce((a: number, b: number) => a + b, 0) / p.accuracyScores.length;
        return sum + avgAcc;
      }, 0);
      todayAccuracy = Math.round(totalAcc / todayPractices.length);
    }

    // Today's XP earned
    const todayXP = todayPractices.reduce((sum, p) => {
      const latestAccuracy = p.accuracyScores[p.accuracyScores.length - 1] || 0;
      let xp = 10;
      if (latestAccuracy >= 90) xp = 50;
      else if (latestAccuracy >= 80) xp = 30;
      else if (latestAccuracy >= 70) xp = 20;
      return sum + (xp * p.attempts);
    }, 0);

    // Calculate overall average accuracy
    const allPractices = await historyCollection
      .find({ userId })
      .toArray();

    let overallAccuracy = 0;
    if (allPractices.length > 0) {
      const totalAcc = allPractices.reduce((sum, p) => {
        const avgAcc = p.accuracyScores.reduce((a: number, b: number) => a + b, 0) / p.accuracyScores.length;
        return sum + avgAcc;
      }, 0);
      overallAccuracy = Math.round(totalAcc / allPractices.length);
    }

    // Calculate XP to next level
    const currentLevel = userProgress.level || 'beginner';
    let xpToNextLevel = 500;
    if (currentLevel === 'intermediate') xpToNextLevel = 2000;
    else if (currentLevel === 'advanced') xpToNextLevel = 5000;

    // Get recent achievements (last 3 unlocked)
    const recentAchievements = [];
    if (userProgress.unlockedAchievements && userProgress.achievementUnlockDates) {
      const achievementsWithDates = userProgress.unlockedAchievements
        .map((id: string) => ({
          id,
          unlockedAt: userProgress.achievementUnlockDates[id]
        }))
        .filter((a: any) => a.unlockedAt)
        .sort((a: any, b: any) => new Date(b.unlockedAt).getTime() - new Date(a.unlockedAt).getTime())
        .slice(0, 3);

      // Map to achievement details
      const { ACHIEVEMENTS } = await import('@/lib/achievements');
      
      for (const item of achievementsWithDates) {
        const achievement = ACHIEVEMENTS.find(a => a.id === item.id);
        if (achievement) {
          recentAchievements.push({
            id: achievement.id,
            title: achievement.title,
            description: achievement.description,
            icon: achievement.icon,
            rarity: achievement.rarity,
            xp: achievement.xp
          });
        }
      }
    }

    return NextResponse.json({
      success: true,
      user: {
        streak: userProgress.streak || 0,
        accuracyScore: overallAccuracy,
        level: userProgress.level || 'beginner',
        xp: userProgress.xp || 0,
        xpToNextLevel,
        dailyGoal: userProgress.dailyGoal || 10,
        dailyProgress: Math.round(todayPracticeTime),
        completedSentences: userProgress.completedSentences?.length || 0
      },
      todayStats: {
        practiceTime: Math.round(todayPracticeTime),
        accuracy: todayAccuracy,
        xpEarned: todayXP
      },
      recentAchievements
    });

  } catch (error: any) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats', details: error.message },
      { status: 500 }
    );
  }
}