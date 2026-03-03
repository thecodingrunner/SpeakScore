import { generateTTS } from '@/lib/azure-tts';
import fs from 'fs';

async function testTTS() {
  console.log('Testing Azure TTS...');
  
  const audio = await generateTTS({
    text: 'I really like learning English.',
    gender: 'female',
    speed: 1.0
  });

  fs.writeFileSync('test-audio.mp3', audio);
  console.log('✅ Audio generated: test-audio.mp3');
}

testTTS();