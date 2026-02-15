// 'use client'

// import { useState, useEffect } from 'react'
// import * as React from 'react'
// import { useRouter } from 'next/navigation'
// import { 
//   Mic, Volume2, RotateCcw, Check, ChevronLeft, X,
//   Star, AlertCircle, Trophy, TrendingUp, Target, Award
// } from 'lucide-react'
// import { convertToWav } from '@/lib/audio-converter'
// import { getLessonConfig, type LessonAttempt } from '@/lib/lesson-config'

// interface Sentence {
//   id: string;
//   text: string;
//   phonemes: string[];
//   difficulty: string;
//   audioUrls: {
//     normal: string;
//     slow: string;
//   };
//   scenario: string;
// }

// export default function PracticeLessonPage({ params }: { params: Promise<{ lessonId: string }> }) {
//   const router = useRouter()
//   const [isRecording, setIsRecording] = useState(false)
//   const [currentStep, setCurrentStep] = useState(0)
//   const [showFeedback, setShowFeedback] = useState(false)
//   const [showSummary, setShowSummary] = useState(false)
//   const [lessonId, setLessonId] = useState<string>('')
//   const [sentence, setSentence] = useState<Sentence | null>(null)
//   const [isLoading, setIsLoading] = useState(true)
//   const [audioSpeed, setAudioSpeed] = useState<'normal' | 'slow'>('normal')
//   const [recordedAudio, setRecordedAudio] = useState<Blob | null>(null)
//   const [feedback, setFeedback] = useState<any>(null)

//   // Lesson tracking
//   const [lessonAttempts, setLessonAttempts] = useState<LessonAttempt[]>([])
//   const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0)
//   const [lessonStartTime, setLessonStartTime] = useState<number>(Date.now())

//   const [audio, setAudio] = useState<HTMLAudioElement | null>(null)

//   // Get lesson config
//   const lessonConfig = lessonId ? getLessonConfig(lessonId) : null
//   const totalSentences = lessonConfig?.sentencesPerLesson || 10

//   useEffect(() => {
//     console.log("Sentence: ", sentence);
//   }, [])

//   // Unwrap params on mount
//   React.useEffect(() => {
//     params.then(p => {
//       setLessonId(p.lessonId)
//       setLessonStartTime(Date.now())
//     })
//   }, [params])

//   // Fetch sentence when lessonId is available
//   useEffect(() => {
//     if (lessonId && currentSentenceIndex < totalSentences) {
//       fetchSentence(lessonId)
//     } else if (lessonId && currentSentenceIndex >= totalSentences) {
//       setShowSummary(true)
//     }
//   }, [lessonId, currentSentenceIndex])

//   const fetchSentence = async (scenario: string) => {
//     try {
//       setIsLoading(true)
//       const response = await fetch('/api/practice/next-sentence', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ scenario })
//       })

//       if (!response.ok) {
//         throw new Error('Failed to fetch sentence')
//       }

//       const data = await response.json()
//       setSentence(data.sentence)
//     } catch (error) {
//       console.error('Error fetching sentence:', error)
//       alert('Failed to load sentence. Please try again.')
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const handlePlayAudio = () => {
//     if (!sentence?.audioUrls) return

//     if (audio) {
//       audio.pause()
//       audio.currentTime = 0
//     }

//     const audioUrl = audioSpeed === 'normal' 
//       ? sentence.audioUrls.normal 
//       : sentence.audioUrls.slow

//     if (!audioUrl) {
//       alert('Audio not available')
//       return
//     }

//     const newAudio = new Audio(audioUrl)
//     newAudio.play()
//     setAudio(newAudio)
//   }

//   const handleRecordToggle = async () => {
//     if (isRecording) {
//       stopRecording()
//     } else {
//       startRecording()
//     }
//   }

//   const startRecording = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ 
//         audio: {
//           sampleRate: 16000,
//           channelCount: 1,
//           echoCancellation: true,
//           noiseSuppression: true,
//         } 
//       })
      
//       const mediaRecorder = new MediaRecorder(stream, {
//         mimeType: 'audio/webm'
//       })
      
//       const audioChunks: Blob[] = []

//       mediaRecorder.addEventListener('dataavailable', (event) => {
//         audioChunks.push(event.data)
//       })

//       const recordStartTime = Date.now();

//       mediaRecorder.addEventListener('stop', async () => {
//         const recordDuration = Date.now() - recordStartTime;

//         if (recordDuration < 1000) {
//           alert('Recording too short! Please speak for at least 2 seconds.');
//           stream.getTracks().forEach(track => track.stop());
//           return;
//         }

//         const audioBlob = new Blob(audioChunks, { type: 'audio/webm' })
        
//         try {
//           const wavBlob = await convertToWav(audioBlob)
//           console.log('✅ WAV conversion:', {
//             originalSize: audioBlob.size,
//             wavSize: wavBlob.size,
//             originalType: audioBlob.type,
//             wavType: wavBlob.type
//           });
//           setRecordedAudio(wavBlob)
//         } catch (error) {
//           console.error('Error converting audio:', error)
//           setRecordedAudio(audioBlob)
//         }
        
//         stream.getTracks().forEach(track => track.stop())
//       })

//       mediaRecorder.start()
//       setIsRecording(true)

//       // @ts-ignore
//       window.currentMediaRecorder = mediaRecorder
//     } catch (error) {
//       console.error('Error starting recording:', error)
//       alert('Could not access microphone. Please check permissions.')
//     }
//   }

//   const stopRecording = () => {
//     // @ts-ignore
//     const mediaRecorder = window.currentMediaRecorder
//     if (mediaRecorder && mediaRecorder.state !== 'inactive') {
//       mediaRecorder.stop()
//       setIsRecording(false)
//     }
//   }

//   const handleSubmit = async () => {
//     if (!recordedAudio || !sentence) return

//     setIsLoading(true)
    
//     try {
//       const formData = new FormData()
//       formData.append('audio', recordedAudio, 'recording.wav')
//       formData.append('referenceText', sentence.text)
//       formData.append('sentenceId', sentence.id)

//       const response = await fetch('/api/practice/analyze-pronunciation', {
//         method: 'POST',
//         body: formData
//       })

//       if (!response.ok) {
//         const errorData = await response.json()
//         throw new Error(errorData.error || 'Analysis failed')
//       }

//       const result = await response.json()
//       setFeedback(result)
//       setShowFeedback(true)

//       const phonemeScoresMap: Record<string, number> = {}
//       if (result.phonemeScores && result.phonemeScores.length > 0) {
//         result.phonemeScores.forEach((ps: any) => {
//           phonemeScoresMap[ps.phoneme] = ps.score
//         })
//       }

//       const attempt: LessonAttempt = {
//         sentenceId: sentence.id,
//         text: sentence.text,
//         accuracy: result.accuracy || 0,
//         phonemeScores: phonemeScoresMap,
//         wordScores: result.wordScores || [],
//         attemptNumber: lessonAttempts.filter(a => a.sentenceId === sentence.id).length + 1,
//       }

//       setLessonAttempts(prev => [...prev, attempt])

//       await fetch('/api/practice/record-attempt', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           sentenceId: sentence.id,
//           accuracy: result.accuracy || 0,
//           phonemeScores: phonemeScoresMap
//         })
//       })
//     } catch (error: any) {
//       console.error('Error analyzing pronunciation:', error)
//       alert(`Failed to analyze pronunciation: ${error.message}`)
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const handleNext = () => {
//     setCurrentSentenceIndex(prev => prev + 1)
//     setCurrentStep(0)
//     setShowFeedback(false)
//     setRecordedAudio(null)
//     setFeedback(null)
//   }

//   const handleTryAgain = () => {
//     setShowFeedback(false)
//     setRecordedAudio(null)
//     setIsRecording(false)
//   }

//   // Calculate lesson summary
//   const lessonSummary = React.useMemo(() => {
//     if (lessonAttempts.length === 0) return null

//     const totalAccuracy = lessonAttempts.reduce((sum, a) => sum + a.accuracy, 0)
//     const averageAccuracy = Math.round(totalAccuracy / lessonAttempts.length)
    
//     const totalXP = lessonAttempts.reduce((sum, a) => {
//       if (a.accuracy >= 90) return sum + 50
//       if (a.accuracy >= 80) return sum + 30
//       if (a.accuracy >= 70) return sum + 20
//       return sum + 10
//     }, 0)

//     const phonemeScores: Record<string, number[]> = {}
//     lessonAttempts.forEach(attempt => {
//       Object.entries(attempt.phonemeScores).forEach(([phoneme, score]) => {
//         if (!phonemeScores[phoneme]) phonemeScores[phoneme] = []
//         phonemeScores[phoneme].push(score)
//       })
//     })

//     const phonemeAverages = Object.entries(phonemeScores).map(([phoneme, scores]) => ({
//       phoneme,
//       averageScore: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
//     }))

//     const weakPhonemes = phonemeAverages.filter(p => p.averageScore < 75).sort((a, b) => a.averageScore - b.averageScore)
//     const strongPhonemes = phonemeAverages.filter(p => p.averageScore >= 85).sort((a, b) => b.averageScore - a.averageScore)

//     const timeSpent = Math.round((Date.now() - lessonStartTime) / 1000)

//     return {
//       lessonName: lessonConfig?.name || 'Practice',
//       totalSentences: lessonAttempts.length,
//       averageAccuracy,
//       totalXP,
//       weakPhonemes,
//       strongPhonemes,
//       timeSpent,
//     }
//   }, [lessonAttempts, lessonStartTime, lessonConfig])

//   if (isLoading && !sentence) {
//     return (
//       <div className="h-[80vh] md:h-[90vh] bg-base-200 flex items-center justify-center">
//         <div className="text-center">
//           <span className="loading loading-spinner loading-lg text-primary"></span>
//           <p className="mt-4">Loading lesson...</p>
//         </div>
//       </div>
//     )
//   }

//   // Show lesson summary - FIT IN VIEWPORT
//   if (showSummary && lessonSummary) {
//     return (
//       <div className="h-[80vh] md:h-[90vh] bg-base-200 overflow-hidden flex flex-col">
//         {/* Header */}
//         <div className="bg-base-100 border-b border-base-300 px-4 py-3">
//           <div className="max-w-4xl mx-auto flex items-center justify-between">
//             <h2 className="font-bold text-lg">Lesson Complete</h2>
//             <button onClick={() => router.push('/practice')} className="btn btn-ghost btn-sm btn-circle">
//               <X className="w-5 h-5" />
//             </button>
//           </div>
//         </div>

//         {/* Content - Scrollable */}
//         <div className="flex-1 overflow-y-auto">
//           <div className="max-w-4xl mx-auto px-4 py-6">
//             <div className="card bg-base-100 shadow-xl">
//               <div className="card-body p-6">
//                 {/* Trophy Header */}
//                 <div className="text-center mb-6">
//                   <div className="inline-block p-3 bg-warning/20 rounded-full mb-3">
//                     <Trophy className="w-12 h-12 text-warning" />
//                   </div>
//                   <h1 className="text-3xl font-bold mb-1">Lesson Complete!</h1>
//                   <p className="text-base-content/70">{lessonSummary.lessonName}</p>
//                 </div>

//                 {/* Stats Grid */}
//                 <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
//                   <div className="card bg-base-200">
//                     <div className="card-body p-3 text-center">
//                       <Target className="w-6 h-6 mx-auto mb-1 text-primary" />
//                       <p className="text-xl font-bold">{lessonSummary.averageAccuracy}%</p>
//                       <p className="text-xs text-base-content/60">Avg Score</p>
//                     </div>
//                   </div>
                  
//                   <div className="card bg-base-200">
//                     <div className="card-body p-3 text-center">
//                       <Star className="w-6 h-6 mx-auto mb-1 text-warning" />
//                       <p className="text-xl font-bold">+{lessonSummary.totalXP}</p>
//                       <p className="text-xs text-base-content/60">XP Earned</p>
//                     </div>
//                   </div>

//                   <div className="card bg-base-200">
//                     <div className="card-body p-3 text-center">
//                       <Check className="w-6 h-6 mx-auto mb-1 text-success" />
//                       <p className="text-xl font-bold">{lessonSummary.totalSentences}</p>
//                       <p className="text-xs text-base-content/60">Sentences</p>
//                     </div>
//                   </div>

//                   <div className="card bg-base-200">
//                     <div className="card-body p-3 text-center">
//                       <TrendingUp className="w-6 h-6 mx-auto mb-1 text-info" />
//                       <p className="text-xl font-bold">{Math.floor(lessonSummary.timeSpent / 60)}m</p>
//                       <p className="text-xs text-base-content/60">Time</p>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Strong & Weak Areas */}
//                 <div className="grid md:grid-cols-2 gap-4 mb-6">
//                   {lessonSummary.strongPhonemes.length > 0 && (
//                     <div>
//                       <h3 className="font-bold text-sm mb-2 flex items-center gap-2">
//                         <Award className="w-4 h-4 text-success" />
//                         Strong
//                       </h3>
//                       <div className="flex flex-wrap gap-1">
//                         {lessonSummary.strongPhonemes.slice(0, 3).map((p, i) => (
//                           <div key={i} className="badge badge-success badge-sm">
//                             {p.phoneme} {p.averageScore}%
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   )}

//                   {lessonSummary.weakPhonemes.length > 0 && (
//                     <div>
//                       <h3 className="font-bold text-sm mb-2 flex items-center gap-2">
//                         <AlertCircle className="w-4 h-4 text-warning" />
//                         Improve
//                       </h3>
//                       <div className="flex flex-wrap gap-1">
//                         {lessonSummary.weakPhonemes.slice(0, 3).map((p, i) => (
//                           <div key={i} className="badge badge-warning badge-sm">
//                             {p.phoneme} {p.averageScore}%
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   )}
//                 </div>

//                 {/* Actions */}
//                 <div className="flex gap-3">
//                   <button 
//                     onClick={() => router.push('/practice')}
//                     className="btn btn-outline flex-1 btn-sm"
//                   >
//                     Back
//                   </button>
//                   <button 
//                     onClick={() => {
//                       setShowSummary(false)
//                       setCurrentSentenceIndex(0)
//                       setLessonAttempts([])
//                       setLessonStartTime(Date.now())
//                     }}
//                     className="btn btn-primary flex-1 btn-sm"
//                   >
//                     Practice Again
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   if (!sentence) {
//     return (
//       <div className="h-[80vh] md:h-[90vh] bg-base-200 flex items-center justify-center">
//         <div className="text-center">
//           <p>No sentence available</p>
//           <button onClick={() => router.push('/practice')} className="btn btn-primary mt-4 btn-sm">
//             Back to Practice
//           </button>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="h-[80vh] md:h-[90vh] bg-base-200 flex flex-col overflow-hidden">
//       {/* Header with Progress - Fixed */}
//       <div className="bg-base-100 border-b border-base-300 flex-shrink-0">
//         <div className="max-w-4xl mx-auto px-4 py-3">
//           <div className="flex items-center justify-between mb-2">
//             <button 
//               onClick={() => router.push('/practice')}
//               className="btn btn-ghost btn-sm btn-circle"
//             >
//               <ChevronLeft className="w-5 h-5" />
//             </button>

//             <div className="text-center">
//               <h2 className="font-bold">{lessonConfig?.name || 'Practice'}</h2>
//               <p className="text-xs text-base-content/60">
//                 {currentSentenceIndex + 1}/{totalSentences}
//               </p>
//             </div>

//             <div className="badge badge-primary badge-sm">
//               {sentence.difficulty}
//             </div>
//           </div>

//           {/* Progress Bar */}
//           <progress 
//             className="progress progress-primary w-full h-2" 
//             value={currentSentenceIndex + 1} 
//             max={totalSentences}
//           />
//         </div>
//       </div>

//       {/* Main Content - Flex grow with centered content */}
//       <div className="flex-1 flex items-center justify-center px-4 py-6 overflow-hidden">
//         <div className="w-full max-w-3xl">
//           {!showFeedback ? (
//             <div className="card bg-base-100 shadow-xl">
//               <div className="card-body p-6 lg:p-8">
//                 {/* Step 1: Listen */}
//                 {currentStep === 0 && (
//                   <div className="text-center space-y-6">
//                     <div className="badge badge-primary">Step 1: Listen</div>
                    
//                     <h1 className="text-2xl lg:text-3xl font-bold">
//                       Listen to the native speaker
//                     </h1>

//                     <div className="card bg-primary/10 border-2 border-primary/30">
//                       <div className="card-body p-4">
//                         <p className="text-xl lg:text-2xl font-bold">
//                           "{sentence.text}"
//                         </p>
//                         <div className="flex items-center justify-center gap-2 mt-3 flex-wrap">
//                           <span className="text-xs">Target sounds:</span>
//                           {sentence.phonemes.map((phoneme, i) => (
//                             <span key={i} className="badge badge-primary badge-sm">
//                               {phoneme}
//                             </span>
//                           ))}
//                         </div>
//                       </div>
//                     </div>

//                     <div className="flex flex-col items-center gap-3">
//                       <button 
//                         onClick={handlePlayAudio}
//                         className="btn btn-circle btn-lg btn-primary"
//                       >
//                         <Volume2 className="w-7 h-7" />
//                       </button>
                      
//                       <div className="btn-group btn-group-sm">
//                         <button 
//                           className={`btn btn-xs ${audioSpeed === 'normal' ? 'btn-active' : ''}`}
//                           onClick={() => setAudioSpeed('normal')}
//                         >
//                           Normal
//                         </button>
//                         <button 
//                           className={`btn btn-xs ${audioSpeed === 'slow' ? 'btn-active' : ''}`}
//                           onClick={() => setAudioSpeed('slow')}
//                         >
//                           Slow
//                         </button>
//                       </div>
//                     </div>

//                     <button 
//                       onClick={() => setCurrentStep(1)}
//                       className="btn btn-primary gap-2"
//                     >
//                       Continue to Practice
//                       <ChevronLeft className="w-4 h-4 rotate-180" />
//                     </button>
//                   </div>
//                 )}

//                 {/* Step 2: Practice (Record) */}
//                 {currentStep === 1 && (
//                   <div className="text-center space-y-6">
//                     <div className="badge badge-warning">Step 2: Your Turn</div>
                    
//                     <h1 className="text-2xl lg:text-3xl font-bold">
//                       Now say it yourself!
//                     </h1>

//                     <div className="card bg-primary/10 border-2 border-primary/30">
//                       <div className="card-body p-4">
//                         <p className="text-xl lg:text-2xl font-bold">
//                           "{sentence.text}"
//                         </p>
//                       </div>
//                     </div>

//                     <div className="flex flex-col items-center gap-3">
//                       <button
//                         onClick={handleRecordToggle}
//                         disabled={isLoading}
//                         className={`btn btn-circle w-24 h-24 ${
//                           isRecording 
//                             ? 'btn-error animate-pulse' 
//                             : 'btn-primary'
//                         }`}
//                       >
//                         <Mic className="w-10 h-10" />
//                       </button>

//                       <p className="text-sm font-semibold">
//                         {isRecording ? 'Recording... Tap to stop' : 'Tap to record'}
//                       </p>

//                       {recordedAudio && !isRecording && (
//                         <div className="text-success font-semibold flex items-center gap-2 text-sm">
//                           <Check className="w-4 h-4" />
//                           Recording complete!
//                         </div>
//                       )}
//                     </div>

//                     {recordedAudio && !isRecording && (
//                       <div className="flex gap-3 justify-center">
//                         <button 
//                           onClick={handleTryAgain}
//                           className="btn btn-ghost btn-sm gap-2"
//                         >
//                           <RotateCcw className="w-4 h-4" />
//                           Try Again
//                         </button>
//                         <button 
//                           onClick={handleSubmit}
//                           disabled={isLoading}
//                           className="btn btn-primary btn-sm gap-2"
//                         >
//                           {isLoading ? (
//                             <>
//                               <span className="loading loading-spinner loading-xs" />
//                               Analyzing...
//                             </>
//                           ) : (
//                             <>
//                               Check Pronunciation
//                               <Check className="w-4 h-4" />
//                             </>
//                           )}
//                         </button>
//                       </div>
//                     )}
//                   </div>
//                 )}
//               </div>
//             </div>
//           ) : (
//             // Feedback Screen - Compact
//             <div className="card bg-base-100 shadow-xl max-h-full overflow-y-auto">
//               <div className="card-body p-6">
//                 <div className="text-center mb-4">
//                   <div className="radial-progress text-primary text-4xl font-bold mb-3" 
//                        style={{"--value": feedback?.accuracy || 0, "--size": "8rem", "--thickness": "0.75rem"} as React.CSSProperties}
//                        role="progressbar">
//                     {feedback?.accuracy || 0}%
//                   </div>
//                   <h2 className="text-xl font-bold">
//                     {(feedback?.accuracy || 0) >= 85 ? 'Excellent!' : (feedback?.accuracy || 0) >= 70 ? 'Good job!' : 'Keep practicing!'}
//                   </h2>
//                 </div>

//                 {feedback?.wordScores && feedback.wordScores.length > 0 && (
//                   <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
//                     <h3 className="font-bold text-sm">Word Scores:</h3>
//                     {feedback.wordScores.map((word: any, idx: number) => (
//                       <div key={idx} className="card bg-base-200">
//                         <div className="card-body p-3">
//                           <div className="flex items-center justify-between mb-1">
//                             <span className="font-bold text-sm">"{word.word}"</span>
//                             <span className={`font-bold text-sm ${
//                               word.score >= 85 ? 'text-success' :
//                               word.score >= 70 ? 'text-warning' : 'text-error'
//                             }`}>
//                               {word.score}%
//                             </span>
//                           </div>
//                           <progress 
//                             className={`progress progress-sm w-full ${
//                               word.score >= 85 ? 'progress-success' :
//                               word.score >= 70 ? 'progress-warning' : 'progress-error'
//                             }`}
//                             value={word.score} 
//                             max="100"
//                           />
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 )}

//                 {(feedback?.xpEarned || 0) > 0 && (
//                   <div className="card bg-warning/20 border border-warning/30 mb-4">
//                     <div className="card-body p-3 flex-row items-center justify-center gap-2">
//                       <Star className="w-6 h-6 text-warning" />
//                       <div>
//                         <p className="font-bold text-sm">+{feedback.xpEarned} XP</p>
//                       </div>
//                     </div>
//                   </div>
//                 )}

//                 <div className="flex gap-3">
//                   <button 
//                     onClick={handleTryAgain}
//                     className="btn btn-outline flex-1 btn-sm gap-2"
//                   >
//                     <RotateCcw className="w-4 h-4" />
//                     Try Again
//                   </button>
//                   <button 
//                     onClick={handleNext}
//                     className="btn btn-primary flex-1 btn-sm gap-2"
//                   >
//                     {currentSentenceIndex + 1 >= totalSentences ? 'Finish' : 'Next'}
//                     <ChevronLeft className="w-4 h-4 rotate-180" />
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   )
// }

// app/[locale]/(dashboard)/practice/[lessonId]/page.tsx
'use client'

import { useState, useEffect, useMemo } from 'react'
import * as React from 'react'
import { useRouter } from 'next/navigation'
import {
  Mic, Volume2, RotateCcw, Check, ChevronLeft, X,
  Star, AlertCircle, Trophy, TrendingUp, Target, Award,
  ChevronRight, Play
} from 'lucide-react'
import { convertToWav } from '@/lib/audio-converter'
import { getLessonConfig, type LessonAttempt } from '@/lib/lesson-config'
import { Mascot } from '@/components/global/Mascot'

/* ═══════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════ */
interface Sentence {
  id: string; text: string; phonemes: string[]; difficulty: string
  audioUrls: { normal: string; slow: string }; scenario: string
}

/* ═══════════════════════════════════════════
   Heights — account for mobile top nav (3.5rem) and desktop (4rem).
   Mobile bottom nav is hidden during lessons.
   ═══════════════════════════════════════════ */
const VIEW_H_MOBILE = 'h-[calc(100dvh-10rem)]'
const VIEW_H_DESKTOP = 'lg:h-[calc(100dvh-6rem)]'
const VIEW_H = `${VIEW_H_MOBILE} ${VIEW_H_DESKTOP}`

/* ═══════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════ */
export default function PracticeLessonPage({ params }: { params: Promise<{ lessonId: string }> }) {
  const router = useRouter()

  const [lessonId, setLessonId] = useState('')
  const [sentence, setSentence] = useState<Sentence | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isRecording, setIsRecording] = useState(false)
  const [currentStep, setCurrentStep] = useState(0) // 0=listen, 1=record
  const [showFeedback, setShowFeedback] = useState(false)
  const [showSummary, setShowSummary] = useState(false)
  const [audioSpeed, setAudioSpeed] = useState<'normal' | 'slow'>('normal')
  const [recordedAudio, setRecordedAudio] = useState<Blob | null>(null)
  const [feedback, setFeedback] = useState<any>(null)
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null)

  const [lessonAttempts, setLessonAttempts] = useState<LessonAttempt[]>([])
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0)
  const [lessonStartTime, setLessonStartTime] = useState(Date.now())

  const lessonConfig = lessonId ? getLessonConfig(lessonId) : null
  const totalSentences = lessonConfig?.sentencesPerLesson || 10
  const progressPercent = ((currentSentenceIndex + 1) / totalSentences) * 100

  // Unwrap params
  React.useEffect(() => { params.then(p => { setLessonId(p.lessonId); setLessonStartTime(Date.now()) }) }, [params])

  // Fetch sentence
  useEffect(() => {
    if (lessonId && currentSentenceIndex < totalSentences) fetchSentence(lessonId)
    else if (lessonId && currentSentenceIndex >= totalSentences) setShowSummary(true)
  }, [lessonId, currentSentenceIndex])

  const fetchSentence = async (scenario: string) => {
    try {
      setIsLoading(true)
      const res = await fetch('/api/practice/next-sentence', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ scenario }) })
      if (!res.ok) throw new Error('Failed')
      setSentence((await res.json()).sentence)
    } catch { alert('Failed to load sentence.') }
    finally { setIsLoading(false) }
  }

  const handlePlayAudio = () => {
    if (!sentence?.audioUrls) return
    if (audio) { audio.pause(); audio.currentTime = 0 }
    const url = audioSpeed === 'normal' ? sentence.audioUrls.normal : sentence.audioUrls.slow
    if (!url) { alert('Audio not available'); return }
    const a = new Audio(url); a.play(); setAudio(a)
  }

  const handleRecordToggle = () => { isRecording ? stopRecording() : startRecording() }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: { sampleRate: 16000, channelCount: 1, echoCancellation: true, noiseSuppression: true } })
      const mr = new MediaRecorder(stream, { mimeType: 'audio/webm' })
      const chunks: Blob[] = []
      const t0 = Date.now()
      mr.addEventListener('dataavailable', e => chunks.push(e.data))
      mr.addEventListener('stop', async () => {
        if (Date.now() - t0 < 1000) { alert('Too short! Speak for at least 2 seconds.'); stream.getTracks().forEach(t => t.stop()); return }
        const blob = new Blob(chunks, { type: 'audio/webm' })
        try { setRecordedAudio(await convertToWav(blob)) } catch { setRecordedAudio(blob) }
        stream.getTracks().forEach(t => t.stop())
      })
      mr.start(); setIsRecording(true)
      // @ts-ignore
      window.currentMediaRecorder = mr
    } catch { alert('Could not access microphone.') }
  }

  const stopRecording = () => {
    // @ts-ignore
    const mr = window.currentMediaRecorder
    if (mr && mr.state !== 'inactive') { mr.stop(); setIsRecording(false) }
  }

  const handleSubmit = async () => {
    if (!recordedAudio || !sentence) return
    setIsLoading(true)
    try {
      const fd = new FormData()
      fd.append('audio', recordedAudio, 'recording.wav')
      fd.append('referenceText', sentence.text)
      fd.append('sentenceId', sentence.id)
      const res = await fetch('/api/practice/analyze-pronunciation', { method: 'POST', body: fd })
      if (!res.ok) { const e = await res.json(); throw new Error(e.error || 'Failed') }
      const result = await res.json()
      setFeedback(result); setShowFeedback(true)
      const pm: Record<string, number> = {}
      result.phonemeScores?.forEach((ps: any) => { pm[ps.phoneme] = ps.score })
      setLessonAttempts(prev => [...prev, { sentenceId: sentence.id, text: sentence.text, accuracy: result.accuracy || 0, phonemeScores: pm, wordScores: result.wordScores || [], attemptNumber: prev.filter(a => a.sentenceId === sentence.id).length + 1 }])
      await fetch('/api/practice/record-attempt', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ sentenceId: sentence.id, accuracy: result.accuracy || 0, phonemeScores: pm }) })
    } catch (e: any) { alert(`Analysis failed: ${e.message}`) }
    finally { setIsLoading(false) }
  }

  const handleNext = () => { setCurrentSentenceIndex(p => p + 1); setCurrentStep(0); setShowFeedback(false); setRecordedAudio(null); setFeedback(null) }
  const handleTryAgain = () => { setShowFeedback(false); setRecordedAudio(null); setIsRecording(false) }

  const lessonSummary = useMemo(() => {
    if (!lessonAttempts.length) return null
    const avg = Math.round(lessonAttempts.reduce((s, a) => s + a.accuracy, 0) / lessonAttempts.length)
    const xp = lessonAttempts.reduce((s, a) => s + (a.accuracy >= 90 ? 50 : a.accuracy >= 80 ? 30 : a.accuracy >= 70 ? 20 : 10), 0)
    const ps: Record<string, number[]> = {}
    lessonAttempts.forEach(a => Object.entries(a.phonemeScores).forEach(([p, s]) => { if (!ps[p]) ps[p] = []; ps[p].push(s) }))
    const pa = Object.entries(ps).map(([p, s]) => ({ phoneme: p, avg: Math.round(s.reduce((a, b) => a + b, 0) / s.length) }))
    return { name: lessonConfig?.name || 'Practice', total: lessonAttempts.length, avg, xp, weak: pa.filter(p => p.avg < 75).sort((a, b) => a.avg - b.avg), strong: pa.filter(p => p.avg >= 85).sort((a, b) => b.avg - a.avg), time: Math.round((Date.now() - lessonStartTime) / 1000) }
  }, [lessonAttempts, lessonStartTime, lessonConfig])

  const accColor = (a: number) => a >= 85 ? 'success' : a >= 70 ? 'warning' : 'error'

  /* ═══════════════════════════════════════════
     LOADING
     ═══════════════════════════════════════════ */
  if (isLoading && !sentence) {
    return (
      <div className={`${VIEW_H} flex flex-col items-center justify-center gap-4 bg-base-100`}>
        <Mascot size={88} expression="thinking" className="animate-float opacity-70" />
        <span className="loading loading-dots loading-lg text-primary" />
        <p className="text-base text-base-content/50 font-semibold">Loading lesson...</p>
      </div>
    )
  }

  /* ═══════════════════════════════════════════
     SUMMARY — fits in viewport, no scroll
     ═══════════════════════════════════════════ */
  if (showSummary && lessonSummary) {
    const expr = lessonSummary.avg >= 85 ? 'cheering' : lessonSummary.avg >= 70 ? 'excited' : 'happy'
    return (
      <div className={`${VIEW_H} flex flex-col bg-base-100`}>
        {/* Header */}
        <div className="bg-base-100 border-b border-primary/8 px-4 py-3 flex-shrink-0">
          <div className="max-w-xl mx-auto flex items-center justify-between">
            <h2 className="font-extrabold text-lg text-base-content">Lesson Complete</h2>
            <button onClick={() => router.push('/practice')} className="btn btn-ghost btn-sm btn-circle"><X className="w-5 h-5" /></button>
          </div>
        </div>

        {/* Body — centered, no scroll */}
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="w-full max-w-xl">
            {/* Celebration */}
            <div className="text-center mb-5">
              <Mascot size={80} expression={expr as any} className="mx-auto mb-2 drop-shadow-md animate-bounce-gentle" />
              <h1 className="text-2xl lg:text-3xl font-extrabold text-base-content">
                {lessonSummary.avg >= 85 ? 'Amazing! 🌸' : lessonSummary.avg >= 70 ? 'Great job!' : 'Keep going!'}
              </h1>
              <p className="text-sm lg:text-base text-base-content/45">{lessonSummary.name}</p>
            </div>

            {/* Stats — 4 across */}
            <div className="grid grid-cols-4 gap-2 lg:gap-3 mb-5">
              {[
                { icon: Target, val: `${lessonSummary.avg}%`, label: 'Score', c: 'text-primary', bg: 'bg-primary/8' },
                { icon: Star, val: `+${lessonSummary.xp}`, label: 'XP', c: 'text-warning', bg: 'bg-warning/8' },
                { icon: Check, val: `${lessonSummary.total}`, label: 'Done', c: 'text-success', bg: 'bg-success/8' },
                { icon: TrendingUp, val: `${Math.floor(lessonSummary.time / 60)}m`, label: 'Time', c: 'text-info', bg: 'bg-info/8' },
              ].map((s, i) => {
                const I = s.icon
                return (
                  <div key={i} className="card bg-base-100 border border-base-content/6">
                    <div className="card-body p-2.5 lg:p-3 items-center text-center gap-1">
                      <div className={`w-9 h-9 lg:w-10 lg:h-10 rounded-xl ${s.bg} flex items-center justify-center`}><I className={`w-4 h-4 lg:w-5 lg:h-5 ${s.c}`} /></div>
                      <span className="text-lg lg:text-xl font-extrabold text-base-content leading-none">{s.val}</span>
                      <span className="text-[10px] lg:text-xs font-semibold text-base-content/35 uppercase">{s.label}</span>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Phonemes — side by side */}
            {(lessonSummary.strong.length > 0 || lessonSummary.weak.length > 0) && (
              <div className="grid grid-cols-2 gap-3 mb-5">
                {lessonSummary.strong.length > 0 && (
                  <div className="bg-success/5 border border-success/12 rounded-2xl p-3">
                    <h3 className="font-bold text-xs lg:text-sm text-success flex items-center gap-1.5 mb-2"><Award className="w-4 h-4" /> Strong</h3>
                    <div className="flex flex-wrap gap-1">{lessonSummary.strong.slice(0, 3).map((p, i) => <span key={i} className="text-xs font-bold bg-success/10 text-success px-2 py-0.5 rounded-full">{p.phoneme} {p.avg}%</span>)}</div>
                  </div>
                )}
                {lessonSummary.weak.length > 0 && (
                  <div className="bg-warning/5 border border-warning/12 rounded-2xl p-3">
                    <h3 className="font-bold text-xs lg:text-sm text-warning flex items-center gap-1.5 mb-2"><AlertCircle className="w-4 h-4" /> Improve</h3>
                    <div className="flex flex-wrap gap-1">{lessonSummary.weak.slice(0, 3).map((p, i) => <span key={i} className="text-xs font-bold bg-warning/10 text-warning px-2 py-0.5 rounded-full">{p.phoneme} {p.avg}%</span>)}</div>
                  </div>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <button onClick={() => router.push('/practice')} className="btn btn-ghost flex-1 border border-base-content/8">Back</button>
              <button onClick={() => { setShowSummary(false); setCurrentSentenceIndex(0); setLessonAttempts([]); setLessonStartTime(Date.now()) }} className="btn btn-primary flex-1 shadow-sm shadow-primary/15 gap-1.5"><RotateCcw className="w-4 h-4" /> Again</button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  /* ═══════════════════════════════════════════
     NO SENTENCE
     ═══════════════════════════════════════════ */
  if (!sentence) {
    return (
      <div className={`${VIEW_H} flex flex-col items-center justify-center gap-4 bg-base-100`}>
        <Mascot size={80} expression="thinking" className="opacity-60" />
        <p className="text-base text-base-content/50">No sentence available</p>
        <button onClick={() => router.push('/practice')} className="btn btn-primary">Back to Practice</button>
      </div>
    )
  }

  /* ═══════════════════════════════════════════
     MAIN PRACTICE VIEW — absolute zero scroll
     Layout: fixed header → flex-1 centered content
     ═══════════════════════════════════════════ */
  return (
    <div className={`${VIEW_H} flex flex-col bg-base-100 overflow-hidden`}>

      {/* ─── Header + Progress ─── */}
      <div className="bg-base-100 border-b border-primary/8 flex-shrink-0">
        <div className="max-w-xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <button onClick={() => router.push('/practice')} className="btn btn-ghost btn-sm btn-circle"><ChevronLeft className="w-5 h-5" /></button>
            <div className="text-center">
              <h2 className="font-bold text-base lg:text-lg text-base-content">{lessonConfig?.name || 'Practice'}</h2>
              <p className="text-xs lg:text-sm text-base-content/40">{currentSentenceIndex + 1} of {totalSentences}</p>
            </div>
            <span className={`badge badge-sm font-semibold ${sentence.difficulty === 'Very Hard' ? 'badge-error' : sentence.difficulty === 'Hard' ? 'badge-warning' : 'badge-info'}`}>{sentence.difficulty}</span>
          </div>
          <div className="w-full bg-base-200 rounded-full h-2.5 overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-all duration-500" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>
      </div>

      {/* ─── Content — flex-1 centered, overflow hidden ─── */}
      <div className="flex-1 flex items-center justify-center px-4 overflow-hidden">
        <div className="w-full max-w-xl">

          {!showFeedback ? (
            /* ═══ LISTEN / RECORD ═══ */
            <div className="text-center">

              {/* STEP 1: LISTEN */}
              {currentStep === 0 && (
                <>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/8 border border-primary/12 rounded-full text-xs lg:text-sm font-bold text-primary mb-4">
                    <Volume2 className="w-3.5 h-3.5" /> Step 1: Listen
                  </span>

                  <h2 className="text-xl lg:text-2xl font-extrabold text-base-content mb-4">
                    Listen to the native speaker
                  </h2>

                  {/* Sentence */}
                  <div className="card bg-primary/5 border border-primary/12 mb-5">
                    <div className="card-body p-4 lg:p-5">
                      <p className="text-xl lg:text-2xl font-bold text-base-content leading-relaxed">
                        &ldquo;{sentence.text}&rdquo;
                      </p>
                      <div className="flex flex-wrap items-center justify-center gap-1.5 mt-2">
                        <span className="text-xs text-base-content/35">Target:</span>
                        {sentence.phonemes.map((p, i) => (
                          <span key={i} className="text-xs font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full">{p}</span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Play + Speed */}
                  <div className="flex flex-col items-center gap-3 mb-5">
                    <button onClick={handlePlayAudio} className="btn btn-circle btn-lg btn-primary shadow-md shadow-primary/20">
                      <Play className="w-7 h-7 ml-0.5" />
                    </button>
                    <div className="flex gap-1">
                      {(['normal', 'slow'] as const).map(s => (
                        <button key={s} className={`btn btn-sm ${audioSpeed === s ? 'btn-primary' : 'btn-ghost border border-base-content/8'}`} onClick={() => setAudioSpeed(s)}>
                          {s === 'normal' ? 'Normal' : 'Slow'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button onClick={() => setCurrentStep(1)} className="btn btn-primary gap-1.5 shadow-sm shadow-primary/15">
                    My Turn <ChevronRight className="w-4 h-4" />
                  </button>
                </>
              )}

              {/* STEP 2: RECORD */}
              {currentStep === 1 && (
                <>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-accent/8 border border-accent/12 rounded-full text-xs lg:text-sm font-bold text-accent mb-4">
                    <Mic className="w-3.5 h-3.5" /> Step 2: Your Turn
                  </span>

                  <h2 className="text-xl lg:text-2xl font-extrabold text-base-content mb-4">
                    Now say it yourself!
                  </h2>

                  {/* Sentence */}
                  <div className="card bg-primary/5 border border-primary/12 mb-5">
                    <div className="card-body p-4 lg:p-5">
                      <p className="text-xl lg:text-2xl font-bold text-base-content leading-relaxed">
                        &ldquo;{sentence.text}&rdquo;
                      </p>
                    </div>
                  </div>

                  {/* Record button */}
                  <div className="flex flex-col items-center gap-3 mb-5">
                    <button
                      onClick={handleRecordToggle}
                      disabled={isLoading}
                      className={`btn btn-circle w-24 h-24 shadow-lg transition-all duration-300 ${
                        isRecording ? 'btn-error animate-pulse shadow-error/30 scale-110' : 'btn-primary shadow-primary/20 hover:scale-105'
                      }`}
                    >
                      <Mic className="w-10 h-10" />
                    </button>
                    <p className="text-sm font-semibold text-base-content/50">
                      {isRecording ? 'Recording... tap to stop' : 'Tap to record'}
                    </p>
                    {recordedAudio && !isRecording && (
                      <span className="text-sm text-success font-bold flex items-center gap-1"><Check className="w-4 h-4" /> Recording complete!</span>
                    )}
                  </div>

                  {recordedAudio && !isRecording && (
                    <div className="flex gap-2 justify-center">
                      <button onClick={handleTryAgain} className="btn btn-ghost gap-1.5 border border-base-content/8"><RotateCcw className="w-4 h-4" /> Redo</button>
                      <button onClick={handleSubmit} disabled={isLoading} className="btn btn-primary gap-1.5 shadow-sm shadow-primary/15">
                        {isLoading ? <><span className="loading loading-spinner loading-sm" /> Analyzing...</> : <><Check className="w-4 h-4" /> Check</>}
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>

          ) : (
            /* ═══ FEEDBACK — compact, no scroll ═══ */
            <div className="text-center">
              {/* Mascot + Score */}
              <Mascot
                size={60}
                expression={(feedback?.accuracy || 0) >= 85 ? 'cheering' : (feedback?.accuracy || 0) >= 70 ? 'excited' : 'happy'}
                className="mx-auto mb-2 drop-shadow-sm"
              />

              <div
                className={`radial-progress text-${accColor(feedback?.accuracy || 0)} text-3xl lg:text-4xl font-extrabold mb-2 mx-auto`}
                style={{ '--value': feedback?.accuracy || 0, '--size': '7rem', '--thickness': '0.5rem' } as React.CSSProperties}
                role="progressbar"
              >
                {feedback?.accuracy || 0}%
              </div>

              <h2 className="text-lg lg:text-xl font-extrabold text-base-content mb-4">
                {(feedback?.accuracy || 0) >= 85 ? 'Excellent! 🌸' : (feedback?.accuracy || 0) >= 70 ? 'Good job!' : 'Keep practicing!'}
              </h2>

              {/* Word scores — horizontal compact, max 3 visible */}
              {feedback?.wordScores?.length > 0 && (
                <div className="flex flex-wrap justify-center gap-2 mb-4">
                  {feedback.wordScores.slice(0, 6).map((w: any, i: number) => (
                    <div key={i} className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm font-bold ${
                      w.score >= 85 ? 'bg-success/8 border-success/15 text-success' :
                      w.score >= 70 ? 'bg-warning/8 border-warning/15 text-warning' :
                      'bg-error/8 border-error/15 text-error'
                    }`}>
                      <span className="text-base-content/70">{w.word}</span>
                      <span>{w.score}%</span>
                    </div>
                  ))}
                </div>
              )}

              {/* XP */}
              {(feedback?.xpEarned || 0) > 0 && (
                <div className="inline-flex items-center gap-2 bg-warning/8 border border-warning/12 rounded-full px-4 py-2 mb-5">
                  <Star className="w-5 h-5 text-warning" />
                  <span className="font-extrabold text-base text-warning">+{feedback.xpEarned} XP</span>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 justify-center max-w-sm mx-auto">
                <button onClick={handleTryAgain} className="btn btn-ghost flex-1 gap-1.5 border border-base-content/8"><RotateCcw className="w-4 h-4" /> Retry</button>
                <button onClick={handleNext} className="btn btn-primary flex-1 gap-1.5 shadow-sm shadow-primary/15">
                  {currentSentenceIndex + 1 >= totalSentences ? 'Finish' : 'Next'} <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}