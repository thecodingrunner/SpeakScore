// app/api/achievements/route.ts
// Get user achievements and track unlocks

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getUserProgressCollection, getUserSentenceHistoryCollection } from '@/lib/mongodb';
import { ACHIEVEMENTS, checkAchievements, calculateAchievementProgress } from '@/lib/achievements';

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
      // New user - no achievements yet
      return NextResponse.json({
        success: true,
        stats: {
          totalAchievements: 0,
          totalPossible: ACHIEVEMENTS.length,
          recentlyUnlocked: 0,
          totalXpFromAchievements: 0
        },
        achievements: ACHIEVEMENTS.map(a => ({
          ...a,
          unlocked: false,
          progress: 0,
          total: a.requirement.value
        }))
      });
    }

    // Get practice history
    const practiceHistory = await historyCollection
      .find({ userId })
      .toArray();

    // Check for newly unlocked achievements
    const newlyUnlocked = await checkAchievements(userId, userProgress, practiceHistory);

    // Update user progress with newly unlocked achievements
    if (newlyUnlocked.length > 0) {
      const xpFromNewAchievements = newlyUnlocked.reduce((sum, achievementId) => {
        const achievement = ACHIEVEMENTS.find(a => a.id === achievementId);
        return sum + (achievement?.xp || 0);
      }, 0);

      await userProgressCollection.updateOne(
        { userId },
        {
          $addToSet: { 
            unlockedAchievements: { $each: newlyUnlocked }
          },
          $inc: {
            xp: xpFromNewAchievements
          },
          $set: {
            updatedAt: new Date()
          }
        }
      );

      console.log(`🏆 User ${userId} unlocked ${newlyUnlocked.length} achievements: +${xpFromNewAchievements} XP`);
    }

    // Get updated progress
    const updatedProgress = await userProgressCollection.findOne({ userId });
    const unlockedAchievements = updatedProgress?.unlockedAchievements || [];

    // Map achievements with unlock status and progress
    const achievementsWithProgress = ACHIEVEMENTS.map(achievement => {
      const isUnlocked = unlockedAchievements.includes(achievement.id);
      const progress = calculateAchievementProgress(achievement, updatedProgress, practiceHistory);

      // Get unlock date if available
      let unlockedDate = null;
      if (isUnlocked && updatedProgress?.achievementUnlockDates) {
        const unlockTimestamp = updatedProgress.achievementUnlockDates[achievement.id];
        if (unlockTimestamp) {
          const date = new Date(unlockTimestamp);
          const now = new Date();
          const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
          
          if (diffDays === 0) unlockedDate = 'Today';
          else if (diffDays === 1) unlockedDate = 'Yesterday';
          else if (diffDays < 7) unlockedDate = `${diffDays} days ago`;
          else if (diffDays < 30) unlockedDate = `${Math.floor(diffDays / 7)} weeks ago`;
          else unlockedDate = date.toLocaleDateString();
        }
      }

      return {
        id: achievement.id,
        title: achievement.title,
        description: achievement.description,
        icon: achievement.icon,
        rarity: achievement.rarity,
        xp: achievement.xp,
        unlocked: isUnlocked,
        unlockedDate,
        progress: isUnlocked ? progress.total : progress.current,
        total: progress.total
      };
    });

    // Calculate stats
    const totalXpFromAchievements = unlockedAchievements.reduce((sum: any, achievementId: any) => {
      const achievement = ACHIEVEMENTS.find(a => a.id === achievementId);
      return sum + (achievement?.xp || 0);
    }, 0);

    // Count recently unlocked (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    let recentlyUnlocked = 0;
    if (updatedProgress?.achievementUnlockDates) {
      recentlyUnlocked = Object.values(updatedProgress.achievementUnlockDates)
        .filter((timestamp: any) => new Date(timestamp) >= sevenDaysAgo)
        .length;
    }

    return NextResponse.json({
      success: true,
      stats: {
        totalAchievements: unlockedAchievements.length,
        totalPossible: ACHIEVEMENTS.length,
        recentlyUnlocked,
        totalXpFromAchievements
      },
      achievements: achievementsWithProgress,
      newlyUnlocked: newlyUnlocked.map(id => {
        const achievement = ACHIEVEMENTS.find(a => a.id === id);
        return {
          id,
          title: achievement?.title,
          xp: achievement?.xp
        };
      })
    });

  } catch (error: any) {
    console.error('Error fetching achievements:', error);
    return NextResponse.json(
      { error: 'Failed to fetch achievements', details: error.message },
      { status: 500 }
    );
  }
}