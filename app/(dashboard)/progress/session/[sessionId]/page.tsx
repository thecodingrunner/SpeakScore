'use client'

import { use, useEffect, useState } from 'react'
import * as React from 'react'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft, Target, Star, Check, TrendingUp, Award,
  AlertCircle, Calendar, Clock, Mic, RefreshCw,
} from 'lucide-react'
import { Mascot } from '@/components/global/Mascot'
import { ProRoute } from '@/components/global/ProRoute'

/* ═══════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════ */
interface SentenceResult {
  sentenceId: string
  text: string | null
  latestAccuracy: number
  bestAccuracy: number
  attempts: number
  phonemeScores: { phoneme: string; score: number }[]
}

interface SessionData {
  lessonSessionId: string
  lessonId: string
  totalSentences: number
  averageAccuracy: number
  totalXP: number
  totalDurationSeconds: number
  completedAt: string
}

interface SessionDetail {
  session: SessionData
  sentences: SentenceResult[]
}

/* ═══════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════ */
function extractLessonName(lessonId: string): string {
  const map: Record<string, string> = {
    daily_drill: 'Daily Drill',
    phoneme_r_vs_l: '/r/ vs /l/ Sounds',
    phoneme_th_sounds: '/th/ Sounds',
    phoneme_f_vs_h: '/f/ vs /h/ Sounds',
    toeic: 'TOEIC Speaking',
    phoneme_v_vs_b: '/v/ vs /b/ Sounds',
    phoneme_word_stress: 'Word Stress',
    phoneme_silent_letters: 'Silent Letters',
    business: 'Business Meetings',
    interview: 'Job Interviews',
    phone: 'Phone Calls',
  }
  for (const [key, name] of Object.entries(map)) {
    if (lessonId.includes(key)) return name
  }
  return 'Practice Session'
}

const accColor = (a: number) => a >= 85 ? 'text-success' : a >= 70 ? 'text-warning' : 'text-error'
const accBadge = (a: number) =>
  a >= 85 ? 'bg-success/10 text-success border-success/15' :
  a >= 70 ? 'bg-warning/10 text-warning border-warning/15' :
  'bg-error/10 text-error border-error/15'
const accLabel = (a: number) => a >= 85 ? 'Excellent' : a >= 70 ? 'Good' : 'Needs Work'

/* ═══════════════════════════════════════════
   SENTENCE CARD
   ═══════════════════════════════════════════ */
function SentenceCard({ sentence, index }: { sentence: SentenceResult; index: number }) {
  const acc = sentence.latestAccuracy

  return (
    <div className="card bg-base-100 border border-base-content/5">
      <div className="card-body p-4 lg:p-5">
        <div className="flex items-start gap-3 lg:gap-4">

          {/* Score circle */}
          <div
            className={`radial-progress ${accColor(acc)} text-sm font-extrabold flex-shrink-0`}
            style={{ '--value': acc, '--size': '3.25rem', '--thickness': '3px' } as React.CSSProperties}
            role="progressbar"
          >
            {acc}%
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Header row */}
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <span className="text-[11px] font-bold text-base-content/30 uppercase tracking-wider">
                Sentence {index + 1}
              </span>
              <span className={`inline-flex text-[10px] font-bold px-2 py-0.5 rounded-full border flex-shrink-0 ${accBadge(acc)}`}>
                {accLabel(acc)}
              </span>
            </div>

            {/* Sentence text */}
            {sentence.text ? (
              <p className="text-sm lg:text-base font-semibold text-base-content leading-snug mb-2">
                &ldquo;{sentence.text}&rdquo;
              </p>
            ) : (
              <p className="text-sm text-base-content/30 italic mb-2">{sentence.sentenceId}</p>
            )}

            {/* Meta */}
            <div className="flex items-center gap-3 text-xs text-base-content/35 mb-2">
              <span>{sentence.attempts} {sentence.attempts === 1 ? 'attempt' : 'attempts'}</span>
              {sentence.bestAccuracy > sentence.latestAccuracy && (
                <span>
                  Best: <span className={`font-bold ${accColor(sentence.bestAccuracy)}`}>{sentence.bestAccuracy}%</span>
                </span>
              )}
            </div>

            {/* Phoneme score pills */}
            {sentence.phonemeScores.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {sentence.phonemeScores.slice(0, 8).map((p, i) => (
                  <span
                    key={i}
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      p.score >= 85 ? 'bg-success/10 text-success' :
                      p.score >= 70 ? 'bg-warning/10 text-warning' :
                      'bg-error/10 text-error'
                    }`}
                  >
                    {p.phoneme} {p.score}%
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════
   PAGE
   ═══════════════════════════════════════════ */
export default function SessionDetailPage({ params }: { params: Promise<{ sessionId: string }> }) {
  const resolvedParams = use(params)
  const router = useRouter()
  const [data, setData] = useState<SessionDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => { fetchSession() }, [resolvedParams.sessionId])

  useEffect(() => {
    console.log("Data: ", data);
  }, [data])

  const fetchSession = async () => {
    setLoading(true)
    setError(false)
    try {
      const res = await fetch(`/api/progress/session/${resolvedParams.sessionId}`)
      if (!res.ok) throw new Error('Not found')
      const json = await res.json()
      setData(json)
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  /* ─── Loading ─── */
  if (loading) {
    return (
      <ProRoute>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <Mascot size={88} expression="thinking" className="animate-float opacity-70" />
          <span className="loading loading-dots loading-lg text-primary" />
          <p className="text-base text-base-content/50 font-semibold">Loading session...</p>
        </div>
      </ProRoute>
    )
  }

  /* ─── Error ─── */
  if (error || !data) {
    return (
      <ProRoute>
        <div className="max-w-lg mx-auto px-4 py-16 text-center">
          <Mascot size={88} expression="thinking" className="mx-auto mb-4 opacity-60" />
          <h3 className="font-extrabold text-xl mb-2 text-base-content">Session not found</h3>
          <p className="text-base text-base-content/50 mb-5">Couldn&apos;t load this session.</p>
          <div className="flex gap-3 justify-center">
            <button onClick={() => router.back()} className="btn btn-ghost border border-base-content/10">Go Back</button>
            <button onClick={fetchSession} className="btn btn-primary gap-2"><RefreshCw className="w-4 h-4" /> Retry</button>
          </div>
        </div>
      </ProRoute>
    )
  }

  const { session, sentences } = data
  const avg = session.averageAccuracy
  const expr = avg >= 85 ? 'cheering' : avg >= 70 ? 'excited' : 'happy'
  const lessonName = extractLessonName(session.lessonId)
  const completedDate = new Date(session.completedAt)
  const durationMins = Math.max(1, Math.floor(session.totalDurationSeconds / 60))

  // Aggregate phoneme scores across all sentences
  const phonemeMap: Record<string, number[]> = {}
  sentences.forEach(s => {
    s.phonemeScores.forEach(p => {
      if (!phonemeMap[p.phoneme]) phonemeMap[p.phoneme] = []
      phonemeMap[p.phoneme].push(p.score)
    })
  })
  const phonemeAverages = Object.entries(phonemeMap).map(([ph, scores]) => ({
    phoneme: ph,
    avg: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
  }))
  const strongPhonemes = phonemeAverages.filter(p => p.avg >= 85).sort((a, b) => b.avg - a.avg)
  const weakPhonemes = phonemeAverages.filter(p => p.avg < 75).sort((a, b) => a.avg - b.avg)

  return (
    <ProRoute>
      <div className="max-w-2xl mx-auto px-4 py-5 lg:px-8 lg:py-8 pb-28 lg:pb-10">

        {/* Back */}
        <button onClick={() => router.back()} className="btn btn-ghost btn-sm gap-1.5 mb-5 -ml-2">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        {/* ═══ SUMMARY CARD ═══ */}
        <div className="card bg-base-100 border border-base-content/5 mb-6">
          <div className="card-body p-5 lg:p-6">

            {/* Mascot + lesson name + date */}
            <div className="flex items-start gap-4 mb-5">
              <Mascot size={64} expression={expr as any} className="flex-shrink-0 drop-shadow-sm" />
              <div className="flex-1 min-w-0">
                <h1 className="font-extrabold text-xl lg:text-2xl text-base-content leading-tight">
                  {lessonName}
                </h1>
                <p className="text-sm lg:text-base font-bold text-base-content/45 mt-0.5">
                  {avg >= 85 ? 'Amazing work! 🌸' : avg >= 70 ? 'Great effort!' : 'Keep practising!'}
                </p>
                <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-base-content/35 mt-1.5">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {completedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {completedDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            </div>

            {/* 4 stat cards */}
            <div className="grid grid-cols-4 gap-2 lg:gap-3 mb-5">
              {[
                { icon: Target, val: `${avg}%`, label: 'Score', c: 'text-primary', bg: 'bg-primary/8' },
                { icon: Star, val: `+${session.totalXP}`, label: 'XP', c: 'text-warning', bg: 'bg-warning/8' },
                { icon: Check, val: `${session.totalSentences}`, label: 'Done', c: 'text-success', bg: 'bg-success/8' },
                { icon: TrendingUp, val: `${durationMins}m`, label: 'Time', c: 'text-info', bg: 'bg-info/8' },
              ].map((s, i) => {
                const I = s.icon
                return (
                  <div key={i} className="card bg-base-200/50 border border-base-content/5">
                    <div className="card-body p-2.5 lg:p-3 items-center text-center gap-1">
                      <div className={`w-8 h-8 lg:w-10 lg:h-10 rounded-xl ${s.bg} flex items-center justify-center`}>
                        <I className={`w-4 h-4 ${s.c}`} />
                      </div>
                      <span className="text-base lg:text-lg font-extrabold text-base-content leading-none">{s.val}</span>
                      <span className="text-[10px] font-semibold text-base-content/35 uppercase tracking-wider">{s.label}</span>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Strong / Weak phonemes */}
            {(strongPhonemes.length > 0 || weakPhonemes.length > 0) && (
              <div className="grid grid-cols-2 gap-3">
                {strongPhonemes.length > 0 && (
                  <div className="bg-success/5 border border-success/12 rounded-2xl p-3">
                    <h3 className="font-bold text-xs text-success flex items-center gap-1.5 mb-2">
                      <Award className="w-3.5 h-3.5" /> Strong
                    </h3>
                    <div className="flex flex-wrap gap-1">
                      {strongPhonemes.slice(0, 3).map((p, i) => (
                        <span key={i} className="text-xs font-bold bg-success/10 text-success px-2 py-0.5 rounded-full">
                          {p.phoneme} {p.avg}%
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {weakPhonemes.length > 0 && (
                  <div className="bg-warning/5 border border-warning/12 rounded-2xl p-3">
                    <h3 className="font-bold text-xs text-warning flex items-center gap-1.5 mb-2">
                      <AlertCircle className="w-3.5 h-3.5" /> Improve
                    </h3>
                    <div className="flex flex-wrap gap-1">
                      {weakPhonemes.slice(0, 3).map((p, i) => (
                        <span key={i} className="text-xs font-bold bg-warning/10 text-warning px-2 py-0.5 rounded-full">
                          {p.phoneme} {p.avg}%
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ═══ SENTENCES ═══ */}
        {sentences.length > 0 && (
          <>
            <h2 className="font-extrabold text-base lg:text-lg text-base-content flex items-center gap-2 mb-3">
              <Mic className="w-4 h-4 text-primary" /> Sentences
            </h2>
            <div className="space-y-3">
              {sentences.map((s, idx) => (
                <SentenceCard key={s.sentenceId} sentence={s} index={idx} />
              ))}
            </div>
          </>
        )}
      </div>
    </ProRoute>
  )
}
