// app/[locale]/(dashboard)/layout.tsx
'use client'

import { UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Home, Mic, BarChart3, Trophy, Settings, Crown, Flame, Lock, Menu, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useSubscription } from '@/contexts/SubscriptionContext'
import { MascotMini } from '@/components/global/Mascot'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { isPro } = useSubscription()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [onboardingChecked, setOnboardingChecked] = useState(false)

  // Check onboarding status on mount
  useEffect(() => {
    const checkOnboarding = async () => {
      try {
        const res = await fetch('/api/user/onboarding')
        if (res.ok) {
          const data = await res.json()
          if (!data.completed) {
            router.replace('/onboarding')
            return
          }
        }
      } catch (err) {
        console.error('Failed to check onboarding status:', err)
        // Don't block the app if the check fails
      }
      setOnboardingChecked(true)
    }

    checkOnboarding()
  }, [router])

  const navigation = [
    { name: 'Home', href: '/dashboard', icon: Home, requiresPro: false },
    { name: 'Practice', href: '/practice', icon: Mic, requiresPro: false },
    { name: 'Progress', href: '/progress', icon: BarChart3, requiresPro: true },
    { name: 'Achievements', href: '/achievements', icon: Trophy, requiresPro: true },
    { name: 'Settings', href: '/settings', icon: Settings, requiresPro: false },
  ]

  const handleNavClick = (e: React.MouseEvent, item: typeof navigation[0]) => {
    if (item.requiresPro && !isPro()) {
      e.preventDefault()
      window.location.href = '/pricing'
    }
    setMobileMenuOpen(false)
  }

  const isActive = (href: string) => pathname === href

  // Mock streak — replace with real data
  const streak = 7

  // Show loading while checking onboarding
  if (!onboardingChecked) {
    return (
      <div className="min-h-screen bg-base-200/60 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <MascotMini size={34} className="animate-bounce-gentle" />
          <span className="loading loading-dots loading-md text-primary" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-base-200/60">

      {/* ═══════════════════════════════════════════
          DESKTOP TOP NAV
          ═══════════════════════════════════════════ */}
      <div className="hidden lg:flex navbar bg-base-100/90 backdrop-blur-xl border-b border-primary/8 px-6 sticky top-0 z-50 min-h-[4rem]">
        {/* Logo — fixed width, won't shrink */}
        <div className="flex-shrink-0 mr-6">
          <Link href="/dashboard" className="flex items-center gap-2.5 group">
            <MascotMini size={34} className="group-hover:animate-bounce-gentle transition-transform" />
            <span className="text-xl font-extrabold text-base-content">
              Speak<span className="text-primary">Score</span>
            </span>
          </Link>
        </div>

        {/* Center nav — flex-1 with overflow hidden, items shrink gracefully */}
        <div className="flex-1 flex items-center justify-center min-w-0">
          <nav className="flex items-center gap-1">
            {navigation.map((item) => {
              const Icon = item.icon
              const active = isActive(item.href)
              const locked = item.requiresPro && !isPro()

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item)}
                  className={`
                    relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold
                    transition-all duration-200 whitespace-nowrap flex-shrink-0
                    ${active
                      ? 'bg-primary/10 text-primary'
                      : 'text-base-content/55 hover:text-base-content hover:bg-base-content/5'
                    }
                    ${locked ? 'opacity-50' : ''}
                  `}
                >
                  <Icon className="w-[18px] h-[18px]" />
                  <span className="hidden xl:inline">{item.name}</span>
                  {locked && <Lock className="w-3 h-3 text-warning/70" />}
                  {active && (
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
                  )}
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Right side — fixed width, won't shrink */}
        <div className="flex-shrink-0 flex items-center gap-3 ml-6">
          <StreakPill streak={streak} />

          <div className={`
            px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5
            ${isPro()
              ? 'bg-primary/10 text-primary border border-primary/15'
              : 'bg-base-content/5 text-base-content/50 border border-base-content/8'
            }
          `}>
            {isPro() && <Crown className="w-3 h-3" />}
            {isPro() ? 'PRO' : 'FREE'}
          </div>

          {!isPro() && (
            <Link href="/pricing" className="btn btn-primary btn-sm shadow-sm shadow-primary/20">
              Upgrade
            </Link>
          )}

          <UserButton afterSignOutUrl="/" />
        </div>
      </div>

      {/* ═══════════════════════════════════════════
          MOBILE TOP BAR
          ═══════════════════════════════════════════ */}
      <div className="lg:hidden navbar bg-base-100/90 backdrop-blur-xl border-b border-primary/8 px-4 sticky top-0 z-50 min-h-0 h-14">
        <div className="navbar-start">
          <Link href="/dashboard" className="flex items-center gap-2">
            <MascotMini size={28} />
            <span className="text-lg font-extrabold text-base-content">
              Speak<span className="text-primary">Score</span>
            </span>
          </Link>
        </div>
        <div className="navbar-end gap-2">
          <StreakPill streak={streak} compact />
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>

      {/* ═══════════════════════════════════════════
          MAIN CONTENT
          ═══════════════════════════════════════════ */}
      <main className="">
        {children}
      </main>

      {/* ═══════════════════════════════════════════
          MOBILE BOTTOM NAV
          ═══════════════════════════════════════════ */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50">
        <div className="bg-base-100/90 backdrop-blur-xl border-t border-primary/8 px-2 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
          <nav className="flex items-center justify-around max-w-md mx-auto">
            {navigation.map((item) => {
              const Icon = item.icon
              const active = isActive(item.href)
              const locked = item.requiresPro && !isPro()

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item)}
                  className={`
                    relative flex flex-col items-center gap-0.5 py-2 px-3 rounded-2xl
                    transition-all duration-200 min-w-[3.5rem]
                    ${active ? 'text-primary' : 'text-base-content/40'}
                    ${locked ? 'opacity-40' : ''}
                  `}
                >
                  {active && <span className="absolute inset-0 bg-primary/8 rounded-2xl" />}
                  <span className="relative">
                    <Icon className={`w-5 h-5 transition-transform duration-200 ${active ? 'scale-110' : ''}`} />
                    {locked && <Lock className="w-2.5 h-2.5 text-warning absolute -top-1 -right-1.5" />}
                  </span>
                  <span className={`relative text-[10px] font-semibold leading-none ${active ? 'text-primary' : ''}`}>
                    {item.name}
                  </span>
                  {active && <span className="absolute -bottom-0.5 w-1 h-1 rounded-full bg-primary" />}
                </Link>
              )
            })}
          </nav>
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════
   STREAK PILL
   ═══════════════════════════════════════════ */
function StreakPill({ streak, compact = false }: { streak: number; compact?: boolean }) {
  return (
    <div className={`
      flex items-center gap-1.5 rounded-full border
      ${streak > 0 ? 'bg-orange-500/8 border-orange-500/15' : 'bg-base-content/4 border-base-content/8'}
      ${compact ? 'px-2 py-1' : 'px-3 py-1.5'}
    `}>
      <Flame className={`
        ${compact ? 'w-3.5 h-3.5' : 'w-4 h-4'}
        ${streak > 0 ? 'text-orange-500 animate-pulse-soft' : 'text-base-content/30'}
      `} />
      <span className={`
        font-extrabold leading-none
        ${compact ? 'text-xs' : 'text-sm'}
        ${streak > 0 ? 'text-orange-500' : 'text-base-content/30'}
      `}>
        {streak}
      </span>
    </div>
  )
}