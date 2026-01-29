// lib/achievements.ts
// Achievement tracking and unlock logic

export interface Achievement {
    id: string;
    title: string;
    description: string;
    icon: string; // Icon name for frontend
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
    xp: number;
    requirement: {
      type: string;
      value: number;
      condition?: any;
    };
  }
  
  export const ACHIEVEMENTS: Achievement[] = [
    // First Steps
    {
      id: 'first_practice',
      title: 'First Steps',
      description: 'Complete your first practice session',
      icon: 'Mic',
      rarity: 'common',
      xp: 10,
      requirement: {
        type: 'total_practices',
        value: 1
      }
    },
    
    // Streak Achievements
    {
      id: 'streak_3',
      title: '3-Day Streak',
      description: 'Practice for 3 consecutive days',
      icon: 'Flame',
      rarity: 'common',
      xp: 25,
      requirement: {
        type: 'streak',
        value: 3
      }
    },
    {
      id: 'streak_7',
      title: '7-Day Streak',
      description: 'Practice for 7 consecutive days',
      icon: 'Flame',
      rarity: 'rare',
      xp: 50,
      requirement: {
        type: 'streak',
        value: 7
      }
    },
    {
      id: 'streak_30',
      title: '30-Day Streak',
      description: 'Practice for 30 consecutive days',
      icon: 'Flame',
      rarity: 'legendary',
      xp: 500,
      requirement: {
        type: 'streak',
        value: 30
      }
    },
    {
      id: 'streak_100',
      title: '100-Day Legend',
      description: 'Practice for 100 consecutive days',
      icon: 'Crown',
      rarity: 'legendary',
      xp: 1000,
      requirement: {
        type: 'streak',
        value: 100
      }
    },
  
    // Accuracy Achievements
    {
      id: 'accuracy_80',
      title: 'Getting Good',
      description: 'Achieve 80%+ average accuracy',
      icon: 'Target',
      rarity: 'common',
      xp: 30,
      requirement: {
        type: 'average_accuracy',
        value: 80
      }
    },
    {
      id: 'accuracy_90',
      title: 'Nearly Perfect',
      description: 'Achieve 90%+ average accuracy',
      icon: 'Star',
      rarity: 'epic',
      xp: 100,
      requirement: {
        type: 'average_accuracy',
        value: 90
      }
    },
    {
      id: 'perfect_score',
      title: 'Flawless',
      description: 'Get 100% accuracy in any lesson',
      icon: 'Star',
      rarity: 'legendary',
      xp: 200,
      requirement: {
        type: 'max_accuracy',
        value: 100
      }
    },
  
    // Volume Achievements
    {
      id: 'sentences_10',
      title: 'Getting Started',
      description: 'Complete 10 sentences',
      icon: 'CheckCircle',
      rarity: 'common',
      xp: 15,
      requirement: {
        type: 'total_sentences',
        value: 10
      }
    },
    {
      id: 'sentences_50',
      title: 'Dedicated Learner',
      description: 'Complete 50 sentences',
      icon: 'Trophy',
      rarity: 'rare',
      xp: 50,
      requirement: {
        type: 'total_sentences',
        value: 50
      }
    },
    {
      id: 'sentences_100',
      title: 'Century Club',
      description: 'Complete 100 sentences',
      icon: 'Trophy',
      rarity: 'epic',
      xp: 150,
      requirement: {
        type: 'total_sentences',
        value: 100
      }
    },
    {
      id: 'sentences_300',
      title: 'Core Complete',
      description: 'Complete all 300 core sentences',
      icon: 'Crown',
      rarity: 'legendary',
      xp: 500,
      requirement: {
        type: 'total_sentences',
        value: 300
      }
    },
  
    // Phoneme Mastery
    {
      id: 'master_r_vs_l',
      title: '/r/ vs /l/ Master',
      description: 'Achieve 85%+ accuracy on /r/ vs /l/ sounds',
      icon: 'Award',
      rarity: 'epic',
      xp: 100,
      requirement: {
        type: 'phoneme_mastery',
        value: 85,
        condition: { phonemes: ['/r/', '/l/'] }
      }
    },
    {
      id: 'master_th',
      title: '/th/ Champion',
      description: 'Achieve 85%+ accuracy on /th/ sounds',
      icon: 'Award',
      rarity: 'epic',
      xp: 100,
      requirement: {
        type: 'phoneme_mastery',
        value: 85,
        condition: { phonemes: ['/θ/', '/ð/'] }
      }
    },
  
    // Speed Achievements
    {
      id: 'speed_5',
      title: 'Quick Learner',
      description: 'Complete 5 sentences in one day',
      icon: 'Zap',
      rarity: 'common',
      xp: 20,
      requirement: {
        type: 'daily_sentences',
        value: 5
      }
    },
    {
      id: 'speed_10',
      title: 'Speed Demon',
      description: 'Complete 10 sentences in one day',
      icon: 'Zap',
      rarity: 'rare',
      xp: 75,
      requirement: {
        type: 'daily_sentences',
        value: 10
      }
    },
  
    // Level Achievements
    {
      id: 'level_intermediate',
      title: 'Level Up!',
      description: 'Reach Intermediate level',
      icon: 'TrendingUp',
      rarity: 'rare',
      xp: 100,
      requirement: {
        type: 'level',
        value: 0,
        condition: { level: 'intermediate' }
      }
    },
    {
      id: 'level_advanced',
      title: 'Expert Speaker',
      description: 'Reach Advanced level',
      icon: 'Crown',
      rarity: 'legendary',
      xp: 300,
      requirement: {
        type: 'level',
        value: 0,
        condition: { level: 'advanced' }
      }
    },
  
    // XP Milestones
    {
      id: 'xp_1000',
      title: 'Rising Star',
      description: 'Earn 1,000 XP',
      icon: 'Star',
      rarity: 'rare',
      xp: 50,
      requirement: {
        type: 'total_xp',
        value: 1000
      }
    },
    {
      id: 'xp_5000',
      title: 'XP Legend',
      description: 'Earn 5,000 XP',
      icon: 'Trophy',
      rarity: 'epic',
      xp: 200,
      requirement: {
        type: 'total_xp',
        value: 5000
      }
    }
  ];
  
  /**
   * Check which achievements a user has unlocked
   */
  export async function checkAchievements(
    userId: string,
    userProgress: any,
    practiceHistory: any[]
  ): Promise<string[]> {
    const newlyUnlocked: string[] = [];
  
    for (const achievement of ACHIEVEMENTS) {
      // Skip if already unlocked
      if (userProgress.unlockedAchievements?.includes(achievement.id)) {
        continue;
      }
  
      const isUnlocked = checkAchievementRequirement(
        achievement,
        userProgress,
        practiceHistory
      );
  
      if (isUnlocked) {
        newlyUnlocked.push(achievement.id);
      }
    }
  
    return newlyUnlocked;
  }
  
  /**
   * Check if a single achievement requirement is met
   */
  function checkAchievementRequirement(
    achievement: Achievement,
    userProgress: any,
    practiceHistory: any[]
  ): boolean {
    const req = achievement.requirement;
  
    switch (req.type) {
      case 'total_practices':
        return practiceHistory.length >= req.value;
  
      case 'streak':
        return (userProgress.streak || 0) >= req.value;
  
      case 'average_accuracy': {
        if (practiceHistory.length === 0) return false;
        const avgAcc = practiceHistory.reduce((sum, h) => {
          const sessionAvg = h.accuracyScores.reduce((a: number, b: number) => a + b, 0) / h.accuracyScores.length;
          return sum + sessionAvg;
        }, 0) / practiceHistory.length;
        return avgAcc >= req.value;
      }
  
      case 'max_accuracy': {
        const maxAcc = Math.max(...practiceHistory.flatMap(h => h.accuracyScores));
        return maxAcc >= req.value;
      }
  
      case 'total_sentences':
        return (userProgress.completedSentences?.length || 0) >= req.value;
  
      case 'phoneme_mastery': {
        const targetPhonemes = req.condition?.phonemes || [];
        const phonemeScores = practiceHistory
          .filter(h => h.phonemeScores)
          .flatMap(h => Object.entries(h.phonemeScores))
          .filter(([phoneme]) => targetPhonemes.some((p: string) => phoneme.includes(p)));
  
        if (phonemeScores.length === 0) return false;
  
        const avgScore = phonemeScores.reduce((sum, [_, score]) => sum + (score as number), 0) / phonemeScores.length;
        return avgScore >= req.value;
      }
  
      case 'daily_sentences': {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayPractices = practiceHistory.filter(h => {
          const practiceDate = new Date(h.lastPracticed);
          practiceDate.setHours(0, 0, 0, 0);
          return practiceDate.getTime() === today.getTime();
        });
        return todayPractices.length >= req.value;
      }
  
      case 'level':
        return userProgress.level === req.condition?.level;
  
      case 'total_xp':
        return (userProgress.xp || 0) >= req.value;
  
      default:
        return false;
    }
  }
  
  /**
   * Calculate progress towards an achievement
   */
  export function calculateAchievementProgress(
    achievement: Achievement,
    userProgress: any,
    practiceHistory: any[]
  ): { current: number; total: number } {
    const req = achievement.requirement;
  
    switch (req.type) {
      case 'total_practices':
        return { current: practiceHistory.length, total: req.value };
  
      case 'streak':
        return { current: userProgress.streak || 0, total: req.value };
  
      case 'total_sentences':
        return { current: userProgress.completedSentences?.length || 0, total: req.value };
  
      case 'total_xp':
        return { current: userProgress.xp || 0, total: req.value };
  
      case 'average_accuracy': {
        if (practiceHistory.length === 0) return { current: 0, total: req.value };
        const avgAcc = practiceHistory.reduce((sum, h) => {
          const sessionAvg = h.accuracyScores.reduce((a: number, b: number) => a + b, 0) / h.accuracyScores.length;
          return sum + sessionAvg;
        }, 0) / practiceHistory.length;
        return { current: Math.round(avgAcc), total: req.value };
      }
  
      case 'daily_sentences': {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayPractices = practiceHistory.filter(h => {
          const practiceDate = new Date(h.lastPracticed);
          practiceDate.setHours(0, 0, 0, 0);
          return practiceDate.getTime() === today.getTime();
        });
        return { current: todayPractices.length, total: req.value };
      }
  
      default:
        return { current: 0, total: req.value };
    }
  }