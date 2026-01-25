'use client'

import Link from 'next/link'
import { 
  Mic, Clock, Star, ChevronRight, Zap, BookOpen,
  Briefcase, GraduationCap, Phone, Users, MessageCircle, Lock,
  Target, TrendingUp
} from 'lucide-react'

export default function PracticePage() {

  const scenarios = [
    {
      id: 'quick',
      title: 'Daily Drill',
      description: 'Random pronunciation challenges',
      icon: <Zap className="w-8 h-8" />,
      duration: '5 min',
      difficulty: 'All Levels',
      color: 'from-success/20 to-success/5',
      borderColor: 'border-success',
      premium: false,
      sentences: 15,
      badge: null,
    },
    {
      id: 'phonemes',
      title: 'Phoneme Lessons',
      description: 'Master /r/ vs /l/, /th/, and more',
      icon: <BookOpen className="w-8 h-8" />,
      duration: '10-15 min',
      difficulty: 'Beginner',
      color: 'from-info/20 to-info/5',
      borderColor: 'border-info',
      premium: false,
      lessons: 6,
      badge: 'POPULAR',
    },
    {
      id: 'toeic',
      title: 'TOEIC Speaking',
      description: 'Official test format practice',
      icon: <GraduationCap className="w-8 h-8" />,
      duration: '15-20 min',
      difficulty: 'Intermediate',
      color: 'from-primary/20 to-primary/5',
      borderColor: 'border-primary',
      premium: false,
      sentences: 20,
      badge: 'FREE',
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
      sentences: 12,
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

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 lg:py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl lg:text-4xl font-bold mb-2">Practice</h1>
        <p className="text-base-content/70">
          Choose a scenario and start improving your pronunciation
        </p>
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
                  href={`/practice/quick`}
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

          {/* Scenarios Grid */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Practice Scenarios</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {scenarios.map((scenario) => (
                <Link
                  key={scenario.id}
                  href={scenario.premium ? `/pricing` : `/practice/${scenario.id}`}
                  className={`card bg-gradient-to-br ${scenario.color} border-2 ${scenario.borderColor} hover:shadow-xl transition-all cursor-pointer relative`}
                >
                  <div className="card-body">
                    {/* Icon & Badges */}
                    <div className="flex items-start justify-between mb-3">
                      <div className={`p-3 rounded-full bg-base-100`}>
                        {scenario.icon}
                      </div>
                      <div className="flex flex-col gap-1 items-end">
                        {scenario.premium && (
                          <div className="badge badge-warning gap-1">
                            <Lock className="w-3 h-3" />
                            Premium
                          </div>
                        )}
                        {scenario.badge && (
                          <div className={`badge badge-sm ${
                            scenario.badge === 'POPULAR' ? 'badge-primary' :
                            scenario.badge === 'FREE' ? 'badge-success' :
                            scenario.badge === 'NEW' ? 'badge-secondary' :
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
                        scenario.difficulty === 'Beginner' ? 'badge-success' :
                        scenario.difficulty === 'Intermediate' ? 'badge-warning' :
                        scenario.difficulty === 'Advanced' ? 'badge-error' :
                        'badge-ghost'
                      }`}>
                        {scenario.difficulty}
                      </div>
                    </div>

                    {/* Sentence/Lesson Count */}
                    <div className="text-xs text-base-content/60 mb-2">
                      {scenario.sentences && (
                        <span>📝 {scenario.sentences} practice sentences</span>
                      )}
                      {scenario.lessons && (
                        <span>📚 {scenario.lessons} phoneme lessons</span>
                      )}
                    </div>

                    {/* What You'll Practice */}
                    {!scenario.premium && (
                      <div className="mt-2 pt-2 border-t border-base-300">
                        <p className="text-xs font-semibold mb-1">What you'll practice:</p>
                        <div className="flex flex-wrap gap-1">
                          {scenario.id === 'quick' && (
                            <>
                              <span className="badge badge-xs badge-outline">/r/ vs /l/</span>
                              <span className="badge badge-xs badge-outline">/th/</span>
                              <span className="badge badge-xs badge-outline">word stress</span>
                            </>
                          )}
                          {scenario.id === 'phonemes' && (
                            <>
                              <span className="badge badge-xs badge-outline">6 sound pairs</span>
                              <span className="badge badge-xs badge-outline">step-by-step</span>
                            </>
                          )}
                          {scenario.id === 'toeic' && (
                            <>
                              <span className="badge badge-xs badge-outline">read aloud</span>
                              <span className="badge badge-xs badge-outline">describe pictures</span>
                              <span className="badge badge-xs badge-outline">opinions</span>
                            </>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Premium Preview */}
                    {scenario.premium && (
                      <div className="mt-2 pt-2 border-t border-base-300">
                        <p className="text-xs font-semibold mb-1">Includes:</p>
                        <div className="flex flex-wrap gap-1">
                          {scenario.id === 'business' && (
                            <>
                              <span className="badge badge-xs badge-outline">meeting phrases</span>
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
                    )}

                    {/* Arrow */}
                    <div className="flex justify-end mt-2">
                      <ChevronRight className="w-5 h-5" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

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
                    Start with Phoneme Lessons to master specific sounds, then practice them in TOEIC scenarios!
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
                href={`/progress`}
                className="btn btn-ghost btn-sm mt-2"
              >
                View All
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Upgrade CTA */}
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
                href={`/pricing`}
                className="btn btn-warning btn-sm"
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