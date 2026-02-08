// components/ProRoute.tsx
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSubscription } from '@/contexts/SubscriptionContext'
import { Lock, Star, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface ProRouteProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function ProRoute({ children, fallback }: ProRouteProps) {
  const { isPro, loading } = useSubscription()
  const router = useRouter()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    )
  }

  if (!isPro()) {
    if (fallback) {
      return <>{fallback}</>
    }

    // Default upgrade prompt
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
        <div className="card bg-base-100 shadow-2xl max-w-lg w-full">
          <div className="card-body items-center text-center space-y-6">
            <div className="w-20 h-20 rounded-full bg-warning/10 flex items-center justify-center">
              <Lock className="w-10 h-10 text-warning" />
            </div>
            
            <div>
              <h2 className="card-title text-2xl mb-2">Premium Feature</h2>
              <p className="text-base-content/70">
                Upgrade to Premium to access this feature
              </p>
            </div>

            <div className="bg-base-200 rounded-lg p-4 w-full">
              <h3 className="font-semibold mb-3 flex items-center gap-2 justify-center">
                <Star className="w-5 h-5 text-warning" />
                Premium Benefits:
              </h3>
              <ul className="text-sm space-y-2 text-left text-base-content/70">
                <li className="flex items-center gap-2">
                  <span className="text-success">✓</span>
                  Detailed progress analytics
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-success">✓</span>
                  Achievement tracking
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-success">✓</span>
                  All premium practice scenarios
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-success">✓</span>
                  Priority support
                </li>
              </ul>
            </div>

            <div className="flex gap-3 w-full">
              <button
                onClick={() => router.back()}
                className="btn btn-ghost flex-1 gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Go Back
              </button>
              <Link
                href="/pricing"
                className="btn btn-primary flex-1 gap-2"
              >
                <Star className="w-4 h-4" />
                Upgrade Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}