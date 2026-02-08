'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Mic, Flame, Trophy, Target, ChevronRight, Star, 
  Lock, CheckCircle, Circle, Calendar, TrendingUp,
  Crown, Zap, Award, RefreshCw
} from 'lucide-react'
import { useUser } from '@clerk/nextjs'

// Icon mapping for achievements
const iconMap: Record<string, any> = {
  Mic, Flame, Trophy, Star, Target, Award, TrendingUp, Crown, Zap, CheckCircle
}

interface DashboardStats {
  user: {
    streak: number;
    accuracyScore: number;
    level: string;
    xp: number;
    xpToNextLevel: number;
    dailyGoal: number;
    dailyProgress: number;
    completedSentences: number;
  };
  todayStats: {
    practiceTime: number;
    accuracy: number;
    xpEarned: number;
  };
  recentAchievements: Array<{
    id: string;
    title: string;
    description: string;
    icon: string;
    rarity: string;
    xp: number;
  }>;
}

export default function DashboardPage() {
  const { user: clerkUser } = useUser()
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState<DashboardStats | null>(null)

  useEffect(() => {
    fetchDashboardStats()
  }, [])

  const fetchDashboardStats = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/dashboard/stats')
      
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard stats')
      }

      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error('Error fetching dashboard:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    console.log("Stats: ", stats);
  }, [stats])

// Lesson scenarios
const lessons = [
  // FREE LESSONS
  {
    id: 'daily_drill',
    title: 'Daily Drill',
    subtitle: 'Quick 5-minute warm-up practice',
    difficulty: 'All Levels',
    icon: '⚡',
    scenario: 'daily_drill',
    lessons: 50,
    locked: false,
  },
  {
    id: 'phoneme_r_vs_l',
    title: '/r/ vs /l/ Sounds',
    subtitle: 'Right vs Light, Read vs Lead',
    difficulty: 'Hard',
    icon: '🔤',
    scenario: 'phoneme_r_vs_l',
    lessons: 50,
    locked: false,
  },
  {
    id: 'phoneme_th_sounds',
    title: '/th/ Sounds',
    subtitle: 'Think, That, This, The',
    difficulty: 'Very Hard',
    icon: '👅',
    scenario: 'phoneme_th_sounds',
    lessons: 50,
    locked: false,
  },
  {
    id: 'phoneme_f_vs_h',
    title: '/f/ vs /h/ Sounds',
    subtitle: 'Fish vs Hish, Fan vs Han',
    difficulty: 'Medium',
    icon: '🗣️',
    scenario: 'phoneme_f_vs_h',
    lessons: 50,
    locked: false,
  },
  {
    id: 'toeic_speaking',
    title: 'TOEIC Speaking',
    subtitle: 'Official test format practice',
    difficulty: 'Intermediate',
    icon: '📝',
    scenario: 'toeic_speaking',
    lessons: 50,
    locked: false,
  },
  
  // PREMIUM LESSONS
  {
    id: 'phoneme_v_vs_b',
    title: '/v/ vs /b/ Sounds',
    subtitle: 'Very vs Berry, Vote vs Boat',
    difficulty: 'Medium',
    icon: '🎵',
    scenario: 'phoneme_v_vs_b',
    lessons: 50,
    locked: true,
  },
  {
    id: 'phoneme_word_stress',
    title: 'Word Stress Patterns',
    subtitle: 'REcord vs reCORD, PREsent vs preSENT',
    difficulty: 'Hard',
    icon: '🎯',
    scenario: 'phoneme_word_stress',
    lessons: 50,
    locked: true,
  },
  {
    id: 'phoneme_silent_letters',
    title: 'Silent Letters',
    subtitle: 'Knight, Psychology, Wednesday',
    difficulty: 'Medium',
    icon: '🤫',
    scenario: 'phoneme_silent_letters',
    lessons: 50,
    locked: true,
  },
  {
    id: 'business',
    title: 'Business Meetings',
    subtitle: 'Professional meeting phrases',
    difficulty: 'Intermediate',
    icon: '💼',
    scenario: 'business',
    lessons: 15,
    locked: true,
  },
  {
    id: 'interview',
    title: 'Job Interviews',
    subtitle: 'Common interview questions',
    difficulty: 'Advanced',
    icon: '🤝',
    scenario: 'interview',
    lessons: 15,
    locked: true,
  },
  {
    id: 'phone',
    title: 'Phone Calls',
    subtitle: 'Clear phone communication',
    difficulty: 'Intermediate',
    icon: '📞',
    scenario: 'phone',
    lessons: 10,
    locked: true,
  },
]

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-3 py-4 lg:px-4 lg:py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <span className="loading loading-spinner loading-lg text-primary"></span>
            <p className="mt-4 text-lg">Loading dashboard...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="max-w-7xl mx-auto px-3 py-4 lg:px-4 lg:py-8">
        <div className="alert alert-error">
          <span>Failed to load dashboard</span>
          <button onClick={fetchDashboardStats} className="btn btn-sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </button>
        </div>
      </div>
    )
  }

  const todayStatsData = [
    { label: 'Practice Time', value: `${stats.todayStats.practiceTime}m`, icon: Mic, color: 'text-primary' },
    { label: 'Accuracy', value: stats.todayStats.accuracy > 0 ? `${stats.todayStats.accuracy}%` : '-', icon: Target, color: 'text-success' },
    { label: 'Streak', value: stats.user.streak, icon: Flame, color: 'text-orange-500' },
    { label: 'XP Earned', value: stats.todayStats.xpEarned, icon: Star, color: 'text-warning' },
  ]

  const userName = clerkUser?.firstName || 'User'
  const levelLabel = stats.user.level.charAt(0).toUpperCase() + stats.user.level.slice(1)

  return (
    <div className="max-w-7xl mx-auto px-3 py-4 lg:px-4 lg:py-8 pb-24 lg:pb-8">
      {/* Welcome Section */}
      <div className="mb-4 lg:mb-6">
        <h1 className="text-2xl lg:text-4xl font-bold mb-1 lg:mb-2">
          Welcome back, {userName}! 👋
        </h1>
        <p className="text-sm lg:text-base text-base-content/70">
          {stats.user.streak > 0 
            ? `${stats.user.streak}-day streak! Keep it alive! 🔥`
            : "Start practicing to build your streak!"}
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-4 lg:gap-6">
        {/* Main Content - Left Column */}
        <div className="lg:col-span-2 space-y-4 lg:space-y-6">
          {/* Daily Goal Progress */}
          <div className="card bg-gradient-to-br from-primary/10 to-secondary/10 border-2 border-primary/20">
            <div className="card-body p-4 lg:p-6">
              <div className="flex items-center justify-between mb-2 lg:mb-3">
                <h2 className="font-bold lg:text-xl">Daily Goal</h2>
                <div className="flex items-center gap-1 lg:gap-2 text-sm lg:text-base">
                  <Target className="w-4 h-4 lg:w-5 lg:h-5 text-primary" />
                  <span className="font-bold">{stats.user.dailyProgress}/{stats.user.dailyGoal} min</span>
                </div>
              </div>
              
              <div className="w-full bg-base-200 rounded-full h-3 lg:h-4 mb-2">
                <div 
                  className="bg-gradient-to-r from-primary to-secondary h-3 lg:h-4 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min((stats.user.dailyProgress / stats.user.dailyGoal) * 100, 100)}%` }}
                ></div>
              </div>
              
              <p className="text-xs lg:text-sm text-base-content/70">
                {stats.user.dailyProgress >= stats.user.dailyGoal
                  ? '🎉 Daily goal completed! Keep going!'
                  : `Just ${stats.user.dailyGoal - stats.user.dailyProgress} more minutes to reach your goal!`}
              </p>
            </div>
          </div>

          {/* Today's Stats */}
          <div className="grid grid-cols-4 gap-2 lg:gap-4">
            {todayStatsData.map((stat, idx) => {
              const Icon = stat.icon
              return (
                <div key={idx} className="card bg-base-100 shadow-md">
                  <div className="card-body p-3 lg:p-4 items-center text-center">
                    <Icon className={`w-5 h-5 lg:w-6 lg:h-6 ${stat.color} mb-1`} />
                    <div className="text-lg lg:text-2xl font-bold">{stat.value}</div>
                    <div className="text-[10px] lg:text-xs opacity-70">{stat.label}</div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Learning Path */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body p-4 lg:p-6">
              <div className="flex items-center justify-between mb-3 lg:mb-4">
                <h2 className="font-bold lg:text-xl">Your Learning Path</h2>
                <div className="badge badge-primary badge-sm lg:badge-md">{levelLabel}</div>
              </div>

              <div className="space-y-2 lg:space-y-3">
                {lessons.map((lesson) => (
                  <div
                    key={lesson.id}
                    className={`card ${
                      lesson.locked 
                        ? 'bg-base-200 opacity-60' 
                        : 'bg-base-200 hover:bg-base-300'
                    } transition-all ${!lesson.locked ? 'cursor-pointer' : ''}`}
                  >
                    <div className="card-body p-3 lg:p-4">
                      <div className="flex items-center gap-3 lg:gap-4">
                        {/* Icon */}
                        <div className="text-3xl lg:text-4xl flex-shrink-0">{lesson.icon}</div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1 lg:gap-2 mb-0.5 lg:mb-1">
                            <h3 className="font-bold text-sm lg:text-base">{lesson.title}</h3>
                            {lesson.locked && <Lock className="w-3 h-3 lg:w-4 lg:h-4 text-base-content/30 flex-shrink-0" />}
                          </div>
                          
                          <p className="text-xs lg:text-sm text-base-content/70 line-clamp-1 lg:line-clamp-none">{lesson.subtitle}</p>
                          
                          <div className="flex items-center gap-2 lg:gap-3 mt-1 lg:mt-2">
                            <div className={`badge badge-xs lg:badge-sm ${
                              lesson.difficulty === 'Very Hard' ? 'badge-error' :
                              lesson.difficulty === 'Hard' ? 'badge-warning' :
                              lesson.difficulty === 'Medium' ? 'badge-info' :
                              'badge-success'
                            }`}>
                              {lesson.difficulty}
                            </div>
                            
                            <span className="text-[10px] lg:text-xs text-base-content/60">
                              {lesson.lessons} sentences
                            </span>
                          </div>
                        </div>

                        {/* Action */}
                        <div className="flex-shrink-0">
                          {lesson.locked ? (
                            <div className="flex flex-col items-center">
                              <Lock className="w-5 h-5 lg:w-6 lg:h-6 text-base-content/30 mb-0.5 lg:mb-1" />
                              <span className="text-[9px] lg:text-xs badge badge-ghost badge-xs">Pro</span>
                            </div>
                          ) : (
                            <Link 
                              href={`/practice/${lesson.scenario}`}
                              className="btn btn-primary btn-xs lg:btn-sm gap-1"
                            >
                              Start
                              <ChevronRight className="w-3 h-3 lg:w-4 lg:h-4" />
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Hidden on mobile */}
        <div className="hidden lg:block space-y-6">
          {/* Level Progress */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h3 className="card-title text-lg">Progress</h3>
              
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold">Level: {levelLabel}</span>
                  <span className="text-sm text-base-content/70">{stats.user.xp} XP</span>
                </div>
                
                <progress 
                  className="progress progress-primary w-full h-3" 
                  value={stats.user.xp} 
                  max={stats.user.xpToNextLevel}
                ></progress>
                
                <p className="text-xs text-center text-base-content/60 mt-1">
                  {stats.user.xpToNextLevel - stats.user.xp} XP to next level
                </p>
              </div>

              <div className="divider my-2"></div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-base-content/70">Sentences Completed</span>
                  <span className="font-semibold">{stats.user.completedSentences}/300</span>
                </div>
                <progress 
                  className="progress progress-success w-full" 
                  value={stats.user.completedSentences} 
                  max={300}
                ></progress>
              </div>
            </div>
          </div>

          {/* Quick Practice */}
          <div className="card bg-gradient-to-br from-success/20 to-primary/20 border-2 border-success/30">
            <div className="card-body">
              <h3 className="card-title text-lg">Quick Practice</h3>
              <p className="text-sm text-base-content/70 mb-3">
                5-minute pronunciation drill
              </p>
              
              <Link 
                href="/practice/daily_drill"
                className="btn btn-success gap-2"
              >
                <Mic className="w-5 h-5" />
                Start Now
              </Link>
            </div>
          </div>

          {/* Recent Achievements */}
          {stats.recentAchievements.length > 0 && (
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title text-lg">Recent Achievements</h3>
                
                <div className="space-y-3">
                  {stats.recentAchievements.map((achievement) => {
                    const IconComponent = iconMap[achievement.icon] || Trophy
                    
                    return (
                      <div key={achievement.id} className="flex items-center gap-3">
                        <div className="avatar">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                            achievement.rarity === 'legendary' ? 'bg-warning/20' :
                            achievement.rarity === 'epic' ? 'bg-primary/20' :
                            achievement.rarity === 'rare' ? 'bg-info/20' :
                            'bg-success/20'
                          }`}>
                            <IconComponent className={`w-6 h-6 ${
                              achievement.rarity === 'legendary' ? 'text-warning' :
                              achievement.rarity === 'epic' ? 'text-primary' :
                              achievement.rarity === 'rare' ? 'text-info' :
                              'text-success'
                            }`} />
                          </div>
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-sm">{achievement.title}</p>
                          <p className="text-xs text-base-content/60">+{achievement.xp} XP</p>
                        </div>
                      </div>
                    )
                  })}
                </div>

                <Link 
                  href="/achievements"
                  className="btn btn-ghost btn-sm mt-2"
                >
                  View All
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          )}

          {/* Empty State for No Achievements */}
          {stats.recentAchievements.length === 0 && (
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title text-lg">Achievements</h3>
                <div className="text-center py-4">
                  <Trophy className="w-12 h-12 mx-auto mb-2 text-base-content/30" />
                  <p className="text-sm text-base-content/60 mb-3">
                    Start practicing to unlock achievements!
                  </p>
                  <Link href="/achievements" className="btn btn-sm btn-primary">
                    View All Achievements
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Upgrade CTA */}
          <div className="card bg-gradient-to-br from-primary to-secondary text-primary-content">
            <div className="card-body">
              <Crown className="w-8 h-8 mb-2" />
              <h3 className="card-title">Upgrade to Pro</h3>
              <p className="text-sm opacity-90 mb-3">
                Unlock TOEIC Speaking, Business English, and more!
              </p>
              <Link 
                href="/pricing"
                className="btn btn-accent"
              >
                Upgrade Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}