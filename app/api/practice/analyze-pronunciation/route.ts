// app/api/practice/analyze-pronunciation/route.ts
// Analyze pronunciation with Japanese learner-specific settings

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import * as sdk from 'microsoft-cognitiveservices-speech-sdk';

const AZURE_SPEECH_KEY = process.env.AZURE_SPEECH_KEY!;
const AZURE_SPEECH_REGION = process.env.AZURE_SPEECH_REGION || 'westeurope';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const audioFile = formData.get('audio') as File;
    const referenceText = formData.get('referenceText') as string;
    const sentenceId = formData.get('sentenceId') as string;

    if (!audioFile || !referenceText) {
      return NextResponse.json(
        { error: 'Missing audio file or reference text' },
        { status: 400 }
      );
    }

    console.log('🎤 Analyzing pronunciation (Japanese learner mode)...');
    console.log('   Reference:', referenceText);

    const arrayBuffer = await audioFile.arrayBuffer();
    const audioBuffer = Buffer.from(arrayBuffer);

    const result = await analyzePronunciationForJapanese(audioBuffer, referenceText);

    console.log('✅ Analysis complete!');
    console.log('   Raw Score:', result.rawAccuracy);
    console.log('   Adjusted Score:', result.accuracy);
    console.log('   Fluency:', result.fluencyScore);
    console.log('   Completeness:', result.completenessScore);

    const xpEarned = calculateXP(result.accuracy);

    return NextResponse.json({
      success: true,
      accuracy: result.accuracy,
      rawAccuracy: result.rawAccuracy,
      recognizedText: result.recognizedText,
      phonemeScores: result.phonemeScores,
      wordScores: result.wordScores,
      fluencyScore: result.fluencyScore,
      completenessScore: result.completenessScore,
      prosodyScore: result.prosodyScore,
      xpEarned,
      sentenceId
    });

  } catch (error: any) {
    console.error('❌ Pronunciation analysis error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to analyze pronunciation', 
        details: error.message
      },
      { status: 500 }
    );
  }
}

// Add this to your analyze-pronunciation route.ts
// Replace the analyzePronunciationForJapanese function with this improved version

async function analyzePronunciationForJapanese(audioBuffer: Buffer, referenceText: string) {
    return new Promise<{
      accuracy: number;
      rawAccuracy: number;
      recognizedText: string;
      phonemeScores: Array<{ phoneme: string; score: number; errorType?: string }>;
      wordScores: Array<{ word: string; score: number; errorType?: string }>;
      fluencyScore: number;
      completenessScore: number;
      prosodyScore: number;
    }>((resolve, reject) => {
      
      console.log('🔧 Setting up Azure Speech SDK for Japanese learners...');
      console.log('   Audio buffer size:', audioBuffer.length, 'bytes');
      
      // Validate audio buffer
      if (audioBuffer.length < 1000) {
        reject(new Error('Audio buffer too small. Please record for at least 1 second.'));
        return;
      }
      
      const speechConfig = sdk.SpeechConfig.fromSubscription(
        AZURE_SPEECH_KEY,
        AZURE_SPEECH_REGION
      );
  
      speechConfig.speechRecognitionLanguage = 'en-US';
      
      // Set longer timeout for recognition
      speechConfig.setProperty(
        sdk.PropertyId.SpeechServiceConnection_InitialSilenceTimeoutMs,
        "8000" // Increased from 5000
      );
      speechConfig.setProperty(
        sdk.PropertyId.SpeechServiceConnection_EndSilenceTimeoutMs,
        "2000" // Increased from 1000
      );
  
      const pronunciationConfig = new sdk.PronunciationAssessmentConfig(
        referenceText,
        sdk.PronunciationAssessmentGradingSystem.HundredMark,
        sdk.PronunciationAssessmentGranularity.Phoneme,
        true
      );
  
      pronunciationConfig.phonemeAlphabet = "IPA";
      pronunciationConfig.enableProsodyAssessment = true;
      pronunciationConfig.enableMiscue = true;
  
      // IMPORTANT: Try to detect WAV format
      const isWavFormat = audioBuffer.length > 44 && 
                         audioBuffer.toString('utf8', 0, 4) === 'RIFF' &&
                         audioBuffer.toString('utf8', 8, 12) === 'WAVE';
      
      console.log('   Format detection:', isWavFormat ? 'WAV' : 'Unknown');
  
      let audioConfig: sdk.AudioConfig;
      
      if (isWavFormat) {
        // It's a WAV file, use push stream
        console.log('   Using WAV push stream');
        const pushStream = sdk.AudioInputStream.createPushStream(
          sdk.AudioStreamFormat.getWaveFormatPCM(16000, 16, 1)
        );
        pushStream.write(audioBuffer);
        pushStream.close();
        audioConfig = sdk.AudioConfig.fromStreamInput(pushStream);
      } else {
        // Unknown format, try default push stream
        console.log('   Using default push stream');
        const pushStream = sdk.AudioInputStream.createPushStream();
        pushStream.write(audioBuffer);
        pushStream.close();
        audioConfig = sdk.AudioConfig.fromStreamInput(pushStream);
      }
  
      const recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);
      
      pronunciationConfig.applyTo(recognizer);
  
      // Add event handlers for debugging
      recognizer.recognizing = (s, e) => {
        console.log('🎤 Recognizing:', e.result.text);
      };
  
      recognizer.canceled = (s, e) => {
        console.log('❌ Recognition canceled:', e.reason);
        if (e.reason === sdk.CancellationReason.Error) {
          console.log('   Error:', e.errorDetails);
        }
      };
  
      console.log('🎯 Starting recognition...');
  
      recognizer.recognizeOnceAsync(
        (result) => {
          console.log('📥 Recognition result reason:', result.reason);
          console.log('   Result text:', result.text);
          
          if (result.reason === sdk.ResultReason.RecognizedSpeech) {
            try {
              console.log('✅ Speech recognized:', result.text);
              
              const pronunciationResult = sdk.PronunciationAssessmentResult.fromResult(result);
              
              const rawAccuracy = Math.round(pronunciationResult.accuracyScore);
              const fluencyScore = Math.round(pronunciationResult.fluencyScore);
              const completenessScore = Math.round(pronunciationResult.completenessScore);
              
              let prosodyScore = 0;
              try {
                // @ts-ignore
                prosodyScore = Math.round(pronunciationResult.prosodyScore || 0);
              } catch {
                console.log('⚠️ Prosody score not available');
              }
  
              console.log('📊 Azure scores:', {
                accuracy: rawAccuracy,
                fluency: fluencyScore,
                completeness: completenessScore,
                prosody: prosodyScore
              });
  
              const phonemeScores: Array<{ phoneme: string; score: number; errorType?: string }> = [];
              const wordScores: Array<{ word: string; score: number; errorType?: string }> = [];
  
              const detailResult = JSON.parse(result.properties.getProperty(
                sdk.PropertyId.SpeechServiceResponse_JsonResult
              ));
  
              if (detailResult.NBest && detailResult.NBest[0]) {
                const words = detailResult.NBest[0].Words || [];
                
                words.forEach((word: any) => {
                  if (word.Word && word.PronunciationAssessment) {
                    const pa = word.PronunciationAssessment;
                    
                    wordScores.push({
                      word: word.Word,
                      score: Math.round(pa.AccuracyScore || 0),
                      errorType: pa.ErrorType || 'None'
                    });
                  }
  
                  if (word.Phonemes) {
                    word.Phonemes.forEach((phoneme: any) => {
                      if (phoneme.PronunciationAssessment) {
                        phonemeScores.push({
                          phoneme: phoneme.Phoneme || '',
                          score: Math.round(phoneme.PronunciationAssessment.AccuracyScore || 0)
                        });
                      }
                    });
                  }
                });
              }
  
              const adjustedAccuracy = calculateJapaneseAdjustedScore(
                rawAccuracy,
                fluencyScore,
                completenessScore,
                prosodyScore,
                phonemeScores,
                wordScores
              );
  
              console.log('✅ Adjusted for Japanese learners:', adjustedAccuracy);
  
              recognizer.close();
  
              resolve({
                accuracy: adjustedAccuracy,
                rawAccuracy,
                recognizedText: result.text,
                phonemeScores,
                wordScores,
                fluencyScore,
                completenessScore,
                prosodyScore
              });
  
            } catch (parseError: any) {
              console.error('❌ Parse error:', parseError);
              recognizer.close();
              reject(new Error('Failed to parse results: ' + parseError.message));
            }
          } else if (result.reason === sdk.ResultReason.NoMatch) {
            console.error('❌ No speech recognized');
            console.error('   Audio buffer size:', audioBuffer.length);
            console.error('   Reference text:', referenceText);
            
            const noMatchDetails = sdk.NoMatchDetails.fromResult(result);
            console.error('   NoMatch reason:', noMatchDetails.reason);
            
            recognizer.close();
            
            // Provide more helpful error message
            reject(new Error(
              'No speech detected. Please:\n' +
              '1. Speak louder and more clearly\n' +
              '2. Hold the microphone closer\n' +
              '3. Check your microphone is working\n' +
              '4. Record for at least 2-3 seconds'
            ));
          } else if (result.reason === sdk.ResultReason.Canceled) {
            const cancellation = sdk.CancellationDetails.fromResult(result);
            console.error('❌ Canceled:', cancellation.reason);
            console.error('   Error details:', cancellation.errorDetails);
            console.error('   Error code:', cancellation.ErrorCode);
            
            recognizer.close();
            
            // Map error codes to user-friendly messages
            let errorMessage = 'Recognition failed. ';
            if (cancellation.errorDetails.includes('audio')) {
              errorMessage += 'Audio format issue. Please try recording again.';
            } else if (cancellation.errorDetails.includes('timeout')) {
              errorMessage += 'Recognition timed out. Please speak immediately after pressing record.';
            } else {
              errorMessage += cancellation.errorDetails;
            }
            
            reject(new Error(errorMessage));
          } else {
            console.error('❌ Unknown reason:', result.reason);
            recognizer.close();
            reject(new Error(`Recognition failed with reason: ${result.reason}`));
          }
        },
        (error) => {
          console.error('❌ Recognition error:', error);
          recognizer.close();
          reject(new Error('Recognition error: ' + error));
        }
      );
    });
  }

/**
 * Adjust score for Japanese learners
 * Applies penalties for common Japanese pronunciation issues
 */
function calculateJapaneseAdjustedScore(
  accuracy: number,
  fluency: number,
  completeness: number,
  prosody: number,
  phonemeScores: Array<{ phoneme: string; score: number }>,
  wordScores: Array<{ word: string; score: number; errorType?: string }>
): number {
  
  // Start with weighted average
  let score = 0;
  
  // Accuracy is most important (50% weight)
  score += accuracy * 0.5;
  
  // Fluency matters for natural speech (25% weight)
  // Japanese speakers often speak in choppy, syllable-by-syllable manner
  if (fluency > 0) {
    score += fluency * 0.25;
  }
  
  // Completeness (15% weight) - did they say all words?
  if (completeness > 0) {
    score += completeness * 0.15;
  }
  
  // Prosody/rhythm (10% weight if available)
  if (prosody > 0) {
    score += prosody * 0.1;
  } else {
    // Redistribute to accuracy
    score += accuracy * 0.1;
  }

  // Apply penalties for problematic phonemes common in Japanese accent
  const japaneseProblematicPhonemes = ['r', 'l', 'θ', 'ð', 'v', 'f', 'æ', 'ʌ'];
  
  let problematicCount = 0;
  let problematicSum = 0;
  
  phonemeScores.forEach(ps => {
    const isProblematic = japaneseProblematicPhonemes.some(p => 
      ps.phoneme.toLowerCase().includes(p)
    );
    
    if (isProblematic) {
      problematicCount++;
      problematicSum += ps.score;
      
      // Extra penalty if score is low on problematic phoneme
      if (ps.score < 70) {
        score -= 3; // -3% per poorly pronounced problematic phoneme
      }
    }
  });
  
  // If average score on problematic phonemes is low, apply additional penalty
  if (problematicCount > 0) {
    const avgProblematicScore = problematicSum / problematicCount;
    if (avgProblematicScore < 65) {
      score -= 5; // Additional -5% for poor problematic phonemes overall
    }
  }

  // Penalize katakana-style rhythm (low fluency with decent accuracy = robotic)
  if (accuracy > 75 && fluency < 70) {
    score -= 8; // -8% for katakana-style pronunciation
    console.log('⚠️ Katakana-style detected: good accuracy but poor fluency');
  }

  // Penalize errors detected by Azure
  const errors = wordScores.filter(w => w.errorType && w.errorType !== 'None');
  if (errors.length > 0) {
    score -= errors.length * 5; // -5% per error
    console.log(`⚠️ ${errors.length} pronunciation errors detected`);
  }

  // Ensure score stays in valid range
  return Math.max(0, Math.min(100, Math.round(score)));
}

function calculateXP(accuracy: number): number {
  if (accuracy >= 90) return 50;
  if (accuracy >= 80) return 30;
  if (accuracy >= 70) return 20;
  if (accuracy > 0) return 10;
  return 0;
}