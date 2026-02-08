'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  TrendingUp, Calendar, Target, Mic, ChevronDown,
  Flame, Trophy, Star, BarChart3, RefreshCw, Eye
} from 'lucide-react'
import { ProRoute } from '@/components/global/ProRoute';

interface Stats {
  totalPracticeTime: number;
  averageAccuracy: number;
  streak: number;
  lessonsCompleted: number;
  xpEarned: number;
  level: string;
}

interface WeeklyDataPoint {
  day: string;
  date: string;
  minutes: number;
  accuracy: number;
  sessions: number;
}

interface PhonemeBreakdown {
  name: string;
  score: number;
  trend: string;
  practiceCount: number;
  color: string;
}

interface LessonSession {
  id: string;
  lessonId: string;
  lessonName: string;
  date: string;
  time: string;
  accuracy: number;
  duration: number;
  xp: number;
  sentencesCompleted: number;
  totalAttempts: number;
  phonemeScores: Record<string, number>;
  lastPracticed: string;
}

export default function ProgressPage() {
  const router = useRouter()
  const [timeRange, setTimeRange] = useState('week')
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState<Stats | null>(null)
  const [weeklyData, setWeeklyData] = useState<WeeklyDataPoint[]>([])
  const [pronunciationBreakdown, setPronunciationBreakdown] = useState<PhonemeBreakdown[]>([])
  const [lessonSessions, setLessonSessions] = useState<LessonSession[]>([])

  useEffect(() => {
    fetchProgressData()
  }, [timeRange])

  const fetchProgressData = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/progress/stats?range=${timeRange}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch progress data')
      }

      const data = await response.json()
      
      setStats(data.stats)
      setWeeklyData(data.weeklyData || [])
      setPronunciationBreakdown(data.pronunciationBreakdown || [])
      setLessonSessions(data.lessonSessions || [])
      
      console.log(`📊 Loaded ${timeRange} data:`, {
        practices: data.weeklyData?.length,
        phonemes: data.pronunciationBreakdown?.length,
        sessions: data.lessonSessions?.length
      });
    } catch (error) {
      console.error('Error fetching progress:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <ProRoute>
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6 lg:py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <span className="loading loading-spinner loading-lg text-primary"></span>
              <p className="mt-4 text-sm sm:text-base lg:text-lg">Loading your progress...</p>
            </div>
          </div>
        </div>
      </ProRoute>
    )
  }

  if (!stats) {
    return (
      <ProRoute>
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6 lg:py-8">
          <div className="alert alert-error text-sm sm:text-base">
            <span>Failed to load progress data</span>
            <button onClick={fetchProgressData} className="btn btn-sm">
              <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              Retry
            </button>
          </div>
        </div>
      </ProRoute>
    )
  }

  const maxMinutes = Math.max(...weeklyData.map(d => d.minutes), 1)
  const hasData = weeklyData.some(d => d.minutes > 0)

  return (
    <ProRoute>
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6 lg:py-8">
        {/* Header */}
        <div className="mb-4 sm:mb-6">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-1 sm:mb-2">Your Progress</h1>
          <p className="text-sm sm:text-base text-base-content/70">
            Track your pronunciation improvement over time
          </p>
        </div>

        {/* Time Range Selector */}
        <div className="flex justify-end mb-4 sm:mb-6">
          <div className="btn-group">
            <button 
              className={`btn btn-xs sm:btn-sm ${timeRange === 'week' ? 'btn-active' : ''}`}
              onClick={() => setTimeRange('week')}
            >
              Week
            </button>
            <button 
              className={`btn btn-xs sm:btn-sm ${timeRange === 'month' ? 'btn-active' : ''}`}
              onClick={() => setTimeRange('month')}
            >
              Month
            </button>
            <button 
              className={`btn btn-xs sm:btn-sm ${timeRange === 'all' ? 'btn-active' : ''}`}
              onClick={() => setTimeRange('all')}
            >
              All Time
            </button>
          </div>
        </div>

        {/* Stats Overview - Mobile Responsive Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3 lg:gap-4 mb-6 sm:mb-8">
          <div className="card bg-base-100 shadow-md">
            <div className="card-body p-3 sm:p-4 items-center text-center">
              <Mic className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-primary mb-1" />
              <div className="text-lg sm:text-xl lg:text-2xl font-bold">{stats.totalPracticeTime}m</div>
              <div className="text-[10px] sm:text-xs opacity-70">Practice Time</div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-md">
            <div className="card-body p-3 sm:p-4 items-center text-center">
              <Target className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-success mb-1" />
              <div className="text-lg sm:text-xl lg:text-2xl font-bold">{stats.averageAccuracy}%</div>
              <div className="text-[10px] sm:text-xs opacity-70">Avg Accuracy</div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-md">
            <div className="card-body p-3 sm:p-4 items-center text-center">
              <Flame className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-orange-500 mb-1" />
              <div className="text-lg sm:text-xl lg:text-2xl font-bold">{stats.streak}</div>
              <div className="text-[10px] sm:text-xs opacity-70">Day Streak</div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-md">
            <div className="card-body p-3 sm:p-4 items-center text-center">
              <Trophy className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-warning mb-1" />
              <div className="text-lg sm:text-xl lg:text-2xl font-bold">{stats.lessonsCompleted}</div>
              <div className="text-[10px] sm:text-xs opacity-70">Sentences Done</div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-md col-span-2 sm:col-span-1">
            <div className="card-body p-3 sm:p-4 items-center text-center">
              <Star className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-warning mb-1" />
              <div className="text-lg sm:text-xl lg:text-2xl font-bold">{stats.xpEarned}</div>
              <div className="text-[10px] sm:text-xs opacity-70">Total XP</div>
            </div>
          </div>
        </div>

        {!hasData && (
          <div className="alert alert-info mb-6 sm:mb-8 text-sm sm:text-base">
            <span>Start practicing to see your progress charts!</span>
          </div>
        )}

        {hasData && (
          <>
            <div className="grid lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
              {/* Weekly Practice Chart - FIXED OVERFLOW */}
              <div className="card bg-base-100 shadow-xl overflow-hidden">
                <div className="card-body p-4 sm:p-6">
                  <h2 className="card-title text-base sm:text-lg">Practice Activity</h2>
                  <p className="text-xs sm:text-sm text-base-content/60 mb-3 sm:mb-4">
                    Minutes practiced {timeRange === 'week' ? 'this week' : timeRange === 'month' ? 'this month' : 'all time'}
                  </p>

                  {/* Scrollable chart container with proper containment */}
                  <div className="overflow-x-auto -mx-4 px-4 sm:-mx-6 sm:px-6">
                    <div 
                      className="flex items-end justify-between gap-1 h-32 sm:h-40 lg:h-48"
                      style={{ 
                        minWidth: timeRange === 'week' 
                          ? '280px'  // 7 days minimum
                          : timeRange === 'month' 
                          ? '480px'  // 30 days minimum
                          : '720px'  // 90 days minimum
                      }}
                    >
                      {weeklyData.map((day, idx) => (
                        <div 
                          key={idx} 
                          className="flex flex-col items-center gap-1 sm:gap-2"
                          style={{ 
                            minWidth: timeRange === 'week' ? '35px' : '12px',
                            flex: timeRange === 'week' ? '1' : '0 0 auto'
                          }}
                        >
                          <div className="tooltip tooltip-top w-full" data-tip={`${day.date}\n${day.minutes} min\n${day.sessions} sessions`}>
                            <div 
                              className={`w-full rounded-t-lg transition-all cursor-pointer ${
                                day.minutes > 0 
                                  ? 'bg-primary hover:bg-primary-focus' 
                                  : 'bg-base-300'
                              }`}
                              style={{ 
                                height: `${day.minutes > 0 ? Math.max((day.minutes / maxMinutes * 100), 10) : 5}%`,
                                minHeight: day.minutes > 0 ? '16px' : '6px',
                              }}
                            ></div>
                          </div>
                          {timeRange === 'week' && (
                            <span className="text-[10px] sm:text-xs font-semibold">{day.day}</span>
                          )}
                          {timeRange === 'month' && idx % 5 === 0 && (
                            <span className="text-[10px] font-semibold">{new Date(day.date).getDate()}</span>
                          )}
                          {timeRange === 'all' && idx % 10 === 0 && (
                            <span className="text-[10px] font-semibold">{new Date(day.date).getDate()}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="stats stats-horizontal shadow mt-3 sm:mt-4 bg-base-200">
                    <div className="stat px-3 py-2 sm:px-4">
                      <div className="stat-title text-[10px] sm:text-xs">Total</div>
                      <div className="stat-value text-primary text-lg sm:text-xl lg:text-2xl">
                        {weeklyData.reduce((sum, day) => sum + day.minutes, 0)}m
                      </div>
                    </div>
                    <div className="stat px-3 py-2 sm:px-4">
                      <div className="stat-title text-[10px] sm:text-xs">Daily Avg</div>
                      <div className="stat-value text-secondary text-lg sm:text-xl lg:text-2xl">
                        {Math.round(weeklyData.reduce((sum, day) => sum + day.minutes, 0) / weeklyData.length)}m
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Accuracy Trend - FIXED OVERFLOW */}
              <div className="card bg-base-100 shadow-xl overflow-hidden">
                <div className="card-body p-4 sm:p-6">
                  <h2 className="card-title text-base sm:text-lg">Accuracy Trend</h2>
                  <p className="text-xs sm:text-sm text-base-content/60 mb-3 sm:mb-4">
                    Your pronunciation accuracy over time
                  </p>

                  {/* Scrollable chart container with proper containment */}
                  <div className="overflow-x-auto -mx-4 px-4 sm:-mx-6 sm:px-6">
                    <div 
                      className="flex items-end justify-between gap-1 h-32 sm:h-40 lg:h-48"
                      style={{ 
                        minWidth: timeRange === 'week' 
                          ? '280px'  // 7 days minimum
                          : timeRange === 'month' 
                          ? '480px'  // 30 days minimum
                          : '720px'  // 90 days minimum
                      }}
                    >
                      {weeklyData.map((day, idx) => (
                        <div 
                          key={idx} 
                          className="flex flex-col items-center gap-1 sm:gap-2"
                          style={{ 
                            minWidth: timeRange === 'week' ? '35px' : '12px',
                            flex: timeRange === 'week' ? '1' : '0 0 auto'
                          }}
                        >
                          <div className="tooltip tooltip-top w-full" data-tip={`${day.date}\n${day.accuracy}%`}>
                            <div className="relative w-full">
                              {day.accuracy > 0 && (
                                <>
                                  <div 
                                    className="w-full bg-success/20"
                                    style={{ 
                                      height: `${Math.max((day.accuracy / 100) * 140, 16)}px`,
                                    }}
                                  ></div>
                                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-success rounded-full absolute -top-1 left-1/2 -translate-x-1/2"></div>
                                </>
                              )}
                            </div>
                          </div>
                          {timeRange === 'week' && (
                            <span className="text-[10px] sm:text-xs font-semibold">{day.day}</span>
                          )}
                          {timeRange === 'month' && idx % 5 === 0 && (
                            <span className="text-[10px] font-semibold">{new Date(day.date).getDate()}</span>
                          )}
                          {timeRange === 'all' && idx % 10 === 0 && (
                            <span className="text-[10px] font-semibold">{new Date(day.date).getDate()}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="stats stats-horizontal shadow mt-3 sm:mt-4 bg-base-200">
                    <div className="stat px-3 py-2 sm:px-4">
                      <div className="stat-title text-[10px] sm:text-xs">Average</div>
                      <div className="stat-value text-success text-lg sm:text-xl lg:text-2xl">
                        {weeklyData.filter(d => d.accuracy > 0).length > 0
                          ? Math.round(
                              weeklyData.filter(d => d.accuracy > 0).reduce((sum, day) => sum + day.accuracy, 0) /
                              weeklyData.filter(d => d.accuracy > 0).length
                            )
                          : 0}%
                      </div>
                    </div>
                    <div className="stat px-3 py-2 sm:px-4">
                      <div className="stat-title text-[10px] sm:text-xs">Best Day</div>
                      <div className="stat-value text-success text-lg sm:text-xl lg:text-2xl">
                        {Math.max(...weeklyData.map(d => d.accuracy))}%
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Pronunciation Breakdown - Mobile Responsive */}
            {pronunciationBreakdown.length > 0 && (
              <div className="card bg-base-100 shadow-xl mb-6 sm:mb-8">
                <div className="card-body p-4 sm:p-6">
                  <h2 className="card-title text-base sm:text-lg mb-3 sm:mb-4">Pronunciation Breakdown</h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {pronunciationBreakdown.slice(0, 6).map((phoneme, idx) => (
                      <div key={idx} className="card bg-base-200">
                        <div className="card-body p-3 sm:p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-bold truncate text-sm sm:text-base">{phoneme.name}</h3>
                            <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                              <span className={`text-xs sm:text-sm font-semibold text-${phoneme.color}`}>
                                {phoneme.trend}
                              </span>
                              {phoneme.trend.includes('+') && (
                                <TrendingUp className={`w-3 h-3 sm:w-4 sm:h-4 text-${phoneme.color}`} />
                              )}
                            </div>
                          </div>

                          <div className="flex items-center justify-between mb-2">
                            <span className="text-2xl sm:text-3xl font-bold">{phoneme.score}%</span>
                            <span className={`badge badge-${phoneme.color} badge-xs sm:badge-sm`}>
                              {phoneme.score >= 85 ? 'Excellent' : 
                              phoneme.score >= 70 ? 'Good' : 
                              'Needs Practice'}
                            </span>
                          </div>
                          <progress 
                            className={`progress progress-${phoneme.color} w-full h-2 sm:h-3`}
                            value={phoneme.score} 
                            max="100"
                          ></progress>
                          <p className="text-[10px] sm:text-xs text-base-content/60 mt-1 sm:mt-2">
                            Practiced {phoneme.practiceCount} times
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Recent Lessons - WITH VIEW DETAILS BUTTON */}
            {lessonSessions.length > 0 && (
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body p-4 sm:p-6">
                  <h2 className="card-title text-base sm:text-lg mb-3 sm:mb-4">Recent Lessons</h2>

                  <div className="space-y-3">
                    {lessonSessions.map((session) => (
                      <div 
                        key={session.id} 
                        className="card bg-base-200 hover:bg-base-300 transition-colors"
                      >
                        <div className="card-body p-3 sm:p-4">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            {/* Left side - Lesson info */}
                            <div className="flex-1 min-w-0">
                              <h3 className="font-bold text-sm sm:text-base truncate mb-1">
                                {session.lessonName}
                              </h3>
                              <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-base-content/70">
                                <span>{session.date}, {session.time}</span>
                                <span>•</span>
                                <span>{session.duration} min</span>
                                <span className="hidden sm:inline">•</span>
                                <span className="hidden sm:inline">{session.sentencesCompleted} sentences</span>
                              </div>
                            </div>

                            {/* Right side - Stats and button */}
                            <div className="flex items-center gap-3 sm:gap-4">
                              {/* Accuracy */}
                              <div className="flex items-center gap-2">
                                <progress 
                                  className={`progress w-16 sm:w-20 h-2 ${
                                    session.accuracy >= 85 ? 'progress-success' :
                                    session.accuracy >= 70 ? 'progress-warning' :
                                    'progress-error'
                                  }`}
                                  value={session.accuracy} 
                                  max="100"
                                ></progress>
                                <span className="font-bold text-xs sm:text-sm whitespace-nowrap">
                                  {session.accuracy}%
                                </span>
                              </div>

                              {/* View Details Button */}
                              <button
                                onClick={() => router.push(`/progress/lesson/${session.lessonId}`)}
                                className="btn btn-primary btn-xs sm:btn-sm gap-1 whitespace-nowrap"
                              >
                                <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                                <span className="hidden sm:inline">View</span>
                              </button>
                            </div>
                          </div>

                          {/* Mobile - Sentences count */}
                          <div className="sm:hidden mt-2 pt-2 border-t border-base-content/10">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-base-content/70">
                                {session.sentencesCompleted} sentences
                              </span>
                              <div className="flex items-center gap-1 text-warning">
                                <Star className="w-3 h-3" />
                                <span className="font-semibold">+{session.xp} XP</span>
                              </div>
                            </div>
                          </div>

                          {/* Desktop - XP */}
                          <div className="hidden sm:block absolute top-3 right-3">
                            <div className="flex items-center gap-1 text-warning text-xs">
                              <Star className="w-3 h-3" />
                              <span className="font-semibold">+{session.xp}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </ProRoute>
  )
}