'use client'

import { useState } from 'react'
import * as React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  Mic, Volume2, RotateCcw, X, Check, ChevronLeft,
  Star, TrendingUp, Target, Sparkles, Play, Pause
} from 'lucide-react'

export default function PracticeLessonPage({ params }: { params: Promise<{ lessonId: string }> }) {
  const router = useRouter()
  const [isRecording, setIsRecording] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [showFeedback, setShowFeedback] = useState(false)
  const [lessonId, setLessonId] = useState<string>('')

  // Unwrap params on mount
  React.useEffect(() => {
    params.then(p => setLessonId(p.lessonId))
  }, [params])

  // Mock lesson data - replace with real data
  const lesson = {
    id: lessonId,
    title: '/th/ Sounds Practice',
    totalSteps: 5,
    scenario: 'TOEIC Speaking Test',
  }

  const steps = [
    {
      id: 1,
      type: 'introduction',
      title: 'Let\'s practice /th/ sounds',
      instruction: 'Put your tongue between your teeth and blow air gently',
      example: 'think',
      audio: '/audio/th-think.mp3',
    },
    {
      id: 2,
      type: 'listen',
      title: 'Listen and repeat',
      instruction: 'Listen to the native pronunciation',
      word: 'think',
      sentence: 'I think this is important.',
      audio: '/audio/think-sentence.mp3',
    },
    {
      id: 3,
      type: 'practice',
      title: 'Your turn!',
      instruction: 'Say: "I think this is important"',
      targetSentence: 'I think this is important.',
      targetPhoneme: '/θ/',
    },
    {
      id: 4,
      type: 'practice',
      title: 'Try another one',
      instruction: 'Say: "Thank you for your help"',
      targetSentence: 'Thank you for your help.',
      targetPhoneme: '/θ/',
    },
    {
      id: 5,
      type: 'conversation',
      title: 'Conversation Practice',
      instruction: 'The AI will ask you a question. Respond naturally.',
      aiPrompt: 'What do you think about learning English?',
    },
  ]

  const currentStepData = steps[currentStep]

  // Mock feedback data
  const feedback = {
    accuracy: 82,
    phonemeScores: [
      { phoneme: '/θ/', score: 78, word: 'think' },
      { phoneme: '/ɪ/', score: 92, word: 'think' },
      { phoneme: '/ŋ/', score: 85, word: 'think' },
    ],
    suggestions: [
      'Your /th/ sound is close! Try putting your tongue further forward.',
      'Great job on the vowel sounds!',
      'Word stress is correct - keep it up!',
    ],
    xpEarned: 15,
  }

  const handleRecordToggle = () => {
    setIsRecording(!isRecording)
    // Audio recording logic will go here
  }

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
      setShowFeedback(false)
    } else {
      // Lesson complete - show results
      router.push(`/practice/${lesson.id}/results`)
    }
  }

  const handleSubmit = () => {
    // Submit recording for analysis
    setShowFeedback(true)
  }

  return (
    <div className="min-h-screen bg-base-200">
      {/* Header */}
      <div className="bg-base-100 border-b border-base-300 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <button 
              onClick={() => router.back()}
              className="btn btn-ghost btn-sm gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Exit
            </button>

            <div className="text-center flex-1">
              <h2 className="font-bold text-lg">{lesson.title}</h2>
              <p className="text-xs text-base-content/60">{lesson.scenario}</p>
            </div>

            <div className="text-sm font-semibold">
              {currentStep + 1}/{lesson.totalSteps}
            </div>
          </div>

          {/* Progress bar */}
          <progress 
            className="progress progress-primary w-full" 
            value={(currentStep + 1) / lesson.totalSteps * 100} 
            max="100"
          ></progress>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-6 lg:py-12">
        {!showFeedback ? (
          <div className="card bg-base-100 shadow-2xl">
            <div className="card-body p-6 lg:p-12 text-center">
              {/* Step Title */}
              <h1 className="text-3xl lg:text-4xl font-bold mb-4">
                {currentStepData.title}
              </h1>

              {/* Instruction */}
              <p className="text-lg text-base-content/70 mb-8">
                {currentStepData.instruction}
              </p>

              {/* Content based on step type */}
              {currentStepData.type === 'introduction' && (
                <div className="space-y-6">
                  <div className="text-6xl mb-4">👅</div>
                  
                  <div className="card bg-primary/10 max-w-md mx-auto">
                    <div className="card-body">
                      <p className="text-2xl font-mono font-bold text-primary">
                        {currentStepData.example}
                      </p>
                    </div>
                  </div>

                  <button className="btn btn-circle btn-lg btn-primary">
                    <Volume2 className="w-6 h-6" />
                  </button>
                </div>
              )}

              {currentStepData.type === 'listen' && (
                <div className="space-y-8">
                  <div className="card bg-base-200 max-w-2xl mx-auto">
                    <div className="card-body">
                      <p className="text-3xl font-bold mb-4">
                        {currentStepData.sentence}
                      </p>
                      <div className="flex items-center justify-center gap-3">
                        <button className="btn btn-circle btn-lg btn-primary">
                          <Volume2 className="w-6 h-6" />
                        </button>
                        <span className="text-sm text-base-content/60">
                          Listen to native speaker
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Word breakdown */}
                  <div className="card bg-base-200 max-w-md mx-auto">
                    <div className="card-body">
                      <h3 className="font-bold mb-2">Focus word:</h3>
                      <p className="text-4xl font-mono font-bold text-primary mb-2">
                        {currentStepData.word}
                      </p>
                      <button className="btn btn-ghost btn-sm">
                        <Volume2 className="w-4 h-4" />
                        Slow playback
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {currentStepData.type === 'practice' && (
                <div className="space-y-8">
                  {/* Target sentence */}
                  <div className="card bg-gradient-to-br from-primary/10 to-secondary/10 border-2 border-primary/30 max-w-2xl mx-auto">
                    <div className="card-body">
                      <p className="text-2xl lg:text-3xl font-bold">
                        "{currentStepData.targetSentence}"
                      </p>
                    </div>
                  </div>

                  {/* Recording interface */}
                  <div className="flex flex-col items-center gap-4">
                    <button
                      onClick={handleRecordToggle}
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
                          ></div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Hint */}
                  <div className="alert alert-info max-w-md mx-auto">
                    <Sparkles className="w-5 h-5" />
                    <span className="text-sm">
                      Focus on the <span className="font-bold">{currentStepData.targetPhoneme}</span> sound
                    </span>
                  </div>

                  {/* Action buttons */}
                  {!isRecording && (
                    <div className="flex gap-3 justify-center">
                      <button className="btn btn-ghost gap-2">
                        <RotateCcw className="w-4 h-4" />
                        Try Again
                      </button>
                      <button 
                        onClick={handleSubmit}
                        className="btn btn-primary gap-2"
                      >
                        Check My Pronunciation
                        <Check className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              )}

              {currentStepData.type === 'conversation' && (
                <div className="space-y-8">
                  {/* AI Avatar */}
                  <div className="avatar">
                    <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-4">
                      <div className="bg-gradient-to-br from-primary to-secondary flex items-center justify-center h-full">
                        <Sparkles className="w-12 h-12 text-primary-content" />
                      </div>
                    </div>
                  </div>

                  {/* AI Speech bubble */}
                  <div className="chat chat-start max-w-2xl mx-auto">
                    <div className="chat-bubble chat-bubble-primary text-lg">
                      {currentStepData.aiPrompt}
                    </div>
                  </div>

                  {/* Recording interface */}
                  <div className="flex flex-col items-center gap-4 mt-8">
                    <button
                      onClick={handleRecordToggle}
                      className={`btn btn-circle w-24 h-24 ${
                        isRecording 
                          ? 'btn-error animate-pulse' 
                          : 'btn-primary'
                      }`}
                    >
                      <Mic className="w-10 h-10" />
                    </button>

                    <p className="text-sm font-semibold">
                      {isRecording ? 'Speaking...' : 'Tap to respond'}
                    </p>
                  </div>
                </div>
              )}

              {/* Skip button */}
              {currentStepData.type !== 'practice' && (
                <button 
                  onClick={handleNext}
                  className="btn btn-ghost mt-6"
                >
                  Skip
                  <ChevronLeft className="w-4 h-4 rotate-180" />
                </button>
              )}
            </div>
          </div>
        ) : (
          // Feedback Screen
          <div className="card bg-base-100 shadow-2xl">
            <div className="card-body p-6 lg:p-12">
              {/* Accuracy Score */}
              <div className="text-center mb-8">
                <div className="radial-progress text-primary text-6xl font-bold mb-4" 
                     style={{"--value": feedback.accuracy, "--size": "12rem", "--thickness": "1rem"} as React.CSSProperties}
                     role="progressbar">
                  {feedback.accuracy}%
                </div>
                <h2 className="text-2xl font-bold">Great job!</h2>
                <p className="text-base-content/70">You're improving!</p>
              </div>

              {/* Phoneme Scores */}
              <div className="space-y-3 mb-6">
                <h3 className="font-bold text-lg">Phoneme Breakdown:</h3>
                {feedback.phonemeScores.map((phoneme, idx) => (
                  <div key={idx} className="card bg-base-200">
                    <div className="card-body p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl font-mono font-bold">
                            {phoneme.phoneme}
                          </span>
                          <span className="text-sm opacity-60">
                            in "{phoneme.word}"
                          </span>
                        </div>
                        <span className={`font-bold ${
                          phoneme.score >= 85 ? 'text-success' :
                          phoneme.score >= 70 ? 'text-warning' :
                          'text-error'
                        }`}>
                          {phoneme.score}%
                        </span>
                      </div>
                      <progress 
                        className={`progress w-full ${
                          phoneme.score >= 85 ? 'progress-success' :
                          phoneme.score >= 70 ? 'progress-warning' :
                          'progress-error'
                        }`}
                        value={phoneme.score} 
                        max="100"
                      ></progress>
                    </div>
                  </div>
                ))}
              </div>

              {/* Suggestions */}
              <div className="space-y-2 mb-6">
                <h3 className="font-bold text-lg">Tips for improvement:</h3>
                {feedback.suggestions.map((suggestion, idx) => (
                  <div key={idx} className="alert alert-info">
                    <Sparkles className="w-5 h-5" />
                    <span className="text-sm">{suggestion}</span>
                  </div>
                ))}
              </div>

              {/* XP Earned */}
              <div className="card bg-gradient-to-r from-warning/20 to-success/20 border-2 border-warning/30">
                <div className="card-body p-4 flex-row items-center justify-center gap-3">
                  <Star className="w-8 h-8 text-warning" />
                  <div>
                    <p className="font-bold">+{feedback.xpEarned} XP</p>
                    <p className="text-xs text-base-content/60">Keep practicing!</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 mt-6">
                <button 
                  onClick={() => setShowFeedback(false)}
                  className="btn btn-outline flex-1 gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  Try Again
                </button>
                <button 
                  onClick={handleNext}
                  className="btn btn-primary flex-1 gap-2"
                >
                  Continue
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