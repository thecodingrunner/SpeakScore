'use client'

import { useState, useEffect } from 'react'
import * as React from 'react'
import { useRouter } from 'next/navigation'
import { 
  Mic, Volume2, RotateCcw, Check, ChevronLeft, X,
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

  useEffect(() => {
    console.log("Sentence: ", sentence);
  }, [])

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
      <div className="h-[80vh] md:h-[90vh] bg-base-200 flex items-center justify-center">
        <div className="text-center">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <p className="mt-4">Loading lesson...</p>
        </div>
      </div>
    )
  }

  // Show lesson summary - FIT IN VIEWPORT
  if (showSummary && lessonSummary) {
    return (
      <div className="h-[80vh] md:h-[90vh] bg-base-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-base-100 border-b border-base-300 px-4 py-3">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <h2 className="font-bold text-lg">Lesson Complete</h2>
            <button onClick={() => router.push('/practice')} className="btn btn-ghost btn-sm btn-circle">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-4 py-6">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body p-6">
                {/* Trophy Header */}
                <div className="text-center mb-6">
                  <div className="inline-block p-3 bg-warning/20 rounded-full mb-3">
                    <Trophy className="w-12 h-12 text-warning" />
                  </div>
                  <h1 className="text-3xl font-bold mb-1">Lesson Complete!</h1>
                  <p className="text-base-content/70">{lessonSummary.lessonName}</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
                  <div className="card bg-base-200">
                    <div className="card-body p-3 text-center">
                      <Target className="w-6 h-6 mx-auto mb-1 text-primary" />
                      <p className="text-xl font-bold">{lessonSummary.averageAccuracy}%</p>
                      <p className="text-xs text-base-content/60">Avg Score</p>
                    </div>
                  </div>
                  
                  <div className="card bg-base-200">
                    <div className="card-body p-3 text-center">
                      <Star className="w-6 h-6 mx-auto mb-1 text-warning" />
                      <p className="text-xl font-bold">+{lessonSummary.totalXP}</p>
                      <p className="text-xs text-base-content/60">XP Earned</p>
                    </div>
                  </div>

                  <div className="card bg-base-200">
                    <div className="card-body p-3 text-center">
                      <Check className="w-6 h-6 mx-auto mb-1 text-success" />
                      <p className="text-xl font-bold">{lessonSummary.totalSentences}</p>
                      <p className="text-xs text-base-content/60">Sentences</p>
                    </div>
                  </div>

                  <div className="card bg-base-200">
                    <div className="card-body p-3 text-center">
                      <TrendingUp className="w-6 h-6 mx-auto mb-1 text-info" />
                      <p className="text-xl font-bold">{Math.floor(lessonSummary.timeSpent / 60)}m</p>
                      <p className="text-xs text-base-content/60">Time</p>
                    </div>
                  </div>
                </div>

                {/* Strong & Weak Areas */}
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  {lessonSummary.strongPhonemes.length > 0 && (
                    <div>
                      <h3 className="font-bold text-sm mb-2 flex items-center gap-2">
                        <Award className="w-4 h-4 text-success" />
                        Strong
                      </h3>
                      <div className="flex flex-wrap gap-1">
                        {lessonSummary.strongPhonemes.slice(0, 3).map((p, i) => (
                          <div key={i} className="badge badge-success badge-sm">
                            {p.phoneme} {p.averageScore}%
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {lessonSummary.weakPhonemes.length > 0 && (
                    <div>
                      <h3 className="font-bold text-sm mb-2 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-warning" />
                        Improve
                      </h3>
                      <div className="flex flex-wrap gap-1">
                        {lessonSummary.weakPhonemes.slice(0, 3).map((p, i) => (
                          <div key={i} className="badge badge-warning badge-sm">
                            {p.phoneme} {p.averageScore}%
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button 
                    onClick={() => router.push('/practice')}
                    className="btn btn-outline flex-1 btn-sm"
                  >
                    Back
                  </button>
                  <button 
                    onClick={() => {
                      setShowSummary(false)
                      setCurrentSentenceIndex(0)
                      setLessonAttempts([])
                      setLessonStartTime(Date.now())
                    }}
                    className="btn btn-primary flex-1 btn-sm"
                  >
                    Practice Again
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!sentence) {
    return (
      <div className="h-[80vh] md:h-[90vh] bg-base-200 flex items-center justify-center">
        <div className="text-center">
          <p>No sentence available</p>
          <button onClick={() => router.push('/practice')} className="btn btn-primary mt-4 btn-sm">
            Back to Practice
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="h-[80vh] md:h-[90vh] bg-base-200 flex flex-col overflow-hidden">
      {/* Header with Progress - Fixed */}
      <div className="bg-base-100 border-b border-base-300 flex-shrink-0">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <button 
              onClick={() => router.push('/practice')}
              className="btn btn-ghost btn-sm btn-circle"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="text-center">
              <h2 className="font-bold">{lessonConfig?.name || 'Practice'}</h2>
              <p className="text-xs text-base-content/60">
                {currentSentenceIndex + 1}/{totalSentences}
              </p>
            </div>

            <div className="badge badge-primary badge-sm">
              {sentence.difficulty}
            </div>
          </div>

          {/* Progress Bar */}
          <progress 
            className="progress progress-primary w-full h-2" 
            value={currentSentenceIndex + 1} 
            max={totalSentences}
          />
        </div>
      </div>

      {/* Main Content - Flex grow with centered content */}
      <div className="flex-1 flex items-center justify-center px-4 py-6 overflow-hidden">
        <div className="w-full max-w-3xl">
          {!showFeedback ? (
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body p-6 lg:p-8">
                {/* Step 1: Listen */}
                {currentStep === 0 && (
                  <div className="text-center space-y-6">
                    <div className="badge badge-primary">Step 1: Listen</div>
                    
                    <h1 className="text-2xl lg:text-3xl font-bold">
                      Listen to the native speaker
                    </h1>

                    <div className="card bg-primary/10 border-2 border-primary/30">
                      <div className="card-body p-4">
                        <p className="text-xl lg:text-2xl font-bold">
                          "{sentence.text}"
                        </p>
                        <div className="flex items-center justify-center gap-2 mt-3 flex-wrap">
                          <span className="text-xs">Target sounds:</span>
                          {sentence.phonemes.map((phoneme, i) => (
                            <span key={i} className="badge badge-primary badge-sm">
                              {phoneme}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-center gap-3">
                      <button 
                        onClick={handlePlayAudio}
                        className="btn btn-circle btn-lg btn-primary"
                      >
                        <Volume2 className="w-7 h-7" />
                      </button>
                      
                      <div className="btn-group btn-group-sm">
                        <button 
                          className={`btn btn-xs ${audioSpeed === 'normal' ? 'btn-active' : ''}`}
                          onClick={() => setAudioSpeed('normal')}
                        >
                          Normal
                        </button>
                        <button 
                          className={`btn btn-xs ${audioSpeed === 'slow' ? 'btn-active' : ''}`}
                          onClick={() => setAudioSpeed('slow')}
                        >
                          Slow
                        </button>
                      </div>
                    </div>

                    <button 
                      onClick={() => setCurrentStep(1)}
                      className="btn btn-primary gap-2"
                    >
                      Continue to Practice
                      <ChevronLeft className="w-4 h-4 rotate-180" />
                    </button>
                  </div>
                )}

                {/* Step 2: Practice (Record) */}
                {currentStep === 1 && (
                  <div className="text-center space-y-6">
                    <div className="badge badge-warning">Step 2: Your Turn</div>
                    
                    <h1 className="text-2xl lg:text-3xl font-bold">
                      Now say it yourself!
                    </h1>

                    <div className="card bg-primary/10 border-2 border-primary/30">
                      <div className="card-body p-4">
                        <p className="text-xl lg:text-2xl font-bold">
                          "{sentence.text}"
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col items-center gap-3">
                      <button
                        onClick={handleRecordToggle}
                        disabled={isLoading}
                        className={`btn btn-circle w-24 h-24 ${
                          isRecording 
                            ? 'btn-error animate-pulse' 
                            : 'btn-primary'
                        }`}
                      >
                        <Mic className="w-10 h-10" />
                      </button>

                      <p className="text-sm font-semibold">
                        {isRecording ? 'Recording... Tap to stop' : 'Tap to record'}
                      </p>

                      {recordedAudio && !isRecording && (
                        <div className="text-success font-semibold flex items-center gap-2 text-sm">
                          <Check className="w-4 h-4" />
                          Recording complete!
                        </div>
                      )}
                    </div>

                    {recordedAudio && !isRecording && (
                      <div className="flex gap-3 justify-center">
                        <button 
                          onClick={handleTryAgain}
                          className="btn btn-ghost btn-sm gap-2"
                        >
                          <RotateCcw className="w-4 h-4" />
                          Try Again
                        </button>
                        <button 
                          onClick={handleSubmit}
                          disabled={isLoading}
                          className="btn btn-primary btn-sm gap-2"
                        >
                          {isLoading ? (
                            <>
                              <span className="loading loading-spinner loading-xs" />
                              Analyzing...
                            </>
                          ) : (
                            <>
                              Check Pronunciation
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
            // Feedback Screen - Compact
            <div className="card bg-base-100 shadow-xl max-h-full overflow-y-auto">
              <div className="card-body p-6">
                <div className="text-center mb-4">
                  <div className="radial-progress text-primary text-4xl font-bold mb-3" 
                       style={{"--value": feedback?.accuracy || 0, "--size": "8rem", "--thickness": "0.75rem"} as React.CSSProperties}
                       role="progressbar">
                    {feedback?.accuracy || 0}%
                  </div>
                  <h2 className="text-xl font-bold">
                    {(feedback?.accuracy || 0) >= 85 ? 'Excellent!' : (feedback?.accuracy || 0) >= 70 ? 'Good job!' : 'Keep practicing!'}
                  </h2>
                </div>

                {feedback?.wordScores && feedback.wordScores.length > 0 && (
                  <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
                    <h3 className="font-bold text-sm">Word Scores:</h3>
                    {feedback.wordScores.map((word: any, idx: number) => (
                      <div key={idx} className="card bg-base-200">
                        <div className="card-body p-3">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-sm">"{word.word}"</span>
                            <span className={`font-bold text-sm ${
                              word.score >= 85 ? 'text-success' :
                              word.score >= 70 ? 'text-warning' : 'text-error'
                            }`}>
                              {word.score}%
                            </span>
                          </div>
                          <progress 
                            className={`progress progress-sm w-full ${
                              word.score >= 85 ? 'progress-success' :
                              word.score >= 70 ? 'progress-warning' : 'progress-error'
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
                  <div className="card bg-warning/20 border border-warning/30 mb-4">
                    <div className="card-body p-3 flex-row items-center justify-center gap-2">
                      <Star className="w-6 h-6 text-warning" />
                      <div>
                        <p className="font-bold text-sm">+{feedback.xpEarned} XP</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex gap-3">
                  <button 
                    onClick={handleTryAgain}
                    className="btn btn-outline flex-1 btn-sm gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Try Again
                  </button>
                  <button 
                    onClick={handleNext}
                    className="btn btn-primary flex-1 btn-sm gap-2"
                  >
                    {currentSentenceIndex + 1 >= totalSentences ? 'Finish' : 'Next'}
                    <ChevronLeft className="w-4 h-4 rotate-180" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}