// lib/schemas.ts
// Zod validation schemas for SpeakScore

import { z } from 'zod';

// ============================================================================
// USER PROGRESS SCHEMAS
// ============================================================================

export const userProgressSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  level: z.enum(['beginner', 'intermediate', 'advanced']),
  xp: z.number().min(0).default(0),
  streak: z.number().min(0).default(0),
  dailyGoal: z.number().min(5).max(120).default(10),
  completedSentences: z.array(z.string()).default([]),
  weakPhonemes: z.array(z.string()).default([]),
  lastPracticed: z.date().optional(),
  
  // Stripe/Subscription fields
  stripeCustomerId: z.string().optional(),
  stripeSubscriptionId: z.string().optional(),
  subscriptionTier: z.enum(['free', 'pro', 'enterprise']).default('free'),
  subscriptionStatus: z.string().optional(),
  subscriptionEndDate: z.date().optional(),
  
  // Achievement tracking
  unlockedAchievements: z.array(z.string()).optional(),
  achievementUnlockDates: z.record(z.string(), z.date()).optional(),
  
  // Settings
  settings: z.object({
    displayName: z.string().optional(),
    avatarUrl: z.string().url().optional(),
    
    practiceSettings: z.object({
      dailyGoalMinutes: z.number().min(5).max(120).default(10),
      reminderEnabled: z.boolean().default(true),
      reminderTime: z.string().regex(/^\d{2}:\d{2}$/).default('18:00'),
      pronunciationFocus: z.object({
        rVsL: z.boolean().default(true),
        thSounds: z.boolean().default(true),
        wordStress: z.boolean().default(false),
        silentVowels: z.boolean().default(false),
      }),
    }),
    
    notifications: z.object({
      progressUpdates: z.boolean().default(true),
      achievementAlerts: z.boolean().default(true),
      newFeatures: z.boolean().default(false),
      emailNotifications: z.boolean().default(true),
    }),
    
    language: z.object({
      interfaceLanguage: z.enum(['en', 'ja']).default('en'),
      practiceVoiceAccent: z.enum(['american', 'british']).default('american'),
    }),
  }).optional(),
  
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type UserProgress = z.infer<typeof userProgressSchema>;

// ============================================================================
// SENTENCE SCHEMAS
// ============================================================================

export const sentenceSchema = z.object({
  id: z.string().min(1, 'Sentence ID is required'),
  text: z.string().min(1, 'Sentence text is required'),
  scenario: z.string().min(1, 'Scenario is required'),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
  type: z.enum(['core', 'ai_generated']),
  
  // Phonemes this sentence helps practice
  phonemes: z.array(z.string()).default([]),
  
  // Audio/pronunciation data
  ipa: z.string().optional(), // International Phonetic Alphabet
  audioUrl: z.string().url().optional(),
  
  // Metadata for AI-generated sentences
  usageCount: z.number().min(0).default(0).optional(),
  lastUsed: z.date().optional(),
  createdAt: z.date(),
  updatedAt: z.date().optional(),
});

export type Sentence = z.infer<typeof sentenceSchema>;

// ============================================================================
// USER SENTENCE HISTORY SCHEMAS
// ============================================================================

export const userSentenceHistorySchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  sentenceId: z.string().min(1, 'Sentence ID is required'),
  attempts: z.number().min(1).default(1),
  accuracyScores: z.array(z.number().min(0).max(100)),
  bestAccuracy: z.number().min(0).max(100),
  phonemeScores: z.record(z.string(), z.number().min(0).max(100)),
  lastPracticed: z.date(),
  nextReview: z.date(),
  mastered: z.boolean().default(false),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type UserSentenceHistory = z.infer<typeof userSentenceHistorySchema>;

// ============================================================================
// API REQUEST/RESPONSE SCHEMAS
// ============================================================================

// Practice Settings Update
export const updatePracticeSettingsSchema = z.object({
  dailyGoalMinutes: z.number().min(5).max(120).optional(),
  reminderEnabled: z.boolean().optional(),
  reminderTime: z.string().regex(/^\d{2}:\d{2}$/).optional(),
  pronunciationFocus: z.object({
    rVsL: z.boolean().optional(),
    thSounds: z.boolean().optional(),
    wordStress: z.boolean().optional(),
    silentVowels: z.boolean().optional(),
  }).optional(),
});

export type UpdatePracticeSettings = z.infer<typeof updatePracticeSettingsSchema>;

// Notification Settings Update
export const updateNotificationSettingsSchema = z.object({
  progressUpdates: z.boolean().optional(),
  achievementAlerts: z.boolean().optional(),
  newFeatures: z.boolean().optional(),
  emailNotifications: z.boolean().optional(),
});

export type UpdateNotificationSettings = z.infer<typeof updateNotificationSettingsSchema>;

// Language Settings Update
export const updateLanguageSettingsSchema = z.object({
  interfaceLanguage: z.enum(['en', 'ja']).optional(),
  practiceVoiceAccent: z.enum(['american', 'british']).optional(),
});

export type UpdateLanguageSettings = z.infer<typeof updateLanguageSettingsSchema>;

// Profile Update
export const updateProfileSchema = z.object({
  displayName: z.string().min(1).max(100).optional(),
  avatarUrl: z.string().url().optional(),
});

export type UpdateProfile = z.infer<typeof updateProfileSchema>;

// Record Practice Attempt
export const recordPracticeAttemptSchema = z.object({
  sentenceId: z.string().min(1, 'Sentence ID is required'),
  accuracy: z.number().min(0).max(100),
  phonemeScores: z.record(z.string(), z.number().min(0).max(100)),
});

export type RecordPracticeAttempt = z.infer<typeof recordPracticeAttemptSchema>;

// Checkout Request
export const checkoutRequestSchema = z.object({
  priceId: z.string().min(1, 'Price ID is required'),
  planName: z.enum(['free', 'pro', 'enterprise']),
});

export type CheckoutRequest = z.infer<typeof checkoutRequestSchema>;

// ============================================================================
// HELPER FUNCTIONS FOR VALIDATION
// ============================================================================

/**
 * Safely parse and validate data with Zod schema
 */
export function validateData<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; error: string } {
  try {
    const validated = schema.parse(data);
    return { success: true, data: validated };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const messages = error.issues.map(issue => `${issue.path.join('.')}: ${issue.message}`);
      return { success: false, error: messages.join(', ') };
    }
    return { success: false, error: 'Validation failed' };
  }
}

/**
 * Safely parse data and return null if invalid (for optional validation)
 */
export function safeParseData<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): T | null {
  const result = schema.safeParse(data);
  return result.success ? result.data : null;
}

// ============================================================================
// PARTIAL SCHEMAS FOR UPDATES (all fields optional)
// ============================================================================

export const partialUserProgressSchema = userProgressSchema.partial();
export const partialSentenceSchema = sentenceSchema.partial();
export const partialUserSentenceHistorySchema = userSentenceHistorySchema.partial();