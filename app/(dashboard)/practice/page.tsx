'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@clerk/nextjs'
import { 
  Mic, Clock, Star, ChevronRight, Zap, BookOpen,
  Briefcase, GraduationCap, Phone, Users, MessageCircle, Lock,
  Target, TrendingUp
} from 'lucide-react'

export default function PracticePage() {
  const { isSignedIn, userId } = useAuth()
  const [subscriptionTier, setSubscriptionTier] = useState<'free' | 'premium-monthly' | 'premium-annual'>('free')
  const [loading, setLoading] = useState(true)

  // Fetch user's subscription status
  useEffect(() => {
    const fetchSubscription = async () => {
      if (!isSignedIn || !userId) {
        setLoading(false)
        return
      }

      try {
        const response = await fetch('/api/user')
        const data = await response.json();

        console.log("User Data: ", data);

        if (data.plan) {
          // Get subscription tier from user data
          const tier = data.plan || 'free'
          console.log("Subscription tier:", tier);
          
          setSubscriptionTier(tier)
        }
      } catch (error) {
        console.error('Error fetching subscription:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchSubscription()
  }, [isSignedIn, userId])

  // Check if user has access to a scenario
  const hasAccess = (scenarioPremium: boolean) => {
    if (!scenarioPremium) return true // Free scenarios are always accessible
    return subscriptionTier === 'premium-monthly' || subscriptionTier === 'premium-annual'
  }

  useEffect(() => {
    console.log("Subscription tier:", subscriptionTier);
  }, [subscriptionTier])

  const scenarios = [
    {
      id: 'daily_drill',
      title: 'Daily Drill',
      description: 'Quick 5-minute warm-up practice',
      icon: <Zap className="w-8 h-8" />,
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
      icon: <BookOpen className="w-8 h-8" />,
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
      icon: <BookOpen className="w-8 h-8" />,
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
      icon: <BookOpen className="w-8 h-8" />,
      duration: '10-15 min',
      difficulty: 'Medium',
      color: 'from-info/20 to-info/5',
      borderColor: 'border-info',
      premium: false,
      sentences: 50,
      badge: null,
    },
    {
      id: 'phoneme_v_vs_b',
      title: '/v/ vs /b/ Sounds',
      description: 'Very vs Berry, Vote vs Boat',
      icon: <BookOpen className="w-8 h-8" />,
      duration: '10-15 min',
      difficulty: 'Medium',
      color: 'from-info/20 to-info/5',
      borderColor: 'border-info',
      premium: false,
      sentences: 50,
      badge: null,
    },
    {
      id: 'phoneme_word_stress',
      title: 'Word Stress Patterns',
      description: 'REcord vs reCORD, PREsent vs preSENT',
      icon: <BookOpen className="w-8 h-8" />,
      duration: '10-15 min',
      difficulty: 'Hard',
      color: 'from-warning/20 to-warning/5',
      borderColor: 'border-warning',
      premium: false,
      sentences: 50,
      badge: null,
    },
    {
      id: 'phoneme_silent_letters',
      title: 'Silent Letters',
      description: 'Knight, Psychology, Wednesday',
      icon: <BookOpen className="w-8 h-8" />,
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
      icon: <GraduationCap className="w-8 h-8" />,
      duration: '15-20 min',
      difficulty: 'Intermediate',
      color: 'from-primary/20 to-primary/5',
      borderColor: 'border-primary',
      premium: false,
      sentences: 50,
      badge: 'TEST PREP',
    },
    {
      id: 'business',
      title: 'Business Meetings',
      description: 'Professional meeting phrases',
      icon: <Briefcase className="w-8 h-8" />,
      duration: '10-15 min',
      difficulty: 'Intermediate',
      color: 'from-warning/20 to-warning/5',
      borderColor: 'border-warning',
      premium: true,
      sentences: 15,
      badge: null,
    },
    {
      id: 'interview',
      title: 'Job Interviews',
      description: 'Common interview questions',
      icon: <Users className="w-8 h-8" />,
      duration: '15-20 min',
      difficulty: 'Advanced',
      color: 'from-error/20 to-error/5',
      borderColor: 'border-error',
      premium: true,
      sentences: 15,
      badge: null,
    },
    {
      id: 'phone',
      title: 'Phone Calls',
      description: 'Clear phone communication',
      icon: <Phone className="w-8 h-8" />,
      duration: '10 min',
      difficulty: 'Intermediate',
      color: 'from-accent/20 to-accent/5',
      borderColor: 'border-accent',
      premium: true,
      sentences: 10,
      badge: null,
    },
  ]

  const recentPractice = [
    {
      id: 1,
      title: '/th/ Sounds Practice',
      date: 'Today, 2:30 PM',
      accuracy: 82,
      duration: 15,
    },
    {
      id: 2,
      title: 'TOEIC Speaking Test',
      date: 'Yesterday',
      accuracy: 88,
      duration: 20,
    },
  ]

  // Group scenarios
  const freeScenarios = scenarios.filter(s => !s.premium)
  const premiumScenarios = scenarios.filter(s => s.premium)

  // Render scenario card
  const renderScenarioCard = (scenario: typeof scenarios[0]) => {
    const userHasAccess = hasAccess(scenario.premium)
    const href = userHasAccess ? `/practice/${scenario.id}` : '/pricing'
    
    return (
      <Link
        key={scenario.id}
        href={href}
        className={`card bg-gradient-to-br ${scenario.color} border-2 ${scenario.borderColor} hover:shadow-xl transition-all cursor-pointer relative ${
          !userHasAccess ? 'opacity-75 hover:opacity-100' : ''
        }`}
      >
        <div className="card-body">
          {/* Icon & Badges */}
          <div className="flex items-start justify-between mb-3">
            <div className="p-3 rounded-full bg-base-100">
              {scenario.icon}
            </div>
            <div className="flex flex-col gap-1 items-end">
              {!userHasAccess && (
                <div className="badge badge-warning gap-1">
                  <Lock className="w-3 h-3" />
                  Premium
                </div>
              )}
              {scenario.badge && userHasAccess && (
                <div className={`badge badge-sm ${
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
          <h3 className="card-title text-lg">{scenario.title}</h3>
          <p className="text-sm text-base-content/70 mb-4">
            {scenario.description}
          </p>

          {/* Stats */}
          <div className="flex items-center gap-4 text-sm mb-3">
            <div className="flex items-center gap-1 opacity-70">
              <Clock className="w-4 h-4" />
              {scenario.duration}
            </div>
            <div className={`badge badge-sm ${
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
          </div>

          {/* Sentence Count */}
          <div className="text-xs text-base-content/60 mb-2">
            📝 {scenario.sentences} practice sentences
          </div>

          {/* What You'll Practice */}
          <div className="mt-2 pt-2 border-t border-base-300">
            <p className="text-xs font-semibold mb-1">
              {userHasAccess ? "What you'll practice:" : "Includes:"}
            </p>
            <div className="flex flex-wrap gap-1">
              {scenario.id === 'daily_drill' && (
                <>
                  <span className="badge badge-xs badge-outline">mixed phonemes</span>
                  <span className="badge badge-xs badge-outline">warm-up</span>
                </>
              )}
              {scenario.id === 'phoneme_r_vs_l' && (
                <>
                  <span className="badge badge-xs badge-outline">/r/ sound</span>
                  <span className="badge badge-xs badge-outline">/l/ sound</span>
                  <span className="badge badge-xs badge-outline">minimal pairs</span>
                </>
              )}
              {scenario.id === 'phoneme_th_sounds' && (
                <>
                  <span className="badge badge-xs badge-outline">/θ/ voiceless</span>
                  <span className="badge badge-xs badge-outline">/ð/ voiced</span>
                  <span className="badge badge-xs badge-outline">tongue position</span>
                </>
              )}
              {scenario.id === 'phoneme_f_vs_h' && (
                <>
                  <span className="badge badge-xs badge-outline">/f/ sound</span>
                  <span className="badge badge-xs badge-outline">/h/ sound</span>
                  <span className="badge badge-xs badge-outline">lip position</span>
                </>
              )}
              {scenario.id === 'phoneme_v_vs_b' && (
                <>
                  <span className="badge badge-xs badge-outline">/v/ sound</span>
                  <span className="badge badge-xs badge-outline">/b/ sound</span>
                  <span className="badge badge-xs badge-outline">minimal pairs</span>
                </>
              )}
              {scenario.id === 'phoneme_word_stress' && (
                <>
                  <span className="badge badge-xs badge-outline">stress patterns</span>
                  <span className="badge badge-xs badge-outline">rhythm</span>
                  <span className="badge badge-xs badge-outline">emphasis</span>
                </>
              )}
              {scenario.id === 'phoneme_silent_letters' && (
                <>
                  <span className="badge badge-xs badge-outline">silent consonants</span>
                  <span className="badge badge-xs badge-outline">silent vowels</span>
                  <span className="badge badge-xs badge-outline">pronunciation</span>
                </>
              )}
              {scenario.id === 'toeic_speaking' && (
                <>
                  <span className="badge badge-xs badge-outline">read aloud</span>
                  <span className="badge badge-xs badge-outline">descriptions</span>
                  <span className="badge badge-xs badge-outline">test format</span>
                </>
              )}
              {scenario.id === 'business' && (
                <>
                  <span className="badge badge-xs badge-outline">meetings</span>
                  <span className="badge badge-xs badge-outline">presentations</span>
                  <span className="badge badge-xs badge-outline">negotiations</span>
                </>
              )}
              {scenario.id === 'interview' && (
                <>
                  <span className="badge badge-xs badge-outline">self-intro</span>
                  <span className="badge badge-xs badge-outline">common Q&A</span>
                  <span className="badge badge-xs badge-outline">strengths</span>
                </>
              )}
              {scenario.id === 'phone' && (
                <>
                  <span className="badge badge-xs badge-outline">greetings</span>
                  <span className="badge badge-xs badge-outline">scheduling</span>
                  <span className="badge badge-xs badge-outline">clarity</span>
                </>
              )}
            </div>
          </div>

          {/* Arrow or Upgrade prompt */}
          <div className="flex justify-end mt-2">
            {userHasAccess ? (
              <ChevronRight className="w-5 h-5" />
            ) : (
              <span className="text-xs text-warning">Click to upgrade →</span>
            )}
          </div>
        </div>
      </Link>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 lg:py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl lg:text-4xl font-bold mb-2">Practice</h1>
        <p className="text-base-content/70">
          Choose a scenario and start improving your pronunciation
        </p>
        {subscriptionTier !== 'free' && (
          <div className="badge badge-success gap-2 mt-2">
            <Star className="w-3 h-3" />
            {subscriptionTier.includes('premium') && 'Premium Member'}
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Start */}
          <div className="card bg-gradient-to-br from-primary to-secondary text-primary-content">
            <div className="card-body">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-white/20 rounded-full">
                  <Mic className="w-8 h-8" />
                </div>
                <div className="flex-1">
                  <h2 className="card-title text-2xl">Ready to practice?</h2>
                  <p className="opacity-90">Start with a quick 5-minute drill</p>
                </div>
                <Link 
                  href="/practice/daily_drill"
                  className="btn btn-accent gap-2"
                >
                  Start Now
                  <ChevronRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>

          {/* Info Alert */}
          <div className="alert alert-info">
            <Target className="w-5 h-5" />
            <div>
              <h3 className="font-bold">Structured Practice</h3>
              <p className="text-sm">Each scenario includes targeted sentences and instant phoneme-level feedback</p>
            </div>
          </div>

          {/* Free Scenarios */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Free Practice Scenarios</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {freeScenarios.map(renderScenarioCard)}
            </div>
          </div>

          {/* Premium Scenarios */}
          {premiumScenarios.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <h2 className="text-2xl font-bold">
                  {subscriptionTier === 'free' ? 'Premium Scenarios' : 'Professional Scenarios'}
                </h2>
                {subscriptionTier === 'free' && (
                  <div className="badge badge-warning gap-1">
                    <Lock className="w-3 h-3" />
                    Pro
                  </div>
                )}
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {premiumScenarios.map(renderScenarioCard)}
              </div>
            </div>
          )}

          {/* Coming Soon - Conversation Mode */}
          <div className="card bg-gradient-to-br from-secondary/20 to-accent/20 border-2 border-secondary/50">
            <div className="card-body">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-full bg-secondary/20">
                  <MessageCircle className="w-8 h-8 text-secondary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="card-title text-lg">AI Conversation Mode</h3>
                    <div className="badge badge-secondary badge-sm">COMING SOON</div>
                  </div>
                  <p className="text-sm text-base-content/70 mb-3">
                    Natural 10-15 minute conversations with AI coach. Practice fluency while improving pronunciation.
                  </p>
                  <div className="flex items-center gap-2 text-sm text-base-content/60">
                    <TrendingUp className="w-4 h-4" />
                    <span>Premium feature • Launching Month 2</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Today's Goal */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h3 className="card-title text-lg">Today's Goal</h3>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">Practice Time</span>
                <span className="font-bold">7/10 min</span>
              </div>
              <progress className="progress progress-primary" value="70" max="100"></progress>
              <p className="text-xs text-base-content/60 mt-2">
                Just 3 more minutes to reach your daily goal!
              </p>
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
              <div className="space-y-3">
                {recentPractice.map((session) => (
                  <div key={session.id} className="card bg-base-200">
                    <div className="card-body p-4">
                      <h4 className="font-semibold text-sm mb-1">
                        {session.title}
                      </h4>
                      <p className="text-xs text-base-content/60 mb-2">
                        {session.date}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 opacity-60" />
                          <span className="text-xs">{session.duration}m</span>
                        </div>
                        <div className="flex items-center gap-1">
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
                  </div>
                ))}
              </div>
              <Link 
                href="/progress"
                className="btn btn-ghost btn-sm mt-2"
              >
                View All
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Upgrade CTA - Only show for free users */}
          {subscriptionTier === 'free' && (
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