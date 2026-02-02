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



// Attempt to make the pronunciate function more Japanese-specific


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
//       sentenceId,
//       detectedSubstitutions: result.detectedSubstitutions,
//       azureErrors: result.azureErrors // NEW: Include Azure-detected errors
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
//       detectedSubstitutions: Array<{ word: string; expected: string; detected: string }>;
//       azureErrors: Array<{ word: string; phoneme: string; errorType: string; actualPhoneme?: string }>; // NEW
//     }>((resolve, reject) => {
      
//       console.log('🔧 Setting up Azure Speech SDK for Japanese learners...');
//       console.log('   Audio buffer size:', audioBuffer.length, 'bytes');
      
//       if (audioBuffer.length < 1000) {
//         reject(new Error('Audio buffer too small. Please record for at least 1 second.'));
//         return;
//       }
      
//       const speechConfig = sdk.SpeechConfig.fromSubscription(
//         AZURE_SPEECH_KEY,
//         AZURE_SPEECH_REGION
//       );
  
//       speechConfig.speechRecognitionLanguage = 'en-US';
      
//       // Enhanced settings for better error detection
//       speechConfig.setProperty(
//         sdk.PropertyId.SpeechServiceResponse_RequestDetailedResultTrueFalse,
//         "true"
//       );
      
//       speechConfig.setProperty(
//         sdk.PropertyId.SpeechServiceResponse_RequestWordLevelTimestamps,
//         "true"
//       );
      
//       speechConfig.setProperty(
//         sdk.PropertyId.SpeechServiceResponse_ProfanityOption,
//         "raw"
//       );
//       speechConfig.outputFormat = sdk.OutputFormat.Detailed;
      
//       speechConfig.setProperty(
//         sdk.PropertyId.SpeechServiceConnection_InitialSilenceTimeoutMs,
//         "8000"
//       );
//       speechConfig.setProperty(
//         sdk.PropertyId.SpeechServiceConnection_EndSilenceTimeoutMs,
//         "2000"
//       );
  
//       const pronunciationConfig = new sdk.PronunciationAssessmentConfig(
//         referenceText,
//         sdk.PronunciationAssessmentGradingSystem.HundredMark,
//         sdk.PronunciationAssessmentGranularity.Phoneme,
//         true
//       );
  
//       pronunciationConfig.phonemeAlphabet = "IPA";
//       pronunciationConfig.enableProsodyAssessment = true;
//       pronunciationConfig.enableMiscue = true; // CRITICAL for detecting substitutions
  
//       const isWavFormat = audioBuffer.length > 44 && 
//                          audioBuffer.toString('utf8', 0, 4) === 'RIFF' &&
//                          audioBuffer.toString('utf8', 8, 12) === 'WAVE';
      
//       console.log('   Format detection:', isWavFormat ? 'WAV' : 'Unknown');
  
//       let audioConfig: sdk.AudioConfig;
      
//       if (isWavFormat) {
//         console.log('   Using WAV push stream');
//         const pushStream = sdk.AudioInputStream.createPushStream(
//           sdk.AudioStreamFormat.getWaveFormatPCM(16000, 16, 1)
//         );
//         pushStream.write(audioBuffer);
//         pushStream.close();
//         audioConfig = sdk.AudioConfig.fromStreamInput(pushStream);
//       } else {
//         console.log('   Using default push stream');
//         const pushStream = sdk.AudioInputStream.createPushStream();
//         pushStream.write(audioBuffer);
//         pushStream.close();
//         audioConfig = sdk.AudioConfig.fromStreamInput(pushStream);
//       }
  
//       const recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);
      
//       pronunciationConfig.applyTo(recognizer);
  
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

//               // Log NBest results for debugging
//               if (detailResult.NBest && detailResult.NBest.length > 1) {
//                 console.log('📋 Alternative recognitions:');
//                 detailResult.NBest.forEach((alt: any, i: number) => {
//                   console.log(`   ${i + 1}. ${alt.Display} (confidence: ${alt.Confidence})`);
//                 });
//               }
  
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
//                           score: Math.round(phoneme.PronunciationAssessment.AccuracyScore || 0),
//                           errorType: phoneme.PronunciationAssessment.ErrorType || 'None'
//                         });
//                       }
//                     });
//                   }
//                 });
//               }
  
//               // NEW: Analyze Azure-detected errors
//               const azureErrors = analyzeAzureErrorTypes(detailResult, referenceText);
  
//               // Detect Japanese-specific phoneme substitutions
//               const detectedSubstitutions = detectPhonemeSubstitutions(
//                 referenceText,
//                 result.text,
//                 detailResult
//               );
  
//               // Calculate adjusted score with both detection methods
//               const adjustedAccuracy = calculateJapaneseAdjustedScore(
//                 rawAccuracy,
//                 fluencyScore,
//                 completenessScore,
//                 prosodyScore,
//                 phonemeScores,
//                 wordScores,
//                 detectedSubstitutions,
//                 azureErrors // NEW: Pass Azure errors
//               );
  
//               // Adjust word scores based on detected errors
//               const adjustedWordScores = adjustWordScores(
//                 wordScores,
//                 detectedSubstitutions,
//                 azureErrors
//               );

//               console.log('✅ Adjusted for Japanese learners:', adjustedAccuracy);

//               recognizer.close();

//               resolve({
//                 accuracy: adjustedAccuracy,
//                 rawAccuracy,
//                 recognizedText: result.text,
//                 phonemeScores,
//                 wordScores: adjustedWordScores, // Use adjusted scores instead
//                 fluencyScore,
//                 completenessScore,
//                 prosodyScore,
//                 detectedSubstitutions,
//                 azureErrors
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
//  * NEW: Analyze Azure-detected phoneme errors
//  */
// function analyzeAzureErrorTypes(
//   detailResult: any,
//   referenceText: string
// ): Array<{ word: string; phoneme: string; errorType: string; actualPhoneme?: string }> {
  
//   const errors: Array<{ word: string; phoneme: string; errorType: string; actualPhoneme?: string }> = [];
  
//   if (detailResult.NBest && detailResult.NBest[0]) {
//     const words = detailResult.NBest[0].Words || [];
    
//     words.forEach((word: any) => {
//       if (word.Phonemes) {
//         word.Phonemes.forEach((phoneme: any) => {
//           const pa = phoneme.PronunciationAssessment;
          
//           if (pa && pa.ErrorType !== 'None') {
//             console.log(`🔍 Phoneme error in "${word.Word}": ${phoneme.Phoneme} (${pa.ErrorType})`);
            
//             errors.push({
//               word: word.Word,
//               phoneme: phoneme.Phoneme,
//               errorType: pa.ErrorType,
//               actualPhoneme: pa.ActualPhoneme // If available
//             });
            
//             // Special handling for th sounds
//             if ((phoneme.Phoneme === 'θ' || phoneme.Phoneme === 'ð') && 
//                 pa.ErrorType === 'Mispronunciation') {
//               console.log(`⚠️ TH-sound mispronunciation detected in: ${word.Word}`);
//             }
//           }
//         });
//       }
//     });
//   }
  
//   return errors;
// }

// /**
//  * Detect common Japanese phoneme substitutions
//  */
// function detectPhonemeSubstitutions(
//   referenceText: string,
//   recognizedText: string,
//   detailResult: any
// ): Array<{ word: string; expected: string; detected: string }> {
  
//   const substitutions: Array<{ word: string; expected: string; detected: string }> = [];
  
//   // Common Japanese substitution patterns
//   const thWordPatterns = [
//     // Voiceless th (θ) -> s substitutions
//     { pattern: /\bthink/i, substitute: /\bsink/i, expected: 'think', detected: 'sink' },
//     { pattern: /\bthank/i, substitute: /\bsank/i, expected: 'thank', detected: 'sank' },
//     { pattern: /\bthing/i, substitute: /\bsing/i, expected: 'thing', detected: 'sing' },
//     { pattern: /\bthree/i, substitute: /\bsree|tree/i, expected: 'three', detected: 'sree/tree' },
//     { pattern: /\bthrow/i, substitute: /\bsrow/i, expected: 'throw', detected: 'srow' },
//     { pattern: /\bthought/i, substitute: /\bsought/i, expected: 'thought', detected: 'sought' },
//     { pattern: /\bthrough/i, substitute: /\bsrough/i, expected: 'through', detected: 'srough' },
//     { pattern: /\bthumb/i, substitute: /\bsum/i, expected: 'thumb', detected: 'sum' },
    
//     // Voiced th (ð) -> z/d substitutions
//     { pattern: /\bthe\b/i, substitute: /\bza|da/i, expected: 'the', detected: 'za/da' },
//     { pattern: /\bthat/i, substitute: /\bzat|dat/i, expected: 'that', detected: 'zat/dat' },
//     { pattern: /\bthis/i, substitute: /\bzis|dis/i, expected: 'this', detected: 'zis/dis' },
//     { pattern: /\bthese/i, substitute: /\bzeese|deese/i, expected: 'these', detected: 'zeese/deese' },
//     { pattern: /\bthose/i, substitute: /\bzoze|doze/i, expected: 'those', detected: 'zoze/doze' },
//     { pattern: /\bweather/i, substitute: /\bweazer|wedder/i, expected: 'weather', detected: 'weazer/wedder' },
//     { pattern: /\bmother/i, substitute: /\bmozer|modder/i, expected: 'mother', detected: 'mozer/modder' },
//     { pattern: /\bfather/i, substitute: /\bfazer|fadder/i, expected: 'father', detected: 'fazer/fadder' },
//     { pattern: /\bbrother/i, substitute: /\bbrozer|brodder/i, expected: 'brother', detected: 'brozer/brodder' },
//     { pattern: /\bwith\b/i, substitute: /\bwiz|wid/i, expected: 'with', detected: 'wiz/wid' },
//     { pattern: /\bthan/i, substitute: /\bzan|dan/i, expected: 'than', detected: 'zan/dan' },
//     { pattern: /\bthem/i, substitute: /\bzem|dem/i, expected: 'them', detected: 'zem/dem' },
//     { pattern: /\bthere/i, substitute: /\bzere|dere/i, expected: 'there', detected: 'zere/dere' },
//     { pattern: /\bthey/i, substitute: /\bzey|dey/i, expected: 'they', detected: 'zey/dey' },
    
//     // L -> R substitutions
//     { pattern: /\blive/i, substitute: /\brive/i, expected: 'live', detected: 'rive' },
//     { pattern: /\blight/i, substitute: /\bright/i, expected: 'light', detected: 'right' },
//     { pattern: /\blove/i, substitute: /\brove/i, expected: 'love', detected: 'rove' },
    
//     // R -> L substitutions
//     { pattern: /\bread/i, substitute: /\blead/i, expected: 'read', detected: 'lead' },
//     { pattern: /\bright/i, substitute: /\blight/i, expected: 'right', detected: 'light' },
    
//     // V -> B substitutions
//     { pattern: /\bvery/i, substitute: /\bbery/i, expected: 'very', detected: 'bery' },
//     { pattern: /\bvote/i, substitute: /\bboat/i, expected: 'vote', detected: 'boat' },
//   ];
  
//   // Check for substitution patterns
//   thWordPatterns.forEach(({ pattern, substitute, expected, detected }) => {
//     if (pattern.test(referenceText) && substitute.test(recognizedText)) {
//       console.log(`🔍 Detected substitution: ${expected} → ${detected}`);
//       substitutions.push({
//         word: expected,
//         expected: expected,
//         detected: detected
//       });
//     }
//   });
  
//   // Additional check using NBest alternatives
//   if (detailResult.NBest && detailResult.NBest.length > 1) {
//     const alternatives = detailResult.NBest.map((n: any) => n.Display?.toLowerCase() || '');
    
//     // Check if problematic alternatives appear
//     thWordPatterns.forEach(({ pattern, substitute, expected, detected }) => {
//       if (pattern.test(referenceText)) {
//         const substitutePattern = substitute.source.replace(/\\b/g, '').replace(/\|/g, '|');
//         if (alternatives.some((alt: string) => new RegExp(substitutePattern, 'i').test(alt))) {
//           console.log(`🔍 NBest alternative suggests substitution: ${expected} → ${detected}`);
//           if (!substitutions.some(s => s.expected === expected)) {
//             substitutions.push({
//               word: expected,
//               expected: expected,
//               detected: detected
//             });
//           }
//         }
//       }
//     });
//   }
  
//   return substitutions;
// }

// /**
//  * Adjust score for Japanese learners with enhanced error detection
//  */
// function calculateJapaneseAdjustedScore(
//   accuracy: number,
//   fluency: number,
//   completeness: number,
//   prosody: number,
//   phonemeScores: Array<{ phoneme: string; score: number }>,
//   wordScores: Array<{ word: string; score: number; errorType?: string }>,
//   detectedSubstitutions: Array<{ word: string; expected: string; detected: string }>,
//   azureErrors: Array<{ word: string; phoneme: string; errorType: string }> // NEW parameter
// ): number {
  
//   let score = 0;
  
//   score += accuracy * 0.5;
  
//   if (fluency > 0) {
//     score += fluency * 0.25;
//   }
  
//   if (completeness > 0) {
//     score += completeness * 0.15;
//   }
  
//   if (prosody > 0) {
//     score += prosody * 0.1;
//   } else {
//     score += accuracy * 0.1;
//   }

//   // NEW: Apply penalties for Azure-detected errors
//   if (azureErrors.length > 0) {
//     console.log(`⚠️ ${azureErrors.length} Azure-detected error(s)`);
    
//     azureErrors.forEach(error => {
//       console.log(`   - ${error.word}: ${error.phoneme} (${error.errorType})`);
      
//       // Heavy penalty for TH-sound errors
//       if (error.phoneme === 'θ' || error.phoneme === 'ð') {
//         if (error.errorType === 'Mispronunciation') {
//           score -= 15; // -15% for TH mispronunciation
//         } else if (error.errorType === 'Omission') {
//           score -= 12; // -12% for omitting TH
//         }
//       }
//       // Penalty for R/L errors
//       else if (error.phoneme.includes('r') || error.phoneme.includes('l')) {
//         score -= 10; // -10% for R/L errors
//       }
//       // Penalty for V/F errors
//       else if (error.phoneme === 'v' || error.phoneme === 'f') {
//         score -= 10; // -10% for V/F errors
//       }
//       // General mispronunciation penalty
//       else if (error.errorType === 'Mispronunciation') {
//         score -= 8; // -8% for other mispronunciations
//       }
//       // Penalty for omissions
//       else if (error.errorType === 'Omission') {
//         score -= 7; // -7% for omissions
//       }
//       // Penalty for insertions
//       else if (error.errorType === 'Insertion') {
//         score -= 5; // -5% for insertions
//       }
//     });
//   }

//   // Apply penalties for pattern-detected substitutions (as backup)
//   if (detectedSubstitutions.length > 0) {
//     console.log(`⚠️ ${detectedSubstitutions.length} pattern-detected substitution(s)`);
    
//     detectedSubstitutions.forEach(sub => {
//       console.log(`   - ${sub.expected} → ${sub.detected}`);
      
//       // Only apply if not already penalized by Azure errors
//       const alreadyPenalized = azureErrors.some(e => 
//         e.word.toLowerCase() === sub.expected.toLowerCase()
//       );
      
//       if (!alreadyPenalized) {
//         if (sub.expected.includes('th') || sub.expected.includes('θ') || sub.expected.includes('ð')) {
//           score -= 12; // -12% per th substitution (slightly less than Azure's 15%)
//         } else if (sub.expected.includes('l') || sub.expected.includes('r')) {
//           score -= 8; // -8% per l/r substitution
//         } else if (sub.expected.includes('v')) {
//           score -= 8; // -8% per v substitution
//         } else {
//           score -= 6; // -6% for other substitutions
//         }
//       }
//     });
//   }

//   // Analyze problematic phonemes
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
      
//       if (ps.score < 70) {
//         score -= 3;
//       }
//     }
//   });
  
//   if (problematicCount > 0) {
//     const avgProblematicScore = problematicSum / problematicCount;
//     if (avgProblematicScore < 65) {
//       score -= 5;
//     }
//   }

//   // Penalize katakana-style rhythm
//   if (accuracy > 75 && fluency < 70) {
//     score -= 8;
//     console.log('⚠️ Katakana-style detected: good accuracy but poor fluency');
//   }

//   // Penalize other word-level errors
//   const errors = wordScores.filter(w => w.errorType && w.errorType !== 'None');
//   if (errors.length > 0) {
//     score -= errors.length * 5;
//     console.log(`⚠️ ${errors.length} word-level error(s) detected`);
//   }

//   // Ensure score stays in valid range
//   const finalScore = Math.max(0, Math.min(100, Math.round(score)));
  
//   console.log('📊 Score calculation breakdown:');
//   console.log(`   Base weighted score: ${Math.round(accuracy * 0.5 + fluency * 0.25 + completeness * 0.15)}`);
//   console.log(`   Azure error penalties: -${azureErrors.length * 10}+`);
//   console.log(`   Pattern substitution penalties: -${detectedSubstitutions.length * 12}+`);
//   console.log(`   Final adjusted score: ${finalScore}`);
  
//   return finalScore;
// }

// function calculateXP(accuracy: number): number {
//   if (accuracy >= 90) return 50;
//   if (accuracy >= 80) return 30;
//   if (accuracy >= 70) return 20;
//   if (accuracy > 0) return 10;
//   return 0;
// }

// /**
//  * Adjust word scores based on detected substitutions and Azure errors
//  */
// function adjustWordScores(
//   wordScores: Array<{ word: string; score: number; errorType?: string }>,
//   detectedSubstitutions: Array<{ word: string; expected: string; detected: string }>,
//   azureErrors: Array<{ word: string; phoneme: string; errorType: string }>
// ): Array<{ word: string; score: number; errorType?: string; originalScore?: number }> {
  
//   console.log('🔧 ADJUSTING WORD SCORES...');
//   console.log('   Input word scores:', wordScores);
//   console.log('   Detected substitutions:', detectedSubstitutions);
//   console.log('   Azure errors:', azureErrors);
  
//   return wordScores.map(wordScore => {
//     let adjustedScore = wordScore.score;
//     let originalScore = wordScore.score;
//     let hasError = false;
    
//     console.log(`\n📝 Processing word: "${wordScore.word}" (original score: ${originalScore})`);
    
//     // Check if this word has a detected substitution
//     const substitution = detectedSubstitutions.find(
//       sub => sub.expected.toLowerCase() === wordScore.word.toLowerCase()
//     );
    
//     if (substitution) {
//       console.log(`   ✓ Found substitution: ${substitution.expected} → ${substitution.detected}`);
      
//       // Heavy penalty for TH substitutions
//       if (substitution.expected.toLowerCase().includes('th')) {
//         adjustedScore = Math.max(30, adjustedScore - 40); // Cap at 30%
//         console.log(`   → TH substitution penalty: ${originalScore} - 40 = ${adjustedScore}`);
//       } else {
//         adjustedScore = Math.max(40, adjustedScore - 30); // Cap at 40%
//         console.log(`   → Other substitution penalty: ${originalScore} - 30 = ${adjustedScore}`);
//       }
//       hasError = true;
//     } else {
//       console.log(`   ✗ No substitution found for "${wordScore.word}"`);
//     }
    
//     // Check if this word has Azure-detected errors
//     const azureError = azureErrors.find(
//       err => err.word.toLowerCase() === wordScore.word.toLowerCase()
//     );
    
//     if (azureError && !hasError) {
//       console.log(`   ✓ Found Azure error: ${azureError.phoneme} (${azureError.errorType})`);
      
//       // Apply penalty based on error type
//       if (azureError.phoneme === 'θ' || azureError.phoneme === 'ð') {
//         adjustedScore = Math.max(30, adjustedScore - 35);
//         console.log(`   → TH phoneme penalty: ${originalScore} - 35 = ${adjustedScore}`);
//       } else if (azureError.errorType === 'Mispronunciation') {
//         adjustedScore = Math.max(40, adjustedScore - 25);
//         console.log(`   → Mispronunciation penalty: ${originalScore} - 25 = ${adjustedScore}`);
//       } else if (azureError.errorType === 'Omission') {
//         adjustedScore = Math.max(35, adjustedScore - 30);
//         console.log(`   → Omission penalty: ${originalScore} - 30 = ${adjustedScore}`);
//       }
//       hasError = true;
//     } else if (azureError && hasError) {
//       console.log(`   ⚠ Azure error found but already penalized by substitution`);
//     } else {
//       console.log(`   ✗ No Azure error found for "${wordScore.word}"`);
//     }
    
//     const result = {
//       ...wordScore,
//       score: Math.round(adjustedScore),
//       originalScore: hasError ? originalScore : undefined,
//       errorType: hasError ? (wordScore.errorType || 'Detected') : wordScore.errorType
//     };
    
//     console.log(`   📊 Final result:`, result);
    
//     return result;
//   });
// }