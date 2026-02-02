// lib/lesson-config.ts
// Lesson structure and configuration

export interface LessonConfig {
    id: string;
    name: string;
    description: string;
    scenario: string;
    sentencesPerLesson: number;
    estimatedMinutes: number;
  }
  
  export const LESSON_CONFIGS: Record<string, LessonConfig> = {
    daily_drill: {
      id: 'daily_drill',
      name: 'Daily Drill',
      description: 'Quick practice with mixed phonemes',
      scenario: 'daily_drill',
      sentencesPerLesson: 10,
      estimatedMinutes: 5,
    },
    phoneme_r_vs_l: {
      id: 'phoneme_r_vs_l',
      name: '/r/ vs /l/ Sounds',
      description: 'Master the difference between R and L',
      scenario: 'phoneme_r_vs_l',
      sentencesPerLesson: 15,
      estimatedMinutes: 10,
    },
    phoneme_th_sounds: {
      id: 'phoneme_th_sounds',
      name: '/th/ Sounds',
      description: 'Practice voiced and voiceless TH',
      scenario: 'phoneme_th_sounds',
      sentencesPerLesson: 15,
      estimatedMinutes: 10,
    },
    phoneme_f_vs_h: {
      id: 'phoneme_f_vs_h',
      name: '/f/ vs /h/ Sounds',
      description: 'Distinguish between F and H sounds',
      scenario: 'phoneme_f_vs_h',
      sentencesPerLesson: 15,
      estimatedMinutes: 10,
    },
    phoneme_v_vs_b: {
      id: 'phoneme_v_vs_b',
      name: '/v/ vs /b/ Sounds',
      description: 'Master V and B pronunciation',
      scenario: 'phoneme_v_vs_b',
      sentencesPerLesson: 15,
      estimatedMinutes: 10,
    },
    phoneme_word_stress: {
      id: 'phoneme_word_stress',
      name: 'Word Stress',
      description: 'Practice correct word stress patterns',
      scenario: 'phoneme_word_stress',
      sentencesPerLesson: 15,
      estimatedMinutes: 10,
    },
    phoneme_silent_letters: {
      id: 'phoneme_silent_letters',
      name: 'Silent Letters',
      description: 'Master words with silent letters',
      scenario: 'phoneme_silent_letters',
      sentencesPerLesson: 15,
      estimatedMinutes: 10,
    },
    toeic: {
      id: 'toeic',
      name: 'TOEIC Speaking',
      description: 'Practice for TOEIC speaking test',
      scenario: 'toeic',
      sentencesPerLesson: 20,
      estimatedMinutes: 15,
    },
    business: {
      id: 'business',
      name: 'Business Meetings',
      description: 'Practice professional meeting language',
      scenario: 'business_meetings',
      sentencesPerLesson: 15,
      estimatedMinutes: 12,
    },
    interview: {
      id: 'interview',
      name: 'Job Interviews',
      description: 'Prepare for job interview questions',
      scenario: 'job_interviews',
      sentencesPerLesson: 15,
      estimatedMinutes: 12,
    },
    phone: {
      id: 'phone',
      name: 'Phone Calls',
      description: 'Master telephone communication skills',
      scenario: 'phone_calls',
      sentencesPerLesson: 15,
      estimatedMinutes: 12,
    },
  };
  
  export function getLessonConfig(lessonId: string): LessonConfig {
    return LESSON_CONFIGS[lessonId] || LESSON_CONFIGS.daily_drill;
  }
  
  export interface LessonAttempt {
    sentenceId: string;
    text: string;
    accuracy: number;
    phonemeScores: Record<string, number>;
    wordScores: Array<{ word: string; score: number }>;
    attemptNumber: number;
  }
  
  export interface LessonSummary {
    lessonId: string;
    lessonName: string;
    totalSentences: number;
    completedSentences: number;
    averageAccuracy: number;
    totalXP: number;
    attempts: LessonAttempt[];
    weakPhonemes: Array<{ phoneme: string; averageScore: number }>;
    strongPhonemes: Array<{ phoneme: string; averageScore: number }>;
    timeSpent: number; // seconds
    completedAt: Date;
  }