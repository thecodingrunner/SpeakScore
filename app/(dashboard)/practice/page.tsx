// app/[locale]/(dashboard)/practice/page.tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@clerk/nextjs'
import {
  Mic, Clock, Star, ChevronRight, MessageCircle, Lock,
  Target, Sparkles, ArrowRight, AlertCircle
} from 'lucide-react'
import { useSubscription } from '@/contexts/SubscriptionContext'
import { Mascot } from '@/components/global/Mascot'
import { SCENARIO_TIERS, type PlanTier } from '@/lib/plan-config'
import { useTranslations } from 'next-intl'

/* ═══════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════ */
interface RecentSession {
  id: string; date: string; time: string; sentenceId: string
  lesson: string; accuracy: number; duration: number; xp: number; attempts: number
}
interface DailyGoal { practiced: number; goal: number; percentage: number; remaining: number }
interface LessonStatus {
  tier: PlanTier; used: number; max: number | null; remaining: number | null
  period: 'week' | 'month' | null; resetDate: string | null
}

/* ═══════════════════════════════════════════
   SCENARIO DATA
   ═══════════════════════════════════════════ */
const scenarios = [
  { id: 'daily_drill', title: 'Daily Drill', description: 'Quick 5-min warm-up', icon: '⚡', duration: '5 min', difficulty: 'All Levels', tier: 'free' as PlanTier, sentences: 50, badge: 'QUICK' },
  { id: 'phoneme_r_vs_l', title: '/r/ vs /l/ Sounds', description: 'Right vs Light, Read vs Lead', icon: '🔤', duration: '10–15 min', difficulty: 'Hard', tier: 'free' as PlanTier, sentences: 50, badge: 'POPULAR' },
  { id: 'phoneme_th_sounds', title: '/th/ Sounds', description: 'Think, That, This, The', icon: '👅', duration: '10–15 min', difficulty: 'Very Hard', tier: 'free' as PlanTier, sentences: 50, badge: null },
  { id: 'phoneme_f_vs_h', title: '/f/ vs /h/ Sounds', description: 'Fish vs Hish, Fan vs Han', icon: '🗣️', duration: '10–15 min', difficulty: 'Medium', tier: 'free' as PlanTier, sentences: 50, badge: null },
  { id: 'toeic', title: 'TOEIC Speaking', description: 'Official test format', icon: '📝', duration: '15–20 min', difficulty: 'Intermediate', tier: 'pro' as PlanTier, sentences: 50, badge: 'TEST PREP' },
  { id: 'phoneme_v_vs_b', title: '/v/ vs /b/ Sounds', description: 'Very vs Berry, Vote vs Boat', icon: '🎵', duration: '10–15 min', difficulty: 'Medium', tier: 'pro' as PlanTier, sentences: 50, badge: null },
  { id: 'phoneme_word_stress', title: 'Word Stress', description: 'REcord vs reCORD', icon: '🎯', duration: '10–15 min', difficulty: 'Hard', tier: 'pro' as PlanTier, sentences: 50, badge: null },
  { id: 'phoneme_silent_letters', title: 'Silent Letters', description: 'Knight, Psychology, Wednesday', icon: '🤫', duration: '10–15 min', difficulty: 'Medium', tier: 'pro' as PlanTier, sentences: 50, badge: null },
  { id: 'business', title: 'Business Meetings', description: 'Professional phrases', icon: '💼', duration: '10–15 min', difficulty: 'Intermediate', tier: 'pro' as PlanTier, sentences: 15, badge: 'PRO' },
  { id: 'interview', title: 'Job Interviews', description: 'Common questions', icon: '🤝', duration: '15–20 min', difficulty: 'Advanced', tier: 'pro' as PlanTier, sentences: 15, badge: 'PRO' },
  { id: 'phone', title: 'Phone Calls', description: 'Clear communication', icon: '📞', duration: '10 min', difficulty: 'Intermediate', tier: 'pro' as PlanTier, sentences: 10, badge: 'PRO' },
]

const TIER_ORDER: Record<PlanTier, number> = { free: 0, pro: 1, premium: 2 }

const difficultyColor = (d: string) => {
  switch (d) { case 'Very Hard': return 'badge-error'; case 'Hard': return 'badge-warning'; case 'Medium': return 'badge-info'; case 'Advanced': return 'badge-error'; case 'Intermediate': return 'badge-success'; default: return 'badge-primary' }
}
const badgeColor = (b: string) => {
  switch (b) { case 'POPULAR': return 'bg-primary/10 text-primary border-primary/20'; case 'QUICK': return 'bg-success/10 text-success border-success/20'; case 'TEST PREP': return 'bg-info/10 text-info border-info/20'; case 'PRO': return 'bg-warning/10 text-warning border-warning/20'; default: return 'bg-base-content/5 text-base-content/50' }
}
const getScenarioName = (sentenceId: string): string => {
  const map: Record<string, string> = { daily_drill: 'Daily Drill', phoneme_r_vs_l: '/r/ vs /l/', phoneme_th_sounds: '/th/ Sounds', phoneme_f_vs_h: '/f/ vs /h/', toeic: 'TOEIC Speaking', toeic_speaking: 'TOEIC Speaking', phoneme_v_vs_b: '/v/ vs /b/', phoneme_word_stress: 'Word Stress', phoneme_silent_letters: 'Silent Letters', business: 'Business Meetings', interview: 'Job Interviews', phone: 'Phone Calls' }
  for (const [key, name] of Object.entries(map)) { if (sentenceId.includes(key)) return name }
  return 'Practice Session'
}

/* ═══════════════════════════════════════════
   PAGE
   ═══════════════════════════════════════════ */
export default function PracticePage() {
  const { isSignedIn, userId } = useAuth()
  const { isPro, getTier, loading: subscriptionLoading } = useSubscription()
  const t = useTranslations('practicePage')
  const ts = useTranslations('scenarios')
  const [recentSessions, setRecentSessions] = useState<RecentSession[]>([])
  const [loading, setLoading] = useState(true)
  const [dailyGoal, setDailyGoal] = useState<DailyGoal>({ practiced: 0, goal: 10, percentage: 0, remaining: 10 })
  const [lessonStatus, setLessonStatus] = useState<LessonStatus | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      if (!isSignedIn || !userId) { setLoading(false); return }
      try {
        const [statsRes, statusRes] = await Promise.all([
          fetch('/api/progress/stats?range=week'),
          fetch('/api/practice/lesson-status'),
        ])
        const statsData = await statsRes.json()
        const statusData = await statusRes.json()

        if (statsData.success) {
          if (statsData.recentSessions) setRecentSessions(statsData.recentSessions.slice(0, 2))
          if (statsData.weeklyData?.length) {
            const today = new Date().toISOString().split('T')[0]
            const td = statsData.weeklyData.find((d: any) => d.date === today)
            if (td) { const p = td.minutes; setDailyGoal({ practiced: p, goal: 10, percentage: Math.min((p / 10) * 100, 100), remaining: Math.max(10 - p, 0) }) }
          }
        }
        if (!statusRes.headers.get('x-error')) {
          setLessonStatus(statusData)
        }
      } catch (e) { console.error(e) }
      finally { setLoading(false) }
    }
    fetchData()
  }, [isSignedIn, userId])

  const getScenarioLabel = (sentenceId: string): string => {
    const keys = ['daily_drill', 'phoneme_r_vs_l', 'phoneme_th_sounds', 'phoneme_f_vs_h', 'toeic', 'phoneme_v_vs_b', 'phoneme_word_stress', 'phoneme_silent_letters', 'business', 'interview', 'phone']
    const match = keys.find(k => sentenceId.includes(k))
    return match ? ts(`${match}.title`) : ts('practiceSession')
  }

  const userTier = getTier()
  const hasAccess = (scenarioTier: PlanTier) => TIER_ORDER[scenarioTier] <= TIER_ORDER[userTier]
  const atLimit = lessonStatus?.remaining === 0

  const freeScenarios = scenarios.filter(s => s.tier === 'free')
  const proScenarios = scenarios.filter(s => s.tier === 'pro')

  if (loading || subscriptionLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Mascot size={88} expression="thinking" className="animate-float opacity-70" />
        <span className="loading loading-dots loading-lg text-primary" />
        <p className="text-base text-base-content/50 font-semibold">{t('loading')}</p>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-5 lg:px-8 lg:py-8 pb-28 lg:pb-10">
      {/* Header */}
      <div className="mb-6 lg:mb-8">
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-2xl lg:text-3xl font-extrabold text-base-content">{t('title')}</h1>
          {isPro() && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/8 border border-primary/12 rounded-full text-xs font-bold text-primary">
              <Star className="w-3.5 h-3.5" /> {userTier === 'premium' ? 'Premium' : t('proLabel')}
            </span>
          )}
        </div>
        <p className="text-sm lg:text-base text-base-content/50">{t('subtitle')}</p>
      </div>

      {/* Lesson Usage Banner */}
      <LessonUsageBanner lessonStatus={lessonStatus} t={t} />

      <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
        {/* MAIN */}
        <div className="lg:col-span-2 space-y-6 lg:space-y-8">
          {/* Quick Start */}
          <div className="card bg-gradient-to-br from-primary/10 to-accent/8 border border-primary/12 overflow-hidden relative">
            <div className="absolute -top-2 -right-2 opacity-15 pointer-events-none"><Mascot size={96} expression="excited" /></div>
            <div className="card-body p-5 lg:p-6 flex-row items-center gap-4 relative z-10">
              <div className="w-14 h-14 lg:w-16 lg:h-16 rounded-2xl bg-primary/12 flex items-center justify-center flex-shrink-0">
                <Mic className="w-7 h-7 lg:w-8 lg:h-8 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="font-extrabold text-lg lg:text-xl text-base-content">{t('readyToPractice')}</h2>
                <p className="text-sm lg:text-base text-base-content/50">{t('quickDrill')}</p>
              </div>
              <Link
                href={atLimit ? '/pricing?limit=true' : '/practice/daily_drill'}
                className="btn btn-primary lg:btn-lg gap-2 shadow-md shadow-primary/15 flex-shrink-0"
              >
                {t('start')} <ArrowRight className="w-4 h-4 lg:w-5 lg:h-5" />
              </Link>
            </div>
          </div>

          {/* Tip */}
          <div className="card bg-info/6 border border-info/12">
            <div className="card-body p-4 flex-row items-center gap-3">
              <Target className="w-5 h-5 text-info flex-shrink-0" />
              <p className="text-sm lg:text-base text-base-content/60">
                <span className="font-bold">{t('structuredPractice')}</span> — {t('structuredDesc')}
              </p>
            </div>
          </div>

          {/* FREE */}
          <div>
            <h2 className="text-sm lg:text-base font-extrabold text-base-content/70 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" /> {t('freeScenarios')}
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {freeScenarios.map(s => (
                <ScenarioCard key={s.id} scenario={s} hasAccess={true} atLimit={atLimit} t={t} ts={ts} />
              ))}
            </div>
          </div>

          {/* PRO */}
          {proScenarios.length > 0 && (
            <div>
              <h2 className="text-sm lg:text-base font-extrabold text-base-content/70 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Lock className="w-4 h-4 text-warning" /> {t('proScenarios')}
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {proScenarios.map(s => (
                  <ScenarioCard key={s.id} scenario={s} hasAccess={hasAccess(s.tier)} atLimit={atLimit} t={t} ts={ts} />
                ))}
              </div>
            </div>
          )}

          {/* Coming Soon */}
          <div className="card bg-secondary/5 border border-secondary/12">
            <div className="card-body p-5 lg:p-6 flex-row items-start gap-4">
              <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-2xl bg-secondary/10 flex items-center justify-center flex-shrink-0">
                <MessageCircle className="w-6 h-6 lg:w-7 lg:h-7 text-secondary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h3 className="font-bold text-base lg:text-lg text-base-content">{t('aiConversation')}</h3>
                  <span className="text-xs font-bold text-secondary bg-secondary/10 border border-secondary/15 px-2 py-0.5 rounded-full">{t('comingSoon')}</span>
                </div>
                <p className="text-sm lg:text-base text-base-content/50">{t('aiConversationDesc')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* SIDEBAR */}
        <div className="hidden lg:flex flex-col gap-6">
          {/* Daily Goal */}
          <div className="card bg-base-100 border border-base-content/5 card-glow">
            <div className="card-body p-6">
              <h3 className="font-bold text-base text-base-content flex items-center gap-2 mb-4">
                <Target className="w-5 h-5 text-primary" /> {t('todaysGoal')}
              </h3>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-base-content/50">{t('practiceTime')}</span>
                <span className="text-lg font-extrabold text-base-content">{dailyGoal.practiced}/{dailyGoal.goal} min</span>
              </div>
              <div className="w-full bg-base-200 rounded-full h-3 overflow-hidden mb-2">
                <div className={`h-full rounded-full transition-all duration-500 ${dailyGoal.remaining <= 0 ? 'bg-success' : 'bg-gradient-to-r from-primary to-primary/80'}`} style={{ width: `${dailyGoal.percentage}%` }} />
              </div>
              <p className="text-sm text-base-content/45">
                {dailyGoal.remaining > 0 ? t('moreMinToGo', { count: dailyGoal.remaining }) : t('goalAchieved')}
              </p>
            </div>
          </div>

          {/* Pro Tip */}
          <div className="card bg-primary/5 border border-primary/12">
            <div className="card-body p-5">
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm mb-1 text-base-content">{t('proTip')}</h4>
                  <p className="text-sm text-base-content/50 leading-relaxed">{t('proTipDesc')}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Sessions */}
          <div className="card bg-base-100 border border-base-content/5 card-glow">
            <div className="card-body p-6">
              <h3 className="font-bold text-base text-base-content flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5 text-base-content/40" /> {t('recentSessions')}
              </h3>
              {recentSessions.length > 0 ? (
                <div className="space-y-3">
                  {recentSessions.map((s) => (
                    <div key={s.id} className="bg-base-200/80 rounded-xl px-4 py-3">
                      <h4 className="font-bold text-sm text-base-content mb-0.5">{getScenarioLabel(s.sentenceId)}</h4>
                      <p className="text-xs text-base-content/40 mb-2">{s.date}{s.time && `, ${s.time}`}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-base-content/45 flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {s.duration}m</span>
                        <span className={`text-base font-extrabold ${s.accuracy >= 85 ? 'text-success' : s.accuracy >= 70 ? 'text-warning' : 'text-error'}`}>{s.accuracy}%</span>
                      </div>
                    </div>
                  ))}
                  <Link href="/progress" className="btn btn-ghost btn-sm w-full text-base-content/40">{t('viewAll')} <ChevronRight className="w-4 h-4" /></Link>
                </div>
              ) : (
                <p className="text-sm text-base-content/40 text-center py-6">{t('noSessions')}</p>
              )}
            </div>
          </div>

          {/* Upgrade CTA */}
          {!isPro() && (
            <div className="card bg-gradient-to-br from-primary/8 to-secondary/8 border border-primary/12 overflow-hidden relative">
              <div className="absolute top-2 right-2 opacity-15"><Mascot size={56} expression="cheering" /></div>
              <div className="card-body p-6 relative z-10">
                <Star className="w-6 h-6 text-primary mb-1" />
                <h3 className="font-extrabold text-base text-base-content">{t('unlockPro')}</h3>
                <p className="text-sm text-base-content/50 mb-4">{t('unlockProDesc')}</p>
                <Link href="/pricing" className="btn btn-primary shadow-sm shadow-primary/15">{t('upgradeNow')}</Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* MOBILE daily goal */}
      <div className="lg:hidden mt-6">
        <div className="card bg-base-100 border border-base-content/5">
          <div className="card-body p-4 flex-row items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-primary/8 flex items-center justify-center flex-shrink-0">
              <Target className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-bold text-base-content/60">{t('today')}</span>
                <span className="text-sm text-base-content/40">{dailyGoal.practiced}/{dailyGoal.goal} min</span>
              </div>
              <div className="w-full bg-base-200 rounded-full h-2.5 overflow-hidden">
                <div className={`h-full rounded-full transition-all duration-500 ${dailyGoal.remaining <= 0 ? 'bg-success' : 'bg-primary'}`} style={{ width: `${dailyGoal.percentage}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════
   LESSON USAGE BANNER
   ═══════════════════════════════════════════ */
function LessonUsageBanner({ lessonStatus, t }: { lessonStatus: LessonStatus | null; t: (key: string, values?: Record<string, any>) => string }) {
  if (!lessonStatus || lessonStatus.tier === 'premium' || lessonStatus.max === null) return null

  const { tier, used, max, remaining, period } = lessonStatus
  const pct = Math.min((used / max) * 100, 100)
  const periodLabel = period === 'week' ? t('periodWeek') : t('periodMonth')
  const atLimit = remaining === 0

  if (atLimit) {
    return (
      <div className="mb-6 card bg-warning/8 border border-warning/20">
        <div className="card-body p-4 flex-row items-center gap-3">
          <AlertCircle className="w-5 h-5 text-warning flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-base-content">{t('limitReached')}</p>
            <p className="text-xs text-base-content/55">
              {t('limitDesc', { max, period: periodLabel })}{' '}
              <Link href="/pricing" className="underline text-warning font-semibold">{t('upgradeToContinue')}</Link>
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="mb-6 card bg-base-100 border border-base-content/6">
      <div className="card-body p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-base-content/55">
            {tier === 'free' ? t('tierFree') : t('tierPro')} — {used}/{max} {t('lessons')} {periodLabel}
          </span>
          <span className="text-xs text-base-content/40">{t('remaining', { count: remaining })}</span>
        </div>
        <div className="w-full bg-base-200 rounded-full h-1.5 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${pct >= 80 ? 'bg-warning' : 'bg-primary'}`}
            style={{ width: `${pct}%` }}
          />
        </div>
        {tier === 'free' && (
          <p className="text-[10px] text-base-content/35 mt-1.5">
            <Link href="/pricing" className="underline">{t('upgradePro')}</Link> {t('forMoreLessons')}
          </p>
        )}
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════
   SCENARIO CARD
   ═══════════════════════════════════════════ */
function ScenarioCard({ scenario, hasAccess, atLimit, t, ts }: { scenario: typeof scenarios[0]; hasAccess: boolean; atLimit: boolean; t: (key: string, values?: Record<string, any>) => string; ts: (key: string) => string }) {
  const blocked = !hasAccess || atLimit
  const href = !hasAccess ? '/pricing' : atLimit ? '/pricing?limit=true' : `/practice/${scenario.id}`

  return (
    <Link
      href={href}
      className={`card bg-base-100 border transition-all duration-200 ${
        !blocked ? 'border-base-content/6 card-glow hover:border-primary/15 hover:-translate-y-0.5 active:scale-[0.99]' : 'border-base-content/5 opacity-60 hover:opacity-80'
      }`}
    >
      <div className="card-body p-5 lg:p-6">
        <div className="flex items-start justify-between mb-3">
          <div className={`w-12 h-12 lg:w-14 lg:h-14 rounded-2xl flex items-center justify-center text-2xl lg:text-3xl ${!blocked ? 'bg-primary/6' : 'bg-base-200'}`}>
            {scenario.icon}
          </div>
          <div className="flex flex-col items-end gap-1">
            {!hasAccess && <span className="inline-flex items-center gap-1 text-xs font-bold text-warning bg-warning/10 border border-warning/15 px-2 py-0.5 rounded-full"><Lock className="w-3 h-3" /> {t('proLabel')}</span>}
            {hasAccess && atLimit && <span className="inline-flex items-center gap-1 text-xs font-bold text-warning bg-warning/10 border border-warning/15 px-2 py-0.5 rounded-full"><AlertCircle className="w-3 h-3" /> {t('limitLabel')}</span>}
            {scenario.badge && !blocked && <span className={`inline-flex text-xs font-bold px-2 py-0.5 rounded-full border ${badgeColor(scenario.badge)}`}>{scenario.badge}</span>}
          </div>
        </div>
        <h3 className="font-bold text-base lg:text-lg text-base-content mb-1">{ts(`${scenario.id}.title`)}</h3>
        <p className="text-sm text-base-content/45 mb-3 line-clamp-1">{ts(`${scenario.id}.description`)}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className={`badge badge-sm ${difficultyColor(scenario.difficulty)} font-semibold`}>{ts(`difficulties.${scenario.difficulty}`)}</span>
            <span className="text-xs text-base-content/35 flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {scenario.duration}</span>
          </div>
          {!blocked ? <ChevronRight className="w-5 h-5 text-base-content/25" /> : <span className="text-xs font-semibold text-warning">{t('upgradeArrow')}</span>}
        </div>
      </div>
    </Link>
  )
}
