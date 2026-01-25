// lib/sentence-selector.ts
// Smart sentence selection logic for practice sessions

import { getSentencesCollection, getUserProgressCollection, getUserSentenceHistoryCollection } from '@/lib/mongodb';

export async function getNextPracticeSentence(
  userId: string,
  scenario: string
) {
  const sentencesCollection = await getSentencesCollection();
  const userProgressCollection = await getUserProgressCollection();
  const historyCollection = await getUserSentenceHistoryCollection();

  // 1. Get user progress
  const userProgress = await userProgressCollection.findOne({ userId });
  const completedSentences = userProgress?.completedSentences || [];
  const weakPhonemes = userProgress?.weakPhonemes || [];

  // 2. Try to get unseen core content first
  const unseenCoreSentences = await sentencesCollection
    .find({
      scenario: scenario,
      type: 'core',
      id: { $nin: completedSentences } // Not in completed list
    })
    .limit(10)
    .toArray();

  if (unseenCoreSentences.length > 0) {
    // Return first unseen core sentence
    return unseenCoreSentences[0];
  }

  // 3. Check for review sentences (spaced repetition)
  const now = new Date();
  const dueForReview = await historyCollection
    .find({
      userId: userId,
      nextReview: { $lte: now }, // Due for review
      mastered: false
    })
    .limit(5)
    .toArray();

  // 30% chance to review if available
  if (dueForReview.length > 0 && Math.random() < 0.3) {
    const reviewSentenceId = dueForReview[0].sentenceId;
    const reviewSentence = await sentencesCollection.findOne({ id: reviewSentenceId });
    
    if (reviewSentence) {
      return reviewSentence;
    }
  }

  // 4. Generate new AI sentence focused on weak phonemes
  const targetPhoneme = weakPhonemes[0] || '/r/'; // Default to /r/
  
  const response = await fetch('/api/generate-sentence', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      phoneme: targetPhoneme,
      difficulty: userProgress?.level || 'beginner',
      scenario,
      userId
    })
  });

  const data = await response.json();
  return data.sentence;
}

/**
 * Get a batch of practice sentences for a scenario
 * Useful for pre-loading sentences in the UI
 */
export async function getPracticeSentenceBatch(
  userId: string,
  scenario: string,
  count: number = 10
) {
  const sentencesCollection = await getSentencesCollection();
  const userProgressCollection = await getUserProgressCollection();

  const userProgress = await userProgressCollection.findOne({ userId });
  const completedSentences = userProgress?.completedSentences || [];

  // Get unseen sentences
  const sentences = await sentencesCollection
    .find({
      scenario: scenario,
      type: 'core',
      id: { $nin: completedSentences }
    })
    .limit(count)
    .toArray();

  return sentences;
}

/**
 * Record a practice attempt
 */
export async function recordPracticeAttempt(
  userId: string,
  sentenceId: string,
  accuracy: number,
  phonemeScores: Record<string, number>
) {
  const historyCollection = await getUserSentenceHistoryCollection();
  const userProgressCollection = await getUserProgressCollection();

  // Get existing history for this sentence
  const existingHistory = await historyCollection.findOne({
    userId,
    sentenceId
  });

  const now = new Date();
  const nextReview = calculateNextReview(accuracy, existingHistory?.attempts || 0);

  if (existingHistory) {
    // Update existing history - FIX: Properly type the $push operator
    await historyCollection.updateOne(
      { userId, sentenceId },
      {
        $set: {
          lastPracticed: now,
          nextReview: nextReview,
          bestAccuracy: Math.max(existingHistory.bestAccuracy || 0, accuracy),
          mastered: accuracy >= 90,
          updatedAt: now
        },
        $push: {
          accuracyScores: accuracy as any // Type assertion to fix MongoDB types
        },
        $inc: {
          attempts: 1
        }
      }
    );
  } else {
    // Create new history entry
    await historyCollection.insertOne({
      userId,
      sentenceId,
      attempts: 1,
      accuracyScores: [accuracy],
      bestAccuracy: accuracy,
      phonemeScores,
      lastPracticed: now,
      nextReview: nextReview,
      mastered: accuracy >= 90,
      createdAt: now,
      updatedAt: now
    });
  }

  // Update user progress
  const userProgress = await userProgressCollection.findOne({ userId });
  
  if (!userProgress) {
    // Create user progress if doesn't exist
    await userProgressCollection.insertOne({
      userId,
      level: 'beginner',
      xp: calculateXP(accuracy),
      streak: 1,
      dailyGoal: 10,
      completedSentences: accuracy >= 70 ? [sentenceId] : [],
      weakPhonemes: findWeakPhonemes(phonemeScores),
      lastPracticed: now,
      createdAt: now,
      updatedAt: now
    });
  } else {
    // Update existing progress
    const updateDoc: any = {
      $inc: {
        xp: calculateXP(accuracy)
      },
      $set: {
        lastPracticed: now,
        updatedAt: now
      }
    };

    // Add to completed sentences if score is good enough
    if (accuracy >= 70 && !userProgress.completedSentences?.includes(sentenceId)) {
      updateDoc.$push = { completedSentences: sentenceId };
    }

    // Update weak phonemes
    const currentWeakPhonemes = findWeakPhonemes(phonemeScores);
    if (currentWeakPhonemes.length > 0) {
      updateDoc.$set.weakPhonemes = currentWeakPhonemes;
    }

    await userProgressCollection.updateOne(
      { userId },
      updateDoc
    );
  }
}

/**
 * Calculate next review date based on spaced repetition
 */
function calculateNextReview(accuracy: number, attempts: number): Date {
  const now = new Date();
  let daysUntilReview = 1;

  if (accuracy >= 90) {
    // Excellent - review in longer intervals
    daysUntilReview = Math.min(30, Math.pow(2, attempts)); // 1, 2, 4, 8, 16, 30 days
  } else if (accuracy >= 70) {
    // Good - moderate intervals
    daysUntilReview = Math.min(7, attempts + 1); // 1, 2, 3, 4, 5, 6, 7 days
  } else {
    // Needs work - review soon
    daysUntilReview = 1; // Tomorrow
  }

  return new Date(now.getTime() + daysUntilReview * 24 * 60 * 60 * 1000);
}

/**
 * Calculate XP based on accuracy
 */
function calculateXP(accuracy: number): number {
  if (accuracy >= 90) return 50;
  if (accuracy >= 80) return 30;
  if (accuracy >= 70) return 20;
  return 10;
}

/**
 * Find weak phonemes from scores
 */
function findWeakPhonemes(phonemeScores: Record<string, number>): string[] {
  return Object.entries(phonemeScores)
    .filter(([_, score]) => score < 75)
    .map(([phoneme, _]) => phoneme)
    .slice(0, 3); // Top 3 weak phonemes
}