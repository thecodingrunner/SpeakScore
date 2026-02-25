// app/[locale]/onboarding/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  ChevronRight, ChevronLeft, Volume2, Target,
  Mic, BookOpen, Briefcase, GraduationCap, Phone,
  Sparkles, Check
} from 'lucide-react'
import { Mascot } from '@/components/global/Mascot'
import { MascotMini } from '@/components/global/Mascot'

/* ═══════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════ */
type VoiceGender = 'female' | 'male'
type VoiceAccent = 'american' | 'british'
type LearningGoal = 'conversation' | 'toeic' | 'business' | 'interview' | 'phone' | 'pronunciation'
type UserLevel = 'beginner' | 'intermediate' | 'advanced'

interface OnboardingData {
  voiceGender: VoiceGender
  voiceAccent: VoiceAccent
  learningGoals: LearningGoal[]
  level: UserLevel
}

/* ═══════════════════════════════════════════
   STEP CONFIGS
   ═══════════════════════════════════════════ */
const goalOptions: { id: LearningGoal; label: string; desc: string; icon: React.ElementType; emoji: string }[] = [
  { id: 'conversation', label: 'Daily Conversation', desc: 'Sound natural in everyday English', icon: Mic, emoji: '💬' },
  { id: 'pronunciation', label: 'Pronunciation', desc: 'Fix common Japanese pronunciation issues', icon: Volume2, emoji: '🔤' },
  { id: 'toeic', label: 'TOEIC Speaking', desc: 'Prepare for the TOEIC speaking test', icon: GraduationCap, emoji: '📝' },
  { id: 'business', label: 'Business English', desc: 'Meetings, presentations & professional talk', icon: Briefcase, emoji: '💼' },
  { id: 'interview', label: 'Job Interviews', desc: 'Practice common interview scenarios', icon: BookOpen, emoji: '🤝' },
  { id: 'phone', label: 'Phone Calls', desc: 'Clear communication over the phone', icon: Phone, emoji: '📞' },
]

const levelOptions: { id: UserLevel; label: string; desc: string; emoji: string }[] = [
  { id: 'beginner', label: 'Beginner', desc: 'I\'m just starting to learn English pronunciation', emoji: '🌱' },
  { id: 'intermediate', label: 'Intermediate', desc: 'I can communicate but want to sound more natural', emoji: '🌿' },
  { id: 'advanced', label: 'Advanced', desc: 'I\'m fairly fluent and want to polish my accent', emoji: '🌳' },
]

const TOTAL_STEPS = 4

/* ═══════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════ */
export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [data, setData] = useState<OnboardingData>({
    voiceGender: 'female',
    voiceAccent: 'american',
    learningGoals: [],
    level: 'beginner',
  })

  const progressPercent = ((step + 1) / TOTAL_STEPS) * 100

  /* ─── Navigation ─── */
  const canProceed = (): boolean => {
    switch (step) {
      case 0: return !!data.voiceGender
      case 1: return !!data.voiceAccent
      case 2: return data.learningGoals.length > 0
      case 3: return !!data.level
      default: return false
    }
  }

  const handleNext = () => {
    if (step < TOTAL_STEPS - 1) setStep(s => s + 1)
    else handleSubmit()
  }

  const handleBack = () => {
    if (step > 0) setStep(s => s - 1)
  }

  const toggleGoal = (goal: LearningGoal) => {
    setData(prev => ({
      ...prev,
      learningGoals: prev.learningGoals.includes(goal)
        ? prev.learningGoals.filter(g => g !== goal)
        : [...prev.learningGoals, goal],
    }))
  }

  /* ─── Submit ─── */
  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      const res = await fetch('/api/user/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!res.ok) throw new Error('Failed to save onboarding')

      router.push('/dashboard')
    } catch (err) {
      console.error('Onboarding error:', err)
      alert('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  /* ─── Mascot expression per step ─── */
  const mascotExpression = step === 0 ? 'waving' : step === 1 ? 'happy' : step === 2 ? 'excited' : 'cheering'

  return (
    <div className="min-h-[100dvh] flex flex-col bg-base-100">

      {/* ═══ TOP BAR ═══ */}
      <div className="flex-shrink-0 px-4 pt-4 pb-2">
        <div className="max-w-lg mx-auto">
          {/* Logo */}
          <div className="flex items-center justify-center gap-2 mb-4">
            <MascotMini size={28} />
            <span className="text-lg font-extrabold text-base-content">
              Speak<span className="text-primary">Score</span>
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-base-200 rounded-full h-2 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="text-center text-[11px] text-base-content/35 font-semibold mt-1.5">
            Step {step + 1} of {TOTAL_STEPS}
          </p>
        </div>
      </div>

      {/* ═══ CONTENT ═══ */}
      <div className="flex-1 flex items-center justify-center px-4 py-6">
        <div className="w-full max-w-lg">

          {/* ── STEP 0: Voice Gender ── */}
          {step === 0 && (
            <StepContainer>
              <Mascot size={72} expression={mascotExpression as any} className="mx-auto mb-3 drop-shadow-sm" />
              <h1 className="text-2xl lg:text-3xl font-extrabold text-base-content text-center mb-1">
                Welcome to SpeakScore!
              </h1>
              <p className="text-base text-base-content/50 text-center mb-6">
                Let&apos;s set up your practice voice. Would you prefer a male or female speaker?
              </p>

              <div className="grid grid-cols-2 gap-3">
                {(['female', 'male'] as VoiceGender[]).map(gender => (
                  <button
                    key={gender}
                    onClick={() => setData(prev => ({ ...prev, voiceGender: gender }))}
                    className={`
                      card border-2 transition-all duration-200 cursor-pointer
                      hover:-translate-y-0.5 active:scale-[0.98]
                      ${data.voiceGender === gender
                        ? 'border-primary bg-primary/5 shadow-md shadow-primary/10'
                        : 'border-base-content/8 bg-base-100 hover:border-primary/20'
                      }
                    `}
                  >
                    <div className="card-body p-5 items-center text-center gap-2">
                      <span className="text-4xl">{gender === 'female' ? '👩' : '👨'}</span>
                      <span className="font-bold text-base text-base-content capitalize">{gender}</span>
                      {data.voiceGender === gender && (
                        <span className="badge badge-primary badge-sm gap-1">
                          <Check className="w-3 h-3" /> Selected
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </StepContainer>
          )}

          {/* ── STEP 1: Accent ── */}
          {step === 1 && (
            <StepContainer>
              <Mascot size={72} expression={mascotExpression as any} className="mx-auto mb-3 drop-shadow-sm" />
              <h1 className="text-2xl lg:text-3xl font-extrabold text-base-content text-center mb-1">
                Which accent do you want to learn?
              </h1>
              <p className="text-base text-base-content/50 text-center mb-6">
                You can change this anytime in settings.
              </p>

              <div className="grid grid-cols-2 gap-3">
                {([
                  { id: 'american' as VoiceAccent, label: 'American', emoji: '🇺🇸', desc: 'US English' },
                  { id: 'british' as VoiceAccent, label: 'British', emoji: '🇬🇧', desc: 'UK English' },
                ]).map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => setData(prev => ({ ...prev, voiceAccent: opt.id }))}
                    className={`
                      card border-2 transition-all duration-200 cursor-pointer
                      hover:-translate-y-0.5 active:scale-[0.98]
                      ${data.voiceAccent === opt.id
                        ? 'border-primary bg-primary/5 shadow-md shadow-primary/10'
                        : 'border-base-content/8 bg-base-100 hover:border-primary/20'
                      }
                    `}
                  >
                    <div className="card-body p-5 items-center text-center gap-2">
                      <span className="text-4xl">{opt.emoji}</span>
                      <span className="font-bold text-base text-base-content">{opt.label}</span>
                      <span className="text-xs text-base-content/40">{opt.desc}</span>
                      {data.voiceAccent === opt.id && (
                        <span className="badge badge-primary badge-sm gap-1">
                          <Check className="w-3 h-3" /> Selected
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </StepContainer>
          )}

          {/* ── STEP 2: Learning Goals ── */}
          {step === 2 && (
            <StepContainer>
              <Mascot size={72} expression={mascotExpression as any} className="mx-auto mb-3 drop-shadow-sm" />
              <h1 className="text-2xl lg:text-3xl font-extrabold text-base-content text-center mb-1">
                What are your goals?
              </h1>
              <p className="text-base text-base-content/50 text-center mb-6">
                Select all that apply — we&apos;ll personalize your experience.
              </p>

              <div className="space-y-2.5">
                {goalOptions.map(goal => {
                  const selected = data.learningGoals.includes(goal.id)
                  return (
                    <button
                      key={goal.id}
                      onClick={() => toggleGoal(goal.id)}
                      className={`
                        w-full card border-2 transition-all duration-200 cursor-pointer text-left
                        hover:-translate-y-0.5 active:scale-[0.99]
                        ${selected
                          ? 'border-primary bg-primary/5 shadow-sm shadow-primary/10'
                          : 'border-base-content/8 bg-base-100 hover:border-primary/20'
                        }
                      `}
                    >
                      <div className="card-body p-4 flex-row items-center gap-3">
                        <span className="text-2xl flex-shrink-0">{goal.emoji}</span>
                        <div className="flex-1 min-w-0">
                          <span className="font-bold text-sm text-base-content block">{goal.label}</span>
                          <span className="text-xs text-base-content/45">{goal.desc}</span>
                        </div>
                        <div className={`
                          w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all
                          ${selected
                            ? 'border-primary bg-primary'
                            : 'border-base-content/15'
                          }
                        `}>
                          {selected && <Check className="w-3.5 h-3.5 text-primary-content" />}
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </StepContainer>
          )}

          {/* ── STEP 3: Level ── */}
          {step === 3 && (
            <StepContainer>
              <Mascot size={72} expression={mascotExpression as any} className="mx-auto mb-3 drop-shadow-sm" />
              <h1 className="text-2xl lg:text-3xl font-extrabold text-base-content text-center mb-1">
                What&apos;s your current level?
              </h1>
              <p className="text-base text-base-content/50 text-center mb-6">
                Don&apos;t worry — we&apos;ll adjust as you practice.
              </p>

              <div className="space-y-3">
                {levelOptions.map(opt => {
                  const selected = data.level === opt.id
                  return (
                    <button
                      key={opt.id}
                      onClick={() => setData(prev => ({ ...prev, level: opt.id }))}
                      className={`
                        w-full card border-2 transition-all duration-200 cursor-pointer text-left
                        hover:-translate-y-0.5 active:scale-[0.99]
                        ${selected
                          ? 'border-primary bg-primary/5 shadow-md shadow-primary/10'
                          : 'border-base-content/8 bg-base-100 hover:border-primary/20'
                        }
                      `}
                    >
                      <div className="card-body p-5 flex-row items-center gap-4">
                        <span className="text-3xl flex-shrink-0">{opt.emoji}</span>
                        <div className="flex-1 min-w-0">
                          <span className="font-bold text-base text-base-content block">{opt.label}</span>
                          <span className="text-sm text-base-content/45">{opt.desc}</span>
                        </div>
                        {selected && (
                          <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                            <Check className="w-4 h-4 text-primary-content" />
                          </div>
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>
            </StepContainer>
          )}
        </div>
      </div>

      {/* ═══ BOTTOM NAV ═══ */}
      <div className="flex-shrink-0 px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-2">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          {step > 0 ? (
            <button
              onClick={handleBack}
              className="btn btn-ghost border border-base-content/8 flex-shrink-0"
            >
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
          ) : (
            <div /> /* spacer */
          )}

          <button
            onClick={handleNext}
            disabled={!canProceed() || isSubmitting}
            className="btn btn-primary flex-1 shadow-md shadow-primary/15 gap-2"
          >
            {isSubmitting ? (
              <>
                <span className="loading loading-spinner loading-sm" />
                Setting up...
              </>
            ) : step === TOTAL_STEPS - 1 ? (
              <>
                <Sparkles className="w-4 h-4" /> Let&apos;s Go!
              </>
            ) : (
              <>
                Continue <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════
   STEP CONTAINER — consistent animation wrapper
   ═══════════════════════════════════════════ */
function StepContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-300">
      {children}
    </div>
  )
}