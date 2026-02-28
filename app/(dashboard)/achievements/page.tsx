// 'use client'

// import { useState, useEffect } from 'react'
// import { 
//   Trophy, Flame, Star, Target, Crown, Zap, Award,
//   CheckCircle, Lock, TrendingUp, Calendar, Mic, RefreshCw
// } from 'lucide-react'
// import Link from 'next/link'
// import { ProRoute } from '@/components/global/ProRoute'

// // Icon mapping
// const iconMap: Record<string, any> = {
//   Mic,
//   Flame,
//   Trophy,
//   Calendar,
//   Star,
//   Crown,
//   Zap,
//   Award,
//   Target,
//   TrendingUp,
//   CheckCircle
// }

// interface Achievement {
//   id: string;
//   title: string;
//   description: string;
//   icon: string;
//   rarity: 'common' | 'rare' | 'epic' | 'legendary';
//   xp: number;
//   unlocked: boolean;
//   unlockedDate?: string | null;
//   progress: number;
//   total: number;
// }

// interface Stats {
//   totalAchievements: number;
//   totalPossible: number;
//   recentlyUnlocked: number;
//   totalXpFromAchievements: number;
// }

// export default function AchievementsPage() {
//   const [isLoading, setIsLoading] = useState(true)
//   const [stats, setStats] = useState<Stats | null>(null)
//   const [achievements, setAchievements] = useState<Achievement[]>([])
//   const [filter, setFilter] = useState<'all' | 'unlocked' | 'progress' | 'locked'>('all')
//   const [newUnlocks, setNewUnlocks] = useState<any[]>([])

//   useEffect(() => {
//     fetchAchievements()
//   }, [])

//   const fetchAchievements = async () => {
//     try {
//       setIsLoading(true)
//       const response = await fetch('/api/achievements')
      
//       if (!response.ok) {
//         throw new Error('Failed to fetch achievements')
//       }

//       const data = await response.json()
      
//       setStats(data.stats)
//       setAchievements(data.achievements)
//       setNewUnlocks(data.newlyUnlocked || [])

//       // Show notification for new unlocks
//       if (data.newlyUnlocked && data.newlyUnlocked.length > 0) {
//         console.log('🎉 New achievements unlocked:', data.newlyUnlocked)
//       }
//     } catch (error) {
//       console.error('Error fetching achievements:', error)
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const filteredAchievements = achievements.filter(a => {
//     switch (filter) {
//       case 'unlocked':
//         return a.unlocked
//       case 'progress':
//         return !a.unlocked && a.progress > 0
//       case 'locked':
//         return !a.unlocked && a.progress === 0
//       default:
//         return true
//     }
//   })

//   const categories = [
//     { name: 'all', label: 'All', count: achievements.length },
//     { name: 'unlocked', label: 'Unlocked', count: achievements.filter(a => a.unlocked).length },
//     { name: 'progress', label: 'In Progress', count: achievements.filter(a => !a.unlocked && a.progress > 0).length },
//     { name: 'locked', label: 'Locked', count: achievements.filter(a => !a.unlocked && a.progress === 0).length },
//   ]

//   const rarityColors = {
//     common: 'badge-ghost',
//     rare: 'badge-info',
//     epic: 'badge-primary',
//     legendary: 'badge-warning',
//   }

//   const rarityBgColors = {
//     common: 'from-base-200 to-base-300',
//     rare: 'from-info/20 to-info/5',
//     epic: 'from-primary/20 to-primary/5',
//     legendary: 'from-warning/20 to-warning/5',
//   }

//   if (isLoading) {
//     return (
//       <ProRoute>
//         <div className="max-w-7xl mx-auto px-3 py-4 lg:px-4 lg:py-8">
//           <div className="flex items-center justify-center min-h-[400px]">
//             <div className="text-center">
//               <span className="loading loading-spinner loading-lg text-primary"></span>
//               <p className="mt-4 text-lg">Loading achievements...</p>
//             </div>
//           </div>
//         </div>
//       </ProRoute>
//     )
//   }

//   if (!stats) {
//     return (
//       <ProRoute>
//         <div className="max-w-7xl mx-auto px-3 py-4 lg:px-4 lg:py-8">
//           <div className="alert alert-error">
//             <span>Failed to load achievements</span>
//             <button onClick={fetchAchievements} className="btn btn-sm">
//               <RefreshCw className="w-4 h-4 mr-2" />
//               Retry
//             </button>
//           </div>
//         </div>
//       </ProRoute>
//     )
//   }

//   return (
//     <ProRoute>
//       <div className="max-w-7xl mx-auto px-3 py-4 lg:px-4 lg:py-8 pb-24 lg:pb-8">
//         {/* Header */}
//         <div className="mb-4 lg:mb-8">
//           <h1 className="text-2xl lg:text-4xl font-bold mb-1 lg:mb-2">Achievements</h1>
//           <p className="text-sm lg:text-base text-base-content/70">
//             Unlock badges and earn XP as you improve
//           </p>
//         </div>

//         {/* New Unlocks Notification */}
//         {newUnlocks.length > 0 && (
//           <div className="alert alert-success mb-4 lg:mb-6">
//             <Trophy className="w-5 h-5 lg:w-6 lg:h-6" />
//             <div>
//               <h3 className="font-bold text-sm lg:text-base">New Achievement{newUnlocks.length > 1 ? 's' : ''} Unlocked!</h3>
//               <div className="text-xs lg:text-sm">
//                 {newUnlocks.map((unlock, i) => (
//                   <span key={i}>
//                     {unlock.title} (+{unlock.xp} XP){i < newUnlocks.length - 1 ? ', ' : ''}
//                   </span>
//                 ))}
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Stats Overview */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-3 lg:gap-4 mb-4 lg:mb-8">
//           <div className="card bg-gradient-to-br from-primary/20 to-primary/5 border-2 border-primary/30">
//             <div className="card-body p-4 lg:p-6 items-center text-center">
//               <Trophy className="w-10 h-10 lg:w-12 lg:h-12 text-primary mb-2" />
//               <div className="text-3xl lg:text-4xl font-bold">{stats.totalAchievements}</div>
//               <div className="text-xs lg:text-sm opacity-70">Achievements Unlocked</div>
//               <progress 
//                 className="progress progress-primary w-full mt-2" 
//                 value={stats.totalAchievements} 
//                 max={stats.totalPossible}
//               ></progress>
//               <div className="text-[10px] lg:text-xs opacity-60 mt-1">
//                 {stats.totalAchievements} of {stats.totalPossible}
//               </div>
//             </div>
//           </div>

//           <div className="card bg-gradient-to-br from-success/20 to-success/5 border-2 border-success/30">
//             <div className="card-body p-4 lg:p-6 items-center text-center">
//               <CheckCircle className="w-10 h-10 lg:w-12 lg:h-12 text-success mb-2" />
//               <div className="text-3xl lg:text-4xl font-bold">{stats.recentlyUnlocked}</div>
//               <div className="text-xs lg:text-sm opacity-70">Recently Unlocked</div>
//               <p className="text-[10px] lg:text-xs opacity-60 mt-2">
//                 This week
//               </p>
//             </div>
//           </div>

//           <div className="card bg-gradient-to-br from-warning/20 to-warning/5 border-2 border-warning/30">
//             <div className="card-body p-4 lg:p-6 items-center text-center">
//               <Star className="w-10 h-10 lg:w-12 lg:h-12 text-warning mb-2" />
//               <div className="text-3xl lg:text-4xl font-bold">{stats.totalXpFromAchievements}</div>
//               <div className="text-xs lg:text-sm opacity-70">XP from Achievements</div>
//               <p className="text-[10px] lg:text-xs opacity-60 mt-2">
//                 Total earned
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Category Tabs */}
//         <div className="tabs tabs-boxed mb-4 lg:mb-6 gap-1 lg:gap-2 flex-wrap">
//           {categories.map((category) => (
//             <button
//               key={category.name}
//               className={`tab tab-sm lg:tab-md ${filter === category.name ? 'tab-active' : ''}`}
//               onClick={() => setFilter(category.name as any)}
//             >
//               {category.label} ({category.count})
//             </button>
//           ))}
//         </div>

//         {/* Empty State */}
//         {filteredAchievements.length === 0 && (
//           <div className="text-center py-8 lg:py-12">
//             <Lock className="w-12 h-12 lg:w-16 lg:h-16 mx-auto mb-3 lg:mb-4 text-base-content/30" />
//             <p className="text-base lg:text-lg text-base-content/70 mb-3 lg:mb-4">
//               No achievements in this category yet
//             </p>
//             <Link href="/practice" className="btn btn-primary btn-sm lg:btn-md">
//               Start Practicing
//             </Link>
//           </div>
//         )}

//         {/* Achievements Grid */}
//         {filteredAchievements.length > 0 && (
//           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
//             {filteredAchievements.map((achievement) => {
//               const IconComponent = iconMap[achievement.icon] || Trophy;
              
//               return (
//                 <div 
//                   key={achievement.id}
//                   className={`card shadow-xl transition-all hover:shadow-2xl ${
//                     achievement.unlocked 
//                       ? `bg-gradient-to-br ${rarityBgColors[achievement.rarity]} border-2 ${
//                           achievement.rarity === 'legendary' ? 'border-warning' :
//                           achievement.rarity === 'epic' ? 'border-primary' :
//                           achievement.rarity === 'rare' ? 'border-info' :
//                           'border-base-300'
//                         }` 
//                       : 'bg-base-200'
//                   }`}
//                 >
//                   <div className="card-body p-4 lg:p-6">
//                     {/* Icon & Status */}
//                     <div className="flex items-start justify-between mb-3 lg:mb-4">
//                       <div className={`p-2 lg:p-3 rounded-full ${
//                         achievement.unlocked 
//                           ? achievement.rarity === 'legendary' ? 'bg-warning/20 text-warning' :
//                             achievement.rarity === 'epic' ? 'bg-primary/20 text-primary' :
//                             achievement.rarity === 'rare' ? 'bg-info/20 text-info' :
//                             'bg-success/20 text-success'
//                           : 'bg-base-300 text-base-content/30'
//                       }`}>
//                         <IconComponent className="w-6 h-6 lg:w-8 lg:h-8" />
//                       </div>

//                       {achievement.unlocked ? (
//                         <CheckCircle className="w-5 h-5 lg:w-6 lg:h-6 text-success" />
//                       ) : achievement.progress > 0 ? (
//                         <div className="radial-progress text-primary text-xs" 
//                             style={{"--value": (achievement.progress / achievement.total) * 100, "--size": "2.5rem"} as React.CSSProperties}
//                             role="progressbar">
//                           {Math.round((achievement.progress / achievement.total) * 100)}%
//                         </div>
//                       ) : (
//                         <Lock className="w-5 h-5 lg:w-6 lg:h-6 text-base-content/30" />
//                       )}
//                     </div>

//                     {/* Title & Description */}
//                     <h3 className="font-bold text-base lg:text-lg mb-1 lg:mb-2">{achievement.title}</h3>
//                     <p className="text-xs lg:text-sm text-base-content/70 mb-3 lg:mb-4">
//                       {achievement.description}
//                     </p>

//                     {/* Progress Bar */}
//                     {!achievement.unlocked && achievement.progress > 0 && (
//                       <div className="mb-3">
//                         <div className="flex justify-between text-xs mb-1">
//                           <span className="text-base-content/60">Progress</span>
//                           <span className="font-semibold">
//                             {achievement.progress}/{achievement.total}
//                           </span>
//                         </div>
//                         <progress 
//                           className="progress progress-primary w-full" 
//                           value={achievement.progress} 
//                           max={achievement.total}
//                         ></progress>
//                       </div>
//                     )}

//                     {/* Footer */}
//                     <div className="flex items-center justify-between mt-auto">
//                       <div className={`badge badge-xs lg:badge-sm ${rarityColors[achievement.rarity]}`}>
//                         {achievement.rarity}
//                       </div>

//                       <div className="flex items-center gap-1 text-xs lg:text-sm font-semibold">
//                         <Star className="w-3 h-3 lg:w-4 lg:h-4 text-warning" />
//                         <span>+{achievement.xp} XP</span>
//                       </div>
//                     </div>

//                     {/* Unlocked Date */}
//                     {achievement.unlocked && achievement.unlockedDate && (
//                       <div className="text-[10px] lg:text-xs text-center text-base-content/60 mt-2 lg:mt-3 pt-2 lg:pt-3 border-t border-base-300">
//                         Unlocked {achievement.unlockedDate}
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         )}

//         {/* Motivational CTA */}
//         {stats.totalAchievements < stats.totalPossible && (
//           <div className="card bg-gradient-to-r from-primary to-secondary text-primary-content mt-4 lg:mt-8">
//             <div className="card-body p-6 lg:p-8 items-center text-center">
//               <Trophy className="w-12 h-12 lg:w-16 lg:h-16 mb-3 lg:mb-4" />
//               <h2 className="text-xl lg:text-2xl font-bold mb-2">Keep Going!</h2>
//               <p className="text-sm lg:text-base mb-3 lg:mb-4">
//                 {stats.totalPossible - stats.totalAchievements} more achievement{stats.totalPossible - stats.totalAchievements !== 1 ? 's' : ''} to unlock
//               </p>
//               <Link href="/practice" className="btn btn-accent btn-sm lg:btn-md">
//                 Practice Now
//               </Link>
//             </div>
//           </div>
//         )}
//       </div>
//     </ProRoute>
//   )
// }


// app/[locale]/(dashboard)/achievements/page.tsx
'use client'

import { useState, useEffect } from 'react'
import {
  Trophy, Flame, Star, Target, Crown, Zap, Award,
  CheckCircle, Lock, TrendingUp, Calendar, Mic, RefreshCw
} from 'lucide-react'
import Link from 'next/link'
import { ProRoute } from '@/components/global/ProRoute'
import { Mascot } from '@/components/global/Mascot'
import { useTranslations } from 'next-intl'

const iconMap: Record<string, any> = { Mic, Flame, Trophy, Calendar, Star, Crown, Zap, Award, Target, TrendingUp, CheckCircle }

interface Achievement {
  id: string; title: string; description: string; icon: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  xp: number; unlocked: boolean; unlockedDate?: string | null; progress: number; total: number
}
interface Stats { totalAchievements: number; totalPossible: number; recentlyUnlocked: number; totalXpFromAchievements: number }

const rarityIcon = (r: string) => r === 'legendary' ? 'text-warning bg-warning/10' : r === 'epic' ? 'text-primary bg-primary/10' : r === 'rare' ? 'text-info bg-info/10' : 'text-success bg-success/10'
const rarityBorder = (r: string) => r === 'legendary' ? 'border-warning/20' : r === 'epic' ? 'border-primary/20' : r === 'rare' ? 'border-info/20' : 'border-base-content/8'
const rarityBg = (r: string) => r === 'legendary' ? 'bg-warning/4' : r === 'epic' ? 'bg-primary/4' : r === 'rare' ? 'bg-info/4' : 'bg-base-100'
const rarityBadge = (r: string) => r === 'legendary' ? 'bg-warning/10 text-warning border-warning/15' : r === 'epic' ? 'bg-primary/10 text-primary border-primary/15' : r === 'rare' ? 'bg-info/10 text-info border-info/15' : 'bg-base-content/5 text-base-content/50 border-base-content/8'

export default function AchievementsPage() {
  const t = useTranslations('achievements')
  const ta = useTranslations('achievementItems')
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState<Stats | null>(null)
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [filter, setFilter] = useState<'all' | 'unlocked' | 'progress' | 'locked'>('all')
  const [newUnlocks, setNewUnlocks] = useState<any[]>([])

  useEffect(() => { fetchAchievements() }, [])

  const fetchAchievements = async () => {
    try {
      setIsLoading(true)
      const res = await fetch('/api/achievements')
      if (!res.ok) throw new Error('Failed')
      const data = await res.json()
      setStats(data.stats); setAchievements(data.achievements); setNewUnlocks(data.newlyUnlocked || [])
    } catch (e) { console.error(e) }
    finally { setIsLoading(false) }
  }

  const filteredAchievements = achievements.filter(a => {
    switch (filter) {
      case 'unlocked': return a.unlocked
      case 'progress': return !a.unlocked && a.progress > 0
      case 'locked': return !a.unlocked && a.progress === 0
      default: return true
    }
  })

  const categories = [
    { name: 'all', label: t('filterAll'), count: achievements.length },
    { name: 'unlocked', label: t('filterUnlocked'), count: achievements.filter(a => a.unlocked).length },
    { name: 'progress', label: t('filterInProgress'), count: achievements.filter(a => !a.unlocked && a.progress > 0).length },
    { name: 'locked', label: t('filterLocked'), count: achievements.filter(a => !a.unlocked && a.progress === 0).length },
  ]

  /* Loading */
  if (isLoading) {
    return (
      <ProRoute>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <Mascot size={88} expression="thinking" className="animate-float opacity-70" />
          <span className="loading loading-dots loading-lg text-primary" />
          <p className="text-base text-base-content/50 font-semibold">{t('loading')}</p>
        </div>
      </ProRoute>
    )
  }

  /* Error */
  if (!stats) {
    return (
      <ProRoute>
        <div className="max-w-lg mx-auto px-4 py-16 text-center">
          <Mascot size={88} expression="thinking" className="mx-auto mb-4 opacity-60" />
          <h3 className="font-extrabold text-xl mb-2 text-base-content">{t('errorTitle')}</h3>
          <p className="text-base text-base-content/50 mb-5">{t('errorDesc')}</p>
          <button onClick={fetchAchievements} className="btn btn-primary gap-2"><RefreshCw className="w-4 h-4" /> {t('retry')}</button>
        </div>
      </ProRoute>
    )
  }

  const completionPercent = Math.round((stats.totalAchievements / stats.totalPossible) * 100)

  return (
    <ProRoute>
      <div className="max-w-6xl mx-auto px-4 py-5 lg:px-8 lg:py-8 pb-28 lg:pb-10">

        {/* Header */}
        <div className="mb-6 lg:mb-8">
          <h1 className="text-2xl lg:text-3xl font-extrabold text-base-content mb-1">{t('title')}</h1>
          <p className="text-sm lg:text-base text-base-content/50">{t('subtitle')}</p>
        </div>

        {/* New Unlocks */}
        {newUnlocks.length > 0 && (
          <div className="card bg-success/6 border border-success/15 mb-6 lg:mb-8">
            <div className="card-body p-4 lg:p-5 flex-row items-center gap-3">
              <div className="w-11 h-11 lg:w-12 lg:h-12 rounded-xl bg-success/10 flex items-center justify-center flex-shrink-0">
                <Trophy className="w-5 h-5 lg:w-6 lg:h-6 text-success" />
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-base text-base-content">{t('newUnlock', { count: newUnlocks.length })}</h3>
                <p className="text-sm text-base-content/50">
                  {newUnlocks.map((u, i) => <span key={i}>{ta(`${u.id}.title`)} (+{u.xp} XP){i < newUnlocks.length - 1 ? ', ' : ''}</span>)}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Stats Overview — 3 cards */}
        <div className="grid grid-cols-3 gap-3 lg:gap-4 mb-6 lg:mb-8">
          {[
            { icon: Trophy, value: stats.totalAchievements, label: t('unlocked'), sub: t('ofTotal', { total: stats.totalPossible }), color: 'text-primary', bg: 'bg-primary/8', progress: completionPercent },
            { icon: CheckCircle, value: stats.recentlyUnlocked, label: t('thisWeek'), sub: t('recently'), color: 'text-success', bg: 'bg-success/8' },
            { icon: Star, value: stats.totalXpFromAchievements, label: t('achievementXp'), sub: t('totalEarned'), color: 'text-warning', bg: 'bg-warning/8' },
          ].map((s, i) => {
            const Icon = s.icon
            return (
              <div key={i} className="card bg-base-100 border border-base-content/5 card-glow">
                <div className="card-body p-4 lg:p-6 items-center text-center gap-2">
                  <div className={`w-11 h-11 lg:w-14 lg:h-14 rounded-xl ${s.bg} flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 lg:w-7 lg:h-7 ${s.color}`} />
                  </div>
                  <span className="text-2xl lg:text-3xl font-extrabold text-base-content leading-none">{s.value}</span>
                  <span className="text-xs lg:text-sm font-semibold text-base-content/50">{s.label}</span>
                  {s.progress !== undefined && (
                    <div className="w-full mt-1">
                      <div className="w-full bg-base-200 rounded-full h-2.5 overflow-hidden">
                        <div className="h-full rounded-full bg-gradient-to-r from-primary to-primary/80 transition-all duration-500" style={{ width: `${s.progress}%` }} />
                      </div>
                      <p className="text-[10px] lg:text-xs text-base-content/35 mt-1">{stats.totalAchievements} {t('ofTotal', { total: stats.totalPossible })}</p>
                    </div>
                  )}
                  {!s.progress && <span className="text-[10px] lg:text-xs text-base-content/35">{s.sub}</span>}
                </div>
              </div>
            )
          })}
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-5 lg:mb-6">
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setFilter(cat.name as any)}
              className={`
                px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200
                ${filter === cat.name
                  ? 'bg-primary/10 text-primary border border-primary/15'
                  : 'bg-base-content/4 text-base-content/50 border border-transparent hover:bg-base-content/6'
                }
              `}
            >
              {cat.label} <span className="text-xs opacity-60">({cat.count})</span>
            </button>
          ))}
        </div>

        {/* Empty State */}
        {filteredAchievements.length === 0 && (
          <div className="text-center py-12 lg:py-16">
            <Mascot size={88} expression="waving" className="mx-auto mb-4 opacity-50" />
            <p className="text-lg text-base-content/50 mb-4">{t('noAchievements')}</p>
            <Link href="/practice" className="btn btn-primary">{t('startPracticing')}</Link>
          </div>
        )}

        {/* Achievement Grid */}
        {filteredAchievements.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAchievements.map((a) => {
              const IconComp = iconMap[a.icon] || Trophy
              const progressPct = a.total > 0 ? Math.round((a.progress / a.total) * 100) : 0

              return (
                <div
                  key={a.id}
                  className={`card border transition-all duration-200 hover:-translate-y-0.5 ${
                    a.unlocked
                      ? `${rarityBg(a.rarity)} border ${rarityBorder(a.rarity)} card-glow`
                      : 'bg-base-100 border-base-content/6 opacity-75 hover:opacity-90'
                  }`}
                >
                  <div className="card-body p-5 lg:p-6">
                    {/* Top: icon + status */}
                    <div className="flex items-start justify-between mb-3">
                      <div className={`w-12 h-12 lg:w-14 lg:h-14 rounded-2xl flex items-center justify-center ${
                        a.unlocked ? rarityIcon(a.rarity) : 'bg-base-200 text-base-content/25'
                      }`}>
                        <IconComp className="w-6 h-6 lg:w-7 lg:h-7" />
                      </div>

                      {a.unlocked ? (
                        <CheckCircle className="w-6 h-6 text-success" />
                      ) : a.progress > 0 ? (
                        <div
                          className="radial-progress text-primary text-xs font-bold"
                          style={{ '--value': progressPct, '--size': '2.5rem', '--thickness': '3px' } as React.CSSProperties}
                          role="progressbar"
                        >
                          {progressPct}%
                        </div>
                      ) : (
                        <Lock className="w-5 h-5 text-base-content/20" />
                      )}
                    </div>

                    {/* Title + description */}
                    <h3 className="font-bold text-base lg:text-lg text-base-content mb-1">{ta(`${a.id}.title`)}</h3>
                    <p className="text-sm text-base-content/45 mb-3">{ta(`${a.id}.desc`)}</p>

                    {/* Progress bar (in-progress only) */}
                    {!a.unlocked && a.progress > 0 && (
                      <div className="mb-3">
                        <div className="flex justify-between text-xs mb-1.5">
                          <span className="text-base-content/45">{t('progressLabel')}</span>
                          <span className="font-bold text-base-content/60">{a.progress}/{a.total}</span>
                        </div>
                        <div className="w-full bg-base-200 rounded-full h-2.5 overflow-hidden">
                          <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${progressPct}%` }} />
                        </div>
                      </div>
                    )}

                    {/* Footer: rarity + XP */}
                    <div className="flex items-center justify-between mt-auto">
                      <span className={`inline-flex text-xs font-bold px-2 py-0.5 rounded-full border capitalize ${rarityBadge(a.rarity)}`}>
                        {a.rarity}
                      </span>
                      <span className="flex items-center gap-1 text-sm font-bold text-warning">
                        <Star className="w-4 h-4" /> +{a.xp} XP
                      </span>
                    </div>

                    {/* Unlocked date */}
                    {a.unlocked && a.unlockedDate && (
                      <p className="text-xs text-base-content/35 text-center mt-3 pt-3 border-t border-base-content/6">
                        {t('unlockedOn', { date: a.unlockedDate })}
                      </p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Motivational CTA */}
        {stats.totalAchievements < stats.totalPossible && (
          <div className="card bg-gradient-to-br from-primary/10 to-accent/8 border border-primary/12 mt-6 lg:mt-8 overflow-hidden relative">
            <div className="absolute -top-2 -right-2 opacity-15 pointer-events-none">
              <Mascot size={96} expression="cheering" />
            </div>
            <div className="card-body p-6 lg:p-8 items-center text-center relative z-10">
              <Trophy className="w-12 h-12 text-primary mb-2" />
              <h2 className="text-xl lg:text-2xl font-extrabold text-base-content mb-1">{t('keepGoing')}</h2>
              <p className="text-sm lg:text-base text-base-content/50 mb-4">
                {t('moreToUnlock', { count: stats.totalPossible - stats.totalAchievements })}
              </p>
              <Link href="/practice" className="btn btn-primary shadow-sm shadow-primary/15">{t('practiceNow')}</Link>
            </div>
          </div>
        )}
      </div>
    </ProRoute>
  )
}