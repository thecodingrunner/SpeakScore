// types/database.ts
// TypeScript types for MongoDB collections

export interface UserProgress {
    userId: string;
    level: 'beginner' | 'intermediate' | 'advanced';
    xp: number;
    streak: number;
    dailyGoal: number;
    completedSentences: string[];
    weakPhonemes: string[];
    lastPracticed?: Date;
    
    // Stripe/Subscription
    stripeCustomerId?: string;
    stripeSubscriptionId?: string;
    subscriptionTier: 'free' | 'pro' | 'enterprise';
    subscriptionStatus?: string;
    subscriptionEndDate?: Date;
    
    // Achievements
    unlockedAchievements?: string[];
    achievementUnlockDates?: Record<string, Date>;
    
    // Settings
    settings?: UserSettings;
    
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface UserSettings {
    displayName?: string;
    avatarUrl?: string;
    
    practiceSettings: {
      dailyGoalMinutes: number;
      reminderEnabled: boolean;
      reminderTime: string;
      pronunciationFocus: {
        rVsL: boolean;
        thSounds: boolean;
        wordStress: boolean;
        silentVowels: boolean;
      };
    };
    
    notifications: {
      progressUpdates: boolean;
      achievementAlerts: boolean;
      newFeatures: boolean;
      emailNotifications: boolean;
    };
    
    language: {
      interfaceLanguage: 'en' | 'ja';
      practiceVoiceAccent: 'american' | 'british';
    };
  }
  
  export interface Sentence {
    id: string;
    text: string;
    scenario: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    type: 'core' | 'ai_generated';
    phonemes: string[];
    
    // Optional fields
    ipa?: string;
    audioUrl?: string;
    
    // AI-generated metadata
    usageCount?: number;
    lastUsed?: Date;
    
    createdAt: Date;
    updatedAt?: Date;
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
  
  // ============================================================================
  // SCENARIO TYPES
  // ============================================================================
  
  export type ScenarioType = 
    | 'daily_drill'
    | 'phoneme_r_vs_l'
    | 'phoneme_th_sounds'
    | 'phoneme_f_vs_h'
    | 'phoneme_v_vs_b'
    | 'phoneme_word_stress'
    | 'phoneme_silent_letters'
    | 'toeic_speaking'
    | 'business'
    | 'interview'
    | 'phone';
  
  export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';
  
  export type SubscriptionTier = 'free' | 'pro' | 'enterprise';
  
  // ============================================================================
  // API RESPONSE TYPES
  // ============================================================================
  
  export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
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
  
  export interface PracticeSession {
    sentenceId: string;
    sentence: Sentence;
    accuracy: number;
    phonemeScores: Record<string, number>;
    timestamp: Date;
  }
  
  // ============================================================================
  // STRIPE TYPES
  // ============================================================================
  
  export interface PricingPlan {
    name: string;
    price: number;
    priceId: string | null;
    features: string[];
    limits: {
      monthlySessions: number | 'unlimited';
      scenarios: string[] | 'all';
      customScenarios?: boolean;
    };
  }
  
  export interface CheckoutSessionData {
    userId: string;
    priceId: string;
    planName: SubscriptionTier;
  }
  
  // ============================================================================
  // ACHIEVEMENT TYPES
  // ============================================================================
  
  export interface Achievement {
    id: string;
    title: string;
    description: string;
    icon: string;
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
    xp: number;
    requirement: {
      type: string;
      value: number;
      condition?: any;
    };
  }
  
  export interface AchievementProgress {
    achievement: Achievement;
    current: number;
    total: number;
    percentage: number;
    unlocked: boolean;
  }
  
  // ============================================================================
  // FORM TYPES
  // ============================================================================
  
  export interface PracticeSettingsForm {
    dailyGoalMinutes: number;
    reminderEnabled: boolean;
    reminderTime: string;
    pronunciationFocus: {
      rVsL: boolean;
      thSounds: boolean;
      wordStress: boolean;
      silentVowels: boolean;
    };
  }
  
  export interface NotificationSettingsForm {
    progressUpdates: boolean;
    achievementAlerts: boolean;
    newFeatures: boolean;
    emailNotifications: boolean;
  }
  
  export interface LanguageSettingsForm {
    interfaceLanguage: 'en' | 'ja';
    practiceVoiceAccent: 'american' | 'british';
  }
  
  export interface ProfileForm {
    displayName: string;
    avatarUrl?: string;
  }