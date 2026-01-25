// lib/ai-sentence-generator.ts
// AI-powered sentence generation for infinite practice content

import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface GenerateSentenceOptions {
  phoneme: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  scenario: string;
  context?: string;
  avoid?: string[]; // Previously generated sentences to avoid duplicates
}

/**
 * Generate a practice sentence using GPT-4o-mini
 * Optimized for low cost and high quality
 */
export async function generatePracticeSentence(options: GenerateSentenceOptions): Promise<string> {
  const { phoneme, difficulty, scenario, context, avoid = [] } = options;

  const systemPrompt = `You are an expert English pronunciation teacher for Japanese learners.
Your task is to generate natural, practical English sentences for pronunciation practice.

CRITICAL RULES:
1. Sentences must be 8-15 words long
2. Natural conversational English (not textbook style)
3. Appropriate for Japanese learners
4. Must contain the target phoneme naturally (not forced)
5. Difficulty must match the requested level
6. Output ONLY the sentence, no explanation or quotation marks`;

  const userPrompt = buildPromptForScenario(phoneme, difficulty, scenario, context, avoid);

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini', // $0.15/1M tokens - very cheap!
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ],
    temperature: 0.8, // Some variety, but not too random
    max_tokens: 50, // Sentences are short
  });

  const sentence = response.choices[0].message.content?.trim() || '';
  
  // Remove quotes if GPT added them
  return sentence.replace(/^["']|["']$/g, '');
}

/**
 * Build scenario-specific prompts
 */
function buildPromptForScenario(
  phoneme: string,
  difficulty: string,
  scenario: string,
  context?: string,
  avoid: string[] = []
): string {
  
  const baseInstructions = `Generate ONE English sentence for pronunciation practice.

Target phoneme: ${phoneme}
Difficulty: ${difficulty}
Scenario: ${scenario}
${context ? `Context: ${context}` : ''}

Difficulty guidelines:
- Beginner: Simple vocabulary (CEFR A1-A2), present tense, common topics
- Intermediate: Moderate vocabulary (CEFR B1-B2), varied tenses, workplace/academic topics  
- Advanced: Complex vocabulary (CEFR C1-C2), professional/abstract topics

${avoid.length > 0 ? `DO NOT generate sentences similar to these:\n${avoid.join('\n')}` : ''}`;

  // Scenario-specific instructions
  const scenarioTemplates: Record<string, string> = {
    
    'phoneme_r_vs_l': `
The sentence should naturally contain ${phoneme} sounds.
Use words like: really, light, read, learn, library, regular, relax, color, travel, world
Focus on minimal pairs where /r/ and /l/ create different meanings.
Make it practical for daily use.`,

    'phoneme_th_sounds': `
The sentence should contain /θ/ (think, three, Thursday) or /ð/ (this, that, the) sounds.
Common words: think, thank, three, through, Thursday, both, bath, math, smooth
Or: this, that, these, those, they, there, weather, father, brother
Emphasize tongue placement between teeth.`,

    'phoneme_f_vs_h': `
The sentence should contain /f/ or /h/ sounds, showing the difference.
/f/ words: feel, fast, food, phone, coffee, life, before, comfortable
/h/ words: happy, hope, hat, house, happen, hospital, behind, behave
Japanese learners often confuse these - make the distinction clear.`,

    'phoneme_v_vs_b': `
The sentence should contain /v/ or /b/ sounds.
/v/ words: very, have, drive, love, arrive, value, November, travel
/b/ words: big, boat, bag, better, book, job, probably, trouble
Japanese doesn't have /v/ - emphasize lip vibration for /v/.`,

    'phoneme_word_stress': `
Focus on word stress patterns, especially:
- Noun vs Verb stress (REcord vs reCORD, PREsent vs preSENT)
- Compound nouns (GREENhouse, BLACKboard)
- Related word families (PHOtograph, phoTOgrapher, phoTOGraphy)
Make the stress pattern clear and natural.`,

    'phoneme_silent_letters': `
Include words with silent letters that Japanese learners often pronounce:
- Silent E: make, time, hope, write
- Silent K: know, knee, knife, knight
- Silent L: walk, talk, calm, would
- Silent H: hour, honest, honor, vehicle
- Silent T: listen, castle, whistle
Focus on common words they'll use.`,

    'daily_drill': `
Create a practical, everyday sentence.
Mix multiple phonemes naturally.
Topics: daily routines, food, weather, hobbies, work, family, travel
Keep it conversational and useful.`,

    'toeic': buildTOEICPrompt(context),

    'business': `
Professional business context.
Topics: meetings, presentations, negotiations, emails, client relations
Formal but natural language.
Common phrases: "I'd like to...", "Could we...", "In my opinion...", "Let's discuss..."`,

    'interview': `
Job interview context.
Topics: self-introduction, strengths/weaknesses, experience, goals, company questions
Professional and confident tone.
Common phrases: "I have experience in...", "My strength is...", "I'm passionate about..."`,

    'phone': `
Phone conversation context.
Clear enunciation is critical (some sounds get lost on phone).
Topics: scheduling, greetings, confirmations, leaving messages
Phrases: "Could you repeat that?", "I'll call back...", "This is [name] calling..."`,
  };

  return `${baseInstructions}\n\n${scenarioTemplates[scenario] || scenarioTemplates['daily_drill']}

Generate ONE sentence now:`;
}

/**
 * Build TOEIC-specific prompts based on context
 */
function buildTOEICPrompt(context?: string): string {
  const toeicContexts: Record<string, string> = {
    'read_aloud': `
TOEIC Read Aloud format.
Create a passage that could appear in TOEIC Part 1 (Read a Text Aloud).
Topics: company announcements, meeting notices, policy updates, instructions
Formal business English. Clear structure. 2-3 sentences combined.
Include times, dates, locations, or specific details.`,

    'describe_picture': `
TOEIC Picture Description format.
Describe a business scene: office meeting, conference, workspace, customer service
Use present continuous: "People are...", "A man is...", "The employees are..."
Mention location, actions, and details visible in a typical business photo.`,

    'opinion': `
TOEIC Express Opinion format.
Answer a question about work, business, or daily life.
Start with: "I think...", "In my opinion...", "I believe..."
Give a reason: "because...", "since...", "due to..."
Professional but conversational.`,

    'solution': `
TOEIC Propose Solution format.
Respond to a workplace problem.
Structure: acknowledge issue + propose solution + explain benefit
Use: "I would recommend...", "One solution could be...", "We should consider..."
Professional problem-solving language.`
  };

  return toeicContexts[context || 'read_aloud'];
}

/**
 * Generate multiple sentences at once (batch generation)
 * More efficient for API calls
 */
export async function generateBatchSentences(
  options: GenerateSentenceOptions,
  count: number = 5
): Promise<string[]> {
  
  const systemPrompt = `You are an expert English pronunciation teacher for Japanese learners.
Generate ${count} different practice sentences following these rules:

CRITICAL RULES:
1. Each sentence must be 8-15 words long
2. Natural conversational English
3. No repetition or very similar sentences
4. Must contain target phoneme naturally
5. Match difficulty level
6. Output format: one sentence per line, no numbering or explanation`;

  const userPrompt = buildPromptForScenario(
    options.phoneme,
    options.difficulty,
    options.scenario,
    options.context,
    options.avoid
  );

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `${userPrompt}\n\nGenerate ${count} different sentences:` }
    ],
    temperature: 0.9, // Higher variety for batch
    max_tokens: 250,
  });

  const content = response.choices[0].message.content || '';
  
  // Split by newlines and clean
  const sentences = content
    .split('\n')
    .map(s => s.trim())
    .filter(s => s.length > 0)
    .map(s => s.replace(/^\d+[\.)]\s*/, '')) // Remove numbering if added
    .map(s => s.replace(/^["']|["']$/g, '')); // Remove quotes

  return sentences.slice(0, count);
}

/**
 * Validate AI-generated sentence quality
 * Returns true if sentence meets quality standards
 */
export function validateGeneratedSentence(
  sentence: string,
  phoneme: string,
  difficulty: string
): { valid: boolean; reason?: string } {
  
  // Check length (8-15 words)
  const wordCount = sentence.split(/\s+/).length;
  if (wordCount < 8 || wordCount > 15) {
    return { valid: false, reason: `Word count ${wordCount} outside 8-15 range` };
  }

  // Check if sentence is natural English (basic checks)
  if (sentence.includes('*') || sentence.includes('_')) {
    return { valid: false, reason: 'Contains markdown formatting' };
  }

  if (sentence.startsWith('Sentence:') || sentence.match(/^\d+[\.)]/)) {
    return { valid: false, reason: 'Contains unwanted prefix' };
  }

  // Check if phoneme exists in sentence (basic check)
  if (phoneme === '/r/' && !sentence.toLowerCase().includes('r')) {
    return { valid: false, reason: 'Missing target phoneme /r/' };
  }
  
  if (phoneme === '/l/' && !sentence.toLowerCase().includes('l')) {
    return { valid: false, reason: 'Missing target phoneme /l/' };
  }

  // Check difficulty appropriateness (basic checks)
  if (difficulty === 'beginner') {
    const complexWords = ['nevertheless', 'consequently', 'furthermore', 'moreover'];
    if (complexWords.some(word => sentence.toLowerCase().includes(word))) {
      return { valid: false, reason: 'Too complex for beginner level' };
    }
  }

  return { valid: true };
}

/**
 * Generate sentence with retry logic and validation
 * Ensures high-quality output
 */
export async function generateValidatedSentence(
  options: GenerateSentenceOptions,
  maxRetries: number = 3
): Promise<string> {
  
  for (let i = 0; i < maxRetries; i++) {
    const sentence = await generatePracticeSentence(options);
    const validation = validateGeneratedSentence(
      sentence,
      options.phoneme,
      options.difficulty
    );

    if (validation.valid) {
      return sentence;
    }

    console.log(`Retry ${i + 1}: ${validation.reason}`);
  }

  // Fallback: return last attempt even if not perfect
  return await generatePracticeSentence(options);
}