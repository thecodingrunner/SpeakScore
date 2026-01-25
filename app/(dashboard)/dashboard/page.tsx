'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  Mic, Flame, Trophy, Target, ChevronRight, Star, 
  Lock, CheckCircle, Circle, Calendar, TrendingUp,
  Crown, Zap, Award
} from 'lucide-react'

export default function DashboardPage() {
  
  // Mock data - replace with real data later
  const user = {
    name: 'Yuki',
    streak: 7,
    accuracyScore: 78,
    level: 12,
    xp: 2450,
    xpToNextLevel: 3000,
    dailyGoal: 10, // minutes
    dailyProgress: 7, // minutes completed today
  }

  const lessons = [
    {
      id: 1,
      title: '/r/ vs /l/ Sounds',
      subtitle: 'Master the difference',
      difficulty: 'Hard',
      completed: true,
      locked: false,
      icon: '🔤',
      accuracy: 85,
      lessons: 5,
    },
    {
      id: 2,
      title: '/th/ Sounds Practice',
      subtitle: 'Think, that, this',
      difficulty: 'Very Hard',
      completed: false,
      locked: false,
      icon: '👅',
      accuracy: null,
      lessons: 4,
      current: true,
    },
    {
      id: 3,
      title: 'Word Stress Patterns',
      subtitle: 'REcord vs reCORD',
      difficulty: 'Medium',
      completed: false,
      locked: false,
      icon: '📊',
      accuracy: null,
      lessons: 6,
    },
    {
      id: 4,
      title: 'Silent Vowels',
      subtitle: 'Avoid extra syllables',
      difficulty: 'Medium',
      completed: false,
      locked: true,
      icon: '🤫',
      accuracy: null,
      lessons: 5,
    },
    {
      id: 5,
      title: 'Business English',
      subtitle: 'Meeting scenarios',
      difficulty: 'Hard',
      completed: false,
      locked: true,
      icon: '💼',
      accuracy: null,
      lessons: 8,
    },
  ]

  const todayStats = [
    { label: 'Practice Time', value: `${user.dailyProgress}m`, icon: Mic, color: 'text-primary' },
    { label: 'Accuracy', value: `${user.accuracyScore}%`, icon: Target, color: 'text-success' },
    { label: 'Streak', value: user.streak, icon: Flame, color: 'text-orange-500' },
    { label: 'XP Earned', value: '120', icon: Star, color: 'text-warning' },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 lg:py-8">
      {/* Welcome Section */}
      <div className="mb-6">
        <h1 className="text-3xl lg:text-4xl font-bold mb-2">
          Welcome back, {user.name}! 👋
        </h1>
        <p className="text-base-content/70">
          Keep your streak alive! You're on fire! 🔥
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content - Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Daily Goal Progress */}
          <div className="card bg-gradient-to-br from-primary/10 to-secondary/10 border-2 border-primary/20">
            <div className="card-body">
              <div className="flex items-center justify-between mb-3">
                <h2 className="card-title">Daily Goal</h2>
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary" />
                  <span className="font-bold">{user.dailyProgress}/{user.dailyGoal} min</span>
                </div>
              </div>
              
              <div className="w-full bg-base-200 rounded-full h-4 mb-2">
                <div 
                  className="bg-gradient-to-r from-primary to-secondary h-4 rounded-full transition-all duration-500"
                  style={{ width: `${(user.dailyProgress / user.dailyGoal) * 100}%` }}
                ></div>
              </div>
              
              <p className="text-sm text-base-content/70">
                {user.dailyGoal - user.dailyProgress > 0 
                  ? `Just ${user.dailyGoal - user.dailyProgress} more minutes to reach your goal!`
                  : '🎉 Daily goal completed! Keep going!'}
              </p>
            </div>
          </div>

          {/* Today's Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {todayStats.map((stat, idx) => {
              const Icon = stat.icon
              return (
                <div key={idx} className="card bg-base-100 shadow-md">
                  <div className="card-body p-4 items-center text-center">
                    <Icon className={`w-6 h-6 ${stat.color} mb-1`} />
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <div className="text-xs opacity-70">{stat.label}</div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Learning Path */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex items-center justify-between mb-4">
                <h2 className="card-title">Your Learning Path</h2>
                <div className="badge badge-primary">Level {user.level}</div>
              </div>

              <div className="space-y-3">
                {lessons.map((lesson, idx) => (
                  <div
                    key={lesson.id}
                    className={`card ${
                      lesson.current 
                        ? 'bg-primary/10 border-2 border-primary' 
                        : lesson.locked 
                        ? 'bg-base-200 opacity-60' 
                        : 'bg-base-200 hover:bg-base-300'
                    } transition-all cursor-pointer`}
                  >
                    <div className="card-body p-4">
                      <div className="flex items-center gap-4">
                        {/* Icon/Status */}
                        <div className="text-4xl">{lesson.icon}</div>

                        {/* Content */}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold">{lesson.title}</h3>
                            {lesson.completed && <CheckCircle className="w-5 h-5 text-success" />}
                            {lesson.current && <Zap className="w-5 h-5 text-primary" />}
                            {lesson.locked && <Lock className="w-5 h-5 text-base-content/30" />}
                          </div>
                          
                          <p className="text-sm text-base-content/70">{lesson.subtitle}</p>
                          
                          <div className="flex items-center gap-3 mt-2">
                            <div className={`badge badge-sm ${
                              lesson.difficulty === 'Very Hard' ? 'badge-error' :
                              lesson.difficulty === 'Hard' ? 'badge-warning' :
                              'badge-info'
                            }`}>
                              {lesson.difficulty}
                            </div>
                            
                            <span className="text-xs text-base-content/60">
                              {lesson.lessons} lessons
                            </span>
                            
                            {lesson.accuracy && (
                              <span className="text-xs font-semibold text-success">
                                {lesson.accuracy}% accuracy
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Action */}
                        <div>
                          {lesson.locked ? (
                            <Lock className="w-6 h-6 text-base-content/30" />
                          ) : lesson.completed ? (
                            <Link 
                              href={`/practice/${lesson.id}`}
                              className="btn btn-ghost btn-sm"
                            >
                              Review
                            </Link>
                          ) : (
                            <Link 
                              href={`/practice/${lesson.id}`}
                              className="btn btn-primary btn-sm"
                            >
                              {lesson.current ? 'Continue' : 'Start'}
                              <ChevronRight className="w-4 h-4" />
                            </Link>
                          )}
                        </div>
                      </div>

                      {/* Progress bar for current lesson */}
                      {lesson.current && (
                        <div className="mt-3">
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-base-content/60">Lesson 2 of {lesson.lessons}</span>
                            <span className="font-semibold">40%</span>
                          </div>
                          <progress className="progress progress-primary w-full" value="40" max="100"></progress>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Level Progress */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h3 className="card-title text-lg">Level Progress</h3>
              
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold">Level {user.level}</span>
                <span className="text-sm font-semibold">Level {user.level + 1}</span>
              </div>
              
              <progress 
                className="progress progress-primary w-full h-3" 
                value={user.xp} 
                max={user.xpToNextLevel}
              ></progress>
              
              <p className="text-xs text-center text-base-content/60 mt-2">
                {user.xpToNextLevel - user.xp} XP to next level
              </p>
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
                href={`/practice/quick`}
                className="btn btn-success gap-2"
              >
                <Mic className="w-5 h-5" />
                Start Now
              </Link>
            </div>
          </div>

          {/* Recent Achievements */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h3 className="card-title text-lg">Recent Achievements</h3>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="avatar">
                    <div className="w-12 h-12 rounded-full bg-warning/20 flex items-center justify-center">
                      <Flame className="w-6 h-6 text-warning" />
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold text-sm">7-Day Streak</p>
                    <p className="text-xs text-base-content/60">Keep it up!</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="avatar">
                    <div className="w-12 h-12 rounded-full bg-success/20 flex items-center justify-center">
                      <Trophy className="w-6 h-6 text-success" />
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold text-sm">/r/ vs /l/ Master</p>
                    <p className="text-xs text-base-content/60">85% accuracy</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="avatar">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                      <Star className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Level 12</p>
                    <p className="text-xs text-base-content/60">Leveled up!</p>
                  </div>
                </div>
              </div>

              <Link 
                href={`/achievements`}
                className="btn btn-ghost btn-sm mt-2"
              >
                View All
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Upgrade CTA (for free users) */}
          <div className="card bg-gradient-to-br from-primary to-secondary text-primary-content">
            <div className="card-body">
              <Crown className="w-8 h-8 mb-2" />
              <h3 className="card-title">Upgrade to Premium</h3>
              <p className="text-sm opacity-90 mb-3">
                Unlock all scenarios, detailed analytics, and more!
              </p>
              <Link 
                href={`/pricing`}
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