// types/user.ts
// TypeScript types for user data structures

export interface UserProgress {
    userId: string;
    level: 'beginner' | 'intermediate' | 'advanced';
    xp: number;
    streak: number;
    dailyGoal: number; // minutes per day
    completedSentences: string[];
    weakPhonemes: string[];
    lastPracticed: Date;
    unlockedAchievements?: string[];
    achievementUnlockDates?: Record<string, Date>;
    
    // Settings
    settings?: UserSettings;
    
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface UserSettings {
    // Profile
    displayName?: string;
    avatarUrl?: string;
    
    // Practice Settings
    practiceSettings: {
      dailyGoalMinutes: number;
      reminderEnabled: boolean;
      reminderTime: string; // Format: "HH:MM"
      pronunciationFocus: {
        rVsL: boolean;
        thSounds: boolean;
        wordStress: boolean;
        silentVowels: boolean;
      };
    };
    
    // Notification Preferences
    notifications: {
      progressUpdates: boolean;
      achievementAlerts: boolean;
      newFeatures: boolean;
      emailNotifications: boolean;
    };
    
    // Language & Region
    language: {
      interfaceLanguage: 'en' | 'ja';
      practiceVoiceAccent: 'american' | 'british';
    };
  }
  
  export interface UserSentenceHistory {
    userId: string;
    sentenceId: string;
    attempts: number;
    accuracyScores: number[];
    bestAccuracy: number;
    phonemeScores: Record<string, number>;
    lastPracticed: Date;
    nextReview: Date;
    mastered: boolean;
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface DashboardStats {
    user: {
      streak: number;
      accuracyScore: number;
      level: string;
      xp: number;
      xpToNextLevel: number;
      dailyGoal: number;
      dailyProgress: number;
      completedSentences: number;
    };
    todayStats: {
      practiceTime: number;
      accuracy: number;
      xpEarned: number;
    };
    recentAchievements: Array<{
      id: string;
      title: string;
      description: string;
      icon: string;
      rarity: string;
      xp: number;
    }>;
  }
  
  // Default settings
  export const DEFAULT_USER_SETTINGS: UserSettings = {
    practiceSettings: {
      dailyGoalMinutes: 10,
      reminderEnabled: true,
      reminderTime: "18:00",
      pronunciationFocus: {
        rVsL: true,
        thSounds: true,
        wordStress: false,
        silentVowels: false,
      },
    },
    notifications: {
      progressUpdates: true,
      achievementAlerts: true,
      newFeatures: false,
      emailNotifications: true,
    },
    language: {
      interfaceLanguage: 'en',
      practiceVoiceAccent: 'american',
    },
  };