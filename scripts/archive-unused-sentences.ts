// scripts/archive-unused-sentences.ts
// Archive AI sentences that haven't been used in 6 months
// Run this as a cron job: `npx tsx scripts/archive-unused-sentences.ts`

import { getSentencesCollection } from '@/lib/mongodb';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function archiveUnusedSentences() {
  console.log('🗄️  Starting archival of unused AI sentences...');

  const sentencesCollection = await getSentencesCollection();

  // Calculate date 6 months ago
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  console.log(`   Looking for sentences unused since: ${sixMonthsAgo.toISOString()}`);

  // Find AI sentences that:
  // 1. Haven't been used in 6 months (lastUsed < 6 months ago)
  // 2. Have low usage count (< 5 uses)
  // 3. Are AI-generated (not core content)
  const unusedSentences = await sentencesCollection
    .find({
      type: 'ai_generated',
      $or: [
        { lastUsed: { $lt: sixMonthsAgo } },
        { lastUsed: { $exists: false } }
      ],
      usageCount: { $lt: 5 }
    })
    .toArray();

  console.log(`   Found ${unusedSentences.length} unused AI sentences`);

  if (unusedSentences.length === 0) {
    console.log('✅ No sentences to archive');
    process.exit(0);
  }

  // Option 1: Mark as archived (soft delete)
  const sentenceIds = unusedSentences.map(s => s.id);
  
  const result = await sentencesCollection.updateMany(
    { id: { $in: sentenceIds } },
    { 
      $set: { 
        archived: true,
        archivedAt: new Date()
      } 
    }
  );

  console.log(`✅ Archived ${result.modifiedCount} sentences`);
  
  // Log some stats
  const totalUsage = unusedSentences.reduce((sum, s) => sum + (s.usageCount || 0), 0);
  console.log(`   Total usage of archived sentences: ${totalUsage}`);
  console.log(`   Average usage: ${(totalUsage / unusedSentences.length).toFixed(2)}`);
  
  // Option 2: Actually delete (uncomment if you want hard delete)
  // const deleteResult = await sentencesCollection.deleteMany({
  //   id: { $in: sentenceIds }
  // });
  // console.log(`🗑️  Deleted ${deleteResult.deletedCount} sentences`);

  process.exit(0);
}

archiveUnusedSentences().catch(error => {
  console.error('❌ Archive script failed:', error);
  process.exit(1);
});