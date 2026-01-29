'use client'

import { useState, useEffect } from 'react'
import * as React from 'react'
import { useRouter } from 'next/navigation'
import { 
  Mic, Volume2, RotateCcw, Check, ChevronLeft,
  Star, AlertCircle, Trophy, TrendingUp, Target, Award
} from 'lucide-react'
import { convertToWav } from '@/lib/audio-converter'
import { getLessonConfig, type LessonAttempt } from '@/lib/lesson-config'

interface Sentence {
  id: string;
  text: string;
  phonemes: string[];
  difficulty: string;
  audioUrls: {
    normal: string;
    slow: string;
  };
  scenario: string;
}

export default function PracticeLessonPage({ params }: { params: Promise<{ lessonId: string }> }) {
  const router = useRouter()
  const [isRecording, setIsRecording] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [showFeedback, setShowFeedback] = useState(false)
  const [showSummary, setShowSummary] = useState(false)
  const [lessonId, setLessonId] = useState<string>('')
  const [sentence, setSentence] = useState<Sentence | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [audioSpeed, setAudioSpeed] = useState<'normal' | 'slow'>('normal')
  const [recordedAudio, setRecordedAudio] = useState<Blob | null>(null)
  const [feedback, setFeedback] = useState<any>(null)
  
  // Lesson tracking
  const [lessonAttempts, setLessonAttempts] = useState<LessonAttempt[]>([])
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0)
  const [lessonStartTime, setLessonStartTime] = useState<number>(Date.now())

  const [audio, setAudio] = useState<HTMLAudioElement | null>(null)

  // Get lesson config
  const lessonConfig = lessonId ? getLessonConfig(lessonId) : null
  const totalSentences = lessonConfig?.sentencesPerLesson || 10

  // Unwrap params on mount
  React.useEffect(() => {
    params.then(p => {
      setLessonId(p.lessonId)
      setLessonStartTime(Date.now())
    })
  }, [params])

  // Fetch sentence when lessonId is available
  useEffect(() => {
    if (lessonId && currentSentenceIndex < totalSentences) {
      fetchSentence(lessonId)
    } else if (lessonId && currentSentenceIndex >= totalSentences) {
      // Lesson complete!
      setShowSummary(true)
    }
  }, [lessonId, currentSentenceIndex])

  const fetchSentence = async (scenario: string) => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/practice/next-sentence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenario })
      })

      if (!response.ok) {
        throw new Error('Failed to fetch sentence')
      }

      const data = await response.json()
      setSentence(data.sentence)
    } catch (error) {
      console.error('Error fetching sentence:', error)
      alert('Failed to load sentence. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handlePlayAudio = () => {
    if (!sentence?.audioUrls) return

    if (audio) {
      audio.pause()
      audio.currentTime = 0
    }

    const audioUrl = audioSpeed === 'normal' 
      ? sentence.audioUrls.normal 
      : sentence.audioUrls.slow

    if (!audioUrl) {
      alert('Audio not available')
      return
    }

    const newAudio = new Audio(audioUrl)
    newAudio.play()
    setAudio(newAudio)
  }

  const handleRecordToggle = async () => {
    if (isRecording) {
      stopRecording()
    } else {
      startRecording()
    }
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
        } 
      })
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm'
      })
      
      const audioChunks: Blob[] = []

      mediaRecorder.addEventListener('dataavailable', (event) => {
        audioChunks.push(event.data)
      })

      const recordStartTime = Date.now();

      mediaRecorder.addEventListener('stop', async () => {

        const recordDuration = Date.now() - recordStartTime;

        if (recordDuration < 1000) {
          alert('Recording too short! Please speak for at least 2 seconds.');
          stream.getTracks().forEach(track => track.stop());
          return;
        }

        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' })
        
        try {
          const wavBlob = await convertToWav(audioBlob)
          console.log('✅ WAV conversion:', {
            originalSize: audioBlob.size,
            wavSize: wavBlob.size,
            originalType: audioBlob.type,
            wavType: wavBlob.type
          });
          setRecordedAudio(wavBlob)
        } catch (error) {
          console.error('Error converting audio:', error)
          setRecordedAudio(audioBlob)
        }
        
        stream.getTracks().forEach(track => track.stop())
      })

      mediaRecorder.start()
      setIsRecording(true)

      // @ts-ignore
      window.currentMediaRecorder = mediaRecorder
    } catch (error) {
      console.error('Error starting recording:', error)
      alert('Could not access microphone. Please check permissions.')
    }
  }

  const stopRecording = () => {
    // @ts-ignore
    const mediaRecorder = window.currentMediaRecorder
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop()
      setIsRecording(false)
    }
  }

  const handleSubmit = async () => {
    if (!recordedAudio || !sentence) return

    setIsLoading(true)
    
    try {
      const formData = new FormData()
      formData.append('audio', recordedAudio, 'recording.wav')
      formData.append('referenceText', sentence.text)
      formData.append('sentenceId', sentence.id)

      const response = await fetch('/api/practice/analyze-pronunciation', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Analysis failed')
      }

      const result = await response.json()
      setFeedback(result)
      setShowFeedback(true)

      // Store attempt in lesson history
      const phonemeScoresMap: Record<string, number> = {}
      if (result.phonemeScores && result.phonemeScores.length > 0) {
        result.phonemeScores.forEach((ps: any) => {
          phonemeScoresMap[ps.phoneme] = ps.score
        })
      }

      const attempt: LessonAttempt = {
        sentenceId: sentence.id,
        text: sentence.text,
        accuracy: result.accuracy || 0,
        phonemeScores: phonemeScoresMap,
        wordScores: result.wordScores || [],
        attemptNumber: lessonAttempts.filter(a => a.sentenceId === sentence.id).length + 1,
      }

      setLessonAttempts(prev => [...prev, attempt])

      // Record attempt in database
      await fetch('/api/practice/record-attempt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sentenceId: sentence.id,
          accuracy: result.accuracy || 0,
          phonemeScores: phonemeScoresMap
        })
      })
    } catch (error: any) {
      console.error('Error analyzing pronunciation:', error)
      alert(`Failed to analyze pronunciation: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleNext = () => {
    // Move to next sentence
    setCurrentSentenceIndex(prev => prev + 1)
    setCurrentStep(0)
    setShowFeedback(false)
    setRecordedAudio(null)
    setFeedback(null)
  }

  const handleTryAgain = () => {
    setShowFeedback(false)
    setRecordedAudio(null)
    setIsRecording(false)
  }

  // Calculate lesson summary
  const lessonSummary = React.useMemo(() => {
    if (lessonAttempts.length === 0) return null

    const totalAccuracy = lessonAttempts.reduce((sum, a) => sum + a.accuracy, 0)
    const averageAccuracy = Math.round(totalAccuracy / lessonAttempts.length)
    
    const totalXP = lessonAttempts.reduce((sum, a) => {
      if (a.accuracy >= 90) return sum + 50
      if (a.accuracy >= 80) return sum + 30
      if (a.accuracy >= 70) return sum + 20
      return sum + 10
    }, 0)

    // Calculate phoneme averages
    const phonemeScores: Record<string, number[]> = {}
    lessonAttempts.forEach(attempt => {
      Object.entries(attempt.phonemeScores).forEach(([phoneme, score]) => {
        if (!phonemeScores[phoneme]) phonemeScores[phoneme] = []
        phonemeScores[phoneme].push(score)
      })
    })

    const phonemeAverages = Object.entries(phonemeScores).map(([phoneme, scores]) => ({
      phoneme,
      averageScore: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
    }))

    const weakPhonemes = phonemeAverages.filter(p => p.averageScore < 75).sort((a, b) => a.averageScore - b.averageScore)
    const strongPhonemes = phonemeAverages.filter(p => p.averageScore >= 85).sort((a, b) => b.averageScore - a.averageScore)

    const timeSpent = Math.round((Date.now() - lessonStartTime) / 1000)

    return {
      lessonName: lessonConfig?.name || 'Practice',
      totalSentences: lessonAttempts.length,
      averageAccuracy,
      totalXP,
      weakPhonemes,
      strongPhonemes,
      timeSpent,
    }
  }, [lessonAttempts, lessonStartTime, lessonConfig])

  if (isLoading && !sentence) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="text-center">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <p className="mt-4 text-lg">Loading lesson...</p>
        </div>
      </div>
    )
  }

  // Show lesson summary
  if (showSummary && lessonSummary) {
    return (
      <div className="min-h-screen bg-base-200">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="card bg-base-100 shadow-2xl">
            <div className="card-body p-8 lg:p-12">
              {/* Trophy Header */}
              <div className="text-center mb-8">
                <div className="inline-block p-4 bg-warning/20 rounded-full mb-4">
                  <Trophy className="w-16 h-16 text-warning" />
                </div>
                <h1 className="text-4xl font-bold mb-2">Lesson Complete!</h1>
                <p className="text-xl text-base-content/70">{lessonSummary.lessonName}</p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="card bg-base-200">
                  <div className="card-body p-4 text-center">
                    <Target className="w-8 h-8 mx-auto mb-2 text-primary" />
                    <p className="text-2xl font-bold">{lessonSummary.averageAccuracy}%</p>
                    <p className="text-xs text-base-content/60">Average Score</p>
                  </div>
                </div>
                
                <div className="card bg-base-200">
                  <div className="card-body p-4 text-center">
                    <Star className="w-8 h-8 mx-auto mb-2 text-warning" />
                    <p className="text-2xl font-bold">+{lessonSummary.totalXP}</p>
                    <p className="text-xs text-base-content/60">XP Earned</p>
                  </div>
                </div>

                <div className="card bg-base-200">
                  <div className="card-body p-4 text-center">
                    <Check className="w-8 h-8 mx-auto mb-2 text-success" />
                    <p className="text-2xl font-bold">{lessonSummary.totalSentences}</p>
                    <p className="text-xs text-base-content/60">Sentences</p>
                  </div>
                </div>

                <div className="card bg-base-200">
                  <div className="card-body p-4 text-center">
                    <TrendingUp className="w-8 h-8 mx-auto mb-2 text-info" />
                    <p className="text-2xl font-bold">{Math.floor(lessonSummary.timeSpent / 60)}m</p>
                    <p className="text-xs text-base-content/60">Time Spent</p>
                  </div>
                </div>
              </div>

              {/* Strong Areas */}
              {lessonSummary.strongPhonemes.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                    <Award className="w-5 h-5 text-success" />
                    Strong Areas
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {lessonSummary.strongPhonemes.slice(0, 5).map((p, i) => (
                      <div key={i} className="badge badge-success badge-lg gap-2">
                        {p.phoneme} - {p.averageScore}%
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Areas to Improve */}
              {lessonSummary.weakPhonemes.length > 0 && (
                <div className="mb-8">
                  <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-warning" />
                    Areas to Improve
                  </h3>
                  <div className="space-y-2">
                    {lessonSummary.weakPhonemes.slice(0, 3).map((p, i) => (
                      <div key={i} className="card bg-base-200">
                        <div className="card-body p-3 flex-row items-center justify-between">
                          <span className="font-bold">{p.phoneme}</span>
                          <div className="flex items-center gap-3">
                            <progress 
                              className="progress progress-warning w-32" 
                              value={p.averageScore} 
                              max="100"
                            />
                            <span className="text-sm font-bold text-warning">{p.averageScore}%</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                <button 
                  onClick={() => router.push('/practice')}
                  className="btn btn-outline flex-1"
                >
                  Back to Practice
                </button>
                <button 
                  onClick={() => {
                    setShowSummary(false)
                    setCurrentSentenceIndex(0)
                    setLessonAttempts([])
                    setLessonStartTime(Date.now())
                  }}
                  className="btn btn-primary flex-1"
                >
                  Practice Again
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!sentence) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg">No sentence available</p>
          <button onClick={() => router.push('/practice')} className="btn btn-primary mt-4">
            Back to Practice
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-base-200">
      {/* Header with Progress */}
      <div className="bg-base-100 border-b border-base-300 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <button 
              onClick={() => router.push('/practice')}
              className="btn btn-ghost btn-sm gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Exit
            </button>

            <div className="text-center flex-1">
              <h2 className="font-bold text-lg">
                {lessonConfig?.name || 'Practice'}
              </h2>
              <p className="text-xs text-base-content/60">
                Sentence {currentSentenceIndex + 1} of {totalSentences}
              </p>
            </div>

            <div className="badge badge-primary">
              {sentence.difficulty}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="flex items-center gap-3">
            <progress 
              className="progress progress-primary flex-1" 
              value={currentSentenceIndex + 1} 
              max={totalSentences}
            />
            <span className="text-sm font-semibold">
              {Math.round(((currentSentenceIndex + 1) / totalSentences) * 100)}%
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-6 lg:py-12">
        {!showFeedback ? (
          <div className="card bg-base-100 shadow-2xl">
            <div className="card-body p-6 lg:p-12">
              {/* Step 1: Listen */}
              {currentStep === 0 && (
                <div className="text-center space-y-8">
                  <div className="badge badge-primary badge-lg">Step 1: Listen</div>
                  
                  <h1 className="text-3xl lg:text-4xl font-bold">
                    Listen to the native speaker
                  </h1>

                  <div className="card bg-gradient-to-br from-primary/10 to-secondary/10 border-2 border-primary/30 max-w-2xl mx-auto">
                    <div className="card-body">
                      <p className="text-2xl lg:text-3xl font-bold">
                        "{sentence.text}"
                      </p>
                      <div className="flex items-center justify-center gap-2 mt-4 flex-wrap">
                        <span className="text-sm">Target sounds:</span>
                        {sentence.phonemes.map((phoneme, i) => (
                          <span key={i} className="badge badge-primary">
                            {phoneme}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-center gap-4">
                    <button 
                      onClick={handlePlayAudio}
                      className="btn btn-circle btn-lg btn-primary"
                    >
                      <Volume2 className="w-8 h-8" />
                    </button>
                    
                    <div className="btn-group">
                      <button 
                        className={`btn btn-sm ${audioSpeed === 'normal' ? 'btn-active' : ''}`}
                        onClick={() => setAudioSpeed('normal')}
                      >
                        Normal
                      </button>
                      <button 
                        className={`btn btn-sm ${audioSpeed === 'slow' ? 'btn-active' : ''}`}
                        onClick={() => setAudioSpeed('slow')}
                      >
                        Slow
                      </button>
                    </div>
                  </div>

                  <button 
                    onClick={() => setCurrentStep(1)}
                    className="btn btn-primary gap-2 mt-6"
                  >
                    Continue to Practice
                    <ChevronLeft className="w-4 h-4 rotate-180" />
                  </button>
                </div>
              )}

              {/* Step 2: Practice (Record) */}
              {currentStep === 1 && (
                <div className="text-center space-y-8">
                  <div className="badge badge-warning badge-lg">Step 2: Your Turn</div>
                  
                  <h1 className="text-3xl lg:text-4xl font-bold">
                    Now say it yourself!
                  </h1>

                  <div className="card bg-gradient-to-br from-primary/10 to-secondary/10 border-2 border-primary/30 max-w-2xl mx-auto">
                    <div className="card-body">
                      <p className="text-2xl lg:text-3xl font-bold">
                        "{sentence.text}"
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-center gap-4">
                    <button
                      onClick={handleRecordToggle}
                      disabled={isLoading}
                      className={`btn btn-circle w-32 h-32 ${
                        isRecording 
                          ? 'btn-error animate-pulse' 
                          : 'btn-primary'
                      }`}
                    >
                      <Mic className="w-12 h-12" />
                    </button>

                    <p className="text-sm font-semibold">
                      {isRecording ? 'Recording... Tap to stop' : 'Tap to record'}
                    </p>

                    {isRecording && (
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <div
                            key={i}
                            className="w-2 bg-error rounded-full animate-pulse"
                            style={{
                              height: `${20 + Math.random() * 40}px`,
                              animationDelay: `${i * 0.1}s`,
                            }}
                          />
                        ))}
                      </div>
                    )}

                    {recordedAudio && !isRecording && (
                      <div className="text-success font-semibold flex items-center gap-2">
                        <Check className="w-5 h-5" />
                        Recording complete!
                      </div>
                    )}
                  </div>

                  {recordedAudio && !isRecording && (
                    <div className="flex gap-3 justify-center">
                      <button 
                        onClick={handleTryAgain}
                        className="btn btn-ghost gap-2"
                      >
                        <RotateCcw className="w-4 h-4" />
                        Try Again
                      </button>
                      <button 
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="btn btn-primary gap-2"
                      >
                        {isLoading ? (
                          <>
                            <span className="loading loading-spinner loading-sm" />
                            Analyzing...
                          </>
                        ) : (
                          <>
                            Check My Pronunciation
                            <Check className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
          // Feedback Screen
          <div className="card bg-base-100 shadow-2xl">
            <div className="card-body p-6 lg:p-12">
              <div className="text-center mb-8">
                <div className="radial-progress text-primary text-6xl font-bold mb-4" 
                     style={{"--value": feedback?.accuracy || 0, "--size": "12rem", "--thickness": "1rem"} as React.CSSProperties}
                     role="progressbar">
                  {feedback?.accuracy || 0}%
                </div>
                <h2 className="text-2xl font-bold">
                  {(feedback?.accuracy || 0) >= 85 ? 'Excellent!' : (feedback?.accuracy || 0) >= 70 ? 'Good job!' : (feedback?.accuracy || 0) > 0 ? 'Keep practicing!' : 'Let\'s try again!'}
                </h2>
              </div>

              {feedback?.wordScores && feedback.wordScores.length > 0 && (
                <div className="space-y-3 mb-6">
                  <h3 className="font-bold text-lg">Word Pronunciation:</h3>
                  {feedback.wordScores.map((word: any, idx: number) => (
                    <div key={idx} className="card bg-base-200">
                      <div className="card-body p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xl font-bold">
                            "{word.word}"
                          </span>
                          <span className={`font-bold text-lg ${
                            word.score >= 85 ? 'text-success' :
                            word.score >= 70 ? 'text-warning' :
                            'text-error'
                          }`}>
                            {word.score}%
                          </span>
                        </div>
                        <progress 
                          className={`progress w-full ${
                            word.score >= 85 ? 'progress-success' :
                            word.score >= 70 ? 'progress-warning' :
                            'progress-error'
                          }`}
                          value={word.score} 
                          max="100"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {(feedback?.xpEarned || 0) > 0 && (
                <div className="card bg-gradient-to-r from-warning/20 to-success/20 border-2 border-warning/30 mb-6">
                  <div className="card-body p-4 flex-row items-center justify-center gap-3">
                    <Star className="w-8 h-8 text-warning" />
                    <div>
                      <p className="font-bold">+{feedback.xpEarned} XP</p>
                      <p className="text-xs text-base-content/60">Keep practicing!</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <button 
                  onClick={handleTryAgain}
                  className="btn btn-outline flex-1 gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  Try Again
                </button>
                <button 
                  onClick={handleNext}
                  className="btn btn-primary flex-1 gap-2"
                >
                  {currentSentenceIndex + 1 >= totalSentences ? 'Finish Lesson' : 'Next Sentence'}
                  <ChevronLeft className="w-4 h-4 rotate-180" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}