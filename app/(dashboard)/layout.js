'use client'

import { UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Settings, FolderKanban, Users, BarChart3, Crown } from 'lucide-react'
import useUserStore from '@/store/userStore'

export default function DashboardLayout({ children }) {
  const pathname = usePathname()
  const { subscriptionTier } = useUserStore()

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Projects', href: '/projects', icon: FolderKanban },
    { name: 'Team', href: '/team', icon: Users },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
    { name: 'Settings', href: '/settings', icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-base-200">
      {/* Top Navigation Bar */}
      <div className="navbar bg-base-100 border-b border-base-300 px-4 lg:px-8">
        <div className="navbar-start">
          <div className="dropdown lg:hidden">
            <label tabIndex={0} className="btn btn-ghost">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
              </svg>
            </label>
            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
              {navigation.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <li key={item.name}>
                    <Link 
                      href={item.href}
                      className={isActive ? 'active' : ''}
                    >
                      <Icon className="w-4 h-4" />
                      {item.name}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            YourSaaS
          </Link>
        </div>

        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <li key={item.name}>
                  <Link 
                    href={item.href}
                    className={`gap-2 ${isActive ? 'active' : ''}`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.name}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>

        <div className="navbar-end gap-2">
          <div className={`badge ${subscriptionTier === 'free' ? 'badge-ghost' : 'badge-primary'} gap-1`}>
            {subscriptionTier !== 'free' && <Crown className="w-3 h-3" />}
            {subscriptionTier.toUpperCase()}
          </div>
          {subscriptionTier === 'free' && (
            <Link href="/pricing" className="btn btn-primary btn-sm hidden sm:inline-flex">
              Upgrade
            </Link>
          )}
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>

      {/* Main Content */}
      <main>{children}</main>
    </div>
  )
}