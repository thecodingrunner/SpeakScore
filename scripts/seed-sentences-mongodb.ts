// scripts/seed-sentences-mongodb.ts
// Seed MongoDB with 300 core sentences
import 'dotenv/config';
import { getSentencesCollection } from '@/lib/mongodb';
import { ALL_CORE_SENTENCES } from '@/data/core-sentences';

async function seedSentences() {
  console.log('🌱 Seeding MongoDB with core sentences...');
  
  const sentencesCollection = await getSentencesCollection();

  // Clear existing sentences (optional - remove if you want to keep existing)
  // await sentencesCollection.deleteMany({ type: 'core' });

  // Insert all core sentences
  const sentencesWithMetadata = ALL_CORE_SENTENCES.map(sentence => ({
    ...sentence,
    type: 'core',
    audioUrls: {
      normal: null, // Will be populated when audio is generated
      slow: null
    },
    createdAt: new Date(),
    updatedAt: new Date()
  }));

  const result = await sentencesCollection.insertMany(sentencesWithMetadata);

  console.log(`✅ Inserted ${result.insertedCount} sentences into MongoDB`);
  console.log('\nSentences by scenario:');
  
  // Count by scenario
  const scenarios = ['phoneme_r_vs_l', 'phoneme_th_sounds', 'phoneme_f_vs_h', 
                     'phoneme_v_vs_b', 'phoneme_word_stress', 'phoneme_silent_letters',
                     'daily_drill', 'toeic'];
  
  for (const scenario of scenarios) {
    const count = await sentencesCollection.countDocuments({ scenario });
    console.log(`  ${scenario}: ${count} sentences`);
  }

  console.log('\n🎉 Database seeding complete!');
  process.exit(0);
}

seedSentences().catch((error) => {
  console.error('❌ Seeding failed:', error);
  process.exit(1);
});