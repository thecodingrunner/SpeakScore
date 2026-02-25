// app/[locale]/(dashboard)/progress/page.tsx
'use client'

import { useState, useEffect, useMemo, useRef } from 'react'
import { useRouter } from 'next/navigation'
import {
  TrendingUp, Target, Mic, Flame, Trophy, Star,
  BarChart3, RefreshCw, Eye, Calendar, ChevronRight,
  BookOpen, Clock, Zap
} from 'lucide-react'
import { ProRoute } from '@/components/global/ProRoute'
import { Mascot } from '@/components/global/Mascot'

/* ═══════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════ */
interface Stats {
  totalPracticeTime: number; averageAccuracy: number; streak: number
  lessonsCompleted: number; xpEarned: number; level: string
}
interface WeeklyDataPoint {
  day: string; date: string; minutes: number; accuracy: number; sessions: number
}
interface PhonemeBreakdown {
  name: string; score: number; trend: string; practiceCount: number; color: string
}
interface LessonSession {
  id: string; lessonId: string; lessonName: string; date: string; time: string
  accuracy: number; duration: number; xp: number; sentencesCompleted: number
  totalAttempts: number; phonemeScores: Record<string, number>; lastPracticed: string
}

/* ═══════════════════════════════════════════
   DATA BUCKETING — aggregate data points to
   always fit within chart width
   ═══════════════════════════════════════════ */
interface ChartBucket {
  label: string       // e.g. "Mon", "Jan 5", "Jan 1–7"
  fullLabel: string   // tooltip detail
  minutes: number
  accuracy: number
  sessions: number
  dayCount: number    // how many days in this bucket
}

function bucketData(data: WeeklyDataPoint[], timeRange: string): ChartBucket[] {
  if (!data.length) return []

  // Week: 1 bar per day (max 7) — no bucketing needed
  if (timeRange === 'week') {
    return data.map(d => ({
      label: d.day,
      fullLabel: d.date,
      minutes: d.minutes,
      accuracy: d.accuracy,
      sessions: d.sessions,
      dayCount: 1,
    }))
  }

  // Month: bucket into ~10 groups (~3 days each)
  // All time: bucket into ~12 groups
  const maxBuckets = timeRange === 'month' ? 10 : 12
  const bucketSize = Math.max(1, Math.ceil(data.length / maxBuckets))

  const buckets: ChartBucket[] = []
  for (let i = 0; i < data.length; i += bucketSize) {
    const slice = data.slice(i, i + bucketSize)
    const totalMins = slice.reduce((s, d) => s + d.minutes, 0)
    const accDays = slice.filter(d => d.accuracy > 0)
    const avgAcc = accDays.length > 0
      ? Math.round(accDays.reduce((s, d) => s + d.accuracy, 0) / accDays.length)
      : 0
    const totalSessions = slice.reduce((s, d) => s + d.sessions, 0)

    // Build label
    const firstDate = new Date(slice[0].date)
    const lastDate = new Date(slice[slice.length - 1].date)
    const fmtShort = (d: Date) => `${d.getMonth() + 1}/${d.getDate()}`

    let label: string
    let fullLabel: string
    if (slice.length === 1) {
      label = fmtShort(firstDate)
      fullLabel = slice[0].date
    } else {
      label = fmtShort(firstDate)
      fullLabel = `${slice[0].date} – ${slice[slice.length - 1].date}`
    }

    buckets.push({
      label,
      fullLabel,
      minutes: totalMins,
      accuracy: avgAcc,
      sessions: totalSessions,
      dayCount: slice.length,
    })
  }

  return buckets
}

/* ═══════════════════════════════════════════
   TOOLTIP COMPONENT — positioned absolutely,
   triggered on hover/tap
   ═══════════════════════════════════════════ */
function ChartBar({
  height, isEmpty, color, hoverColor, label, tooltip, isWeek,
}: {
  height: string; isEmpty: boolean; color: string; hoverColor: string
  label: string; tooltip: string; isWeek: boolean
}) {
  const [showTip, setShowTip] = useState(false)
  const barRef = useRef<HTMLDivElement>(null)

  return (
    <div className="flex flex-col items-center gap-1 flex-1 min-w-0 relative h-full justify-end">
      <div
        ref={barRef}
        className="w-full relative h-full flex items-end"
        onMouseEnter={() => setShowTip(true)}
        onMouseLeave={() => setShowTip(false)}
        onTouchStart={() => setShowTip(true)}
        onTouchEnd={() => setTimeout(() => setShowTip(false), 1500)}
      >
        {/* Tooltip */}
        {showTip && !isEmpty && (
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-20 pointer-events-none">
            <div className="bg-base-content text-base-100 text-[11px] font-semibold px-2.5 py-1.5 rounded-lg shadow-lg whitespace-pre-line text-center leading-relaxed min-w-max">
              {tooltip}
            </div>
            <div className="w-2 h-2 bg-base-content rotate-45 absolute left-1/2 -translate-x-1/2 -bottom-1" />
          </div>
        )}

        {/* Bar */}
        <div
          className={`w-full rounded-lg transition-all duration-200 cursor-pointer ${
            isEmpty ? 'bg-base-200/60' : `${color} hover:${hoverColor}`
          }`}
          style={{
            height: height,
            minHeight: isEmpty ? '4px' : '12px',
          }}
        />
      </div>

      {/* Label */}
      <span className={`font-semibold text-base-content/35 truncate w-full text-center ${
        isWeek ? 'text-[11px]' : 'text-[9px]'
      }`}>
        {label}
      </span>
    </div>
  )
}

/* ═══════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════ */
export default function ProgressPage() {
  const router = useRouter()
  const [timeRange, setTimeRange] = useState('week')
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState<Stats | null>(null)
  const [weeklyData, setWeeklyData] = useState<WeeklyDataPoint[]>([])
  const [pronunciationBreakdown, setPronunciationBreakdown] = useState<PhonemeBreakdown[]>([])
  const [lessonSessions, setLessonSessions] = useState<LessonSession[]>([])

  useEffect(() => { fetchProgressData() }, [timeRange])

  const fetchProgressData = async () => {
    try {
      setIsLoading(true)
      const res = await fetch(`/api/progress/stats?range=${timeRange}`)
      if (!res.ok) throw new Error('Failed')
      const data = await res.json()
      setStats(data.stats)
      setWeeklyData(data.weeklyData || [])
      setPronunciationBreakdown(data.pronunciationBreakdown || [])
      setLessonSessions(data.lessonSessions || [])
    } catch (e) { console.error(e) }
    finally { setIsLoading(false) }
  }

  /* ── Bucketed chart data ── */
  const chartBuckets = useMemo(() => bucketData(weeklyData, timeRange), [weeklyData, timeRange])

  /* ── Derived stats ── */
  const hasData = weeklyData.some(d => d.minutes > 0)
  const maxMinutes = useMemo(() => Math.max(...chartBuckets.map(b => b.minutes), 1), [chartBuckets])
  const maxAccuracy = 100
  const totalMins = weeklyData.reduce((s, d) => s + d.minutes, 0)
  const dailyAvg = weeklyData.length > 0 ? Math.round(totalMins / weeklyData.length) : 0
  const accDays = weeklyData.filter(d => d.accuracy > 0)
  const avgAcc = accDays.length > 0 ? Math.round(accDays.reduce((s, d) => s + d.accuracy, 0) / accDays.length) : 0
  const bestAcc = Math.max(...weeklyData.map(d => d.accuracy), 0)

  /* ── Helpers ── */
  const accColor = (a: number) => a >= 85 ? 'text-success' : a >= 70 ? 'text-warning' : 'text-error'
  const accBg = (a: number) => a >= 85 ? 'bg-success' : a >= 70 ? 'bg-warning' : 'bg-error'
  const accLabel = (a: number) => a >= 85 ? 'Excellent' : a >= 70 ? 'Good' : 'Needs Work'
  const accBadge = (a: number) => a >= 85 ? 'bg-success/10 text-success border-success/15' : a >= 70 ? 'bg-warning/10 text-warning border-warning/15' : 'bg-error/10 text-error border-error/15'

  console.log("Lesson Sessions: ", lessonSessions);
  
  /* ═══════════════════════════════════════════
     LOADING
     ═══════════════════════════════════════════ */
  if (isLoading) {
    return (
      <ProRoute>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <Mascot size={88} expression="thinking" className="animate-float opacity-70" />
          <span className="loading loading-dots loading-lg text-primary" />
          <p className="text-base text-base-content/50 font-semibold">Loading your progress...</p>
        </div>
      </ProRoute>
    )
  }

  /* ═══════════════════════════════════════════
     ERROR
     ═══════════════════════════════════════════ */
  if (!stats) {
    return (
      <ProRoute>
        <div className="max-w-lg mx-auto px-4 py-16 text-center">
          <Mascot size={88} expression="thinking" className="mx-auto mb-4 opacity-60" />
          <h3 className="font-extrabold text-xl mb-2 text-base-content">Couldn&apos;t load progress</h3>
          <p className="text-base text-base-content/50 mb-5">Something went wrong — let&apos;s try again.</p>
          <button onClick={fetchProgressData} className="btn btn-primary gap-2"><RefreshCw className="w-4 h-4" /> Retry</button>
        </div>
      </ProRoute>
    )
  }

  const isWeek = timeRange === 'week'

  /* ═══════════════════════════════════════════
     RENDER
     ═══════════════════════════════════════════ */
  return (
    <ProRoute>
      <div className="max-w-6xl mx-auto px-4 py-5 lg:px-8 lg:py-8 pb-28 lg:pb-10">

        {/* ─── Header + Time Range ─── */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6 lg:mb-8">
          <div>
            <h1 className="text-2xl lg:text-3xl font-extrabold text-base-content mb-1">Your Progress</h1>
            <p className="text-sm lg:text-base text-base-content/50">Track your pronunciation improvement over time</p>
          </div>
          <div className="flex gap-1">
            {(['week', 'month', 'all'] as const).map(range => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  timeRange === range
                    ? 'bg-primary/10 text-primary border border-primary/15'
                    : 'bg-base-content/4 text-base-content/50 border border-transparent hover:bg-base-content/6'
                }`}
              >
                {range === 'week' ? 'Week' : range === 'month' ? 'Month' : 'All Time'}
              </button>
            ))}
          </div>
        </div>

        {/* ─── Stats Overview ─── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 lg:gap-4 mb-6 lg:mb-8">
          {[
            { icon: Mic, value: `${stats.totalPracticeTime}m`, label: 'Practice Time', color: 'text-primary', bg: 'bg-primary/8' },
            { icon: Target, value: `${stats.averageAccuracy}%`, label: 'Avg Accuracy', color: 'text-success', bg: 'bg-success/8' },
            { icon: Flame, value: `${stats.streak}`, label: 'Day Streak', color: 'text-orange-500', bg: 'bg-orange-500/8' },
            { icon: Trophy, value: `${stats.lessonsCompleted}`, label: 'Sentences', color: 'text-warning', bg: 'bg-warning/8' },
            { icon: Star, value: `${stats.xpEarned}`, label: 'Total XP', color: 'text-warning', bg: 'bg-warning/8' },
          ].map((s, i) => {
            const Icon = s.icon
            return (
              <div key={i} className={`card bg-base-100 border border-base-content/5 ${i === 4 ? 'col-span-2 sm:col-span-1' : ''}`}>
                <div className="card-body p-3 lg:p-4 items-center text-center gap-1.5">
                  <div className={`w-10 h-10 lg:w-12 lg:h-12 rounded-xl ${s.bg} flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 lg:w-6 lg:h-6 ${s.color}`} />
                  </div>
                  <span className="text-xl lg:text-2xl font-extrabold text-base-content leading-none">{s.value}</span>
                  <span className="text-[10px] lg:text-xs font-semibold text-base-content/35 uppercase tracking-wider">{s.label}</span>
                </div>
              </div>
            )
          })}
        </div>

        {/* ─── No data hint ─── */}
        {!hasData && (
          <div className="card bg-info/6 border border-info/12 mb-6 lg:mb-8">
            <div className="card-body p-4 flex-row items-center gap-3">
              <Target className="w-5 h-5 text-info flex-shrink-0" />
              <p className="text-sm lg:text-base text-base-content/60">Start practicing to see your progress charts!</p>
            </div>
          </div>
        )}

        {hasData && (
          <>
            {/* ═══════════════════════════════════════════
                CHARTS — no horizontal scroll, bars flex
                to fill available width
                ═══════════════════════════════════════════ */}
            <div className="grid lg:grid-cols-2 gap-4 lg:gap-6 mb-6 lg:mb-8">

              {/* Practice Activity */}
              <div className="card bg-base-100 border border-base-content/5">
                <div className="card-body p-5 lg:p-6">
                  <h2 className="font-extrabold text-base lg:text-lg text-base-content mb-0.5">Practice Activity</h2>
                  <p className="text-xs text-base-content/40 mb-4">
                    Minutes practiced {isWeek ? 'this week' : timeRange === 'month' ? 'this month' : 'all time'}
                    {!isWeek && <span className="text-base-content/25"> · {chartBuckets.length} intervals</span>}
                  </p>

                  {/* Chart — always contained */}
                  <div className="flex items-end gap-1 lg:gap-1.5 h-36 lg:h-44">
                    {chartBuckets.map((bucket, idx) => {
                      const pct = bucket.minutes > 0 ? Math.max((bucket.minutes / maxMinutes) * 100, 8) : 0
                      const tooltip = bucket.dayCount > 1
                        ? `${bucket.fullLabel}\n${bucket.minutes} min total\n${bucket.sessions} sessions\n${bucket.dayCount} days`
                        : `${bucket.fullLabel}\n${bucket.minutes} min\n${bucket.sessions} sessions`
                      return (
                        <ChartBar
                          key={idx}
                          height={`${pct}%`}
                          isEmpty={bucket.minutes === 0}
                          color="bg-primary"
                          hoverColor="bg-primary/80"
                          label={bucket.label}
                          tooltip={tooltip}
                          isWeek={isWeek}
                        />
                      )
                    })}
                  </div>

                  {/* Summary */}
                  <div className="flex gap-3 mt-4">
                    <div className="flex-1 bg-base-200/50 rounded-xl px-3 py-2.5 text-center">
                      <span className="text-lg lg:text-xl font-extrabold text-primary">{totalMins}m</span>
                      <p className="text-[10px] lg:text-xs text-base-content/35 font-semibold">Total</p>
                    </div>
                    <div className="flex-1 bg-base-200/50 rounded-xl px-3 py-2.5 text-center">
                      <span className="text-lg lg:text-xl font-extrabold text-secondary">{dailyAvg}m</span>
                      <p className="text-[10px] lg:text-xs text-base-content/35 font-semibold">Daily Avg</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Accuracy Trend */}
              <div className="card bg-base-100 border border-base-content/5">
                <div className="card-body p-5 lg:p-6">
                  <h2 className="font-extrabold text-base lg:text-lg text-base-content mb-0.5">Accuracy Trend</h2>
                  <p className="text-xs text-base-content/40 mb-4">
                    Pronunciation accuracy over time
                    {!isWeek && <span className="text-base-content/25"> · averaged per interval</span>}
                  </p>

                  {/* Chart — always contained */}
                  <div className="flex items-end gap-1 lg:gap-1.5 h-36 lg:h-44">
                    {chartBuckets.map((bucket, idx) => {
                      const pct = bucket.accuracy > 0 ? Math.max((bucket.accuracy / maxAccuracy) * 100, 8) : 0
                      console.log("PCT: ", pct);
                      
                      const tooltip = bucket.dayCount > 1
                        ? `${bucket.fullLabel}\nAvg accuracy: ${bucket.accuracy}%\n${bucket.sessions} sessions`
                        : `${bucket.fullLabel}\nAccuracy: ${bucket.accuracy}%`
                      return (
                        <ChartBar
                          key={idx}
                          height={`${pct}%`}
                          isEmpty={bucket.accuracy === 0}
                          color={bucket.accuracy >= 85 ? 'bg-success' : bucket.accuracy >= 70 ? 'bg-warning' : 'bg-error'}
                          hoverColor={bucket.accuracy >= 85 ? 'bg-success/80' : bucket.accuracy >= 70 ? 'bg-warning/80' : 'bg-error/80'}
                          label={bucket.label}
                          tooltip={tooltip}
                          isWeek={isWeek}
                        />
                      )
                    })}
                  </div>

                  {/* Summary */}
                  <div className="flex gap-3 mt-4">
                    <div className="flex-1 bg-base-200/50 rounded-xl px-3 py-2.5 text-center">
                      <span className={`text-lg lg:text-xl font-extrabold ${accColor(avgAcc)}`}>{avgAcc}%</span>
                      <p className="text-[10px] lg:text-xs text-base-content/35 font-semibold">Average</p>
                    </div>
                    <div className="flex-1 bg-base-200/50 rounded-xl px-3 py-2.5 text-center">
                      <span className={`text-lg lg:text-xl font-extrabold ${accColor(bestAcc)}`}>{bestAcc}%</span>
                      <p className="text-[10px] lg:text-xs text-base-content/35 font-semibold">Best</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ═══════════════════════════════════════════
                PRONUNCIATION BREAKDOWN
                ═══════════════════════════════════════════ */}
            {pronunciationBreakdown.length > 0 && (
              <div className="mb-6 lg:mb-8">
                <h2 className="font-extrabold text-lg lg:text-xl text-base-content flex items-center gap-2 mb-4">
                  <BarChart3 className="w-5 h-5 text-primary" /> Pronunciation Breakdown
                </h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {pronunciationBreakdown.slice(0, 6).map((p, idx) => (
                    <div key={idx} className="card bg-base-100 border border-base-content/5">
                      <div className="card-body p-5">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-bold text-base text-base-content">{p.name}</h3>
                          <div className="flex items-center gap-1.5">
                            {p.trend.includes('+') && <TrendingUp className="w-4 h-4 text-success" />}
                            <span className={`text-sm font-bold ${p.trend.includes('+') ? 'text-success' : p.trend.includes('-') ? 'text-error' : 'text-base-content/40'}`}>
                              {p.trend}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-end justify-between mb-3">
                          <span className="text-3xl lg:text-4xl font-extrabold text-base-content">{p.score}%</span>
                          <span className={`inline-flex text-xs font-bold px-2 py-0.5 rounded-full border ${accBadge(p.score)}`}>
                            {accLabel(p.score)}
                          </span>
                        </div>
                        <div className="w-full bg-base-200 rounded-full h-2.5 overflow-hidden mb-2">
                          <div className={`h-full rounded-full ${accBg(p.score)} transition-all duration-500`} style={{ width: `${p.score}%` }} />
                        </div>
                        <p className="text-xs text-base-content/35">Practiced {p.practiceCount} times</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ═══════════════════════════════════════════
                RECENT LESSONS — full lesson completions
                showing averaged results across all sentences
                ═══════════════════════════════════════════ */}
            {lessonSessions.length > 0 && (
              <div>
                <h2 className="font-extrabold text-lg lg:text-xl text-base-content flex items-center gap-2 mb-4">
                  <BookOpen className="w-5 h-5 text-primary" /> Completed Lessons
                </h2>
                <div className="space-y-3">
                  {lessonSessions.map((session) => (
                    <div
                      key={session.id}
                      className="card bg-base-100 border border-base-content/5 hover:border-primary/15 transition-all duration-200"
                    >
                      <div className="card-body p-4 lg:p-5">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3">

                          {/* Left — Lesson info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1.5">
                              <h3 className="font-bold text-base text-base-content truncate">{session.lessonName}</h3>
                              <span className={`inline-flex text-[10px] font-bold px-2 py-0.5 rounded-full border flex-shrink-0 ${accBadge(session.accuracy)}`}>
                                {accLabel(session.accuracy)}
                              </span>
                            </div>

                            {/* Meta row */}
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-base-content/40">
                              <span className="inline-flex items-center gap-1">
                                <Calendar className="w-3 h-3" /> {session.date}, {session.time}
                              </span>
                              <span className="inline-flex items-center gap-1">
                                <Clock className="w-3 h-3" /> {Math.round(session.duration / 60)} min
                              </span>
                              <span className="inline-flex items-center gap-1">
                                <BookOpen className="w-3 h-3" /> {session.sentencesCompleted} sentences
                              </span>
                            </div>
                          </div>

                          {/* Right — Score + XP + button */}
                          <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
                            {/* Score circle */}
                            <div className="flex items-center gap-2.5">
                              <div
                                className={`radial-progress ${accColor(session.accuracy)} text-sm font-extrabold`}
                                style={{
                                  '--value': session.accuracy,
                                  '--size': '2.75rem',
                                  '--thickness': '3px',
                                } as React.CSSProperties}
                                role="progressbar"
                              >
                                {session.accuracy}%
                              </div>
                            </div>

                            {/* XP */}
                            <span className="hidden sm:flex items-center gap-1 text-sm font-bold text-warning">
                              <Star className="w-4 h-4" /> +{session.xp}
                            </span>

                            {/* View */}
                            <button
                              onClick={() => router.push(`/progress/lesson/${session.lessonId}`)}
                              className="btn btn-primary btn-sm gap-1.5"
                            >
                              <Eye className="w-4 h-4" />
                              <span className="hidden sm:inline">Details</span>
                            </button>
                          </div>
                        </div>

                        {/* Mobile — extra row */}
                        <div className="sm:hidden mt-3 pt-3 border-t border-base-content/5 flex items-center justify-between text-xs">
                          <span className="text-base-content/40">{session.totalAttempts} total attempts</span>
                          <span className="flex items-center gap-1 font-bold text-warning">
                            <Star className="w-3.5 h-3.5" /> +{session.xp} XP
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </ProRoute>
  )
}