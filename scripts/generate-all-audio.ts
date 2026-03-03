// scripts/generate-all-audio.ts
// Generate TTS audio for all 300 core sentences and upload to Firebase Storage

// Load environment variables FIRST!
import 'dotenv/config';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

// Now import the rest
import { getSentencesCollection } from '../lib/mongodb';
import { generateTTSVariants } from '../lib/azure-tts';
import { uploadAudioVariants, audioExists } from '../lib/firebase-audio-storage';

// Configuration
const DELAY_BETWEEN_REQUESTS = 200; // 200ms delay to avoid rate limiting
const BATCH_SIZE = 10; // Process 10 at a time, then show progress

async function generateAllAudio() {
  console.log('🎤 Starting Audio Generation for All Core Sentences\n');
  
  // Verify environment variables
  if (!process.env.MONGODB_URI) {
    console.error('❌ MONGODB_URI not found in .env.local');
    process.exit(1);
  }
  if (!process.env.AZURE_SPEECH_KEY) {
    console.error('❌ AZURE_SPEECH_KEY not found in .env.local');
    process.exit(1);
  }

  console.log('✅ Environment variables loaded');
  console.log(`🌍 Azure Region: ${process.env.AZURE_SPEECH_REGION || 'eastus'}\n`);

  try {
    // Get all sentences from MongoDB
    const sentencesCollection = await getSentencesCollection();
    const sentences = await sentencesCollection
      .find({ type: 'core' })
      .toArray();

    console.log(`📊 Found ${sentences.length} sentences in database\n`);

    if (sentences.length === 0) {
      console.error('❌ No sentences found in database. Run seed script first!');
      process.exit(1);
    }

    let successCount = 0;
    let skipCount = 0;
    let errorCount = 0;
    const errors: any[] = [];

    // Process each sentence
    for (let i = 0; i < sentences.length; i++) {
      const sentence = sentences[i];
      const progress = `[${i + 1}/${sentences.length}]`;

      try {
        // Check if audio already exists
        const exists = await audioExists(sentence.id, 'female', 'american', 'normal');
        
        if (exists) {
          console.log(`${progress} ⏭️  Skipping ${sentence.id} (already exists)`);
          skipCount++;
          continue;
        }

        console.log(`${progress} 🔊 Generating: ${sentence.id}`);
        console.log(`     Text: "${sentence.text}"`);

        // Generate TTS audio (normal + slow versions)
        const { normal, slow } = await generateTTSVariants(sentence.text);
        
        console.log(`     ✓ Generated audio (${(normal.length / 1024).toFixed(1)}KB)`);

        // Upload to Firebase Storage
        const urls = await uploadAudioVariants(sentence.id, normal, slow);
        
        console.log(`     ✓ Uploaded to Firebase`);

        // Update MongoDB with audio URLs
        await sentencesCollection.updateOne(
          { id: sentence.id },
          {
            $set: {
              audioUrls: urls,
              audioGeneratedAt: new Date()
            }
          }
        );

        console.log(`     ✓ Updated database`);
        console.log(`     🎉 Success!\n`);
        
        successCount++;

        // Show progress every batch
        if ((i + 1) % BATCH_SIZE === 0) {
          const percentComplete = ((i + 1) / sentences.length * 100).toFixed(1);
          console.log(`\n📈 Progress: ${percentComplete}% (${i + 1}/${sentences.length})`);
          console.log(`   ✅ Success: ${successCount}`);
          console.log(`   ⏭️  Skipped: ${skipCount}`);
          console.log(`   ❌ Errors: ${errorCount}\n`);
        }

        // Rate limiting delay
        await sleep(DELAY_BETWEEN_REQUESTS);

      } catch (error: any) {
        console.error(`${progress} ❌ Failed: ${sentence.id}`);
        console.error(`     Error: ${error.message}\n`);
        errorCount++;
        errors.push({
          sentenceId: sentence.id,
          text: sentence.text,
          error: error.message
        });

        // Continue with next sentence despite error
        continue;
      }
    }

    // Final summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 GENERATION COMPLETE');
    console.log('='.repeat(60));
    console.log(`✅ Successfully generated: ${successCount} sentences`);
    console.log(`⏭️  Skipped (existing):    ${skipCount} sentences`);
    console.log(`❌ Failed:                 ${errorCount} sentences`);
    console.log(`📝 Total processed:        ${sentences.length} sentences`);
    console.log('='.repeat(60));

    // Show errors if any
    if (errors.length > 0) {
      console.log('\n⚠️  ERRORS SUMMARY:');
      errors.forEach((err, i) => {
        console.log(`\n${i + 1}. Sentence ID: ${err.sentenceId}`);
        console.log(`   Text: "${err.text}"`);
        console.log(`   Error: ${err.error}`);
      });
      console.log('\n💡 Tip: You can re-run this script to retry failed sentences.');
    }

    if (successCount > 0) {
      console.log('\n🎉 Audio generation completed successfully!');
      console.log('💾 All audio files have been uploaded to Firebase Storage');
      console.log('📊 Database has been updated with audio URLs');
    }

    process.exit(errorCount > 0 ? 1 : 0);

  } catch (error) {
    console.error('\n❌ Fatal error:', error);
    process.exit(1);
  }
}

// Helper function for delay
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Run the script
generateAllAudio();