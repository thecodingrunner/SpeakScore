// // app/api/practice/analyze-pronunciation/route.ts
// // Analyze pronunciation with Japanese learner-specific settings

// import { NextRequest, NextResponse } from 'next/server';
// import { auth } from '@clerk/nextjs/server';
// import * as sdk from 'microsoft-cognitiveservices-speech-sdk';

// const AZURE_SPEECH_KEY = process.env.AZURE_SPEECH_KEY!;
// const AZURE_SPEECH_REGION = process.env.AZURE_SPEECH_REGION || 'westeurope';

// export async function POST(request: NextRequest) {
//   try {
//     const { userId } = await auth();
    
//     if (!userId) {
//       return NextResponse.json(
//         { error: 'Unauthorized' },
//         { status: 401 }
//       );
//     }

//     const formData = await request.formData();
//     const audioFile = formData.get('audio') as File;
//     const referenceText = formData.get('referenceText') as string;
//     const sentenceId = formData.get('sentenceId') as string;

//     if (!audioFile || !referenceText) {
//       return NextResponse.json(
//         { error: 'Missing audio file or reference text' },
//         { status: 400 }
//       );
//     }

//     console.log('🎤 Analyzing pronunciation (Japanese learner mode)...');
//     console.log('   Reference:', referenceText);

//     const arrayBuffer = await audioFile.arrayBuffer();
//     const audioBuffer = Buffer.from(arrayBuffer);

//     const result = await analyzePronunciationForJapanese(audioBuffer, referenceText);

//     console.log('✅ Analysis complete!');
//     console.log('   Raw Score:', result.rawAccuracy);
//     console.log('   Adjusted Score:', result.accuracy);
//     console.log('   Fluency:', result.fluencyScore);
//     console.log('   Completeness:', result.completenessScore);

//     const xpEarned = calculateXP(result.accuracy);

//     return NextResponse.json({
//       success: true,
//       accuracy: result.accuracy,
//       rawAccuracy: result.rawAccuracy,
//       recognizedText: result.recognizedText,
//       phonemeScores: result.phonemeScores,
//       wordScores: result.wordScores,
//       fluencyScore: result.fluencyScore,
//       completenessScore: result.completenessScore,
//       prosodyScore: result.prosodyScore,
//       xpEarned,
//       sentenceId
//     });

//   } catch (error: any) {
//     console.error('❌ Pronunciation analysis error:', error);
//     return NextResponse.json(
//       { 
//         error: 'Failed to analyze pronunciation', 
//         details: error.message
//       },
//       { status: 500 }
//     );
//   }
// }

// // Add this to your analyze-pronunciation route.ts
// // Replace the analyzePronunciationForJapanese function with this improved version

// async function analyzePronunciationForJapanese(audioBuffer: Buffer, referenceText: string) {
//     return new Promise<{
//       accuracy: number;
//       rawAccuracy: number;
//       recognizedText: string;
//       phonemeScores: Array<{ phoneme: string; score: number; errorType?: string }>;
//       wordScores: Array<{ word: string; score: number; errorType?: string }>;
//       fluencyScore: number;
//       completenessScore: number;
//       prosodyScore: number;
//     }>((resolve, reject) => {
      
//       console.log('🔧 Setting up Azure Speech SDK for Japanese learners...');
//       console.log('   Audio buffer size:', audioBuffer.length, 'bytes');
      
//       // Validate audio buffer
//       if (audioBuffer.length < 1000) {
//         reject(new Error('Audio buffer too small. Please record for at least 1 second.'));
//         return;
//       }
      
//       const speechConfig = sdk.SpeechConfig.fromSubscription(
//         AZURE_SPEECH_KEY,
//         AZURE_SPEECH_REGION
//       );
  
//       speechConfig.speechRecognitionLanguage = 'en-US';
      
//       // Set longer timeout for recognition
//       speechConfig.setProperty(
//         sdk.PropertyId.SpeechServiceConnection_InitialSilenceTimeoutMs,
//         "8000" // Increased from 5000
//       );
//       speechConfig.setProperty(
//         sdk.PropertyId.SpeechServiceConnection_EndSilenceTimeoutMs,
//         "2000" // Increased from 1000
//       );
  
//       const pronunciationConfig = new sdk.PronunciationAssessmentConfig(
//         referenceText,
//         sdk.PronunciationAssessmentGradingSystem.HundredMark,
//         sdk.PronunciationAssessmentGranularity.Phoneme,
//         true
//       );
  
//       pronunciationConfig.phonemeAlphabet = "IPA";
//       pronunciationConfig.enableProsodyAssessment = true;
//       pronunciationConfig.enableMiscue = true;
  
//       // IMPORTANT: Try to detect WAV format
//       const isWavFormat = audioBuffer.length > 44 && 
//                          audioBuffer.toString('utf8', 0, 4) === 'RIFF' &&
//                          audioBuffer.toString('utf8', 8, 12) === 'WAVE';
      
//       console.log('   Format detection:', isWavFormat ? 'WAV' : 'Unknown');
  
//       let audioConfig: sdk.AudioConfig;
      
//       if (isWavFormat) {
//         // It's a WAV file, use push stream
//         console.log('   Using WAV push stream');
//         const pushStream = sdk.AudioInputStream.createPushStream(
//           sdk.AudioStreamFormat.getWaveFormatPCM(16000, 16, 1)
//         );
//         pushStream.write(audioBuffer);
//         pushStream.close();
//         audioConfig = sdk.AudioConfig.fromStreamInput(pushStream);
//       } else {
//         // Unknown format, try default push stream
//         console.log('   Using default push stream');
//         const pushStream = sdk.AudioInputStream.createPushStream();
//         pushStream.write(audioBuffer);
//         pushStream.close();
//         audioConfig = sdk.AudioConfig.fromStreamInput(pushStream);
//       }
  
//       const recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);
      
//       pronunciationConfig.applyTo(recognizer);
  
//       // Add event handlers for debugging
//       recognizer.recognizing = (s, e) => {
//         console.log('🎤 Recognizing:', e.result.text);
//       };
  
//       recognizer.canceled = (s, e) => {
//         console.log('❌ Recognition canceled:', e.reason);
//         if (e.reason === sdk.CancellationReason.Error) {
//           console.log('   Error:', e.errorDetails);
//         }
//       };
  
//       console.log('🎯 Starting recognition...');
  
//       recognizer.recognizeOnceAsync(
//         (result) => {
//           console.log('📥 Recognition result reason:', result.reason);
//           console.log('   Result text:', result.text);
          
//           if (result.reason === sdk.ResultReason.RecognizedSpeech) {
//             try {
//               console.log('✅ Speech recognized:', result.text);
              
//               const pronunciationResult = sdk.PronunciationAssessmentResult.fromResult(result);
              
//               const rawAccuracy = Math.round(pronunciationResult.accuracyScore);
//               const fluencyScore = Math.round(pronunciationResult.fluencyScore);
//               const completenessScore = Math.round(pronunciationResult.completenessScore);
              
//               let prosodyScore = 0;
//               try {
//                 // @ts-ignore
//                 prosodyScore = Math.round(pronunciationResult.prosodyScore || 0);
//               } catch {
//                 console.log('⚠️ Prosody score not available');
//               }
  
//               console.log('📊 Azure scores:', {
//                 accuracy: rawAccuracy,
//                 fluency: fluencyScore,
//                 completeness: completenessScore,
//                 prosody: prosodyScore
//               });
  
//               const phonemeScores: Array<{ phoneme: string; score: number; errorType?: string }> = [];
//               const wordScores: Array<{ word: string; score: number; errorType?: string }> = [];
  
//               const detailResult = JSON.parse(result.properties.getProperty(
//                 sdk.PropertyId.SpeechServiceResponse_JsonResult
//               ));
  
//               if (detailResult.NBest && detailResult.NBest[0]) {
//                 const words = detailResult.NBest[0].Words || [];
                
//                 words.forEach((word: any) => {
//                   if (word.Word && word.PronunciationAssessment) {
//                     const pa = word.PronunciationAssessment;
                    
//                     wordScores.push({
//                       word: word.Word,
//                       score: Math.round(pa.AccuracyScore || 0),
//                       errorType: pa.ErrorType || 'None'
//                     });
//                   }
  
//                   if (word.Phonemes) {
//                     word.Phonemes.forEach((phoneme: any) => {
//                       if (phoneme.PronunciationAssessment) {
//                         phonemeScores.push({
//                           phoneme: phoneme.Phoneme || '',
//                           score: Math.round(phoneme.PronunciationAssessment.AccuracyScore || 0)
//                         });
//                       }
//                     });
//                   }
//                 });
//               }
  
//               const adjustedAccuracy = calculateJapaneseAdjustedScore(
//                 rawAccuracy,
//                 fluencyScore,
//                 completenessScore,
//                 prosodyScore,
//                 phonemeScores,
//                 wordScores
//               );
  
//               console.log('✅ Adjusted for Japanese learners:', adjustedAccuracy);
  
//               recognizer.close();
  
//               resolve({
//                 accuracy: adjustedAccuracy,
//                 rawAccuracy,
//                 recognizedText: result.text,
//                 phonemeScores,
//                 wordScores,
//                 fluencyScore,
//                 completenessScore,
//                 prosodyScore
//               });
  
//             } catch (parseError: any) {
//               console.error('❌ Parse error:', parseError);
//               recognizer.close();
//               reject(new Error('Failed to parse results: ' + parseError.message));
//             }
//           } else if (result.reason === sdk.ResultReason.NoMatch) {
//             console.error('❌ No speech recognized');
//             console.error('   Audio buffer size:', audioBuffer.length);
//             console.error('   Reference text:', referenceText);
            
//             const noMatchDetails = sdk.NoMatchDetails.fromResult(result);
//             console.error('   NoMatch reason:', noMatchDetails.reason);
            
//             recognizer.close();
            
//             // Provide more helpful error message
//             reject(new Error(
//               'No speech detected. Please:\n' +
//               '1. Speak louder and more clearly\n' +
//               '2. Hold the microphone closer\n' +
//               '3. Check your microphone is working\n' +
//               '4. Record for at least 2-3 seconds'
//             ));
//           } else if (result.reason === sdk.ResultReason.Canceled) {
//             const cancellation = sdk.CancellationDetails.fromResult(result);
//             console.error('❌ Canceled:', cancellation.reason);
//             console.error('   Error details:', cancellation.errorDetails);
//             console.error('   Error code:', cancellation.ErrorCode);
            
//             recognizer.close();
            
//             // Map error codes to user-friendly messages
//             let errorMessage = 'Recognition failed. ';
//             if (cancellation.errorDetails.includes('audio')) {
//               errorMessage += 'Audio format issue. Please try recording again.';
//             } else if (cancellation.errorDetails.includes('timeout')) {
//               errorMessage += 'Recognition timed out. Please speak immediately after pressing record.';
//             } else {
//               errorMessage += cancellation.errorDetails;
//             }
            
//             reject(new Error(errorMessage));
//           } else {
//             console.error('❌ Unknown reason:', result.reason);
//             recognizer.close();
//             reject(new Error(`Recognition failed with reason: ${result.reason}`));
//           }
//         },
//         (error) => {
//           console.error('❌ Recognition error:', error);
//           recognizer.close();
//           reject(new Error('Recognition error: ' + error));
//         }
//       );
//     });
//   }

// /**
//  * Adjust score for Japanese learners
//  * Applies penalties for common Japanese pronunciation issues
//  */
// function calculateJapaneseAdjustedScore(
//   accuracy: number,
//   fluency: number,
//   completeness: number,
//   prosody: number,
//   phonemeScores: Array<{ phoneme: string; score: number }>,
//   wordScores: Array<{ word: string; score: number; errorType?: string }>
// ): number {
  
//   // Start with weighted average
//   let score = 0;
  
//   // Accuracy is most important (50% weight)
//   score += accuracy * 0.5;
  
//   // Fluency matters for natural speech (25% weight)
//   // Japanese speakers often speak in choppy, syllable-by-syllable manner
//   if (fluency > 0) {
//     score += fluency * 0.25;
//   }
  
//   // Completeness (15% weight) - did they say all words?
//   if (completeness > 0) {
//     score += completeness * 0.15;
//   }
  
//   // Prosody/rhythm (10% weight if available)
//   if (prosody > 0) {
//     score += prosody * 0.1;
//   } else {
//     // Redistribute to accuracy
//     score += accuracy * 0.1;
//   }

//   // Apply penalties for problematic phonemes common in Japanese accent
//   const japaneseProblematicPhonemes = ['r', 'l', 'θ', 'ð', 'v', 'f', 'æ', 'ʌ'];
  
//   let problematicCount = 0;
//   let problematicSum = 0;
  
//   phonemeScores.forEach(ps => {
//     const isProblematic = japaneseProblematicPhonemes.some(p => 
//       ps.phoneme.toLowerCase().includes(p)
//     );
    
//     if (isProblematic) {
//       problematicCount++;
//       problematicSum += ps.score;
      
//       // Extra penalty if score is low on problematic phoneme
//       if (ps.score < 70) {
//         score -= 3; // -3% per poorly pronounced problematic phoneme
//       }
//     }
//   });
  
//   // If average score on problematic phonemes is low, apply additional penalty
//   if (problematicCount > 0) {
//     const avgProblematicScore = problematicSum / problematicCount;
//     if (avgProblematicScore < 65) {
//       score -= 5; // Additional -5% for poor problematic phonemes overall
//     }
//   }

//   // Penalize katakana-style rhythm (low fluency with decent accuracy = robotic)
//   if (accuracy > 75 && fluency < 70) {
//     score -= 8; // -8% for katakana-style pronunciation
//     console.log('⚠️ Katakana-style detected: good accuracy but poor fluency');
//   }

//   // Penalize errors detected by Azure
//   const errors = wordScores.filter(w => w.errorType && w.errorType !== 'None');
//   if (errors.length > 0) {
//     score -= errors.length * 5; // -5% per error
//     console.log(`⚠️ ${errors.length} pronunciation errors detected`);
//   }

//   // Ensure score stays in valid range
//   return Math.max(0, Math.min(100, Math.round(score)));
// }

// function calculateXP(accuracy: number): number {
//   if (accuracy >= 90) return 50;
//   if (accuracy >= 80) return 30;
//   if (accuracy >= 70) return 20;
//   if (accuracy > 0) return 10;
//   return 0;
// }


// app/api/practice/analyze-pronunciation/route.ts
// Improved pronunciation analysis with Japanese L1 interference detection

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import * as sdk from 'microsoft-cognitiveservices-speech-sdk';

const AZURE_SPEECH_KEY = process.env.AZURE_SPEECH_KEY!;
const AZURE_SPEECH_REGION = process.env.AZURE_SPEECH_REGION || 'westeurope';

// ============================================================================
// JAPANESE L1 INTERFERENCE MAP
// Maps target English phonemes to common Japanese substitutions
// ============================================================================
const JAPANESE_CONFUSION_MAP: Record<string, {
  substitutions: string[];   // What Japanese speakers typically produce instead
  description: string;       // Human-readable explanation
  severityWeight: number;    // How much to penalize (1.0 = standard, 1.5 = critical)
}> = {
  // ---- Consonants ----
  'θ': {  // "th" as in "think"
    substitutions: ['s', 'θ̱', 't'],
    description: 'th→s substitution (e.g., "think" → "sink")',
    severityWeight: 1.5,
  },
  'ð': {  // "th" as in "this"
    substitutions: ['z', 'd', 'dz'],
    description: 'voiced th→z/d substitution (e.g., "this" → "zis")',
    severityWeight: 1.5,
  },
  'ɹ': {  // English "r"
    substitutions: ['l', 'ɾ', 'w'],
    description: 'r/l confusion (e.g., "right" → "light")',
    severityWeight: 1.5,
  },
  'l': {  // English "l"
    substitutions: ['ɹ', 'ɾ', 'r'],
    description: 'l/r confusion (e.g., "light" → "right")',
    severityWeight: 1.5,
  },
  'f': {  // labiodental fricative
    substitutions: ['h', 'ɸ', 'p'],
    description: 'f→h substitution (Japanese フ is bilabial, e.g., "fun" → "hun")',
    severityWeight: 1.3,
  },
  'v': {  // voiced labiodental fricative
    substitutions: ['b', 'β'],
    description: 'v→b substitution (e.g., "very" → "berry")',
    severityWeight: 1.3,
  },
  'w': {  // labiovelar approximant - less problematic but worth tracking
    substitutions: ['ɰ'],
    description: 'w weakening (Japanese わ is less rounded)',
    severityWeight: 0.8,
  },
  'dʒ': { // "j" as in "judge"
    substitutions: ['ʒ', 'dz'],
    description: 'j/z confusion in some contexts',
    severityWeight: 1.0,
  },
  'ʒ': {  // "zh" as in "measure"
    substitutions: ['dʒ', 'z'],
    description: 'zh→j substitution',
    severityWeight: 1.0,
  },
  'ʃ': {  // "sh" - usually fine for Japanese speakers but can over-palatalize
    substitutions: ['s'],
    description: 'sh/s confusion in certain positions',
    severityWeight: 0.7,
  },
  'n': {  // final n - Japanese ん changes based on following sound
    substitutions: ['ŋ', 'ɴ', 'm'],
    description: 'final n nasalization differences',
    severityWeight: 0.6,
  },

  // ---- Vowels ----
  'æ': {  // "a" as in "cat"
    substitutions: ['a', 'ɑ', 'e'],
    description: 'æ→a flattening (e.g., "cat" → closer to "kaht")',
    severityWeight: 1.2,
  },
  'ʌ': {  // "u" as in "but"
    substitutions: ['a', 'ɑ'],
    description: 'ʌ→a confusion (e.g., "but" → closer to "bat")',
    severityWeight: 1.0,
  },
  'ɑː': { // "a" as in "father"
    substitutions: ['a', 'ɔ'],
    description: 'long a quality difference',
    severityWeight: 0.8,
  },
  'ɪ': {  // "i" as in "bit"
    substitutions: ['iː', 'i'],
    description: 'ɪ/iː length distinction lost (e.g., "bit" vs "beat")',
    severityWeight: 1.2,
  },
  'ʊ': {  // "oo" as in "book"
    substitutions: ['uː', 'u'],
    description: 'ʊ/uː length distinction lost',
    severityWeight: 1.0,
  },
  'ɝ': {  // r-colored vowel as in "bird"
    substitutions: ['aː', 'əː'],
    description: 'r-colored vowel → pure vowel (no r-coloring)',
    severityWeight: 1.2,
  },
  'ɚ': {  // unstressed r-colored vowel as in "butter"
    substitutions: ['a', 'ə'],
    description: 'unstressed r-colored vowel dropped',
    severityWeight: 0.8,
  },
};

// Known vowel epenthesis patterns (adding vowels between/after consonants)
// Japanese speakers insert vowels because Japanese is largely CV syllable structure
const EPENTHESIS_PATTERNS = [
  { pattern: /str/i, issue: 'consonant cluster "str" - may insert vowel (su-to-ra)' },
  { pattern: /\w[bdgkpt]$/i, issue: 'final stop consonant - may add vowel (e.g., "good" → "goodo")' },
  { pattern: /\w[sz]$/i, issue: 'final sibilant - may add vowel (e.g., "is" → "izu")' },
  { pattern: /\wth/i, issue: 'th cluster' },
  { pattern: /\wts/i, issue: 'ts cluster' },
  { pattern: /ght$/i, issue: 'silent gh + final t' },
];

// ============================================================================
// ROUTE HANDLER
// ============================================================================

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const audioFile = formData.get('audio') as File;
    const referenceText = formData.get('referenceText') as string;
    const sentenceId = formData.get('sentenceId') as string;
    // Optional: pass known problem words for this sentence from your curriculum DB
    const knownProblemsJson = formData.get('knownProblems') as string | null;

    if (!audioFile || !referenceText) {
      return NextResponse.json(
        { error: 'Missing audio file or reference text' },
        { status: 400 }
      );
    }

    console.log('🎤 Analyzing pronunciation (Japanese learner mode v2)...');
    console.log('   Reference:', referenceText);

    const arrayBuffer = await audioFile.arrayBuffer();
    const audioBuffer = Buffer.from(arrayBuffer);

    // Parse optional known problems for this sentence
    let knownProblems: WordProblemHint[] | undefined;
    if (knownProblemsJson) {
      try {
        knownProblems = JSON.parse(knownProblemsJson);
      } catch {
        console.warn('⚠️ Could not parse knownProblems JSON');
      }
    }

    // ---- PASS 1: Pronunciation assessment with reference text ----
    const scoredResult = await runPronunciationAssessment(audioBuffer, referenceText);

    // ---- PASS 2: Free-form recognition (no reference text) ----
    // This reveals what Azure actually heard without bias
    let freeFormText: string | null = null;
    try {
      freeFormText = await runFreeFormRecognition(audioBuffer);
      console.log('🔍 Free-form heard:', freeFormText);
    } catch (e: any) {
      console.warn('⚠️ Free-form pass failed (non-critical):', e.message);
    }

    // ---- Analyze Japanese-specific issues ----
    const japaneseAnalysis = analyzeJapaneseInterference(
      scoredResult,
      freeFormText,
      referenceText,
      knownProblems
    );

    // ---- Calculate final score ----
    const finalScore = calculateFinalScore(scoredResult, japaneseAnalysis);

    console.log('✅ Analysis complete!');
    console.log('   Azure raw accuracy:', scoredResult.rawAccuracy);
    console.log('   Final adjusted score:', finalScore);
    console.log('   Japanese issues found:', japaneseAnalysis.issues.length);

    const xpEarned = calculateXP(finalScore);

    return NextResponse.json({
      success: true,
      // Overall scores
      accuracy: finalScore,
      rawAccuracy: scoredResult.rawAccuracy,
      fluencyScore: scoredResult.fluencyScore,
      completenessScore: scoredResult.completenessScore,
      prosodyScore: scoredResult.prosodyScore,

      // What was recognized
      recognizedText: scoredResult.recognizedText,
      freeFormText,  // What Azure heard without reference bias

      // Detailed breakdowns
      phonemeScores: scoredResult.phonemeScores,
      wordScores: scoredResult.wordScores,

      // Japanese-specific feedback (NEW)
      japaneseIssues: japaneseAnalysis.issues,
      substitutionsDetected: japaneseAnalysis.substitutions,
      epenthesisDetected: japaneseAnalysis.epenthesisIssues,

      xpEarned,
      sentenceId,
    });
  } catch (error: any) {
    console.error('❌ Pronunciation analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze pronunciation', details: error.message },
      { status: 500 }
    );
  }
}

// ============================================================================
// TYPES
// ============================================================================

interface ScoredResult {
  rawAccuracy: number;
  recognizedText: string;
  phonemeScores: PhonemeScore[];
  wordScores: WordScore[];
  fluencyScore: number;
  completenessScore: number;
  prosodyScore: number;
  detailJson: any; // Raw Azure JSON for deep analysis
}

interface PhonemeScore {
  phoneme: string;
  score: number;
  errorType?: string;
  // Which word this phoneme belongs to (for context)
  parentWord?: string;
}

interface WordScore {
  word: string;
  score: number;
  errorType?: string;
  phonemes?: PhonemeScore[];
}

/** Optional hint you can attach to sentences in your curriculum DB */
interface WordProblemHint {
  word: string;
  expectedIPA: string;        // e.g., "θɪŋk"
  commonMistakeIPA?: string;  // e.g., "sɪŋk"
  issueType: string;          // e.g., "th_fronting"
  tip: string;                // e.g., "Place tongue between teeth for 'th'"
}

interface JapaneseIssue {
  type: 'substitution' | 'epenthesis' | 'rhythm' | 'word_error' | 'missing_distinction';
  word?: string;
  phoneme?: string;
  expected?: string;
  detected?: string;
  description: string;
  tip: string;
  severity: 'low' | 'medium' | 'high';
}

interface JapaneseAnalysis {
  issues: JapaneseIssue[];
  substitutions: Array<{ expected: string; detected: string; word: string }>;
  epenthesisIssues: string[];
  totalPenalty: number;
}

// ============================================================================
// PASS 1: Pronunciation assessment WITH reference text
// ============================================================================

async function runPronunciationAssessment(
  audioBuffer: Buffer,
  referenceText: string
): Promise<ScoredResult> {
  return new Promise((resolve, reject) => {
    console.log('🔧 Pass 1: Scored pronunciation assessment...');

    if (audioBuffer.length < 1000) {
      reject(new Error('Audio buffer too small. Please record for at least 1 second.'));
      return;
    }

    const speechConfig = sdk.SpeechConfig.fromSubscription(AZURE_SPEECH_KEY, AZURE_SPEECH_REGION);
    speechConfig.speechRecognitionLanguage = 'en-US';
    speechConfig.setProperty(sdk.PropertyId.SpeechServiceConnection_InitialSilenceTimeoutMs, '8000');
    speechConfig.setProperty(sdk.PropertyId.SpeechServiceConnection_EndSilenceTimeoutMs, '2000');

    const pronunciationConfig = new sdk.PronunciationAssessmentConfig(
      referenceText,
      sdk.PronunciationAssessmentGradingSystem.HundredMark,
      sdk.PronunciationAssessmentGranularity.Phoneme,
      true // enable miscue
    );
    pronunciationConfig.phonemeAlphabet = 'IPA';
    pronunciationConfig.enableProsodyAssessment = true;
    pronunciationConfig.enableMiscue = true;

    const audioConfig = createAudioConfig(audioBuffer);
    const recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);
    pronunciationConfig.applyTo(recognizer);

    recognizer.recognizeOnceAsync(
      (result) => {
        if (result.reason === sdk.ResultReason.RecognizedSpeech) {
          try {
            const pronunciationResult = sdk.PronunciationAssessmentResult.fromResult(result);
            const rawAccuracy = Math.round(pronunciationResult.accuracyScore);
            const fluencyScore = Math.round(pronunciationResult.fluencyScore);
            const completenessScore = Math.round(pronunciationResult.completenessScore);

            let prosodyScore = 0;
            try {
              // @ts-ignore - prosodyScore may not be in type definitions
              prosodyScore = Math.round(pronunciationResult.prosodyScore || 0);
            } catch { /* not available */ }

            const detailJson = JSON.parse(
              result.properties.getProperty(sdk.PropertyId.SpeechServiceResponse_JsonResult)
            );

            const phonemeScores: PhonemeScore[] = [];
            const wordScores: WordScore[] = [];

            if (detailJson.NBest?.[0]) {
              const words = detailJson.NBest[0].Words || [];
              words.forEach((word: any) => {
                const wordPhonemes: PhonemeScore[] = [];

                if (word.Phonemes) {
                  word.Phonemes.forEach((ph: any) => {
                    if (ph.PronunciationAssessment) {
                      const ps: PhonemeScore = {
                        phoneme: ph.Phoneme || '',
                        score: Math.round(ph.PronunciationAssessment.AccuracyScore || 0),
                        parentWord: word.Word,
                      };
                      phonemeScores.push(ps);
                      wordPhonemes.push(ps);
                    }
                  });
                }

                if (word.Word && word.PronunciationAssessment) {
                  wordScores.push({
                    word: word.Word,
                    score: Math.round(word.PronunciationAssessment.AccuracyScore || 0),
                    errorType: word.PronunciationAssessment.ErrorType || 'None',
                    phonemes: wordPhonemes,
                  });
                }
              });
            }

            recognizer.close();
            resolve({
              rawAccuracy,
              recognizedText: result.text,
              phonemeScores,
              wordScores,
              fluencyScore,
              completenessScore,
              prosodyScore,
              detailJson,
            });
          } catch (parseError: any) {
            recognizer.close();
            reject(new Error('Failed to parse results: ' + parseError.message));
          }
        } else if (result.reason === sdk.ResultReason.NoMatch) {
          recognizer.close();
          reject(new Error(
            'No speech detected. Please speak louder, hold the mic closer, and record for at least 2-3 seconds.'
          ));
        } else {
          const cancellation = sdk.CancellationDetails.fromResult(result);
          recognizer.close();
          reject(new Error('Recognition failed: ' + (cancellation.errorDetails || result.reason)));
        }
      },
      (error) => {
        recognizer.close();
        reject(new Error('Recognition error: ' + error));
      }
    );
  });
}

// ============================================================================
// PASS 2: Free-form recognition WITHOUT reference text
// This tells us what Azure actually heard, without reference-text bias
// ============================================================================

async function runFreeFormRecognition(audioBuffer: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    console.log('🔧 Pass 2: Free-form recognition (no reference)...');

    const speechConfig = sdk.SpeechConfig.fromSubscription(AZURE_SPEECH_KEY, AZURE_SPEECH_REGION);
    speechConfig.speechRecognitionLanguage = 'en-US';
    speechConfig.setProperty(sdk.PropertyId.SpeechServiceConnection_InitialSilenceTimeoutMs, '8000');
    speechConfig.setProperty(sdk.PropertyId.SpeechServiceConnection_EndSilenceTimeoutMs, '2000');

    const audioConfig = createAudioConfig(audioBuffer);
    const recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);

    recognizer.recognizeOnceAsync(
      (result) => {
        recognizer.close();
        if (result.reason === sdk.ResultReason.RecognizedSpeech) {
          resolve(result.text);
        } else {
          reject(new Error('Free-form recognition failed: ' + result.reason));
        }
      },
      (error) => {
        recognizer.close();
        reject(new Error('Free-form recognition error: ' + error));
      }
    );
  });
}

// ============================================================================
// JAPANESE INTERFERENCE ANALYSIS
// The core improvement: detect specific L1 transfer errors
// ============================================================================

function analyzeJapaneseInterference(
  scored: ScoredResult,
  freeFormText: string | null,
  referenceText: string,
  knownProblems?: WordProblemHint[]
): JapaneseAnalysis {
  const issues: JapaneseIssue[] = [];
  const substitutions: Array<{ expected: string; detected: string; word: string }> = [];
  const epenthesisIssues: string[] = [];
  let totalPenalty = 0;

  // ---- 1. Phoneme-level confusion detection ----
  scored.phonemeScores.forEach((ps) => {
    const confusionEntry = JAPANESE_CONFUSION_MAP[ps.phoneme];

    if (confusionEntry && ps.score < 75) {
      // This is a phoneme Japanese speakers struggle with AND the score is low
      const severity: 'low' | 'medium' | 'high' =
        ps.score < 40 ? 'high' : ps.score < 60 ? 'medium' : 'low';

      const penalty = (75 - ps.score) * 0.05 * confusionEntry.severityWeight;
      totalPenalty += penalty;

      issues.push({
        type: 'substitution',
        word: ps.parentWord,
        phoneme: ps.phoneme,
        expected: ps.phoneme,
        description: confusionEntry.description,
        tip: getPhonmeTip(ps.phoneme),
        severity,
      });
    }
  });

  // ---- 2. Free-form vs reference text comparison (word-level substitution detection) ----
  if (freeFormText) {
    const refWords = normalizeWords(referenceText);
    const heardWords = normalizeWords(freeFormText);

    // Use simple alignment to find mismatches
    const alignment = alignWords(refWords, heardWords);

    alignment.forEach(({ expected, heard }) => {
      if (expected && heard && expected !== heard) {
        // Check if this mismatch matches a known Japanese confusion pattern
        const substitutionType = classifySubstitution(expected, heard);

        if (substitutionType) {
          substitutions.push({ expected, detected: heard, word: expected });
          totalPenalty += substitutionType.penalty;

          issues.push({
            type: 'substitution',
            word: expected,
            detected: heard,
            expected: expected,
            description: substitutionType.description,
            tip: substitutionType.tip,
            severity: substitutionType.severity,
          });
        }
      }
    });
  }

  // ---- 3. Epenthesis detection (vowel insertion) ----
  if (freeFormText) {
    const refWords = normalizeWords(referenceText);
    const heardWords = normalizeWords(freeFormText);

    // If we hear MORE words/syllables than expected, epenthesis may be happening
    if (heardWords.length > refWords.length + 1) {
      epenthesisIssues.push(
        'Extra syllables detected — possible vowel insertion between consonants'
      );
      totalPenalty += 5;

      issues.push({
        type: 'epenthesis',
        description:
          'Extra syllables detected. Japanese speakers sometimes insert vowels between consonant clusters.',
        tip: 'Try to blend consonant clusters smoothly without adding extra vowel sounds between them.',
        severity: 'medium',
      });
    }

    // Check specific words for epenthesis patterns
    refWords.forEach((word) => {
      EPENTHESIS_PATTERNS.forEach(({ pattern, issue }) => {
        if (pattern.test(word)) {
          // Check if the heard version has extra syllables for this word
          const heardMatch = heardWords.find(
            (h) => h.startsWith(word.substring(0, 2)) && h.length > word.length + 1
          );
          if (heardMatch) {
            epenthesisIssues.push(`"${word}" → "${heardMatch}": ${issue}`);
            totalPenalty += 3;
          }
        }
      });
    });
  }

  // ---- 4. Rhythm / katakana-style detection ----
  if (scored.rawAccuracy > 70 && scored.fluencyScore < 60) {
    totalPenalty += 8;
    issues.push({
      type: 'rhythm',
      description:
        'Syllable-timed rhythm detected. English uses stress-timing, not syllable-timing like Japanese.',
      tip: 'Try to stress important words and reduce unstressed syllables. English has a "da-DA-da-DA" rhythm, not "DA-DA-DA-DA".',
      severity: 'medium',
    });
  }

  // ---- 5. Known problem words from curriculum (if provided) ----
  if (knownProblems) {
    knownProblems.forEach((hint) => {
      const wordScore = scored.wordScores.find(
        (w) => w.word.toLowerCase() === hint.word.toLowerCase()
      );

      if (wordScore && wordScore.score < 80) {
        issues.push({
          type: 'substitution',
          word: hint.word,
          expected: hint.expectedIPA,
          detected: hint.commonMistakeIPA,
          description: `Known difficulty: ${hint.issueType}`,
          tip: hint.tip,
          severity: wordScore.score < 50 ? 'high' : 'medium',
        });

        // Extra penalty for known problem words — these are what we're training!
        totalPenalty += (80 - wordScore.score) * 0.1;
      }
    });
  }

  // ---- 6. Word-level error analysis ----
  scored.wordScores.forEach((ws) => {
    if (ws.errorType && ws.errorType !== 'None') {
      totalPenalty += 5;
      issues.push({
        type: 'word_error',
        word: ws.word,
        description: `Word error: ${ws.errorType} on "${ws.word}"`,
        tip: `Practice the word "${ws.word}" in isolation, then in the full sentence.`,
        severity: 'high',
      });
    }
  });

  return { issues, substitutions, epenthesisIssues, totalPenalty };
}

// ============================================================================
// SCORING
// ============================================================================

function calculateFinalScore(scored: ScoredResult, analysis: JapaneseAnalysis): number {
  // Weighted base score
  let score = 0;
  score += scored.rawAccuracy * 0.45;
  score += (scored.fluencyScore || 0) * 0.25;
  score += (scored.completenessScore || 0) * 0.15;
  score += (scored.prosodyScore > 0 ? scored.prosodyScore : scored.rawAccuracy) * 0.15;

  // Apply Japanese-specific penalties (capped so we don't destroy the score)
  const cappedPenalty = Math.min(analysis.totalPenalty, 30);
  score -= cappedPenalty;

  return Math.max(0, Math.min(100, Math.round(score)));
}

function calculateXP(accuracy: number): number {
  if (accuracy >= 90) return 50;
  if (accuracy >= 80) return 30;
  if (accuracy >= 70) return 20;
  if (accuracy > 0) return 10;
  return 0;
}

// ============================================================================
// HELPERS
// ============================================================================

function createAudioConfig(audioBuffer: Buffer): sdk.AudioConfig {
  const isWavFormat =
    audioBuffer.length > 44 &&
    audioBuffer.toString('utf8', 0, 4) === 'RIFF' &&
    audioBuffer.toString('utf8', 8, 12) === 'WAVE';

  if (isWavFormat) {
    const pushStream = sdk.AudioInputStream.createPushStream(
      sdk.AudioStreamFormat.getWaveFormatPCM(16000, 16, 1)
    );
    pushStream.write(audioBuffer.buffer.slice(audioBuffer.byteOffset, audioBuffer.byteOffset + audioBuffer.byteLength) as ArrayBuffer);
    pushStream.close();
    return sdk.AudioConfig.fromStreamInput(pushStream);
  } else {
    const pushStream = sdk.AudioInputStream.createPushStream();
    pushStream.write(audioBuffer.buffer.slice(audioBuffer.byteOffset, audioBuffer.byteOffset + audioBuffer.byteLength) as ArrayBuffer);
    pushStream.close();
    return sdk.AudioConfig.fromStreamInput(pushStream);
  }
}

function normalizeWords(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s']/g, '')
    .split(/\s+/)
    .filter(Boolean);
}

/**
 * Simple word alignment using longest common subsequence approach.
 * Returns pairs of (expected, heard) where mismatches indicate errors.
 */
function alignWords(
  ref: string[],
  heard: string[]
): Array<{ expected: string | null; heard: string | null }> {
  const result: Array<{ expected: string | null; heard: string | null }> = [];

  let ri = 0;
  let hi = 0;

  while (ri < ref.length || hi < heard.length) {
    if (ri >= ref.length) {
      // Extra words heard (possible epenthesis or additions)
      result.push({ expected: null, heard: heard[hi] });
      hi++;
    } else if (hi >= heard.length) {
      // Words missing from heard
      result.push({ expected: ref[ri], heard: null });
      ri++;
    } else if (ref[ri] === heard[hi]) {
      // Match
      result.push({ expected: ref[ri], heard: heard[hi] });
      ri++;
      hi++;
    } else {
      // Mismatch — check if it's a skip or substitution
      // Look ahead to see if the heard word appears later in ref (insertion)
      const refLookAhead = ref.indexOf(heard[hi], ri + 1);
      const heardLookAhead = heard.indexOf(ref[ri], hi + 1);

      if (heardLookAhead !== -1 && (refLookAhead === -1 || heardLookAhead - hi < refLookAhead - ri)) {
        // The ref word appears later in heard — extra word was inserted
        result.push({ expected: null, heard: heard[hi] });
        hi++;
      } else if (refLookAhead !== -1) {
        // The heard word appears later in ref — word was skipped
        result.push({ expected: ref[ri], heard: null });
        ri++;
      } else {
        // True substitution
        result.push({ expected: ref[ri], heard: heard[hi] });
        ri++;
        hi++;
      }
    }
  }

  return result;
}

/**
 * Classify a word-level substitution as a known Japanese confusion pattern.
 * Returns null if it doesn't match a known pattern.
 */
function classifySubstitution(
  expected: string,
  heard: string
): { description: string; tip: string; severity: 'low' | 'medium' | 'high'; penalty: number } | null {
  const e = expected.toLowerCase();
  const h = heard.toLowerCase();

  // th → s/z (think→sink, three→sree, this→zis)
  if (e.includes('th') && (h.replace(/th/g, '') !== e.replace(/th/g, '') || h.includes('s') || h.includes('z'))) {
    if (
      e.replace(/th/g, 's') === h ||
      e.replace(/th/g, 'z') === h ||
      e.replace(/th/g, 'd') === h ||
      e.replace(/th/g, 't') === h ||
      levenshtein(e.replace(/th/g, 's'), h) <= 1 ||
      levenshtein(e.replace(/th/g, 'z'), h) <= 1
    ) {
      return {
        description: `"th" sound substituted: "${expected}" heard as "${heard}"`,
        tip: 'For "th", place the tip of your tongue between your upper and lower teeth and blow air gently.',
        severity: 'high',
        penalty: 8,
      };
    }
  }

  // r ↔ l (right→light, really→leally, light→right)
  if (
    e.replace(/r/g, 'l') === h ||
    e.replace(/l/g, 'r') === h ||
    levenshtein(e.replace(/r/g, 'l'), h) <= 1 ||
    levenshtein(e.replace(/l/g, 'r'), h) <= 1
  ) {
    return {
      description: `r/l confusion: "${expected}" heard as "${heard}"`,
      tip: 'For "r", curl your tongue back without touching the roof of your mouth. For "l", press your tongue tip firmly against the ridge behind your upper teeth.',
      severity: 'high',
      penalty: 8,
    };
  }

  // f → h (fun→hun, fish→hish)
  if (e.replace(/f/g, 'h') === h || levenshtein(e.replace(/f/g, 'h'), h) <= 1) {
    return {
      description: `f→h substitution: "${expected}" heard as "${heard}"`,
      tip: 'For "f", gently bite your lower lip with your upper teeth and blow air through. Japanese フ uses both lips — English "f" uses teeth on lip.',
      severity: 'high',
      penalty: 7,
    };
  }

  // v → b (very→berry, five→fibe)
  if (e.replace(/v/g, 'b') === h || levenshtein(e.replace(/v/g, 'b'), h) <= 1) {
    return {
      description: `v→b substitution: "${expected}" heard as "${heard}"`,
      tip: 'For "v", gently bite your lower lip with your upper teeth and vibrate. It\'s like "f" but with voicing.',
      severity: 'high',
      penalty: 7,
    };
  }

  // si → shi or vice versa (sit→shit, see→shee)
  if (e.replace(/si/g, 'shi') === h || e.replace(/s/g, 'sh') === h) {
    return {
      description: `s/sh confusion: "${expected}" heard as "${heard}"`,
      tip: 'Keep your tongue tip behind your lower teeth for "s". Pull it back slightly for "sh".',
      severity: 'medium',
      penalty: 5,
    };
  }

  // Generic close match — might be a pronunciation issue we haven't specifically mapped
  if (levenshtein(e, h) === 1) {
    return {
      description: `Close mismatch: "${expected}" heard as "${heard}"`,
      tip: `Practice pronouncing "${expected}" slowly, then at natural speed.`,
      severity: 'low',
      penalty: 3,
    };
  }

  return null;
}

/** Provides a pronunciation tip for a specific IPA phoneme */
function getPhonmeTip(phoneme: string): string {
  const tips: Record<string, string> = {
    'θ': 'Place tongue tip between teeth, blow air gently (voiceless "th").',
    'ð': 'Place tongue tip between teeth and vibrate vocal cords (voiced "th").',
    'ɹ': 'Curl tongue back, don\'t touch the roof of your mouth. Lips slightly rounded.',
    'l': 'Press tongue tip firmly against the ridge behind your upper teeth.',
    'f': 'Upper teeth on lower lip, blow air. Don\'t use both lips.',
    'v': 'Upper teeth on lower lip, blow air WITH voice. Like "f" but buzzing.',
    'æ': 'Open mouth wide, tongue low and forward. Like a mix of "ah" and "eh".',
    'ʌ': 'Short, relaxed "uh" sound. Mouth slightly open, tongue in the middle.',
    'ɪ': 'Short "i" — relax your tongue, don\'t tense it like Japanese イ.',
    'ʊ': 'Short "oo" — lips relaxed, not as rounded as Japanese ウ.',
    'ɝ': 'Hold the "er" sound by curling your tongue back. The r-sound is part of the vowel.',
    'ɚ': 'Quick, unstressed "er" — tongue slightly curled back.',
    'dʒ': 'Like "j" in "judge" — tongue presses against roof, then releases with voice.',
    'ʒ': 'Like "sh" but with voice — as in "measure" or "vision".',
    'ʃ': 'Tongue pulled back from teeth, lips slightly rounded, blow air.',
    'w': 'Round your lips tightly, then release. More lip rounding than Japanese わ.',
  };
  return tips[phoneme] || `Focus on accurate production of the /${phoneme}/ sound.`;
}

/** Simple Levenshtein distance for word comparison */
function levenshtein(a: string, b: string): number {
  const matrix: number[][] = [];
  for (let i = 0; i <= a.length; i++) matrix[i] = [i];
  for (let j = 0; j <= b.length; j++) matrix[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
      );
    }
  }
  return matrix[a.length][b.length];
}