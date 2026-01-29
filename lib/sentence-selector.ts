// lib/sentence-selector.ts
// Smart sentence selection with difficulty filtering

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
  const userLevel = userProgress?.level || 'beginner';

  console.log(`🔍 Finding sentence for user ${userId}, scenario: ${scenario}`);
  console.log(`   User level: ${userLevel}`);
  console.log(`   Completed: ${completedSentences.length} sentences`);
  console.log(`   Weak phonemes:`, weakPhonemes);

  const dbScenario = mapScenarioName(scenario);

  // 2. Try to get unseen CORE content matching user's level
  const unseenCoreSentences = await sentencesCollection
    .find({
      scenario: dbScenario,
      type: 'core',
      difficulty: getDifficultyRange(userLevel), // ✅ Filter by difficulty
      id: { $nin: completedSentences }
    })
    .limit(10)
    .toArray();

  console.log(`   Found ${unseenCoreSentences.length} unseen core sentences at ${userLevel} level`);

  if (unseenCoreSentences.length > 0) {
    console.log(`   ✅ Returning core: ${unseenCoreSentences[0].id} (${unseenCoreSentences[0].difficulty})`);
    return unseenCoreSentences[0];
  }

  // 3. If no sentences at user's level, try adjacent levels
  console.log(`   ⚠️ No unseen sentences at ${userLevel}, trying adjacent levels...`);
  
  const adjacentLevels = getAdjacentLevels(userLevel);
  const adjacentSentences = await sentencesCollection
    .find({
      scenario: dbScenario,
      type: 'core',
      difficulty: { $in: adjacentLevels },
      id: { $nin: completedSentences }
    })
    .limit(10)
    .toArray();

  if (adjacentSentences.length > 0) {
    console.log(`   ✅ Found sentence at adjacent level: ${adjacentSentences[0].difficulty}`);
    return adjacentSentences[0];
  }

  // 4. Check for review sentences (spaced repetition)
  const now = new Date();
  const dueForReview = await historyCollection
    .find({
      userId: userId,
      nextReview: { $lte: now },
      mastered: false
    })
    .limit(5)
    .toArray();

  console.log(`   Found ${dueForReview.length} sentences due for review`);

  if (dueForReview.length > 0 && Math.random() < 0.3) {
    const reviewSentenceId = dueForReview[0].sentenceId;
    const reviewSentence = await sentencesCollection.findOne({ id: reviewSentenceId });
    
    if (reviewSentence) {
      console.log(`   ✅ Returning review: ${reviewSentence.id}`);
      return reviewSentence;
    }
  }

  // 5. User completed all core sentences at their level - time for AI content!
  console.log(`   🤖 User completed core content at their level, checking for AI sentences...`);

  const targetPhoneme = weakPhonemes[0] || null;
  const existingAI = await findMatchingAISentence(
    sentencesCollection,
    dbScenario,
    targetPhoneme,
    userLevel,
    completedSentences
  );

  if (existingAI) {
    console.log(`   ✅ Reusing AI sentence: ${existingAI.id} (used ${existingAI.usageCount || 0} times)`);
    
    await sentencesCollection.updateOne(
      { id: existingAI.id },
      { 
        $inc: { usageCount: 1 },
        $set: { lastUsed: new Date() }
      }
    );
    
    return existingAI;
  }

  // 6. No matching AI sentence exists - return null to trigger generation
  console.log(`   🎲 No matching AI sentence found, returning null`);
  return null;
}

/**
 * Get difficulty range based on user level
 */
function getDifficultyRange(userLevel: string): any {
  switch (userLevel) {
    case 'beginner':
      return 'beginner'; // Only beginner sentences
    case 'intermediate':
      return { $in: ['beginner', 'intermediate'] }; // Beginner + intermediate
    case 'advanced':
      return { $in: ['intermediate', 'advanced'] }; // Intermediate + advanced
    default:
      return 'beginner';
  }
}

/**
 * Get adjacent difficulty levels for fallback
 */
function getAdjacentLevels(userLevel: string): string[] {
  switch (userLevel) {
    case 'beginner':
      return ['intermediate']; // Try intermediate if no beginner left
    case 'intermediate':
      return ['beginner', 'advanced']; // Try both easier and harder
    case 'advanced':
      return ['intermediate']; // Try intermediate if no advanced left
    default:
      return ['beginner', 'intermediate'];
  }
}

/**
 * Find existing AI sentence that matches criteria
 */
async function findMatchingAISentence(
  sentencesCollection: any,
  scenario: string,
  targetPhoneme: string | null,
  difficulty: string,
  completedSentences: string[]
) {
  const query: any = {
    type: 'ai_generated',
    scenario: scenario,
    difficulty: difficulty,
    id: { $nin: completedSentences }
  };

  if (targetPhoneme) {
    query.phonemes = { $in: [targetPhoneme] };
  }

  const aiSentences = await sentencesCollection
    .find(query)
    .sort({ usageCount: 1, createdAt: -1 })
    .limit(10)
    .toArray();

  if (aiSentences.length > 0) {
    return aiSentences[0];
  }

  if (targetPhoneme) {
    delete query.phonemes;
    
    const fallbackAI = await sentencesCollection
      .find(query)
      .sort({ usageCount: 1, createdAt: -1 })
      .limit(5)
      .toArray();

    if (fallbackAI.length > 0) {
      return fallbackAI[0];
    }
  }

  return null;
}

/**
 * Level up user based on performance
 */
export async function checkAndLevelUp(userId: string) {
  const userProgressCollection = await getUserProgressCollection();
  const historyCollection = await getUserSentenceHistoryCollection();

  const userProgress = await userProgressCollection.findOne({ userId });
  if (!userProgress) return;

  const currentLevel = userProgress.level || 'beginner';
  
  // Get last 20 practice sessions
  const recentPractice = await historyCollection
    .find({ userId })
    .sort({ lastPracticed: -1 })
    .limit(20)
    .toArray();

  if (recentPractice.length < 20) return; // Need at least 20 sessions

  // Calculate average accuracy of recent sessions
  const avgAccuracy = recentPractice.reduce((sum, session) => {
    const sessionAvg = session.accuracyScores.reduce((a: number, b: number) => a + b, 0) / session.accuracyScores.length;
    return sum + sessionAvg;
  }, 0) / recentPractice.length;

  console.log(`📊 User ${userId} recent average: ${avgAccuracy}%`);

  // Level up conditions
  let newLevel = currentLevel;
  
  if (currentLevel === 'beginner' && avgAccuracy >= 85 && userProgress.completedSentences?.length >= 30) {
    newLevel = 'intermediate';
  } else if (currentLevel === 'intermediate' && avgAccuracy >= 90 && userProgress.completedSentences?.length >= 100) {
    newLevel = 'advanced';
  }

  if (newLevel !== currentLevel) {
    console.log(`🎉 Level up! ${currentLevel} → ${newLevel}`);
    
    await userProgressCollection.updateOne(
      { userId },
      { 
        $set: { 
          level: newLevel,
          updatedAt: new Date()
        }
      }
    );
  }
}

export async function getPracticeSentenceBatch(
  userId: string,
  scenario: string,
  count: number = 10
) {
  const sentencesCollection = await getSentencesCollection();
  const userProgressCollection = await getUserProgressCollection();

  const userProgress = await userProgressCollection.findOne({ userId });
  const completedSentences = userProgress?.completedSentences || [];
  const userLevel = userProgress?.level || 'beginner';

  const dbScenario = mapScenarioName(scenario);

  const sentences = await sentencesCollection
    .find({
      scenario: dbScenario,
      type: 'core',
      difficulty: getDifficultyRange(userLevel),
      id: { $nin: completedSentences }
    })
    .limit(count)
    .toArray();

  return sentences;
}

export async function recordPracticeAttempt(
  userId: string,
  sentenceId: string,
  accuracy: number,
  phonemeScores: Record<string, number>
) {
  const historyCollection = await getUserSentenceHistoryCollection();
  const userProgressCollection = await getUserProgressCollection();

  console.log(`📝 Recording attempt for user ${userId}, sentence ${sentenceId}, accuracy: ${accuracy}%`);

  const existingHistory = await historyCollection.findOne({
    userId,
    sentenceId
  });

  const now = new Date();
  const nextReview = calculateNextReview(accuracy, existingHistory?.attempts || 0);

  if (existingHistory) {
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
          accuracyScores: accuracy as any
        },
        $inc: {
          attempts: 1
        }
      }
    );
    console.log(`   ✅ Updated existing history`);
  } else {
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
    console.log(`   ✅ Created new history entry`);
  }

  const userProgress = await userProgressCollection.findOne({ userId });
  
  if (!userProgress) {
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
    console.log(`   ✅ Created user progress`);
  } else {
    const updateDoc: any = {
      $inc: {
        xp: calculateXP(accuracy)
      },
      $set: {
        lastPracticed: now,
        updatedAt: now
      }
    };

    if (accuracy >= 70 && !userProgress.completedSentences?.includes(sentenceId)) {
      updateDoc.$push = { completedSentences: sentenceId };
      console.log(`   ✅ Marked sentence as completed`);
    }

    const currentWeakPhonemes = findWeakPhonemes(phonemeScores);
    if (currentWeakPhonemes.length > 0) {
      updateDoc.$set.weakPhonemes = currentWeakPhonemes;
    }

    await userProgressCollection.updateOne(
      { userId },
      updateDoc
    );
    console.log(`   ✅ Updated user progress (+${calculateXP(accuracy)} XP)`);
  }

  // Check if user should level up
  await checkAndLevelUp(userId);
}

function calculateNextReview(accuracy: number, attempts: number): Date {
  const now = new Date();
  let daysUntilReview = 1;

  if (accuracy >= 90) {
    daysUntilReview = Math.min(30, Math.pow(2, attempts));
  } else if (accuracy >= 70) {
    daysUntilReview = Math.min(7, attempts + 1);
  } else {
    daysUntilReview = 1;
  }

  return new Date(now.getTime() + daysUntilReview * 24 * 60 * 60 * 1000);
}

function calculateXP(accuracy: number): number {
  if (accuracy >= 90) return 50;
  if (accuracy >= 80) return 30;
  if (accuracy >= 70) return 20;
  return 10;
}

function findWeakPhonemes(phonemeScores: Record<string, number>): string[] {
  return Object.entries(phonemeScores)
    .filter(([_, score]) => score < 75)
    .map(([phoneme, _]) => phoneme)
    .slice(0, 3);
}

function mapScenarioName(frontendScenario: string): string {
  const mapping: Record<string, string> = {
    'quick': 'daily_drill',
    'daily_drill': 'daily_drill',
    'phonemes': 'phoneme_r_vs_l',
    'phoneme_r_vs_l': 'phoneme_r_vs_l',
    'toeic': 'toeic',
    'business': 'business',
    'interview': 'interview',
    'phone': 'phone',
  };
  return mapping[frontendScenario] || frontendScenario;
}