import 'dotenv/config';
import { generatePracticeSentence } from '@/lib/ai-sentence-generator';

async function testAIGeneration() {
  console.log('Testing AI sentence generation...');
  
  const sentence = await generatePracticeSentence({
    phoneme: '/r/',
    difficulty: 'beginner',
    scenario: 'daily_drill'
  });
  
  console.log('Generated:', sentence);
}

testAIGeneration();