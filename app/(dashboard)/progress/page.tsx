'use client'

import { useState, useEffect } from 'react'
import { 
  TrendingUp, Calendar, Target, Mic, ChevronDown,
  Flame, Trophy, Star, BarChart3, RefreshCw
} from 'lucide-react'

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

interface RecentSession {
  id: string;
  date: string;
  time: string;
  sentenceId: string;
  lesson: string;
  accuracy: number;
  duration: number;
  xp: number;
  attempts: number;
}

export default function ProgressPage() {
  const [timeRange, setTimeRange] = useState('week')
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState<Stats | null>(null)
  const [weeklyData, setWeeklyData] = useState<WeeklyDataPoint[]>([])
  const [pronunciationBreakdown, setPronunciationBreakdown] = useState<PhonemeBreakdown[]>([])
  const [recentSessions, setRecentSessions] = useState<RecentSession[]>([])

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
      setRecentSessions(data.recentSessions || [])
    } catch (error) {
      console.error('Error fetching progress:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6 lg:py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <span className="loading loading-spinner loading-lg text-primary"></span>
            <p className="mt-4 text-lg">Loading your progress...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6 lg:py-8">
        <div className="alert alert-error">
          <span>Failed to load progress data</span>
          <button onClick={fetchProgressData} className="btn btn-sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </button>
        </div>
      </div>
    )
  }

  const maxMinutes = Math.max(...weeklyData.map(d => d.minutes), 1)
  const hasData = weeklyData.some(d => d.minutes > 0)

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 lg:py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl lg:text-4xl font-bold mb-2">Your Progress</h1>
        <p className="text-base-content/70">
          Track your pronunciation improvement over time
        </p>
      </div>

      {/* Time Range Selector */}
      <div className="flex justify-end mb-6">
        <div className="btn-group">
          <button 
            className={`btn btn-sm ${timeRange === 'week' ? 'btn-active' : ''}`}
            onClick={() => setTimeRange('week')}
          >
            Week
          </button>
          <button 
            className={`btn btn-sm ${timeRange === 'month' ? 'btn-active' : ''}`}
            onClick={() => setTimeRange('month')}
          >
            Month
          </button>
          <button 
            className={`btn btn-sm ${timeRange === 'all' ? 'btn-active' : ''}`}
            onClick={() => setTimeRange('all')}
          >
            All Time
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <div className="card bg-base-100 shadow-md">
          <div className="card-body p-4 items-center text-center">
            <Mic className="w-6 h-6 text-primary mb-1" />
            <div className="text-2xl font-bold">{stats.totalPracticeTime}m</div>
            <div className="text-xs opacity-70">Practice Time</div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-md">
          <div className="card-body p-4 items-center text-center">
            <Target className="w-6 h-6 text-success mb-1" />
            <div className="text-2xl font-bold">{stats.averageAccuracy}%</div>
            <div className="text-xs opacity-70">Avg Accuracy</div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-md">
          <div className="card-body p-4 items-center text-center">
            <Flame className="w-6 h-6 text-orange-500 mb-1" />
            <div className="text-2xl font-bold">{stats.streak}</div>
            <div className="text-xs opacity-70">Day Streak</div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-md">
          <div className="card-body p-4 items-center text-center">
            <Trophy className="w-6 h-6 text-warning mb-1" />
            <div className="text-2xl font-bold">{stats.lessonsCompleted}</div>
            <div className="text-xs opacity-70">Sentences Done</div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-md">
          <div className="card-body p-4 items-center text-center">
            <Star className="w-6 h-6 text-warning mb-1" />
            <div className="text-2xl font-bold">{stats.xpEarned}</div>
            <div className="text-xs opacity-70">Total XP</div>
          </div>
        </div>
      </div>

      {!hasData && (
        <div className="alert alert-info mb-8">
          <span>Start practicing to see your progress charts!</span>
        </div>
      )}

      {hasData && (
        <>
          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            {/* Weekly Practice Chart */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">Practice Activity</h2>
                <p className="text-sm text-base-content/60 mb-4">
                  Minutes practiced this week
                </p>

                <div className="flex items-end justify-between gap-2 h-48">
                  {weeklyData.map((day, idx) => (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                      <div className="tooltip" data-tip={`${day.minutes} min\n${day.sessions} sessions`}>
                        <div 
                          className={`w-full rounded-t-lg transition-all cursor-pointer ${
                            day.minutes > 0 
                              ? 'bg-primary hover:bg-primary-focus' 
                              : 'bg-base-300'
                          }`}
                          style={{ 
                            height: `${day.minutes > 0 ? (day.minutes / maxMinutes * 100) : 5}%`,
                            minHeight: day.minutes > 0 ? '20px' : '0'
                          }}
                        ></div>
                      </div>
                      <span className="text-xs font-semibold">{day.day}</span>
                    </div>
                  ))}
                </div>

                <div className="stats stats-horizontal shadow mt-4 bg-base-200">
                  <div className="stat px-4 py-2">
                    <div className="stat-title text-xs">This Week</div>
                    <div className="stat-value text-primary text-2xl">
                      {weeklyData.reduce((sum, day) => sum + day.minutes, 0)}m
                    </div>
                  </div>
                  <div className="stat px-4 py-2">
                    <div className="stat-title text-xs">Daily Avg</div>
                    <div className="stat-value text-secondary text-2xl">
                      {Math.round(weeklyData.reduce((sum, day) => sum + day.minutes, 0) / 7)}m
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Accuracy Trend */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">Accuracy Trend</h2>
                <p className="text-sm text-base-content/60 mb-4">
                  Your pronunciation accuracy over time
                </p>

                <div className="flex items-end justify-between gap-1 h-48">
                  {weeklyData.map((day, idx) => (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                      <div className="tooltip" data-tip={`${day.accuracy}%`}>
                        <div className="relative w-full">
                          {day.accuracy > 0 && (
                            <>
                              <div 
                                className="w-full bg-success/20"
                                style={{ height: `${(day.accuracy / 100) * 180}px` }}
                              ></div>
                              <div className="w-3 h-3 bg-success rounded-full absolute -top-1 left-1/2 -translate-x-1/2"></div>
                            </>
                          )}
                        </div>
                      </div>
                      <span className="text-xs font-semibold">{day.day}</span>
                    </div>
                  ))}
                </div>

                <div className="stats stats-horizontal shadow mt-4 bg-base-200">
                  <div className="stat px-4 py-2">
                    <div className="stat-title text-xs">This Week</div>
                    <div className="stat-value text-success text-2xl">
                      {weeklyData.filter(d => d.accuracy > 0).length > 0
                        ? Math.round(
                            weeklyData.filter(d => d.accuracy > 0).reduce((sum, day) => sum + day.accuracy, 0) /
                            weeklyData.filter(d => d.accuracy > 0).length
                          )
                        : 0}%
                    </div>
                  </div>
                  <div className="stat px-4 py-2">
                    <div className="stat-title text-xs">Best Day</div>
                    <div className="stat-value text-success text-2xl">
                      {Math.max(...weeklyData.map(d => d.accuracy))}%
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Pronunciation Breakdown */}
          {pronunciationBreakdown.length > 0 && (
            <div className="card bg-base-100 shadow-xl mb-8">
              <div className="card-body">
                <h2 className="card-title mb-4">Pronunciation Breakdown</h2>

                <div className="grid md:grid-cols-2 gap-4">
                  {pronunciationBreakdown.slice(0, 4).map((phoneme, idx) => (
                    <div key={idx} className="card bg-base-200">
                      <div className="card-body p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-bold">{phoneme.name}</h3>
                          <div className="flex items-center gap-2">
                            <span className={`text-sm font-semibold text-${phoneme.color}`}>
                              {phoneme.trend}
                            </span>
                            {phoneme.trend.includes('+') && (
                              <TrendingUp className={`w-4 h-4 text-${phoneme.color}`} />
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-between mb-2">
                          <span className="text-3xl font-bold">{phoneme.score}%</span>
                          <span className={`badge badge-${phoneme.color}`}>
                            {phoneme.score >= 85 ? 'Excellent' : 
                             phoneme.score >= 70 ? 'Good' : 
                             'Needs Practice'}
                          </span>
                        </div>
                        <progress 
                          className={`progress progress-${phoneme.color} w-full`}
                          value={phoneme.score} 
                          max="100"
                        ></progress>
                        <p className="text-xs text-base-content/60 mt-2">
                          Practiced {phoneme.practiceCount} times
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Recent Sessions */}
          {recentSessions.length > 0 && (
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title mb-4">Recent Sessions</h2>

                <div className="overflow-x-auto">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Date & Time</th>
                        <th>Sentence</th>
                        <th>Duration</th>
                        <th>Accuracy</th>
                        <th>XP</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentSessions.map((session) => (
                        <tr key={session.id} className="hover">
                          <td>
                            <div>
                              <div className="font-semibold">{session.date}</div>
                              <div className="text-sm opacity-60">{session.time}</div>
                            </div>
                          </td>
                          <td>
                            <div>
                              <div className="font-mono text-sm">{session.sentenceId}</div>
                              <div className="text-xs opacity-60">{session.attempts} attempts</div>
                            </div>
                          </td>
                          <td>{session.duration} min</td>
                          <td>
                            <div className="flex items-center gap-2">
                              <progress 
                                className={`progress w-20 ${
                                  session.accuracy >= 85 ? 'progress-success' :
                                  session.accuracy >= 70 ? 'progress-warning' :
                                  'progress-error'
                                }`}
                                value={session.accuracy} 
                                max="100"
                              ></progress>
                              <span className="font-semibold">{session.accuracy}%</span>
                            </div>
                          </td>
                          <td>
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-warning" />
                              <span className="font-semibold">+{session.xp}</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}