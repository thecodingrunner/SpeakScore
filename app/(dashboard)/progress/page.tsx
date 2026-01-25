'use client'

import { useState } from 'react'
import { 
  TrendingUp, Calendar, Target, Mic, ChevronDown,
  Flame, Trophy, Star, BarChart3
} from 'lucide-react'

export default function ProgressPage() {
  const [timeRange, setTimeRange] = useState('week') // week, month, all

  // Mock data - replace with real data later
  const stats = {
    totalPracticeTime: 145, // minutes
    averageAccuracy: 78,
    streak: 7,
    lessonsCompleted: 12,
    xpEarned: 1240,
    pronunciationScores: {
      rVsL: 85,
      thSounds: 72,
      wordStress: 81,
      silentVowels: 0, // not started
      fVsH: 0,
      vVsB: 0,
    },
  }

  const weeklyData = [
    { day: 'Mon', minutes: 15, accuracy: 75 },
    { day: 'Tue', minutes: 20, accuracy: 78 },
    { day: 'Wed', minutes: 25, accuracy: 80 },
    { day: 'Thu', minutes: 18, accuracy: 76 },
    { day: 'Fri', minutes: 22, accuracy: 82 },
    { day: 'Sat', minutes: 0, accuracy: 0 },
    { day: 'Sun', minutes: 30, accuracy: 85 },
  ]

  const pronunciationProgress = [
    { name: '/r/ vs /l/', score: stats.pronunciationScores.rVsL, trend: '+12%', color: 'success' },
    { name: '/th/ sounds', score: stats.pronunciationScores.thSounds, trend: '+8%', color: 'warning' },
    { name: 'Word Stress', score: stats.pronunciationScores.wordStress, trend: '+15%', color: 'success' },
    { name: 'Silent Vowels', score: stats.pronunciationScores.silentVowels, trend: 'Not started', color: 'ghost' },
  ]

  const recentSessions = [
    {
      id: 1,
      date: 'Today',
      time: '2:30 PM',
      lesson: '/th/ Sounds Practice',
      accuracy: 82,
      duration: 15,
      xp: 25,
    },
    {
      id: 2,
      date: 'Yesterday',
      time: '6:45 PM',
      lesson: '/r/ vs /l/ Review',
      accuracy: 88,
      duration: 20,
      xp: 30,
    },
    {
      id: 3,
      date: '2 days ago',
      time: '7:00 PM',
      lesson: 'Word Stress Practice',
      accuracy: 75,
      duration: 18,
      xp: 22,
    },
  ]

  const maxMinutes = Math.max(...weeklyData.map(d => d.minutes))

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
            <div className="text-xs opacity-70">Lessons Done</div>
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

      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* Weekly Practice Chart */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Practice Activity</h2>
            <p className="text-sm text-base-content/60 mb-4">
              Minutes practiced this week
            </p>

            {/* Bar chart */}
            <div className="flex items-end justify-between gap-2 h-48">
              {weeklyData.map((day, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                  <div className="tooltip" data-tip={`${day.minutes} min`}>
                    <div 
                      className={`w-full rounded-t-lg transition-all ${
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

            {/* Line chart representation */}
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
                  {Math.round(
                    weeklyData.filter(d => d.accuracy > 0).reduce((sum, day) => sum + day.accuracy, 0) /
                    weeklyData.filter(d => d.accuracy > 0).length
                  )}%
                </div>
              </div>
              <div className="stat px-4 py-2">
                <div className="stat-title text-xs">Change</div>
                <div className="stat-value text-success text-2xl">
                  +7%
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pronunciation Breakdown */}
      <div className="card bg-base-100 shadow-xl mb-8">
        <div className="card-body">
          <h2 className="card-title mb-4">Pronunciation Breakdown</h2>

          <div className="grid md:grid-cols-2 gap-4">
            {pronunciationProgress.map((phoneme, idx) => (
              <div key={idx} className="card bg-base-200">
                <div className="card-body p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold">{phoneme.name}</h3>
                    <div className="flex items-center gap-2">
                      {phoneme.score > 0 && (
                        <>
                          <span className={`text-sm font-semibold text-${phoneme.color}`}>
                            {phoneme.trend}
                          </span>
                          <TrendingUp className={`w-4 h-4 text-${phoneme.color}`} />
                        </>
                      )}
                    </div>
                  </div>

                  {phoneme.score > 0 ? (
                    <>
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
                    </>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-sm text-base-content/60 mb-2">
                        Not started yet
                      </p>
                      <button className="btn btn-primary btn-sm">
                        Start Learning
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Sessions */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title mb-4">Recent Sessions</h2>

          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Date & Time</th>
                  <th>Lesson</th>
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
                    <td>{session.lesson}</td>
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
    </div>
  )
}