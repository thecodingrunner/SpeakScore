'use client'

import { useState, useEffect } from 'react'
import { 
  Trophy, Flame, Star, Target, Crown, Zap, Award,
  CheckCircle, Lock, TrendingUp, Calendar, Mic, RefreshCw
} from 'lucide-react'
import Link from 'next/link'

// Icon mapping
const iconMap: Record<string, any> = {
  Mic,
  Flame,
  Trophy,
  Calendar,
  Star,
  Crown,
  Zap,
  Award,
  Target,
  TrendingUp,
  CheckCircle
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  xp: number;
  unlocked: boolean;
  unlockedDate?: string | null;
  progress: number;
  total: number;
}

interface Stats {
  totalAchievements: number;
  totalPossible: number;
  recentlyUnlocked: number;
  totalXpFromAchievements: number;
}

export default function AchievementsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState<Stats | null>(null)
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [filter, setFilter] = useState<'all' | 'unlocked' | 'progress' | 'locked'>('all')
  const [newUnlocks, setNewUnlocks] = useState<any[]>([])

  useEffect(() => {
    fetchAchievements()
  }, [])

  const fetchAchievements = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/achievements')
      
      if (!response.ok) {
        throw new Error('Failed to fetch achievements')
      }

      const data = await response.json()
      
      setStats(data.stats)
      setAchievements(data.achievements)
      setNewUnlocks(data.newlyUnlocked || [])

      // Show notification for new unlocks
      if (data.newlyUnlocked && data.newlyUnlocked.length > 0) {
        console.log('🎉 New achievements unlocked:', data.newlyUnlocked)
      }
    } catch (error) {
      console.error('Error fetching achievements:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredAchievements = achievements.filter(a => {
    switch (filter) {
      case 'unlocked':
        return a.unlocked
      case 'progress':
        return !a.unlocked && a.progress > 0
      case 'locked':
        return !a.unlocked && a.progress === 0
      default:
        return true
    }
  })

  const categories = [
    { name: 'all', label: 'All', count: achievements.length },
    { name: 'unlocked', label: 'Unlocked', count: achievements.filter(a => a.unlocked).length },
    { name: 'progress', label: 'In Progress', count: achievements.filter(a => !a.unlocked && a.progress > 0).length },
    { name: 'locked', label: 'Locked', count: achievements.filter(a => !a.unlocked && a.progress === 0).length },
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

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6 lg:py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <span className="loading loading-spinner loading-lg text-primary"></span>
            <p className="mt-4 text-lg">Loading achievements...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6 lg:py-8">
        <div className="alert alert-error">
          <span>Failed to load achievements</span>
          <button onClick={fetchAchievements} className="btn btn-sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </button>
        </div>
      </div>
    )
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

      {/* New Unlocks Notification */}
      {newUnlocks.length > 0 && (
        <div className="alert alert-success mb-6">
          <Trophy className="w-6 h-6" />
          <div>
            <h3 className="font-bold">New Achievement{newUnlocks.length > 1 ? 's' : ''} Unlocked!</h3>
            <div className="text-sm">
              {newUnlocks.map((unlock, i) => (
                <span key={i}>
                  {unlock.title} (+{unlock.xp} XP){i < newUnlocks.length - 1 ? ', ' : ''}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="card bg-gradient-to-br from-primary/20 to-primary/5 border-2 border-primary/30">
          <div className="card-body items-center text-center">
            <Trophy className="w-12 h-12 text-primary mb-2" />
            <div className="text-4xl font-bold">{stats.totalAchievements}</div>
            <div className="text-sm opacity-70">Achievements Unlocked</div>
            <progress 
              className="progress progress-primary w-full mt-2" 
              value={stats.totalAchievements} 
              max={stats.totalPossible}
            ></progress>
            <div className="text-xs opacity-60 mt-1">
              {stats.totalAchievements} of {stats.totalPossible}
            </div>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-success/20 to-success/5 border-2 border-success/30">
          <div className="card-body items-center text-center">
            <CheckCircle className="w-12 h-12 text-success mb-2" />
            <div className="text-4xl font-bold">{stats.recentlyUnlocked}</div>
            <div className="text-sm opacity-70">Recently Unlocked</div>
            <p className="text-xs opacity-60 mt-2">
              This week
            </p>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-warning/20 to-warning/5 border-2 border-warning/30">
          <div className="card-body items-center text-center">
            <Star className="w-12 h-12 text-warning mb-2" />
            <div className="text-4xl font-bold">{stats.totalXpFromAchievements}</div>
            <div className="text-sm opacity-70">XP from Achievements</div>
            <p className="text-xs opacity-60 mt-2">
              Total earned
            </p>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="tabs tabs-boxed mb-6 gap-2 flex-wrap">
        {categories.map((category) => (
          <button
            key={category.name}
            className={`tab ${filter === category.name ? 'tab-active' : ''}`}
            onClick={() => setFilter(category.name as any)}
          >
            {category.label} ({category.count})
          </button>
        ))}
      </div>

      {/* Empty State */}
      {filteredAchievements.length === 0 && (
        <div className="text-center py-12">
          <Lock className="w-16 h-16 mx-auto mb-4 text-base-content/30" />
          <p className="text-lg text-base-content/70 mb-4">
            No achievements in this category yet
          </p>
          <Link href="/practice" className="btn btn-primary">
            Start Practicing
          </Link>
        </div>
      )}

      {/* Achievements Grid */}
      {filteredAchievements.length > 0 && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAchievements.map((achievement) => {
            const IconComponent = iconMap[achievement.icon] || Trophy;
            
            return (
              <div 
                key={achievement.id}
                className={`card shadow-xl transition-all hover:shadow-2xl ${
                  achievement.unlocked 
                    ? `bg-gradient-to-br ${rarityBgColors[achievement.rarity]} border-2 ${
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
                      <IconComponent className="w-8 h-8" />
                    </div>

                    {achievement.unlocked ? (
                      <CheckCircle className="w-6 h-6 text-success" />
                    ) : achievement.progress > 0 ? (
                      <div className="radial-progress text-primary text-xs" 
                           style={{"--value": (achievement.progress / achievement.total) * 100, "--size": "2.5rem"} as React.CSSProperties}
                           role="progressbar">
                        {Math.round((achievement.progress / achievement.total) * 100)}%
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
                  {!achievement.unlocked && achievement.progress > 0 && (
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
                    <div className={`badge ${rarityColors[achievement.rarity]}`}>
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
            );
          })}
        </div>
      )}

      {/* Motivational CTA */}
      {stats.totalAchievements < stats.totalPossible && (
        <div className="card bg-gradient-to-r from-primary to-secondary text-primary-content mt-8">
          <div className="card-body items-center text-center">
            <Trophy className="w-16 h-16 mb-4" />
            <h2 className="card-title text-2xl mb-2">Keep Going!</h2>
            <p className="mb-4">
              {stats.totalPossible - stats.totalAchievements} more achievement{stats.totalPossible - stats.totalAchievements !== 1 ? 's' : ''} to unlock
            </p>
            <Link href="/practice" className="btn btn-accent">
              Practice Now
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}