// app/[locale]/(dashboard)/layout.tsx
'use client'

import { UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Mic, BarChart3, Trophy, Settings, Crown, Flame, Lock } from 'lucide-react'
import { useEffect } from 'react'
import { useSubscription } from '@/contexts/SubscriptionContext'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { subscriptionTier, isPro, loading } = useSubscription();

  const navigation = [
    { name: 'Home', href: `/dashboard`, icon: Home, requiresPro: false },
    { name: 'Practice', href: `/practice`, icon: Mic, requiresPro: false },
    { name: 'Progress', href: `/progress`, icon: BarChart3, requiresPro: true },
    { name: 'Achievements', href: `/achievements`, icon: Trophy, requiresPro: true },
    { name: 'Settings', href: `/settings`, icon: Settings, requiresPro: false },
  ]

  // Mock streak data - replace with real data later
  const streak = 7

  const handleNavClick = (e: React.MouseEvent, item: typeof navigation[0]) => {
    if (item.requiresPro && !isPro()) {
      e.preventDefault()
      // Optionally show a modal or toast here
      // Or redirect to pricing page
      window.location.href = '/pricing'
    }
  }

  return (
    <div className="min-h-screen bg-base-200">
      {/* Top Navigation Bar - Desktop */}
      <div className="navbar bg-base-100 border-b border-base-300 px-4 lg:px-8 hidden lg:flex">
        <div className="navbar-start">
          <Link href={`/dashboard`} className="flex items-center gap-2">
            <Mic className="w-8 h-8 text-primary" />
            <span className="text-2xl font-bold">SpeakScore</span>
          </Link>
        </div>

        <div className="navbar-center">
          <ul className="menu menu-horizontal px-1 gap-2">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              const isLocked = item.requiresPro && !isPro()
              
              return (
                <li key={item.name}>
                  <Link 
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item)}
                    className={`gap-2 relative ${isActive ? 'active' : ''} ${
                      isLocked ? 'opacity-60 cursor-not-allowed' : ''
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.name}
                    {isLocked && (
                      <Lock className="w-3 h-3 text-warning" />
                    )}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>

        <div className="navbar-end gap-3">
          {/* Streak indicator */}
          <div className="flex items-center gap-2 px-3 py-2 bg-orange-500/10 rounded-full">
            <Flame className="w-5 h-5 text-orange-500" />
            <span className="font-bold text-orange-500">{streak}</span>
          </div>

          {/* Subscription badge */}
          <div className={`badge ${!isPro() ? 'badge-ghost' : 'badge-primary'} gap-1`}>
            {isPro() && <Crown className="w-3 h-3" />}
            {!isPro() ? 'FREE' : 'PREMIUM'}
          </div>

          {!isPro() && (
            <Link href={`/pricing`} className="btn btn-primary btn-sm">
              Upgrade
            </Link>
          )}

          <UserButton afterSignOutUrl={`/`} />
        </div>
      </div>

      {/* Mobile Top Bar */}
      <div className="navbar bg-base-100 border-b border-base-300 px-4 lg:hidden sticky top-0 z-50">
        <div className="navbar-start">
          <Link href={`/dashboard`} className="flex items-center gap-2">
            <Mic className="w-6 h-6 text-primary" />
            <span className="text-xl font-bold">SpeakScore</span>
          </Link>
        </div>
        
        <div className="navbar-end gap-2">
          {/* Streak */}
          <div className="flex items-center gap-1 px-2 py-1 bg-orange-500/10 rounded-full">
            <Flame className="w-4 h-4 text-orange-500" />
            <span className="font-bold text-orange-500 text-sm">{streak}</span>
          </div>

          <UserButton afterSignOutUrl={`/`} />
        </div>
      </div>

      {/* Main Content */}
      <main className="pb-20 lg:pb-0">{children}</main>

      {/* Mobile Bottom Navigation */}
      <div className="btm-nav lg:hidden z-50 border-t border-base-300">
        {navigation.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          const isLocked = item.requiresPro && !isPro()
          
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={(e) => handleNavClick(e, item)}
              className={`relative ${isActive ? 'active' : ''} ${
                isLocked ? 'opacity-60' : ''
              }`}
            >
              <div className="relative">
                <Icon className="w-5 h-5" />
                {isLocked && (
                  <Lock className="w-2 h-2 text-warning absolute -top-1 -right-1" />
                )}
              </div>
              <span className="btm-nav-label text-xs">{item.name}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}