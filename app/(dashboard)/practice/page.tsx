'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@clerk/nextjs'
import { 
  Mic, Clock, Star, ChevronRight, Zap, BookOpen,
  Briefcase, GraduationCap, Phone, Users, MessageCircle, Lock,
  Target, TrendingUp
} from 'lucide-react'
import { useSubscription } from '@/contexts/SubscriptionContext'

interface RecentSession {
  id: string
  date: string
  time: string
  sentenceId: string
  lesson: string
  accuracy: number
  duration: number
  xp: number
  attempts: number
}

interface DailyGoal {
  practiced: number
  goal: number
  percentage: number
  remaining: number
}

export default function PracticePage() {
  const { isSignedIn, userId } = useAuth()
  const { subscriptionTier, isPro, loading: subscriptionLoading } = useSubscription()
  const [recentSessions, setRecentSessions] = useState<RecentSession[]>([])
  const [loading, setLoading] = useState(true)
  const [dailyGoal, setDailyGoal] = useState<DailyGoal>({
    practiced: 0,
    goal: 10,
    percentage: 0,
    remaining: 10
  })

  useEffect(() => {
    const fetchData = async () => {
      if (!isSignedIn || !userId) {
        setLoading(false)
        return
      }

      try {
        const response = await fetch('/api/progress/stats?range=week')
        const data = await response.json()

        if (data.success) {
          // Set recent sessions
          if (data.recentSessions) {
            setRecentSessions(data.recentSessions.slice(0, 2))
          }

          // Calculate today's practice time
          if (data.weeklyData && data.weeklyData.length > 0) {
            const today = new Date().toISOString().split('T')[0]
            const todayData = data.weeklyData.find((day: any) => day.date === today)
            
            if (todayData) {
              const practiced = todayData.minutes
              const goal = 10
              const percentage = Math.min((practiced / goal) * 100, 100)
              const remaining = Math.max(goal - practiced, 0)

              setDailyGoal({
                practiced,
                goal,
                percentage,
                remaining
              })
            }
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [isSignedIn, userId])

  // Fetch recent sessions
  useEffect(() => {
    const fetchRecentSessions = async () => {
      if (!isSignedIn || !userId) {
        setLoading(false)
        return
      }

      try {
        const response = await fetch('/api/progress/stats?range=week')
        const data = await response.json()

        if (data.success && data.recentSessions) {
          setRecentSessions(data.recentSessions.slice(0, 2)) // Get last 2 sessions
        }
      } catch (error) {
        console.error('Error fetching recent sessions:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchRecentSessions()
  }, [isSignedIn, userId])

  const hasAccess = (scenarioPremium: boolean) => {
    if (!scenarioPremium) return true
    return isPro()
  }

  // Scenario ID to name mapping
  const getScenarioName = (sentenceId: string): string => {
    const scenarioMap: Record<string, string> = {
      'daily_drill': 'Daily Drill',
      'phoneme_r_vs_l': '/r/ vs /l/ Sounds',
      'phoneme_th_sounds': '/th/ Sounds',
      'phoneme_f_vs_h': '/f/ vs /h/ Sounds',
      'toeic_speaking': 'TOEIC Speaking',
      'phoneme_v_vs_b': '/v/ vs /b/ Sounds',
      'phoneme_word_stress': 'Word Stress',
      'phoneme_silent_letters': 'Silent Letters',
      'business': 'Business Meetings',
      'interview': 'Job Interviews',
      'phone': 'Phone Calls',
    }
    
    // Try to match the scenario from the sentenceId
    for (const [key, name] of Object.entries(scenarioMap)) {
      if (sentenceId.includes(key)) {
        return name
      }
    }
    
    return 'Practice Session'
  }

  const scenarios = [
    {
      id: 'daily_drill',
      title: 'Daily Drill',
      description: 'Quick 5-minute warm-up practice',
      icon: <Zap className="w-6 h-6 lg:w-8 lg:h-8" />,
      duration: '5 min',
      difficulty: 'All Levels',
      color: 'from-success/20 to-success/5',
      borderColor: 'border-success',
      premium: false,
      sentences: 50,
      badge: 'QUICK',
    },
    {
      id: 'phoneme_r_vs_l',
      title: '/r/ vs /l/ Sounds',
      description: 'Right vs Light, Read vs Lead',
      icon: <BookOpen className="w-6 h-6 lg:w-8 lg:h-8" />,
      duration: '10-15 min',
      difficulty: 'Hard',
      color: 'from-warning/20 to-warning/5',
      borderColor: 'border-warning',
      premium: false,
      sentences: 50,
      badge: 'POPULAR',
    },
    {
      id: 'phoneme_th_sounds',
      title: '/th/ Sounds',
      description: 'Think, That, This, The',
      icon: <BookOpen className="w-6 h-6 lg:w-8 lg:h-8" />,
      duration: '10-15 min',
      difficulty: 'Very Hard',
      color: 'from-error/20 to-error/5',
      borderColor: 'border-error',
      premium: false,
      sentences: 50,
      badge: null,
    },
    {
      id: 'phoneme_f_vs_h',
      title: '/f/ vs /h/ Sounds',
      description: 'Fish vs Hish, Fan vs Han',
      icon: <BookOpen className="w-6 h-6 lg:w-8 lg:h-8" />,
      duration: '10-15 min',
      difficulty: 'Medium',
      color: 'from-info/20 to-info/5',
      borderColor: 'border-info',
      premium: false,
      sentences: 50,
      badge: null,
    },
    {
      id: 'toeic_speaking',
      title: 'TOEIC Speaking',
      description: 'Official test format practice',
      icon: <GraduationCap className="w-6 h-6 lg:w-8 lg:h-8" />,
      duration: '15-20 min',
      difficulty: 'Intermediate',
      color: 'from-primary/20 to-primary/5',
      borderColor: 'border-primary',
      premium: false,
      sentences: 50,
      badge: 'TEST PREP',
    },
    {
      id: 'phoneme_v_vs_b',
      title: '/v/ vs /b/ Sounds',
      description: 'Very vs Berry, Vote vs Boat',
      icon: <BookOpen className="w-6 h-6 lg:w-8 lg:h-8" />,
      duration: '10-15 min',
      difficulty: 'Medium',
      color: 'from-info/20 to-info/5',
      borderColor: 'border-info',
      premium: true,
      sentences: 50,
      badge: null,
    },
    {
      id: 'phoneme_word_stress',
      title: 'Word Stress Patterns',
      description: 'REcord vs reCORD, PREsent vs preSENT',
      icon: <BookOpen className="w-6 h-6 lg:w-8 lg:h-8" />,
      duration: '10-15 min',
      difficulty: 'Hard',
      color: 'from-warning/20 to-warning/5',
      borderColor: 'border-warning',
      premium: true,
      sentences: 50,
      badge: null,
    },
    {
      id: 'phoneme_silent_letters',
      title: 'Silent Letters',
      description: 'Knight, Psychology, Wednesday',
      icon: <BookOpen className="w-6 h-6 lg:w-8 lg:h-8" />,
      duration: '10-15 min',
      difficulty: 'Medium',
      color: 'from-info/20 to-info/5',
      borderColor: 'border-info',
      premium: true,
      sentences: 50,
      badge: null,
    },
    {
      id: 'business',
      title: 'Business Meetings',
      description: 'Professional meeting phrases',
      icon: <Briefcase className="w-6 h-6 lg:w-8 lg:h-8" />,
      duration: '10-15 min',
      difficulty: 'Intermediate',
      color: 'from-warning/20 to-warning/5',
      borderColor: 'border-warning',
      premium: true,
      sentences: 15,
      badge: 'PRO',
    },
    {
      id: 'interview',
      title: 'Job Interviews',
      description: 'Common interview questions',
      icon: <Users className="w-6 h-6 lg:w-8 lg:h-8" />,
      duration: '15-20 min',
      difficulty: 'Advanced',
      color: 'from-error/20 to-error/5',
      borderColor: 'border-error',
      premium: true,
      sentences: 15,
      badge: 'PRO',
    },
    {
      id: 'phone',
      title: 'Phone Calls',
      description: 'Clear phone communication',
      icon: <Phone className="w-6 h-6 lg:w-8 lg:h-8" />,
      duration: '10 min',
      difficulty: 'Intermediate',
      color: 'from-accent/20 to-accent/5',
      borderColor: 'border-accent',
      premium: true,
      sentences: 10,
      badge: 'PRO',
    },
  ]

  const freeScenarios = scenarios.filter(s => !s.premium)
  const premiumScenarios = scenarios.filter(s => s.premium)

  const renderScenarioCard = (scenario: typeof scenarios[0]) => {
    const userHasAccess = hasAccess(scenario.premium)
    const href = userHasAccess ? `/practice/${scenario.id}` : '/pricing'
    
    return (
      <Link
        key={scenario.id}
        href={href}
        className={`card bg-gradient-to-br ${scenario.color} border-2 ${scenario.borderColor} hover:shadow-lg transition-all cursor-pointer relative ${
          !userHasAccess ? 'opacity-75 hover:opacity-100' : ''
        }`}
      >
        <div className="card-body p-4 lg:p-6">
          {/* Icon & Badges */}
          <div className="flex items-start justify-between mb-2 lg:mb-3">
            <div className="p-2 lg:p-3 rounded-full bg-base-100">
              {scenario.icon}
            </div>
            <div className="flex flex-col gap-1 items-end">
              {!userHasAccess && (
                <div className="badge badge-warning badge-xs lg:badge-sm gap-1">
                  <Lock className="w-2.5 h-2.5 lg:w-3 lg:h-3" />
                  Pro
                </div>
              )}
              {scenario.badge && userHasAccess && (
                <div className={`badge badge-xs lg:badge-sm ${
                  scenario.badge === 'POPULAR' ? 'badge-primary' :
                  scenario.badge === 'QUICK' ? 'badge-success' :
                  scenario.badge === 'TEST PREP' ? 'badge-info' :
                  'badge-ghost'
                }`}>
                  {scenario.badge}
                </div>
              )}
            </div>
          </div>

          {/* Content */}
          <h3 className="font-bold text-base lg:text-lg mb-1 lg:mb-2">{scenario.title}</h3>
          <p className="text-xs lg:text-sm text-base-content/70 mb-2 lg:mb-3 line-clamp-2">
            {scenario.description}
          </p>

          {/* Stats */}
          <div className="flex items-center justify-between text-xs lg:text-sm mb-2 lg:mb-3">
            <div className="flex items-center gap-1 opacity-70">
              <Clock className="w-3 h-3 lg:w-4 lg:h-4" />
              {scenario.duration}
            </div>
            <div className={`badge badge-xs lg:badge-sm ${
              scenario.difficulty === 'All Levels' ? 'badge-ghost' :
              scenario.difficulty === 'Easy' ? 'badge-success' :
              scenario.difficulty === 'Medium' ? 'badge-info' :
              scenario.difficulty === 'Hard' ? 'badge-warning' :
              scenario.difficulty === 'Very Hard' ? 'badge-error' :
              scenario.difficulty === 'Intermediate' ? 'badge-warning' :
              scenario.difficulty === 'Advanced' ? 'badge-error' :
              'badge-ghost'
            }`}>
              {scenario.difficulty}
            </div>
            <span className="text-base-content/60">
              {scenario.sentences} sentences
            </span>
          </div>

          {/* Arrow or Upgrade prompt */}
          <div className="flex justify-end">
            {userHasAccess ? (
              <ChevronRight className="w-4 h-4 lg:w-5 lg:h-5" />
            ) : (
              <span className="text-[10px] lg:text-xs text-warning">Upgrade →</span>
            )}
          </div>
        </div>
      </Link>
    )
  }

  if (loading || subscriptionLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-3 py-4 lg:px-4 lg:py-8 pb-24 lg:pb-8">
      {/* Header */}
      <div className="mb-4 lg:mb-6">
        <h1 className="text-2xl lg:text-4xl font-bold mb-1 lg:mb-2">Practice</h1>
        <p className="text-sm lg:text-base text-base-content/70">
          Choose a scenario and start improving your pronunciation
        </p>
        {isPro() && (
          <div className="badge badge-success badge-sm lg:badge-md gap-1 lg:gap-2 mt-2">
            <Star className="w-3 h-3 lg:w-4 lg:h-4" />
            Premium Member
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-4 lg:gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-4 lg:space-y-6">
          {/* Quick Start */}
          <div className="card bg-gradient-to-br from-primary to-secondary text-primary-content">
            <div className="card-body p-4 lg:p-6">
              <div className="flex items-center gap-3 lg:gap-4">
                <div className="p-3 lg:p-4 bg-white/20 rounded-full flex-shrink-0">
                  <Mic className="w-6 h-6 lg:w-8 lg:h-8" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="font-bold text-lg lg:text-2xl">Ready to practice?</h2>
                  <p className="text-sm lg:text-base opacity-90">Start with a quick 5-minute drill</p>
                </div>
                <Link 
                  href="/practice/daily_drill"
                  className="btn btn-accent btn-sm lg:btn-md gap-1 lg:gap-2 flex-shrink-0"
                >
                  Start
                  <ChevronRight className="w-4 h-4 lg:w-5 lg:h-5" />
                </Link>
              </div>
            </div>
          </div>

          {/* Info Alert */}
          <div className="alert bg-info/10 border border-info/30 py-3 lg:py-4">
            <Target className="w-4 h-4 lg:w-5 lg:h-5 text-info flex-shrink-0" />
            <div className="min-w-0">
              <h3 className="font-bold text-sm lg:text-base">Structured Practice</h3>
              <p className="text-xs lg:text-sm">Targeted sentences with instant phoneme-level feedback</p>
            </div>
          </div>

          {/* Free Scenarios */}
          <div>
            <h2 className="text-xl lg:text-2xl font-bold mb-3 lg:mb-4">Free Practice Scenarios</h2>
            <div className="grid sm:grid-cols-2 gap-3 lg:gap-4">
              {freeScenarios.map(renderScenarioCard)}
            </div>
          </div>

          {/* Premium Scenarios */}
          {premiumScenarios.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3 lg:mb-4">
                <h2 className="text-xl lg:text-2xl font-bold">
                  {!isPro() ? 'Premium Scenarios' : 'Professional Scenarios'}
                </h2>
                {!isPro() && (
                  <div className="badge badge-warning badge-xs lg:badge-sm gap-1">
                    <Lock className="w-2.5 h-2.5 lg:w-3 lg:h-3" />
                    Pro
                  </div>
                )}
              </div>
              <div className="grid sm:grid-cols-2 gap-3 lg:gap-4">
                {premiumScenarios.map(renderScenarioCard)}
              </div>
            </div>
          )}

          {/* Coming Soon */}
          <div className="card bg-gradient-to-br from-secondary/20 to-accent/20 border-2 border-secondary/50">
            <div className="card-body p-4 lg:p-6">
              <div className="flex items-start gap-3 lg:gap-4">
                <div className="p-2 lg:p-3 rounded-full bg-secondary/20 flex-shrink-0">
                  <MessageCircle className="w-6 h-6 lg:w-8 lg:h-8 text-secondary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 lg:mb-2 flex-wrap">
                    <h3 className="font-bold text-base lg:text-lg">AI Conversation Mode</h3>
                    <div className="badge badge-secondary badge-xs lg:badge-sm">COMING SOON</div>
                  </div>
                  <p className="text-xs lg:text-sm text-base-content/70 mb-2 lg:mb-3">
                    Natural 10-15 minute conversations with AI coach. Practice fluency while improving pronunciation.
                  </p>
                  <div className="flex items-center gap-1 lg:gap-2 text-xs lg:text-sm text-base-content/60">
                    <TrendingUp className="w-3 h-3 lg:w-4 lg:h-4" />
                    <span>Premium feature • Launching Month 2</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar - Hidden on mobile */}
        <div className="hidden lg:block space-y-6">
          {/* Today's Goal */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h3 className="card-title text-lg">Today's Goal</h3>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">Practice Time</span>
                <span className="font-bold">
                  {dailyGoal.practiced}/{dailyGoal.goal} min
                </span>
              </div>
              <progress 
                className="progress progress-primary" 
                value={dailyGoal.percentage} 
                max="100"
              ></progress>
              {dailyGoal.remaining > 0 ? (
                <p className="text-xs text-base-content/60 mt-2">
                  Just {dailyGoal.remaining} more {dailyGoal.remaining === 1 ? 'minute' : 'minutes'} to reach your daily goal!
                </p>
              ) : (
                <p className="text-xs text-success font-semibold mt-2 flex items-center gap-1">
                  <Star className="w-3 h-3" />
                  Daily goal achieved! 🎉
                </p>
              )}
            </div>
          </div>

          {/* Learning Tip */}
          <div className="card bg-primary/10 border border-primary/30">
            <div className="card-body p-4">
              <div className="flex items-start gap-2">
                <Star className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm mb-1">Pro Tip</h4>
                  <p className="text-xs text-base-content/70">
                    Master one phoneme at a time! Focus on /r/ vs /l/ before moving to /th/ sounds.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Practice */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h3 className="card-title text-lg mb-4">Recent Sessions</h3>
              {recentSessions.length > 0 ? (
                <div className="space-y-3">
                  {recentSessions.map((session) => (
                    <div key={session.id} className="card bg-base-200">
                      <div className="card-body p-4">
                        <h4 className="font-semibold text-sm mb-1">
                          {getScenarioName(session.sentenceId)}
                        </h4>
                        <p className="text-xs text-base-content/60 mb-2">
                          {session.date}{session.time && `, ${session.time}`}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 opacity-60" />
                            <span className="text-xs">{session.duration}m</span>
                          </div>
                          <span className={`text-sm font-bold ${
                            session.accuracy >= 85 ? 'text-success' :
                            session.accuracy >= 70 ? 'text-warning' :
                            'text-error'
                          }`}>
                            {session.accuracy}%
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-base-content/60 text-center py-4">
                  No recent sessions yet. Start practicing!
                </p>
              )}
              <Link 
                href="/progress"
                className="btn btn-ghost btn-sm mt-2"
              >
                View All
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Upgrade CTA */}
          {!isPro() && (
            <div className="card bg-gradient-to-br from-warning/20 to-warning/5 border-2 border-warning/30">
              <div className="card-body">
                <Star className="w-8 h-8 text-warning mb-2" />
                <h3 className="card-title text-lg">Unlock Premium</h3>
                <p className="text-sm text-base-content/70 mb-3">
                  Get access to Business, Interview, and Phone practice scenarios
                </p>
                <ul className="text-xs space-y-1 mb-3 text-base-content/70">
                  <li>✓ All practice scenarios</li>
                  <li>✓ Detailed analytics</li>
                  <li>✓ Priority support</li>
                  <li>✓ Early access to new features</li>
                </ul>
                <Link 
                  href="/pricing"
                  className="btn btn-warning btn-sm"
                >
                  Upgrade Now
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}