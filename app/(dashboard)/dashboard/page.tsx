// 'use client'

// import { useState, useEffect } from 'react'
// import Link from 'next/link'
// import { 
//   Mic, Flame, Trophy, Target, ChevronRight, Star, 
//   Lock, CheckCircle, Circle, Calendar, TrendingUp,
//   Crown, Zap, Award, RefreshCw
// } from 'lucide-react'
// import { useUser } from '@clerk/nextjs'

// // Icon mapping for achievements
// const iconMap: Record<string, any> = {
//   Mic, Flame, Trophy, Star, Target, Award, TrendingUp, Crown, Zap, CheckCircle
// }

// interface DashboardStats {
//   user: {
//     streak: number;
//     accuracyScore: number;
//     level: string;
//     xp: number;
//     xpToNextLevel: number;
//     dailyGoal: number;
//     dailyProgress: number;
//     completedSentences: number;
//   };
//   todayStats: {
//     practiceTime: number;
//     accuracy: number;
//     xpEarned: number;
//   };
//   recentAchievements: Array<{
//     id: string;
//     title: string;
//     description: string;
//     icon: string;
//     rarity: string;
//     xp: number;
//   }>;
// }

// export default function DashboardPage() {
//   const { user: clerkUser } = useUser()
//   const [isLoading, setIsLoading] = useState(true)
//   const [stats, setStats] = useState<DashboardStats | null>(null)

//   useEffect(() => {
//     fetchDashboardStats()
//   }, [])

//   const fetchDashboardStats = async () => {
//     try {
//       setIsLoading(true)
//       const response = await fetch('/api/dashboard/stats')
      
//       if (!response.ok) {
//         throw new Error('Failed to fetch dashboard stats')
//       }

//       const data = await response.json()
//       setStats(data)
//     } catch (error) {
//       console.error('Error fetching dashboard:', error)
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   useEffect(() => {
//     console.log("Stats: ", stats);
//   }, [stats])

// // Lesson scenarios
// const lessons = [
//   // FREE LESSONS
//   {
//     id: 'daily_drill',
//     title: 'Daily Drill',
//     subtitle: 'Quick 5-minute warm-up practice',
//     difficulty: 'All Levels',
//     icon: '⚡',
//     scenario: 'daily_drill',
//     lessons: 50,
//     locked: false,
//   },
//   {
//     id: 'phoneme_r_vs_l',
//     title: '/r/ vs /l/ Sounds',
//     subtitle: 'Right vs Light, Read vs Lead',
//     difficulty: 'Hard',
//     icon: '🔤',
//     scenario: 'phoneme_r_vs_l',
//     lessons: 50,
//     locked: false,
//   },
//   {
//     id: 'phoneme_th_sounds',
//     title: '/th/ Sounds',
//     subtitle: 'Think, That, This, The',
//     difficulty: 'Very Hard',
//     icon: '👅',
//     scenario: 'phoneme_th_sounds',
//     lessons: 50,
//     locked: false,
//   },
//   {
//     id: 'phoneme_f_vs_h',
//     title: '/f/ vs /h/ Sounds',
//     subtitle: 'Fish vs Hish, Fan vs Han',
//     difficulty: 'Medium',
//     icon: '🗣️',
//     scenario: 'phoneme_f_vs_h',
//     lessons: 50,
//     locked: false,
//   },
//   {
//     id: 'toeic_speaking',
//     title: 'TOEIC Speaking',
//     subtitle: 'Official test format practice',
//     difficulty: 'Intermediate',
//     icon: '📝',
//     scenario: 'toeic_speaking',
//     lessons: 50,
//     locked: false,
//   },
  
//   // PREMIUM LESSONS
//   {
//     id: 'phoneme_v_vs_b',
//     title: '/v/ vs /b/ Sounds',
//     subtitle: 'Very vs Berry, Vote vs Boat',
//     difficulty: 'Medium',
//     icon: '🎵',
//     scenario: 'phoneme_v_vs_b',
//     lessons: 50,
//     locked: true,
//   },
//   {
//     id: 'phoneme_word_stress',
//     title: 'Word Stress Patterns',
//     subtitle: 'REcord vs reCORD, PREsent vs preSENT',
//     difficulty: 'Hard',
//     icon: '🎯',
//     scenario: 'phoneme_word_stress',
//     lessons: 50,
//     locked: true,
//   },
//   {
//     id: 'phoneme_silent_letters',
//     title: 'Silent Letters',
//     subtitle: 'Knight, Psychology, Wednesday',
//     difficulty: 'Medium',
//     icon: '🤫',
//     scenario: 'phoneme_silent_letters',
//     lessons: 50,
//     locked: true,
//   },
//   {
//     id: 'business',
//     title: 'Business Meetings',
//     subtitle: 'Professional meeting phrases',
//     difficulty: 'Intermediate',
//     icon: '💼',
//     scenario: 'business',
//     lessons: 15,
//     locked: true,
//   },
//   {
//     id: 'interview',
//     title: 'Job Interviews',
//     subtitle: 'Common interview questions',
//     difficulty: 'Advanced',
//     icon: '🤝',
//     scenario: 'interview',
//     lessons: 15,
//     locked: true,
//   },
//   {
//     id: 'phone',
//     title: 'Phone Calls',
//     subtitle: 'Clear phone communication',
//     difficulty: 'Intermediate',
//     icon: '📞',
//     scenario: 'phone',
//     lessons: 10,
//     locked: true,
//   },
// ]

//   if (isLoading) {
//     return (
//       <div className="max-w-7xl mx-auto px-3 py-4 lg:px-4 lg:py-8">
//         <div className="flex items-center justify-center min-h-[400px]">
//           <div className="text-center">
//             <span className="loading loading-spinner loading-lg text-primary"></span>
//             <p className="mt-4 text-lg">Loading dashboard...</p>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   if (!stats) {
//     return (
//       <div className="max-w-7xl mx-auto px-3 py-4 lg:px-4 lg:py-8">
//         <div className="alert alert-error">
//           <span>Failed to load dashboard</span>
//           <button onClick={fetchDashboardStats} className="btn btn-sm">
//             <RefreshCw className="w-4 h-4 mr-2" />
//             Retry
//           </button>
//         </div>
//       </div>
//     )
//   }

//   const todayStatsData = [
//     { label: 'Practice Time', value: `${stats.todayStats.practiceTime}m`, icon: Mic, color: 'text-primary' },
//     { label: 'Accuracy', value: stats.todayStats.accuracy > 0 ? `${stats.todayStats.accuracy}%` : '-', icon: Target, color: 'text-success' },
//     { label: 'Streak', value: stats.user.streak, icon: Flame, color: 'text-orange-500' },
//     { label: 'XP Earned', value: stats.todayStats.xpEarned, icon: Star, color: 'text-warning' },
//   ]

//   const userName = clerkUser?.firstName || 'User'
//   const levelLabel = stats.user.level.charAt(0).toUpperCase() + stats.user.level.slice(1)

//   return (
//     <div className="max-w-7xl mx-auto px-3 py-4 lg:px-4 lg:py-8 pb-24 lg:pb-8">
//       {/* Welcome Section */}
//       <div className="mb-4 lg:mb-6">
//         <h1 className="text-2xl lg:text-4xl font-bold mb-1 lg:mb-2">
//           Welcome back, {userName}! 👋
//         </h1>
//         <p className="text-sm lg:text-base text-base-content/70">
//           {stats.user.streak > 0 
//             ? `${stats.user.streak}-day streak! Keep it alive! 🔥`
//             : "Start practicing to build your streak!"}
//         </p>
//       </div>

//       <div className="grid lg:grid-cols-3 gap-4 lg:gap-6">
//         {/* Main Content - Left Column */}
//         <div className="lg:col-span-2 space-y-4 lg:space-y-6">
//           {/* Daily Goal Progress */}
//           <div className="card bg-gradient-to-br from-primary/10 to-secondary/10 border-2 border-primary/20">
//             <div className="card-body p-4 lg:p-6">
//               <div className="flex items-center justify-between mb-2 lg:mb-3">
//                 <h2 className="font-bold lg:text-xl">Daily Goal</h2>
//                 <div className="flex items-center gap-1 lg:gap-2 text-sm lg:text-base">
//                   <Target className="w-4 h-4 lg:w-5 lg:h-5 text-primary" />
//                   <span className="font-bold">{stats.user.dailyProgress}/{stats.user.dailyGoal} min</span>
//                 </div>
//               </div>
              
//               <div className="w-full bg-base-200 rounded-full h-3 lg:h-4 mb-2">
//                 <div 
//                   className="bg-gradient-to-r from-primary to-secondary h-3 lg:h-4 rounded-full transition-all duration-500"
//                   style={{ width: `${Math.min((stats.user.dailyProgress / stats.user.dailyGoal) * 100, 100)}%` }}
//                 ></div>
//               </div>
              
//               <p className="text-xs lg:text-sm text-base-content/70">
//                 {stats.user.dailyProgress >= stats.user.dailyGoal
//                   ? '🎉 Daily goal completed! Keep going!'
//                   : `Just ${stats.user.dailyGoal - stats.user.dailyProgress} more minutes to reach your goal!`}
//               </p>
//             </div>
//           </div>

//           {/* Today's Stats */}
//           <div className="grid grid-cols-4 gap-2 lg:gap-4">
//             {todayStatsData.map((stat, idx) => {
//               const Icon = stat.icon
//               return (
//                 <div key={idx} className="card bg-base-100 shadow-md">
//                   <div className="card-body p-3 lg:p-4 items-center text-center">
//                     <Icon className={`w-5 h-5 lg:w-6 lg:h-6 ${stat.color} mb-1`} />
//                     <div className="text-lg lg:text-2xl font-bold">{stat.value}</div>
//                     <div className="text-[10px] lg:text-xs opacity-70">{stat.label}</div>
//                   </div>
//                 </div>
//               )
//             })}
//           </div>

//           {/* Learning Path */}
//           <div className="card bg-base-100 shadow-xl">
//             <div className="card-body p-4 lg:p-6">
//               <div className="flex items-center justify-between mb-3 lg:mb-4">
//                 <h2 className="font-bold lg:text-xl">Your Learning Path</h2>
//                 <div className="badge badge-primary badge-sm lg:badge-md">{levelLabel}</div>
//               </div>

//               <div className="space-y-2 lg:space-y-3">
//                 {lessons.map((lesson) => (
//                   <div
//                     key={lesson.id}
//                     className={`card ${
//                       lesson.locked 
//                         ? 'bg-base-200 opacity-60' 
//                         : 'bg-base-200 hover:bg-base-300'
//                     } transition-all ${!lesson.locked ? 'cursor-pointer' : ''}`}
//                   >
//                     <div className="card-body p-3 lg:p-4">
//                       <div className="flex items-center gap-3 lg:gap-4">
//                         {/* Icon */}
//                         <div className="text-3xl lg:text-4xl flex-shrink-0">{lesson.icon}</div>

//                         {/* Content */}
//                         <div className="flex-1 min-w-0">
//                           <div className="flex items-center gap-1 lg:gap-2 mb-0.5 lg:mb-1">
//                             <h3 className="font-bold text-sm lg:text-base">{lesson.title}</h3>
//                             {lesson.locked && <Lock className="w-3 h-3 lg:w-4 lg:h-4 text-base-content/30 flex-shrink-0" />}
//                           </div>
                          
//                           <p className="text-xs lg:text-sm text-base-content/70 line-clamp-1 lg:line-clamp-none">{lesson.subtitle}</p>
                          
//                           <div className="flex items-center gap-2 lg:gap-3 mt-1 lg:mt-2">
//                             <div className={`badge badge-xs lg:badge-sm ${
//                               lesson.difficulty === 'Very Hard' ? 'badge-error' :
//                               lesson.difficulty === 'Hard' ? 'badge-warning' :
//                               lesson.difficulty === 'Medium' ? 'badge-info' :
//                               'badge-success'
//                             }`}>
//                               {lesson.difficulty}
//                             </div>
                            
//                             <span className="text-[10px] lg:text-xs text-base-content/60">
//                               {lesson.lessons} sentences
//                             </span>
//                           </div>
//                         </div>

//                         {/* Action */}
//                         <div className="flex-shrink-0">
//                           {lesson.locked ? (
//                             <div className="flex flex-col items-center">
//                               <Lock className="w-5 h-5 lg:w-6 lg:h-6 text-base-content/30 mb-0.5 lg:mb-1" />
//                               <span className="text-[9px] lg:text-xs badge badge-ghost badge-xs">Pro</span>
//                             </div>
//                           ) : (
//                             <Link 
//                               href={`/practice/${lesson.scenario}`}
//                               className="btn btn-primary btn-xs lg:btn-sm gap-1"
//                             >
//                               Start
//                               <ChevronRight className="w-3 h-3 lg:w-4 lg:h-4" />
//                             </Link>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Right Sidebar - Hidden on mobile */}
//         <div className="hidden lg:block space-y-6">
//           {/* Level Progress */}
//           <div className="card bg-base-100 shadow-xl">
//             <div className="card-body">
//               <h3 className="card-title text-lg">Progress</h3>
              
//               <div className="mb-4">
//                 <div className="flex items-center justify-between mb-2">
//                   <span className="text-sm font-semibold">Level: {levelLabel}</span>
//                   <span className="text-sm text-base-content/70">{stats.user.xp} XP</span>
//                 </div>
                
//                 <progress 
//                   className="progress progress-primary w-full h-3" 
//                   value={stats.user.xp} 
//                   max={stats.user.xpToNextLevel}
//                 ></progress>
                
//                 <p className="text-xs text-center text-base-content/60 mt-1">
//                   {stats.user.xpToNextLevel - stats.user.xp} XP to next level
//                 </p>
//               </div>

//               <div className="divider my-2"></div>

//               <div className="space-y-2">
//                 <div className="flex justify-between text-sm">
//                   <span className="text-base-content/70">Sentences Completed</span>
//                   <span className="font-semibold">{stats.user.completedSentences}/300</span>
//                 </div>
//                 <progress 
//                   className="progress progress-success w-full" 
//                   value={stats.user.completedSentences} 
//                   max={300}
//                 ></progress>
//               </div>
//             </div>
//           </div>

//           {/* Quick Practice */}
//           <div className="card bg-gradient-to-br from-success/20 to-primary/20 border-2 border-success/30">
//             <div className="card-body">
//               <h3 className="card-title text-lg">Quick Practice</h3>
//               <p className="text-sm text-base-content/70 mb-3">
//                 5-minute pronunciation drill
//               </p>
              
//               <Link 
//                 href="/practice/daily_drill"
//                 className="btn btn-success gap-2"
//               >
//                 <Mic className="w-5 h-5" />
//                 Start Now
//               </Link>
//             </div>
//           </div>

//           {/* Recent Achievements */}
//           {stats.recentAchievements.length > 0 && (
//             <div className="card bg-base-100 shadow-xl">
//               <div className="card-body">
//                 <h3 className="card-title text-lg">Recent Achievements</h3>
                
//                 <div className="space-y-3">
//                   {stats.recentAchievements.map((achievement) => {
//                     const IconComponent = iconMap[achievement.icon] || Trophy
                    
//                     return (
//                       <div key={achievement.id} className="flex items-center gap-3">
//                         <div className="avatar">
//                           <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
//                             achievement.rarity === 'legendary' ? 'bg-warning/20' :
//                             achievement.rarity === 'epic' ? 'bg-primary/20' :
//                             achievement.rarity === 'rare' ? 'bg-info/20' :
//                             'bg-success/20'
//                           }`}>
//                             <IconComponent className={`w-6 h-6 ${
//                               achievement.rarity === 'legendary' ? 'text-warning' :
//                               achievement.rarity === 'epic' ? 'text-primary' :
//                               achievement.rarity === 'rare' ? 'text-info' :
//                               'text-success'
//                             }`} />
//                           </div>
//                         </div>
//                         <div className="flex-1">
//                           <p className="font-semibold text-sm">{achievement.title}</p>
//                           <p className="text-xs text-base-content/60">+{achievement.xp} XP</p>
//                         </div>
//                       </div>
//                     )
//                   })}
//                 </div>

//                 <Link 
//                   href="/achievements"
//                   className="btn btn-ghost btn-sm mt-2"
//                 >
//                   View All
//                   <ChevronRight className="w-4 h-4" />
//                 </Link>
//               </div>
//             </div>
//           )}

//           {/* Empty State for No Achievements */}
//           {stats.recentAchievements.length === 0 && (
//             <div className="card bg-base-100 shadow-xl">
//               <div className="card-body">
//                 <h3 className="card-title text-lg">Achievements</h3>
//                 <div className="text-center py-4">
//                   <Trophy className="w-12 h-12 mx-auto mb-2 text-base-content/30" />
//                   <p className="text-sm text-base-content/60 mb-3">
//                     Start practicing to unlock achievements!
//                   </p>
//                   <Link href="/achievements" className="btn btn-sm btn-primary">
//                     View All Achievements
//                   </Link>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Upgrade CTA */}
//           <div className="card bg-gradient-to-br from-primary to-secondary text-primary-content">
//             <div className="card-body">
//               <Crown className="w-8 h-8 mb-2" />
//               <h3 className="card-title">Upgrade to Pro</h3>
//               <p className="text-sm opacity-90 mb-3">
//                 Unlock TOEIC Speaking, Business English, and more!
//               </p>
//               <Link 
//                 href="/pricing"
//                 className="btn btn-accent"
//               >
//                 Upgrade Now
//               </Link>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// app/[locale]/(dashboard)/dashboard/page.tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Mic, Flame, Trophy, Target, ChevronRight, Star,
  Lock, TrendingUp, Crown, Zap, Award,
  RefreshCw, BookOpen, ArrowRight, BarChart3
} from 'lucide-react'
import { useUser } from '@clerk/nextjs'
import { Mascot } from '@/components/global/Mascot'

/* ═══════════════════════════════════════════
   ICON MAP
   ═══════════════════════════════════════════ */
const iconMap: Record<string, any> = { Mic, Flame, Trophy, Star, Target, Award, TrendingUp, Crown, Zap }

/* ═══════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════ */
interface DashboardStats {
  user: { streak: number; accuracyScore: number; level: string; xp: number; xpToNextLevel: number; dailyGoal: number; dailyProgress: number; completedSentences: number }
  todayStats: { practiceTime: number; accuracy: number; xpEarned: number }
  recentAchievements: Array<{ id: string; title: string; description: string; icon: string; rarity: string; xp: number }>
}

/* ═══════════════════════════════════════════
   LESSON DATA
   ═══════════════════════════════════════════ */
const lessons = [
  { id: 'daily_drill', title: 'Daily Drill', subtitle: 'Quick 5-min warm-up', difficulty: 'All Levels', icon: '⚡', scenario: 'daily_drill', lessons: 50, locked: false },
  { id: 'phoneme_r_vs_l', title: '/r/ vs /l/ Sounds', subtitle: 'Right vs Light, Read vs Lead', difficulty: 'Hard', icon: '🔤', scenario: 'phoneme_r_vs_l', lessons: 50, locked: false },
  { id: 'phoneme_th_sounds', title: '/th/ Sounds', subtitle: 'Think, That, This, The', difficulty: 'Very Hard', icon: '👅', scenario: 'phoneme_th_sounds', lessons: 50, locked: false },
  { id: 'phoneme_f_vs_h', title: '/f/ vs /h/ Sounds', subtitle: 'Fish vs Hish, Fan vs Han', difficulty: 'Medium', icon: '🗣️', scenario: 'phoneme_f_vs_h', lessons: 50, locked: false },
  { id: 'toeic_speaking', title: 'TOEIC Speaking', subtitle: 'Official test format', difficulty: 'Intermediate', icon: '📝', scenario: 'toeic_speaking', lessons: 50, locked: false },
  { id: 'phoneme_v_vs_b', title: '/v/ vs /b/ Sounds', subtitle: 'Very vs Berry, Vote vs Boat', difficulty: 'Medium', icon: '🎵', scenario: 'phoneme_v_vs_b', lessons: 50, locked: true },
  { id: 'phoneme_word_stress', title: 'Word Stress', subtitle: 'REcord vs reCORD', difficulty: 'Hard', icon: '🎯', scenario: 'phoneme_word_stress', lessons: 50, locked: true },
  { id: 'phoneme_silent_letters', title: 'Silent Letters', subtitle: 'Knight, Psychology, Wednesday', difficulty: 'Medium', icon: '🤫', scenario: 'phoneme_silent_letters', lessons: 50, locked: true },
  { id: 'business', title: 'Business Meetings', subtitle: 'Professional phrases', difficulty: 'Intermediate', icon: '💼', scenario: 'business', lessons: 15, locked: true },
  { id: 'interview', title: 'Job Interviews', subtitle: 'Common interview questions', difficulty: 'Advanced', icon: '🤝', scenario: 'interview', lessons: 15, locked: true },
  { id: 'phone', title: 'Phone Calls', subtitle: 'Clear phone communication', difficulty: 'Intermediate', icon: '📞', scenario: 'phone', lessons: 10, locked: true },
]

const difficultyColor = (d: string) => {
  switch (d) { case 'Very Hard': return 'badge-error'; case 'Hard': return 'badge-warning'; case 'Medium': return 'badge-info'; case 'Intermediate': return 'badge-success'; case 'Advanced': return 'badge-error'; default: return 'badge-primary' }
}

/* ═══════════════════════════════════════════
   DASHBOARD PAGE
   ═══════════════════════════════════════════ */
export default function DashboardPage() {
  const { user: clerkUser } = useUser()
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState<DashboardStats | null>(null)

  useEffect(() => { fetchDashboardStats() }, [])

  const fetchDashboardStats = async () => {
    try {
      setIsLoading(true)
      const res = await fetch('/api/dashboard/stats')
      if (!res.ok) throw new Error('Failed')
      setStats(await res.json())
    } catch (e) { console.error(e) }
    finally { setIsLoading(false) }
  }

  /* ─── Loading ─── */
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Mascot size={88} expression="thinking" className="animate-float opacity-70" />
        <span className="loading loading-dots loading-lg text-primary" />
        <p className="text-base text-base-content/50 font-semibold">Loading your dashboard...</p>
      </div>
    )
  }

  /* ─── Error ─── */
  if (!stats) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <Mascot size={88} expression="thinking" className="mx-auto mb-4 opacity-60" />
        <h3 className="font-extrabold text-xl mb-2 text-base-content">Couldn&apos;t load your dashboard</h3>
        <p className="text-base text-base-content/50 mb-5">Something went wrong — let&apos;s try again.</p>
        <button onClick={fetchDashboardStats} className="btn btn-primary gap-2">
          <RefreshCw className="w-4 h-4" /> Retry
        </button>
      </div>
    )
  }

  const userName = clerkUser?.firstName || 'there'
  const levelLabel = stats.user.level.charAt(0).toUpperCase() + stats.user.level.slice(1)
  const goalPercent = Math.min((stats.user.dailyProgress / stats.user.dailyGoal) * 100, 100)
  const xpPercent = Math.min((stats.user.xp / stats.user.xpToNextLevel) * 100, 100)
  const goalComplete = stats.user.dailyProgress >= stats.user.dailyGoal

  return (
    <div className="max-w-6xl mx-auto px-4 py-5 lg:px-8 lg:py-8 pb-28 lg:pb-10">

      {/* ═══════════════════════════════════════════
          GREETING + DAILY GOAL
          ═══════════════════════════════════════════ */}
      <div className="mb-6 lg:mb-8">
        {/* Greeting */}
        <div className="flex items-center gap-4 mb-5">
          <Mascot
            size={64}
            expression={goalComplete ? 'cheering' : stats.user.streak > 0 ? 'happy' : 'waving'}
            className="flex-shrink-0 drop-shadow-sm"
          />
          <div className="min-w-0">
            <h1 className="text-2xl lg:text-3xl font-extrabold text-base-content truncate">
              Welcome back, {userName}! 👋
            </h1>
            <p className="text-sm lg:text-base text-base-content/50 font-medium">
              {goalComplete
                ? 'Daily goal smashed! Keep going! 🎉'
                : stats.user.streak > 0
                  ? `${stats.user.streak}-day streak — keep it alive! 🔥`
                  : 'Start practicing to build your streak!'}
            </p>
          </div>
        </div>

        {/* Daily Goal Card */}
        <div className="card bg-base-100 border border-primary/10 card-glow">
          <div className="card-body p-5 lg:p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                <span className="text-base font-bold text-base-content">Daily Goal</span>
              </div>
              <span className="text-base lg:text-lg font-extrabold text-primary">
                {stats.user.dailyProgress}/{stats.user.dailyGoal} min
              </span>
            </div>
            <div className="w-full bg-base-200 rounded-full h-3.5 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ease-out ${
                  goalComplete ? 'bg-gradient-to-r from-success to-success/80' : 'bg-gradient-to-r from-primary to-primary/80'
                }`}
                style={{ width: `${goalPercent}%` }}
              />
            </div>
            <p className="text-sm text-base-content/45 mt-2">
              {goalComplete ? '✨ Goal completed!' : `${stats.user.dailyGoal - stats.user.dailyProgress} more minutes to go`}
            </p>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════
          QUICK STATS ROW
          ═══════════════════════════════════════════ */}
      <div className="grid grid-cols-4 gap-3 lg:gap-4 mb-6 lg:mb-8">
        {[
          { label: 'Time', value: `${stats.todayStats.practiceTime}m`, icon: Mic, color: 'text-primary', bg: 'bg-primary/8' },
          { label: 'Accuracy', value: stats.todayStats.accuracy > 0 ? `${stats.todayStats.accuracy}%` : '—', icon: Target, color: 'text-success', bg: 'bg-success/8' },
          { label: 'Streak', value: stats.user.streak, icon: Flame, color: 'text-orange-500', bg: 'bg-orange-500/8' },
          { label: 'XP', value: stats.todayStats.xpEarned, icon: Star, color: 'text-warning', bg: 'bg-warning/8' },
        ].map((s, i) => {
          const Icon = s.icon
          return (
            <div key={i} className="card bg-base-100 border border-base-content/5">
              <div className="card-body p-3 lg:p-4 items-center text-center gap-1.5">
                <div className={`w-10 h-10 lg:w-12 lg:h-12 rounded-xl ${s.bg} flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 lg:w-6 lg:h-6 ${s.color}`} />
                </div>
                <span className="text-xl lg:text-2xl font-extrabold text-base-content leading-none">{s.value}</span>
                <span className="text-[10px] lg:text-xs font-semibold text-base-content/35 uppercase tracking-wider">{s.label}</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* ═══════════════════════════════════════════
          MAIN CONTENT — 2 column on desktop
          ═══════════════════════════════════════════ */}
      <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">

        {/* LEFT — Learning path */}
        <div className="lg:col-span-2 space-y-6 lg:space-y-8">

          {/* Quick Practice CTA */}
          <div className="card bg-gradient-to-br from-primary/10 to-accent/8 border border-primary/12">
            <div className="card-body p-5 lg:p-6 flex-row items-center gap-4">
              <div className="w-14 h-14 lg:w-16 lg:h-16 rounded-2xl bg-primary/12 flex items-center justify-center flex-shrink-0">
                <Zap className="w-7 h-7 lg:w-8 lg:h-8 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-extrabold text-lg lg:text-xl text-base-content">Quick Practice</h3>
                <p className="text-sm lg:text-base text-base-content/50">5-minute pronunciation drill</p>
              </div>
              <Link href="/practice/daily_drill" className="btn btn-primary lg:btn-lg gap-2 shadow-md shadow-primary/15 flex-shrink-0">
                Start <ArrowRight className="w-4 h-4 lg:w-5 lg:h-5" />
              </Link>
            </div>
          </div>

          {/* Learning Path */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-extrabold text-lg lg:text-xl text-base-content flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                Learning Path
              </h2>
              <span className="badge badge-primary font-bold">{levelLabel}</span>
            </div>

            <div className="space-y-3">
              {lessons.map((lesson) => (
                <LessonCard key={lesson.id} lesson={lesson} />
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT — Sidebar (desktop only) */}
        <div className="hidden lg:flex flex-col gap-6">

          {/* XP / Level */}
          <div className="card bg-base-100 border border-base-content/5 card-glow">
            <div className="card-body p-6">
              <h3 className="font-bold text-base text-base-content flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-primary" /> Progress
              </h3>

              <div className="mb-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-base-content/60">{levelLabel}</span>
                  <span className="text-sm font-semibold text-base-content/45">{stats.user.xp} XP</span>
                </div>
                <div className="w-full bg-base-200 rounded-full h-3 overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-all duration-500" style={{ width: `${xpPercent}%` }} />
                </div>
                <p className="text-xs text-base-content/40 mt-1.5 text-center">
                  {stats.user.xpToNextLevel - stats.user.xp} XP to next level
                </p>
              </div>

              <div className="divider my-1" />

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-base-content/50 font-medium">Sentences Completed</span>
                  <span className="font-bold text-base-content/60">{stats.user.completedSentences}/300</span>
                </div>
                <progress className="progress progress-success w-full h-2.5" value={stats.user.completedSentences} max={300} />
              </div>
            </div>
          </div>

          {/* Achievements */}
          <div className="card bg-base-100 border border-base-content/5 card-glow">
            <div className="card-body p-6">
              <h3 className="font-bold text-base text-base-content flex items-center gap-2 mb-4">
                <Trophy className="w-5 h-5 text-warning" /> Achievements
              </h3>

              {stats.recentAchievements.length > 0 ? (
                <div className="space-y-3">
                  {stats.recentAchievements.map((a) => {
                    const IconComp = iconMap[a.icon] || Trophy
                    const rc = a.rarity === 'legendary' ? 'text-warning bg-warning/10' : a.rarity === 'epic' ? 'text-primary bg-primary/10' : a.rarity === 'rare' ? 'text-info bg-info/10' : 'text-success bg-success/10'
                    return (
                      <div key={a.id} className="flex items-center gap-3">
                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${rc}`}>
                          <IconComp className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-sm text-base-content truncate">{a.title}</p>
                          <p className="text-xs text-base-content/40">+{a.xp} XP</p>
                        </div>
                      </div>
                    )
                  })}
                  <Link href="/achievements" className="btn btn-ghost btn-sm w-full text-base-content/40 mt-1">
                    View All <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              ) : (
                <div className="text-center py-6">
                  <Trophy className="w-12 h-12 mx-auto mb-3 text-base-content/15" />
                  <p className="text-sm text-base-content/40 mb-3">Start practicing to unlock achievements!</p>
                  <Link href="/achievements" className="btn btn-primary btn-sm">View All</Link>
                </div>
              )}
            </div>
          </div>

          {/* Upgrade CTA */}
          <div className="card bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/15 overflow-hidden relative">
            <div className="absolute top-3 right-3 opacity-15"><Mascot size={56} expression="excited" /></div>
            <div className="card-body p-6 relative z-10">
              <Crown className="w-7 h-7 text-primary mb-1" />
              <h3 className="font-extrabold text-base text-base-content">Upgrade to Pro</h3>
              <p className="text-sm text-base-content/50 mb-4">Unlock all lessons, analytics, and more!</p>
              <Link href="/pricing" className="btn btn-primary shadow-sm shadow-primary/15">Upgrade Now</Link>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════
          MOBILE-ONLY: XP + Achievements
          ═══════════════════════════════════════════ */}
      <div className="lg:hidden mt-6 space-y-4">
        {/* XP bar */}
        <div className="card bg-base-100 border border-base-content/5">
          <div className="card-body p-4 flex-row items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-primary/8 flex items-center justify-center flex-shrink-0">
              <Star className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-bold text-base-content/60">{levelLabel}</span>
                <span className="text-xs text-base-content/40">{stats.user.xp}/{stats.user.xpToNextLevel} XP</span>
              </div>
              <div className="w-full bg-base-200 rounded-full h-2.5 overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-all duration-500" style={{ width: `${xpPercent}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Achievements peek */}
        {stats.recentAchievements.length > 0 && (
          <div className="card bg-base-100 border border-base-content/5">
            <div className="card-body p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-bold text-base-content/60 flex items-center gap-1.5">
                  <Trophy className="w-4 h-4 text-warning" /> Recent Achievements
                </span>
                <Link href="/achievements" className="text-xs font-semibold text-primary">See All</Link>
              </div>
              <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
                {stats.recentAchievements.map((a) => {
                  const IconComp = iconMap[a.icon] || Trophy
                  return (
                    <div key={a.id} className="flex-shrink-0 flex items-center gap-2 bg-base-200/80 rounded-xl px-3 py-2.5">
                      <IconComp className="w-4 h-4 text-warning" />
                      <span className="text-sm font-semibold text-base-content/70 whitespace-nowrap">{a.title}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════
   LESSON CARD
   ═══════════════════════════════════════════ */
function LessonCard({ lesson }: { lesson: typeof lessons[0] }) {
  return (
    <div className={`card bg-base-100 border transition-all duration-200 ${
      lesson.locked
        ? 'border-base-content/5 opacity-55'
        : 'border-base-content/6 card-glow hover:border-primary/15 hover:-translate-y-0.5 active:scale-[0.99]'
    }`}>
      <div className="card-body p-4 lg:p-5">
        <div className="flex items-center gap-4">
          {/* Icon */}
          <div className={`w-12 h-12 lg:w-14 lg:h-14 rounded-2xl flex items-center justify-center flex-shrink-0 text-2xl lg:text-3xl ${
            lesson.locked ? 'bg-base-200' : 'bg-primary/6'
          }`}>
            {lesson.icon}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <h3 className="font-bold text-base lg:text-lg text-base-content truncate">{lesson.title}</h3>
              {lesson.locked && <Lock className="w-3.5 h-3.5 text-base-content/25 flex-shrink-0" />}
            </div>
            <p className="text-sm text-base-content/45 truncate">{lesson.subtitle}</p>
            <div className="flex items-center gap-2.5 mt-1.5">
              <span className={`badge badge-sm ${difficultyColor(lesson.difficulty)} font-semibold`}>{lesson.difficulty}</span>
              <span className="text-xs text-base-content/30 font-medium">{lesson.lessons} sentences</span>
            </div>
          </div>

          {/* Action */}
          <div className="flex-shrink-0">
            {lesson.locked ? (
              <div className="flex flex-col items-center gap-1">
                <Lock className="w-5 h-5 text-base-content/20" />
                <span className="text-[9px] lg:text-xs font-bold text-primary/60 bg-primary/8 px-2 py-0.5 rounded-full">PRO</span>
              </div>
            ) : (
              <Link href={`/practice/${lesson.scenario}`} className="btn btn-primary btn-sm lg:btn-md gap-1.5 shadow-sm shadow-primary/10">
                Start <ChevronRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}