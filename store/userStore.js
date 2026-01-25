import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useUserStore = create(
  persist(
    (set, get) => ({
      // User state
      user: null,
      subscriptionTier: 'free',
      subscriptionEndDate: null,
      loading: true,

      // Actions
      setUser: (userData) => set({ 
        user: userData,
        subscriptionTier: userData?.subscriptionTier || 'free',
        subscriptionEndDate: userData?.subscriptionEndDate,
        loading: false
      }),

      updateSubscription: (tier, endDate) => set({
        subscriptionTier: tier,
        subscriptionEndDate: endDate
      }),

      clearUser: () => set({
        user: null,
        subscriptionTier: 'free',
        subscriptionEndDate: null,
        loading: false
      }),

      setLoading: (loading) => set({ loading }),

      // Helper methods
      isPro: () => {
        const { subscriptionTier } = get()
        return subscriptionTier === 'pro' || subscriptionTier === 'enterprise'
      },

      isEnterprise: () => {
        const { subscriptionTier } = get()
        return subscriptionTier === 'enterprise'
      },

      hasActiveSubscription: () => {
        const { subscriptionTier, subscriptionEndDate } = get()
        if (subscriptionTier === 'free') return false
        if (!subscriptionEndDate) return false
        return new Date(subscriptionEndDate) > new Date()
      },

      canAccessFeature: (feature) => {
        const { subscriptionTier } = get()
        
        const features = {
          free: ['basicAnalytics', 'limitedProjects'],
          pro: ['basicAnalytics', 'limitedProjects', 'advancedAnalytics', 'unlimitedProjects', 'prioritySupport'],
          enterprise: ['basicAnalytics', 'limitedProjects', 'advancedAnalytics', 'unlimitedProjects', 'prioritySupport', 'customIntegrations', 'dedicatedSupport']
        }

        return features[subscriptionTier]?.includes(feature) || false
      }
    }),
    {
      name: 'user-storage',
      partialize: (state) => ({
        subscriptionTier: state.subscriptionTier,
        subscriptionEndDate: state.subscriptionEndDate
      })
    }
  )
)

export default useUserStore