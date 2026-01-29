// lib/achievement-tracker.ts
// Track achievement unlocks with timestamps

import { getUserProgressCollection } from '@/lib/mongodb';
import { ACHIEVEMENTS } from '@/lib/achievements';

/**
 * Record achievement unlock with timestamp
 * Call this when an achievement is unlocked
 */
export async function recordAchievementUnlock(
  userId: string,
  achievementId: string
) {
  const userProgressCollection = await getUserProgressCollection();
  const achievement = ACHIEVEMENTS.find(a => a.id === achievementId);
  
  if (!achievement) return;

  const now = new Date();
  
  await userProgressCollection.updateOne(
    { userId },
    {
      $addToSet: {
        unlockedAchievements: achievementId
      },
      $set: {
        [`achievementUnlockDates.${achievementId}`]: now,
        updatedAt: now
      },
      $inc: {
        xp: achievement.xp
      }
    },
    { upsert: false }
  );

  console.log(`🏆 Achievement unlocked: ${achievement.title} (+${achievement.xp} XP)`);
}

/**
 * Initialize achievement tracking fields for existing users
 * Run this once as a migration script
 */
export async function initializeAchievementFields() {
  const userProgressCollection = await getUserProgressCollection();
  
  // Update all users that don't have achievement fields
  const result = await userProgressCollection.updateMany(
    { unlockedAchievements: { $exists: false } },
    {
      $set: {
        unlockedAchievements: [],
        achievementUnlockDates: {}
      }
    }
  );

  console.log(`✅ Initialized achievement fields for ${result.modifiedCount} users`);
  return result.modifiedCount;
}