// scripts/setup-mongodb-indexes.ts
// Create indexes for optimal query performance
// Run once: `npx tsx scripts/setup-mongodb-indexes.ts`

import { getSentencesCollection, getUserProgressCollection, getUserSentenceHistoryCollection } from '@/lib/mongodb';
import 'dotenv/config';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

async function setupIndexes() {
  console.log('📊 Setting up MongoDB indexes...');

  // 1. Sentences Collection Indexes
  const sentencesCollection = await getSentencesCollection();
  
  console.log('Creating sentences indexes...');
  
  // Index for finding core sentences by scenario
  await sentencesCollection.createIndex(
    { scenario: 1, type: 1, id: 1 },
    { name: 'scenario_type_id' }
  );
  
  // Index for finding AI sentences to reuse
  await sentencesCollection.createIndex(
    { type: 1, scenario: 1, difficulty: 1, phonemes: 1, usageCount: 1 },
    { name: 'ai_reuse_lookup' }
  );
  
  // Index for archival queries
  await sentencesCollection.createIndex(
    { type: 1, lastUsed: 1, usageCount: 1 },
    { name: 'archival_lookup' }
  );
  
  // Index for sentence ID lookups
  await sentencesCollection.createIndex(
    { id: 1 },
    { unique: true, name: 'sentence_id' }
  );

  console.log('✅ Sentences indexes created');

  // 2. User Progress Collection Indexes
  const userProgressCollection = await getUserProgressCollection();
  
  console.log('Creating user progress indexes...');
  
  // Index for user lookups
  await userProgressCollection.createIndex(
    { userId: 1 },
    { unique: true, name: 'user_id' }
  );
  
  // Index for completed sentences lookup
  await userProgressCollection.createIndex(
    { userId: 1, completedSentences: 1 },
    { name: 'user_completed' }
  );

  console.log('✅ User progress indexes created');

  // 3. User Sentence History Collection Indexes
  const historyCollection = await getUserSentenceHistoryCollection();
  
  console.log('Creating history indexes...');
  
  // Compound index for user + sentence lookups
  await historyCollection.createIndex(
    { userId: 1, sentenceId: 1 },
    { unique: true, name: 'user_sentence' }
  );
  
  // Index for review queries (spaced repetition)
  await historyCollection.createIndex(
    { userId: 1, nextReview: 1, mastered: 1 },
    { name: 'review_lookup' }
  );
  
  // Index for last practiced lookups
  await historyCollection.createIndex(
    { userId: 1, lastPracticed: -1 },
    { name: 'recent_practice' }
  );

  console.log('✅ History indexes created');

  // List all indexes
  console.log('\n📋 Indexes summary:');
  
  const sentenceIndexes = await sentencesCollection.indexes();
  console.log('\nSentences collection:');
  sentenceIndexes.forEach(idx => {
    console.log(`  - ${idx.name}: ${JSON.stringify(idx.key)}`);
  });
  
  const progressIndexes = await userProgressCollection.indexes();
  console.log('\nUser progress collection:');
  progressIndexes.forEach(idx => {
    console.log(`  - ${idx.name}: ${JSON.stringify(idx.key)}`);
  });
  
  const historyIndexes = await historyCollection.indexes();
  console.log('\nHistory collection:');
  historyIndexes.forEach(idx => {
    console.log(`  - ${idx.name}: ${JSON.stringify(idx.key)}`);
  });

  console.log('\n✅ All indexes created successfully!');
  
  process.exit(0);
}

setupIndexes().catch(error => {
  console.error('❌ Index setup failed:', error);
  process.exit(1);
});