'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { useUser } from '@clerk/nextjs'

type SubscriptionTier = 'free' | 'premium-monthly' | 'premium-yearly'

interface SubscriptionContextType {
  subscriptionTier: SubscriptionTier
  subscriptionEndDate: string | null
  loading: boolean
  isPro: () => boolean
  hasActiveSubscription: () => boolean
  refreshSubscription: () => Promise<void>
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined)

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const { isSignedIn, user } = useUser()
  const [subscriptionTier, setSubscriptionTier] = useState<SubscriptionTier>('free')
  const [subscriptionEndDate, setSubscriptionEndDate] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchSubscription = async () => {
    if (!isSignedIn || !user?.id) {
      setSubscriptionTier('free')
      setSubscriptionEndDate(null)
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/user')
      const data = await response.json()

      console.log("User Data:", data)

      if (data.plan) {
        setSubscriptionTier(data.plan)
        setSubscriptionEndDate(data.subscriptionEndDate || null)
      } else {
        setSubscriptionTier('free')
        setSubscriptionEndDate(null)
      }
    } catch (error) {
      console.error('Error fetching subscription:', error)
      setSubscriptionTier('free')
      setSubscriptionEndDate(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSubscription()
  }, [isSignedIn, user?.id])

  const isPro = () => {
    return subscriptionTier === 'premium-monthly' || 
           subscriptionTier === 'premium-yearly'
  }

  const hasActiveSubscription = () => {
    if (subscriptionTier === 'free') return false
    if (!subscriptionEndDate) return true // Assume active if no end date
    return new Date(subscriptionEndDate) > new Date()
  }

  return (
    <SubscriptionContext.Provider
      value={{
        subscriptionTier,
        subscriptionEndDate,
        loading,
        isPro,
        hasActiveSubscription,
        refreshSubscription: fetchSubscription
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  )
}

export function useSubscription() {
  const context = useContext(SubscriptionContext)
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider')
  }
  return context
}