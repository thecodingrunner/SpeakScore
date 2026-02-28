// app/[locale]/(dashboard)/practice/[lessonId]/page.tsx
'use client'

import { useState, useEffect, useMemo } from 'react'
import * as React from 'react'
import { useRouter } from 'next/navigation'
import {
  Mic, Volume2, RotateCcw, Check, ChevronLeft, X,
  Star, AlertCircle, TrendingUp, Target, Award,
  ChevronRight, Play, Ear, Lightbulb, ChevronDown
} from 'lucide-react'
import { usePostHog } from 'posthog-js/react'
import { convertToWav } from '@/lib/audio-converter'
import { getLessonConfig, type LessonAttempt } from '@/lib/lesson-config'
import { Mascot } from '@/components/global/Mascot'
import { useSubscription } from '@/contexts/SubscriptionContext'
import { SCENARIO_TIERS, type PlanTier } from '@/lib/plan-config'
import { useTranslations } from 'next-intl'

/* ═══════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════ */
interface Sentence {
  id: string; text: string; phonemes: string[]; difficulty: string
  audioUrls: { normal: string; slow: string }; scenario: string
}

interface JapaneseIssue {
  type: 'substitution' | 'epenthesis' | 'rhythm' | 'word_error' | 'missing_distinction'
  word?: string
  phoneme?: string
  expected?: string
  detected?: string
  description: string
  tip: string
  severity: 'low' | 'medium' | 'high'
}

interface AnalysisResult {
  success: boolean
  accuracy: number
  rawAccuracy: number
  fluencyScore: number
  completenessScore: number
  prosodyScore: number
  recognizedText: string
  freeFormText: string | null
  phonemeScores: Array<{ phoneme: string; score: number; parentWord?: string }>
  wordScores: Array<{ word: string; score: number; errorType?: string }>
  japaneseIssues: JapaneseIssue[]
  substitutionsDetected: Array<{ expected: string; detected: string; word: string }>
  epenthesisDetected: string[]
  xpEarned: number
  sentenceId: string
}

/* ═══════════════════════════════════════════
   LAYOUT
   ═══════════════════════════════════════════ */
const VIEW_H_MOBILE = 'h-[calc(100dvh-10rem)]'
const VIEW_H_DESKTOP = 'lg:h-[calc(100dvh-6rem)]'
const VIEW_H = `${VIEW_H_MOBILE} ${VIEW_H_DESKTOP}`

/* ═══════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════ */
export default function PracticeLessonPage({ params }: { params: Promise<{ lessonId: string }> }) {

  const router = useRouter()
  const posthog = usePostHog()
  const { getTier } = useSubscription()
  const t = useTranslations('lesson')

  const getLessonStorageKey = (lessonId: string) =>
  `lessonState_${lessonId}`

  const [lessonId, setLessonId] = useState('')
  const [sentence, setSentence] = useState<Sentence | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isRecording, setIsRecording] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [showFeedback, setShowFeedback] = useState(false)
  const [showSummary, setShowSummary] = useState(false)
  const [audioSpeed, setAudioSpeed] = useState<'normal' | 'slow'>('normal')
  const [recordedAudio, setRecordedAudio] = useState<Blob | null>(null)
  const [feedback, setFeedback] = useState<AnalysisResult | null>(null)
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null)
  const [showMoreTips, setShowMoreTips] = useState(false)
  const [lessonSessionId, setLessonSessionId] = useState<string | null>(null)

  const [lessonAttempts, setLessonAttempts] = useState<LessonAttempt[]>([])
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0)
  const [lessonStartTime, setLessonStartTime] = useState(Date.now())
  const [seenSentenceIds, setSeenSentenceIds] = useState<string[]>([])

  const lessonConfig = lessonId ? getLessonConfig(lessonId) : null
  const totalSentences = lessonConfig?.sentencesPerLesson || 10
  const progressPercent = ((currentSentenceIndex + 1) / totalSentences) * 100

  // useEffect(() => { 
  //   params.then(p => { 
  //     setLessonId(p.lessonId); 
  //     const storageKey = `lessonSession_${p.lessonId}`
  //     const savedSessionId = localStorage.getItem(storageKey)
  
  //     if (savedSessionId) {
  //       // Resume existing lesson
  //       setLessonSessionId(savedSessionId)
  //     } else {
  //       // Create new session
  //       const newSessionId = crypto.randomUUID()
  //       localStorage.setItem(storageKey, newSessionId)
  //       setLessonSessionId(newSessionId)
  //       setLessonStartTime(Date.now())
  //     }
  //   }) 
  // }, [params])

  useEffect(() => {
    params.then(p => {
      const id = p.lessonId
      setLessonId(id)

      const storageKey = getLessonStorageKey(id)

      const savedState = localStorage.getItem(storageKey)

      if (savedState) {
        const parsed = JSON.parse(savedState)

        setLessonSessionId(parsed.lessonSessionId)
        setCurrentSentenceIndex(parsed.currentSentenceIndex)
        setLessonStartTime(Date.now()) // always reset timer to now so stale localStorage timestamps don't skew duration
        setSeenSentenceIds(parsed.seenSentenceIds || [])

      } else {
        const newSessionId = crypto.randomUUID()

        const initialState = {
          lessonSessionId: newSessionId,
          currentSentenceIndex: 0,
          seenSentenceIds: []
        }

        localStorage.setItem(storageKey, JSON.stringify(initialState))

        setLessonSessionId(newSessionId)
        setLessonStartTime(Date.now())

        posthog?.capture('lesson_started', { lessonId: id, scenario: id })
      }
    })
  }, [params])

  useEffect(() => {
    if (!lessonId || !lessonSessionId) return

    const storageKey = getLessonStorageKey(lessonId)

    // Don't persist lessonStartTime — always reset to Date.now() on load
    const stateToSave = {
      lessonSessionId,
      currentSentenceIndex,
      seenSentenceIds
    }

    localStorage.setItem(storageKey, JSON.stringify(stateToSave))

  }, [
    lessonSessionId,
    currentSentenceIndex,
    seenSentenceIds,
    lessonId
  ])

  // Access gate: check tier and lesson limit
  useEffect(() => {
    if (!lessonId) return
    const check = async () => {
      const TIER_ORDER: Record<PlanTier, number> = { free: 0, pro: 1, premium: 2 }
      const scenarioTier: PlanTier = SCENARIO_TIERS[lessonId] ?? 'free'
      const userTier = getTier()
      if (TIER_ORDER[scenarioTier] > TIER_ORDER[userTier]) {
        router.replace('/pricing')
        return
      }
      try {
        const res = await fetch('/api/practice/lesson-status')
        const data = await res.json()
        if (data.remaining === 0) {
          router.replace('/pricing?limit=true')
        }
      } catch { /* non-blocking */ }
    }
    check()
  }, [lessonId])

  useEffect(() => {
    if (lessonId && currentSentenceIndex < totalSentences) fetchSentence(lessonId)
    else if (lessonId && currentSentenceIndex >= totalSentences) setShowSummary(true)
  }, [lessonId, currentSentenceIndex])

  const completeLesson = async (lessonSummary: any) => {
    if (!lessonSummary) return
    try {
      await fetch('/api/practice/complete-lesson', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lessonSessionId,
          lessonId,
          totalSentences: lessonSummary.total,
          averageAccuracy: lessonSummary.avg,
          totalXP: lessonSummary.xp,
          totalDurationSeconds: lessonSummary.time,
          sentenceIds: lessonAttempts.map(a => a.sentenceId)
        })
      })

      posthog?.capture('lesson_completed', {
        lessonId,
        scenario: lessonId,
        avgAccuracy: lessonSummary.avg,
        totalXP: lessonSummary.xp,
        durationSeconds: lessonSummary.time,
        sentenceCount: lessonSummary.total,
      })

      const storageKey = getLessonStorageKey(lessonId)
      localStorage.removeItem(storageKey)
    } catch (err) {
      console.error('Failed to complete lesson:', err)
    }
  }

  useEffect(() => {
    if (!showSummary || !lessonSessionId || !lessonSummary) return;
  
    completeLesson(lessonSummary)
  }, [showSummary])

  const fetchAudioUrls = async (s: { id: string; text: string }) => {
    try {
      const [normalRes, slowRes] = await Promise.all([
        fetch('/api/audio/resolve', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ sentenceId: s.id, text: s.text, speed: 'normal' }) }),
        fetch('/api/audio/resolve', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ sentenceId: s.id, text: s.text, speed: 'slow' }) }),
      ])
      const [normalData, slowData] = await Promise.all([normalRes.json(), slowRes.json()])
      setSentence(prev => prev ? { ...prev, audioUrls: { normal: normalData.url ?? '', slow: slowData.url ?? '' } } : null)
    } catch { /* audio fetch is non-critical */ }
  }

  const fetchSentence = async (scenario: string) => {
    try {
      setIsLoading(true)
      const res = await fetch('/api/practice/next-sentence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenario, excludeSentenceIds: seenSentenceIds })
      })
      if (!res.ok) throw new Error('Failed')
      const data = await res.json()
      setSentence(data.sentence)
      if (data.sentence?.id) {
        setSeenSentenceIds(prev => [...prev, data.sentence.id])
        fetchAudioUrls(data.sentence) // fetch audio in background after sentence is shown
      }
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
      const result: AnalysisResult = await res.json()
      setFeedback(result)
      setShowFeedback(true)
      setShowMoreTips(false)
      posthog?.capture('sentence_attempt', {
        lessonId,
        scenario: lessonId,
        sentenceId: sentence.id,
        accuracy: result.accuracy ?? 0,
        xpEarned: result.xpEarned ?? 0,
      })
      const pm: Record<string, number> = {}
      result.phonemeScores?.forEach((ps) => { pm[ps.phoneme] = ps.score })
      setLessonAttempts(prev => [...prev, {
        sentenceId: sentence.id,
        text: sentence.text,
        accuracy: result.accuracy || 0,
        phonemeScores: pm,
        wordScores: result.wordScores || [],
        attemptNumber: prev.filter(a => a.sentenceId === sentence.id).length + 1,
        japaneseIssues: result.japaneseIssues || [],
      } as LessonAttempt & { japaneseIssues: JapaneseIssue[] }])
      await fetch('/api/practice/record-attempt', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ 
          sentenceId: sentence.id, 
          accuracy: result.accuracy || 0, 
          phonemeScores: pm,
          lessonSessionId 
        }) 
      })
    } catch (e: any) { alert(`Analysis failed: ${e.message}`) }
    finally { setIsLoading(false) }
  }

  const handleNext = () => { setSentence(null); setCurrentSentenceIndex(p => p + 1); setCurrentStep(0); setShowFeedback(false); setRecordedAudio(null); setFeedback(null); setShowMoreTips(false) }
  const handleTryAgain = () => { setShowFeedback(false); setRecordedAudio(null); setIsRecording(false); setShowMoreTips(false) }

  /* ── Derived ── */

  const lessonJapaneseIssues = useMemo(() => {
    const seen = new Set<string>()
    const issues: JapaneseIssue[] = []
    lessonAttempts.forEach(a => {
      ;(a as any).japaneseIssues?.forEach((issue: JapaneseIssue) => {
        const key = `${issue.type}-${issue.phoneme || issue.word || issue.description}`
        if (!seen.has(key) && issue.severity !== 'low') { seen.add(key); issues.push(issue) }
      })
    })
    return issues
  }, [lessonAttempts])

  const lessonSummary = useMemo(() => {
    if (!lessonAttempts.length) return null
    const avg = Math.round(lessonAttempts.reduce((s, a) => s + a.accuracy, 0) / lessonAttempts.length)
    const xp = lessonAttempts.reduce((s, a) => s + (a.accuracy >= 90 ? 50 : a.accuracy >= 80 ? 30 : a.accuracy >= 70 ? 20 : 10), 0)
    const ps: Record<string, number[]> = {}
    lessonAttempts.forEach(a => Object.entries(a.phonemeScores).forEach(([p, s]) => { if (!ps[p]) ps[p] = []; ps[p].push(s) }))
    const pa = Object.entries(ps).map(([p, s]) => ({ phoneme: p, avg: Math.round(s.reduce((a, b) => a + b, 0) / s.length) }))
    return { name: lessonConfig?.name || 'Practice', total: lessonAttempts.length, avg, xp, weak: pa.filter(p => p.avg < 75).sort((a, b) => a.avg - b.avg), strong: pa.filter(p => p.avg >= 85).sort((a, b) => b.avg - a.avg), time: Math.round((Date.now() - lessonStartTime) / 1000) }
  }, [lessonAttempts, lessonStartTime, lessonConfig])

  const sortedTips = useMemo(() => {
    if (!feedback?.japaneseIssues) return []
    const order = { high: 0, medium: 1, low: 2 }
    return [...feedback.japaneseIssues].sort((a, b) => (order[a.severity] ?? 2) - (order[b.severity] ?? 2))
  }, [feedback])

  const accColor = (a: number) => a >= 85 ? 'text-success' : a >= 70 ? 'text-warning' : 'text-error'
  const severityColor = (s: string) => s === 'high' ? 'error' : s === 'medium' ? 'warning' : 'info'

  const wordScoreMap = useMemo(() => {
    const map = new Map<string, number>()
    feedback?.wordScores?.forEach(w => map.set(w.word.toLowerCase(), w.score))
    return map
  }, [feedback])

  /* ═══════════════════════════════════════════
     HEADER
     ═══════════════════════════════════════════ */
  const Header = () => (
    <div className="bg-base-100 border-b border-primary/8 flex-shrink-0">
      <div className="max-w-xl mx-auto px-4 py-2.5">
        <div className="flex items-center justify-between mb-1.5">
          <button onClick={() => {
            if (!showSummary) {
              posthog?.capture('lesson_abandoned', {
                lessonId,
                scenario: lessonId,
                sentencesCompleted: currentSentenceIndex,
              })
            }
            router.push('/practice')
            completeLesson(lessonSummary)
          }} className="btn btn-ghost btn-sm btn-circle"><ChevronLeft className="w-5 h-5" /></button>
          <div className="text-center">
            <h2 className="font-bold text-sm lg:text-base text-base-content leading-tight">{lessonConfig?.name || 'Practice'}</h2>
            <p className="text-[11px] text-base-content/40">{t('sentenceOf', { current: currentSentenceIndex + 1, total: totalSentences })}</p>
          </div>
          {sentence ? (
            <span className={`badge badge-sm font-semibold ${sentence.difficulty === 'Very Hard' ? 'badge-error' : sentence.difficulty === 'Hard' ? 'badge-warning' : 'badge-info'}`}>{sentence.difficulty}</span>
          ) : <div className="w-8" />}
        </div>
        <div className="w-full bg-base-200 rounded-full h-2 overflow-hidden">
          <div className="h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-all duration-500" style={{ width: `${progressPercent}%` }} />
        </div>
      </div>
    </div>
  )

  /* ═══════════════════════════════════════════
     SUMMARY (checked before !sentence so it isn't masked by the loading screen)
     ═══════════════════════════════════════════ */
  if (showSummary && lessonSummary) {
    const expr = lessonSummary.avg >= 85 ? 'cheering' : lessonSummary.avg >= 70 ? 'excited' : 'happy'
    return (
      <div className={`${VIEW_H} flex flex-col bg-base-100`}>
        <div className="bg-base-100 border-b border-primary/8 px-4 py-3 flex-shrink-0">
          <div className="max-w-xl mx-auto flex items-center justify-between">
            <h2 className="font-extrabold text-lg text-base-content">{t('lessonComplete')}</h2>
            <button onClick={() => router.push('/practice')} className="btn btn-ghost btn-sm btn-circle"><X className="w-5 h-5" /></button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-4 py-4">
          <div className="w-full max-w-xl mx-auto">
            <div className="text-center mb-5">
              <Mascot size={80} expression={expr as any} className="mx-auto mb-2 drop-shadow-md animate-bounce-gentle" />
              <h1 className="text-2xl lg:text-3xl font-extrabold text-base-content">
                {lessonSummary.avg >= 85 ? t('amazing') : lessonSummary.avg >= 70 ? t('greatJob') : t('keepGoing')}
              </h1>
              <p className="text-sm text-base-content/45">{lessonSummary.name}</p>
            </div>
            <div className="grid grid-cols-4 gap-2 lg:gap-3 mb-5">
              {[
                { icon: Target, val: `${lessonSummary.avg}%`, label: t('score'), c: 'text-primary', bg: 'bg-primary/8' },
                { icon: Star, val: `+${lessonSummary.xp}`, label: t('xp'), c: 'text-warning', bg: 'bg-warning/8' },
                { icon: Check, val: `${lessonSummary.total}`, label: t('done'), c: 'text-success', bg: 'bg-success/8' },
                { icon: TrendingUp, val: `${Math.floor(lessonSummary.time / 60)}m`, label: t('time'), c: 'text-info', bg: 'bg-info/8' },
              ].map((s, i) => { const I = s.icon; return (
                <div key={i} className="card bg-base-100 border border-base-content/6">
                  <div className="card-body p-2.5 lg:p-3 items-center text-center gap-1">
                    <div className={`w-9 h-9 lg:w-10 lg:h-10 rounded-xl ${s.bg} flex items-center justify-center`}><I className={`w-4 h-4 lg:w-5 lg:h-5 ${s.c}`} /></div>
                    <span className="text-lg lg:text-xl font-extrabold text-base-content leading-none">{s.val}</span>
                    <span className="text-[10px] lg:text-xs font-semibold text-base-content/35 uppercase">{s.label}</span>
                  </div>
                </div>
              )})}
            </div>
            {(lessonSummary.strong.length > 0 || lessonSummary.weak.length > 0) && (
              <div className="grid grid-cols-2 gap-3 mb-5">
                {lessonSummary.strong.length > 0 && (
                  <div className="bg-success/5 border border-success/12 rounded-2xl p-3">
                    <h3 className="font-bold text-xs text-success flex items-center gap-1.5 mb-2"><Award className="w-4 h-4" /> {t('strong')}</h3>
                    <div className="flex flex-wrap gap-1">{lessonSummary.strong.slice(0, 3).map((p, i) => <span key={i} className="text-xs font-bold bg-success/10 text-success px-2 py-0.5 rounded-full">{p.phoneme} {p.avg}%</span>)}</div>
                  </div>
                )}
                {lessonSummary.weak.length > 0 && (
                  <div className="bg-warning/5 border border-warning/12 rounded-2xl p-3">
                    <h3 className="font-bold text-xs text-warning flex items-center gap-1.5 mb-2"><AlertCircle className="w-4 h-4" /> {t('improve')}</h3>
                    <div className="flex flex-wrap gap-1">{lessonSummary.weak.slice(0, 3).map((p, i) => <span key={i} className="text-xs font-bold bg-warning/10 text-warning px-2 py-0.5 rounded-full">{p.phoneme} {p.avg}%</span>)}</div>
                  </div>
                )}
              </div>
            )}
            {lessonJapaneseIssues.length > 0 && (
              <div className="bg-info/5 border border-info/12 rounded-2xl p-4 mb-5">
                <h3 className="font-bold text-sm text-info flex items-center gap-1.5 mb-3"><Lightbulb className="w-4 h-4" /> {t('keyAreas')}</h3>
                <div className="space-y-2">
                  {lessonJapaneseIssues.slice(0, 4).map((issue, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className={`mt-0.5 w-2 h-2 rounded-full flex-shrink-0 bg-${severityColor(issue.severity)}`} />
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-base-content/70">{issue.description}</p>
                        <p className="text-xs text-base-content/45">{issue.tip}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {lessonAttempts.length > 0 && (
              <div className="mb-5">
                <h3 className="font-bold text-sm text-base-content flex items-center gap-1.5 mb-3">
                  <Target className="w-4 h-4 text-primary" /> {t('sentencesReview')}
                </h3>
                <div className="space-y-2">
                  {lessonAttempts.map((attempt, i) => (
                    <div key={i} className="flex items-start gap-3 bg-base-200/40 border border-base-content/5 rounded-xl px-3 py-2.5">
                      <div
                        className={`radial-progress ${accColor(attempt.accuracy)} text-xs font-extrabold flex-shrink-0`}
                        style={{ '--value': attempt.accuracy, '--size': '2.5rem', '--thickness': '3px' } as React.CSSProperties}
                        role="progressbar"
                      >
                        {attempt.accuracy}%
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs lg:text-sm font-semibold text-base-content leading-snug">
                          &ldquo;{attempt.text}&rdquo;
                        </p>
                        {Object.entries(attempt.phonemeScores).slice(0, 5).length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {Object.entries(attempt.phonemeScores).slice(0, 5).map(([ph, score], j) => (
                              <span key={j} className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                                score >= 85 ? 'bg-success/10 text-success' : score >= 70 ? 'bg-warning/10 text-warning' : 'bg-error/10 text-error'
                              }`}>{ph} {score}%</span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="flex gap-3">
              <button onClick={() => router.push('/practice')} className="btn btn-ghost flex-1 border border-base-content/8">{t('back')}</button>
              <button onClick={() => { setShowSummary(false); setCurrentSentenceIndex(0); setLessonAttempts([]); setSeenSentenceIds([]); setLessonStartTime(Date.now()) }} className="btn btn-primary flex-1 shadow-sm shadow-primary/15 gap-1.5"><RotateCcw className="w-4 h-4" /> {t('again')}</button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  /* ═══════════════════════════════════════════
     LOADING / NO SENTENCE
     Show mascot whenever no sentence is available (loading or between sentences)
     ═══════════════════════════════════════════ */
  if (!sentence) {
    return (
      <div className={`${VIEW_H} flex flex-col bg-base-100 overflow-hidden`}>
        {lessonId && lessonConfig && <Header />}
        <div className="flex-1 flex flex-col items-center justify-center gap-3">
          <Mascot size={80} expression="thinking" className="opacity-70 animate-float" />
          <p className="text-sm text-base-content/40 font-semibold">{currentSentenceIndex > 0 ? t('nextSentence') : t('loading')}</p>
        </div>
      </div>
    )
  }

  /* ═══════════════════════════════════════════
     MAIN VIEW
     Three zones: Header (fixed) → Content (flex-1) → Footer (fixed, feedback only)
     Feedback content uses flex-col with justify-between so it
     always distributes within the available space.
     ═══════════════════════════════════════════ */
  return (
    <div className={`${VIEW_H} flex flex-col bg-base-100 overflow-hidden`}>
      <Header />

      <div className="flex-1 flex flex-col min-h-0">
        {!showFeedback ? (
          /* ═══ LISTEN / RECORD ═══ */
          <div className="flex-1 flex items-center justify-center px-4">
            <div className="w-full max-w-xl text-center">
              {currentStep === 0 && (
                <>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/8 border border-primary/12 rounded-full text-xs lg:text-sm font-bold text-primary mb-4">
                    <Volume2 className="w-3.5 h-3.5" /> {t('step1')}
                  </span>
                  <h2 className="text-xl lg:text-2xl font-extrabold text-base-content mb-4">{t('listenTitle')}</h2>
                  <div className="card bg-primary/5 border border-primary/12 mb-5">
                    <div className="card-body p-4 lg:p-5">
                      <p className="text-xl lg:text-2xl font-bold text-base-content leading-relaxed">&ldquo;{sentence.text}&rdquo;</p>
                      <div className="flex flex-wrap items-center justify-center gap-1.5 mt-2">
                        <span className="text-xs text-base-content/35">{t('target')}</span>
                        {sentence.phonemes.map((p, i) => <span key={i} className="text-xs font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full">{p}</span>)}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-center gap-3 mb-5">
                    <button onClick={handlePlayAudio} className="btn btn-circle btn-lg btn-primary shadow-md shadow-primary/20"><Play className="w-7 h-7 ml-0.5" /></button>
                    <div className="flex gap-1">
                      {(['normal', 'slow'] as const).map(s => (
                        <button key={s} className={`btn btn-sm ${audioSpeed === s ? 'btn-primary' : 'btn-ghost border border-base-content/8'}`} onClick={() => setAudioSpeed(s)}>{s === 'normal' ? t('normal') : t('slow')}</button>
                      ))}
                    </div>
                  </div>
                  <button onClick={() => setCurrentStep(1)} className="btn btn-primary gap-1.5 shadow-sm shadow-primary/15">{t('myTurn')} <ChevronRight className="w-4 h-4" /></button>
                </>
              )}
              {currentStep === 1 && (
                <>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-accent/8 border border-accent/12 rounded-full text-xs lg:text-sm font-bold text-accent mb-4">
                    <Mic className="w-3.5 h-3.5" /> {t('step2')}
                  </span>
                  <h2 className="text-xl lg:text-2xl font-extrabold text-base-content mb-4">{t('sayItYourself')}</h2>
                  <div className="card bg-primary/5 border border-primary/12 mb-5">
                    <div className="card-body p-4 lg:p-5">
                      <p className="text-xl lg:text-2xl font-bold text-base-content leading-relaxed">&ldquo;{sentence.text}&rdquo;</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-center gap-3 mb-5">
                    <button onClick={handleRecordToggle} disabled={isLoading}
                      className={`btn btn-circle w-24 h-24 shadow-lg transition-all duration-300 ${isRecording ? 'btn-error animate-pulse shadow-error/30 scale-110' : 'btn-primary shadow-primary/20 hover:scale-105'}`}>
                      <Mic className="w-10 h-10" />
                    </button>
                    <p className="text-sm font-semibold text-base-content/50">{isRecording ? t('recording') : t('tapToRecord')}</p>
                    {recordedAudio && !isRecording && <span className="text-sm text-success font-bold flex items-center gap-1"><Check className="w-4 h-4" /> {t('recordingComplete')}</span>}
                  </div>
                  {recordedAudio && !isRecording && (
                    <div className="flex gap-2 justify-center">
                      <button onClick={handleTryAgain} className="btn btn-ghost gap-1.5 border border-base-content/8"><RotateCcw className="w-4 h-4" /> {t('redo')}</button>
                      <button onClick={handleSubmit} disabled={isLoading} className="btn btn-primary gap-1.5 shadow-sm shadow-primary/15">
                        {isLoading ? <><span className="loading loading-spinner loading-sm" /> {t('analyzing')}</> : <><Check className="w-4 h-4" /> {t('check')}</>}
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

        ) : (
          /* ════════════════════════════════════════════
             FEEDBACK — flex-col with 3 fixed-purpose zones.
             The middle zone uses flex-1 + justify-center
             so content is always vertically centered in
             whatever space remains. No scroll needed.
             ════════════════════════════════════════════ */
          <div className="flex-1 flex flex-col px-4 max-w-xl mx-auto w-full min-h-0">

            {/* ── ZONE A: Score header ── always same height */}
            <div className="flex-1 flex items-center gap-4 flex-shrink-0 py-3 lg:py-4">
              <div
                className={`radial-progress ${accColor(feedback?.accuracy || 0)} text-2xl lg:text-3xl font-extrabold flex-shrink-0`}
                style={{ '--value': feedback?.accuracy || 0, '--size': '5rem', '--thickness': '0.4rem' } as React.CSSProperties}
                role="progressbar"
              >
                {feedback?.accuracy || 0}%
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-base lg:text-lg font-extrabold text-base-content leading-tight">
                  {(feedback?.accuracy || 0) >= 85 ? t('excellent') : (feedback?.accuracy || 0) >= 70 ? t('goodJob') : t('niceTry')}
                </h2>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-0.5 text-[11px] text-base-content/40">
                  <span>{t('fluency')} <span className={`font-bold ${accColor(feedback?.fluencyScore || 0)}`}>{feedback?.fluencyScore}%</span></span>
                  <span>{t('completeness')} <span className={`font-bold ${accColor(feedback?.completenessScore || 0)}`}>{feedback?.completenessScore}%</span></span>
                  <span>{t('prosody')} <span className={`font-bold ${accColor(feedback?.prosodyScore || 0)}`}>{feedback?.prosodyScore}%</span></span>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  {(feedback?.xpEarned || 0) > 0 && (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-warning"><Star className="w-3 h-3" /> +{feedback?.xpEarned} XP</span>
                  )}
                  {(feedback?.accuracy || 0) < 70 && (
                    <span className="text-[10px] text-base-content/25 italic">{t('tryAgainOrMove')}</span>
                  )}
                </div>
              </div>
            </div>

            {/* ── ZONE B: Middle content — fills remaining space ── */}
            <div className="flex-1 flex flex-col justify-center min-h-0 gap-3">

              {/* Sentence with inline color-coded words */}
              <div className="card bg-base-200/30 border border-base-content/5">
                <div className="card-body p-3 lg:p-4">
                  <p className="text-base lg:text-lg leading-relaxed text-center">
                    {sentence.text.split(/\s+/).map((word, i) => {
                      const clean = word.replace(/[^a-zA-Z']/g, '').toLowerCase()
                      const score = wordScoreMap.get(clean)
                      const color = score !== undefined
                        ? score >= 85 ? 'text-success' : score >= 70 ? 'text-warning' : 'text-error'
                        : 'text-base-content/50'
                      return (
                        <span key={i}>
                          <span className={`${color} font-bold`}>{word}</span>
                          {score !== undefined && score < 85 && (
                            <sub className={`${color} text-[9px] font-bold ml-0.5 opacity-60`}>{score}</sub>
                          )}
                          {' '}
                        </span>
                      )
                    })}
                  </p>
                  {feedback?.freeFormText && feedback.freeFormText.toLowerCase().trim() !== sentence.text.toLowerCase().trim() && (
                    <div className="flex items-center justify-center gap-1.5 mt-2 pt-2 border-t border-base-content/5">
                      <Ear className="w-3 h-3 text-base-content/25" />
                      <p className="text-[11px] text-base-content/35">
                        {t('heard')} <span className="font-semibold text-base-content/50">&ldquo;{feedback.freeFormText}&rdquo;</span>
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Substitution pills */}
              {feedback?.substitutionsDetected && feedback.substitutionsDetected.length > 0 && (
                <div className="flex flex-wrap items-center justify-center gap-1.5">
                  <Ear className="w-3 h-3 text-error/40" />
                  {feedback.substitutionsDetected.slice(0, 4).map((sub, i) => (
                    <span key={i} className="text-[11px] font-semibold bg-error/6 text-error/60 px-2 py-0.5 rounded-full border border-error/8">
                      {sub.expected} → {sub.detected}
                    </span>
                  ))}
                </div>
              )}

              {/* Top tip — just 1, with expand for more */}
              {sortedTips.length > 0 && (
                <div className={`border rounded-xl px-3 py-2.5 ${
                  sortedTips[0].severity === 'high' ? 'bg-error/4 border-error/10' :
                  sortedTips[0].severity === 'medium' ? 'bg-warning/4 border-warning/10' :
                  'bg-info/4 border-info/10'
                }`}>
                  <p className="text-xs text-base-content/55 leading-snug">
                    {sortedTips[0].word && <span className="font-bold text-base-content/80">&ldquo;{sortedTips[0].word}&rdquo; — </span>}
                    {sortedTips[0].description}
                  </p>
                  <p className="text-[11px] text-primary/60 leading-snug mt-0.5">💡 {sortedTips[0].tip}</p>

                  {sortedTips.length > 1 && (
                    <>
                      <button
                        onClick={() => setShowMoreTips(!showMoreTips)}
                        className="text-[10px] font-semibold text-base-content/25 hover:text-base-content/45 mt-1.5 flex items-center gap-0.5 transition-colors"
                      >
                        {showMoreTips ? t('showLess') : t('showMore', { count: sortedTips.length - 1 })}
                        <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${showMoreTips ? 'rotate-180' : ''}`} />
                      </button>
                      {showMoreTips && (
                        <div className="mt-1.5 pt-1.5 border-t border-base-content/5 space-y-1 max-h-20 overflow-y-auto">
                          {sortedTips.slice(1, 4).map((tip, i) => (
                            <p key={i} className="text-[11px] text-base-content/40 leading-snug">
                              {tip.word && <span className="font-semibold text-base-content/55">&ldquo;{tip.word}&rdquo; </span>}
                              💡 {tip.tip}
                            </p>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>

            {/* ── ZONE C: Buttons ── always pinned to bottom */}
            <div className="flex-1 flex gap-3 py-3 flex-shrink-0 items-end">
              <button onClick={handleTryAgain} className="btn btn-ghost flex-1 gap-1.5 border border-base-content/8">
                <RotateCcw className="w-4 h-4" /> {t('retry')}
              </button>
              <button onClick={handleNext} className="btn btn-primary flex-1 gap-1.5 shadow-sm shadow-primary/15">
                {currentSentenceIndex + 1 >= totalSentences ? t('finish') : t('next')} <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}