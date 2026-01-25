'use client'

import { 
  Trophy, Flame, Star, Target, Crown, Zap, Award,
  CheckCircle, Lock, TrendingUp, Calendar, Mic
} from 'lucide-react'

export default function AchievementsPage() {
  // Mock data - replace with real data later
  const userStats = {
    totalAchievements: 12,
    totalPossible: 45,
    recentlyUnlocked: 3,
  }

  const achievements = [
    {
      id: 1,
      title: 'First Steps',
      description: 'Complete your first practice session',
      icon: <Mic className="w-8 h-8" />,
      unlocked: true,
      unlockedDate: '3 days ago',
      rarity: 'common',
      xp: 10,
    },
    {
      id: 2,
      title: '7-Day Streak',
      description: 'Practice for 7 consecutive days',
      icon: <Flame className="w-8 h-8" />,
      unlocked: true,
      unlockedDate: 'Today',
      rarity: 'rare',
      xp: 50,
    },
    {
      id: 3,
      title: '/r/ vs /l/ Master',
      description: 'Achieve 85%+ accuracy on /r/ vs /l/ sounds',
      icon: <Trophy className="w-8 h-8" />,
      unlocked: true,
      unlockedDate: 'Yesterday',
      rarity: 'epic',
      xp: 100,
    },
    {
      id: 4,
      title: 'Early Bird',
      description: 'Practice before 8 AM for 5 days',
      icon: <Calendar className="w-8 h-8" />,
      unlocked: false,
      progress: 3,
      total: 5,
      rarity: 'rare',
      xp: 50,
    },
    {
      id: 5,
      title: 'Perfect Score',
      description: 'Get 100% accuracy in any lesson',
      icon: <Star className="w-8 h-8" />,
      unlocked: false,
      progress: 98,
      total: 100,
      rarity: 'legendary',
      xp: 200,
    },
    {
      id: 6,
      title: '30-Day Streak',
      description: 'Practice for 30 consecutive days',
      icon: <Flame className="w-8 h-8" />,
      unlocked: false,
      progress: 7,
      total: 30,
      rarity: 'legendary',
      xp: 500,
    },
    {
      id: 7,
      title: 'Pronunciation Pro',
      description: 'Complete all pronunciation lessons',
      icon: <Crown className="w-8 h-8" />,
      unlocked: false,
      progress: 2,
      total: 6,
      rarity: 'epic',
      xp: 150,
    },
    {
      id: 8,
      title: 'Speed Learner',
      description: 'Complete 10 lessons in one day',
      icon: <Zap className="w-8 h-8" />,
      unlocked: false,
      progress: 0,
      total: 10,
      rarity: 'rare',
      xp: 75,
    },
  ]

  const categories = [
    { name: 'All', count: achievements.length },
    { name: 'Unlocked', count: achievements.filter(a => a.unlocked).length },
    { name: 'In Progress', count: achievements.filter(a => !a.unlocked && a.progress).length },
    { name: 'Locked', count: achievements.filter(a => !a.unlocked && !a.progress).length },
  ]

  const rarityColors = {
    common: 'badge-ghost',
    rare: 'badge-info',
    epic: 'badge-primary',
    legendary: 'badge-warning',
  }

  const rarityBgColors = {
    common: 'from-base-200 to-base-300',
    rare: 'from-info/20 to-info/5',
    epic: 'from-primary/20 to-primary/5',
    legendary: 'from-warning/20 to-warning/5',
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 lg:py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl lg:text-4xl font-bold mb-2">Achievements</h1>
        <p className="text-base-content/70">
          Unlock badges and earn XP as you improve
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="card bg-gradient-to-br from-primary/20 to-primary/5 border-2 border-primary/30">
          <div className="card-body items-center text-center">
            <Trophy className="w-12 h-12 text-primary mb-2" />
            <div className="text-4xl font-bold">{userStats.totalAchievements}</div>
            <div className="text-sm opacity-70">Achievements Unlocked</div>
            <progress 
              className="progress progress-primary w-full mt-2" 
              value={userStats.totalAchievements} 
              max={userStats.totalPossible}
            ></progress>
            <div className="text-xs opacity-60 mt-1">
              {userStats.totalAchievements} of {userStats.totalPossible}
            </div>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-success/20 to-success/5 border-2 border-success/30">
          <div className="card-body items-center text-center">
            <CheckCircle className="w-12 h-12 text-success mb-2" />
            <div className="text-4xl font-bold">{userStats.recentlyUnlocked}</div>
            <div className="text-sm opacity-70">Recently Unlocked</div>
            <p className="text-xs opacity-60 mt-2">
              This week
            </p>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-warning/20 to-warning/5 border-2 border-warning/30">
          <div className="card-body items-center text-center">
            <Star className="w-12 h-12 text-warning mb-2" />
            <div className="text-4xl font-bold">450</div>
            <div className="text-sm opacity-70">XP from Achievements</div>
            <p className="text-xs opacity-60 mt-2">
              Total earned
            </p>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="tabs tabs-boxed mb-6 gap-4">
        {categories.map((category) => (
          <a key={category.name} className="tab tab-active">
            {category.name} ({category.count})
          </a>
        ))}
      </div>

      {/* Achievements Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {achievements.map((achievement) => (
          <div 
            key={achievement.id}
            className={`card shadow-xl ${
              achievement.unlocked 
                ? `bg-gradient-to-br ${rarityBgColors[achievement.rarity as keyof typeof rarityBgColors]} border-2 ${
                    achievement.rarity === 'legendary' ? 'border-warning' :
                    achievement.rarity === 'epic' ? 'border-primary' :
                    achievement.rarity === 'rare' ? 'border-info' :
                    'border-base-300'
                  }` 
                : 'bg-base-200'
            }`}
          >
            <div className="card-body p-6">
              {/* Icon & Status */}
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-full ${
                  achievement.unlocked 
                    ? achievement.rarity === 'legendary' ? 'bg-warning/20 text-warning' :
                      achievement.rarity === 'epic' ? 'bg-primary/20 text-primary' :
                      achievement.rarity === 'rare' ? 'bg-info/20 text-info' :
                      'bg-success/20 text-success'
                    : 'bg-base-300 text-base-content/30'
                }`}>
                  {achievement.icon}
                </div>

                {achievement.unlocked ? (
                  <CheckCircle className="w-6 h-6 text-success" />
                ) : achievement.progress ? (
                  <div className="radial-progress text-primary text-xs" 
                       style={{"--value": (achievement.progress! / achievement.total!) * 100, "--size": "2.5rem"} as React.CSSProperties}
                       role="progressbar">
                    {Math.round((achievement.progress! / achievement.total!) * 100)}%
                  </div>
                ) : (
                  <Lock className="w-6 h-6 text-base-content/30" />
                )}
              </div>

              {/* Title & Description */}
              <h3 className="card-title text-lg mb-2">{achievement.title}</h3>
              <p className="text-sm text-base-content/70 mb-4">
                {achievement.description}
              </p>

              {/* Progress Bar */}
              {!achievement.unlocked && achievement.progress !== undefined && (
                <div className="mb-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-base-content/60">Progress</span>
                    <span className="font-semibold">
                      {achievement.progress}/{achievement.total}
                    </span>
                  </div>
                  <progress 
                    className="progress progress-primary w-full" 
                    value={achievement.progress} 
                    max={achievement.total}
                  ></progress>
                </div>
              )}

              {/* Footer */}
              <div className="flex items-center justify-between mt-auto">
                <div className={`badge ${rarityColors[achievement.rarity as keyof typeof rarityColors]}`}>
                  {achievement.rarity}
                </div>

                <div className="flex items-center gap-1 text-sm font-semibold">
                  <Star className="w-4 h-4 text-warning" />
                  <span>+{achievement.xp} XP</span>
                </div>
              </div>

              {/* Unlocked Date */}
              {achievement.unlocked && achievement.unlockedDate && (
                <div className="text-xs text-center text-base-content/60 mt-3 pt-3 border-t border-base-300">
                  Unlocked {achievement.unlockedDate}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Motivational CTA */}
      <div className="card bg-gradient-to-r from-primary to-secondary text-primary-content mt-8">
        <div className="card-body items-center text-center">
          <Trophy className="w-16 h-16 mb-4" />
          <h2 className="card-title text-2xl mb-2">Keep Going!</h2>
          <p className="mb-4">
            Complete more lessons to unlock new achievements and earn XP
          </p>
          <button className="btn btn-accent">
            Practice Now
          </button>
        </div>
      </div>
    </div>
  )
}