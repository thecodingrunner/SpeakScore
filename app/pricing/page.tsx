'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@clerk/nextjs'
import { Check, Star, Sparkles, TrendingUp, Crown } from 'lucide-react'
import { useState } from 'react'

export default function PricingPage() {
  const { isSignedIn, isLoaded } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)

  const handleCheckout = async (plan: string) => {
    if (!isLoaded || !isSignedIn) {
      router.push('/sign-up')
      return
    }

    setLoading(plan)

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ plan }),
      })

      const data = await response.json()

      if (data.url) {
        window.location.href = data.url
      } else {
        alert('Error creating checkout session')
      }
    } catch (error) {
      console.error('Checkout error:', error)
      alert('Error creating checkout session')
    } finally {
      setLoading(null)
    }
  }

  const plans = [
    {
      name: 'Premium Monthly',
      price: 20,
      billingCycle: 'month',
      description: 'Perfect for consistent practice',
      features: [
        'All 11 practice scenarios unlocked',
        'Unlimited practice sessions',
        // 'Detailed phoneme-level analysis',
        'Progress analytics dashboard',
        // 'Japanese-specific pronunciation tips',
        'Spaced repetition recommendations',
        // '/r/ vs /l/, /th/, /v/ vs /b/ sounds',
        // 'Word stress & silent letters',
        // 'Business Meeting scenarios',
        // 'Job Interview practice',
        // 'Phone conversation training',
        'Achievement badges & streaks',
        'Priority email support'
      ],
      cta: 'Start Monthly Plan',
      ctaVariant: 'primary',
      plan: 'premium_monthly',
      highlighted: true
    },
    {
      name: 'Premium Annual',
      price: 199,
      originalPrice: 240,
      billingCycle: 'year',
      description: 'Best value for serious learners',
      features: [
        'Everything in Monthly, plus:',
        'Save £41 per year (17% off)',
        // 'All 11 practice scenarios unlocked',
        // 'Unlimited practice sessions',
        // 'Detailed phoneme-level analysis',
        // 'Progress analytics dashboard',
        // 'Japanese-specific pronunciation tips',
        // 'Spaced repetition recommendations',
        // 'All phoneme sound training',
        // 'Business & Interview scenarios',
        // 'Phone conversation training',
        // 'Achievement badges & streaks',
        // 'Priority email support'
      ],
      cta: 'Get Annual Plan',
      ctaVariant: 'secondary',
      plan: 'premium_annual',
      highlighted: false,
      savings: 'Save £41 per year',
      badge: 'BEST VALUE'
    }
  ]

  return (
    <div className="h-screen bg-gradient-to-b from-base-100 to-base-200 overflow-hidden">
      <div className="h-full max-w-7xl mx-auto px-6 py-4 flex flex-col">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full mb-4">
            <Crown className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Upgrade to Premium</span>
          </div>
          
          <h1 className="text-4xl lg:text-5xl font-bold mb-3">
            Unlock Your{' '}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Full Potential
            </span>
          </h1>
          
          <p className="text-base text-base-content/60 max-w-2xl mx-auto">
            Get access to all scenarios, unlimited practice, and advanced analytics
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto mb-8 flex-1">
          {plans.map((plan, idx) => {
            const isPopular = plan.highlighted
            
            return (
              <div
                key={idx}
                className={`relative bg-base-100 rounded-2xl shadow-xl border-2 overflow-hidden transition-all duration-300 hover:shadow-2xl flex flex-col ${
                  isPopular 
                    ? 'border-primary/50 ring-2 ring-primary shadow-primary/20 md:scale-105' 
                    : 'border-base-300 hover:border-primary/30'
                }`}
              >
                
                {/* Popular Badge */}
                {isPopular && (
                  <div className="absolute top-0 right-0 bg-primary text-primary-content px-4 py-1.5 rounded-bl-xl flex items-center gap-2">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="text-sm font-bold">Most Popular</span>
                  </div>
                )}

                {plan.badge && !isPopular && (
                  <div className="absolute top-4 right-4">
                    <span className="badge badge-success badge-lg">{plan.badge}</span>
                  </div>
                )}

                <div className="p-8 flex flex-col flex-1">
                  
                  {/* Header */}
                  <div className="mb-6">
                    <h3 className={`text-2xl font-bold mb-2 ${isPopular ? 'text-primary' : 'text-base-content'}`}>
                      {plan.name}
                    </h3>
                    
                    <div className="flex items-baseline gap-2 mb-3">
                      <span className="text-5xl font-black text-base-content">
                        £{plan.price}
                      </span>
                      <div className="flex flex-col">
                        <span className="text-base text-base-content/60">
                          /{plan.billingCycle}
                        </span>
                        {plan.originalPrice && (
                          <span className="text-sm text-base-content/40 line-through">
                            £{plan.originalPrice}
                          </span>
                        )}
                      </div>
                    </div>

                    {plan.savings && (
                      <div className="mb-3">
                        <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-success/10 border border-success/20 rounded-full text-success text-sm font-semibold">
                          <TrendingUp className="w-4 h-4" />
                          {plan.savings}
                        </span>
                      </div>
                    )}
                    
                    <p className="text-sm text-base-content/70">{plan.description}</p>
                  </div>

                  {/* Features */}
                  <ul className="space-y-2.5 mb-6 flex-1 overflow-y-auto max-h-[340px] pr-2">
                    {plan.features.map((feature, featureIdx) => (
                      <li key={featureIdx} className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-success/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="w-3 h-3 text-success" />
                        </div>
                        <span className="text-sm text-base-content/80">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <button
                    onClick={() => handleCheckout(plan.plan)}
                    disabled={loading === plan.plan}
                    className={`btn btn-${plan.ctaVariant} btn-block btn-lg ${
                      isPopular ? 'shadow-lg shadow-primary/30' : ''
                    }`}
                  >
                    {loading === plan.plan ? (
                      <span className="loading loading-spinner"></span>
                    ) : (
                      plan.cta
                    )}
                  </button>

                  <p className="text-xs text-center text-base-content/60 mt-3">
                    14-day money-back guarantee
                  </p>
                </div>

                {/* Decorative gradient for popular card */}
                {isPopular && (
                  <>
                    <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-2xl" />
                    <div className="absolute -top-10 -left-10 w-40 h-40 bg-secondary/10 rounded-full blur-2xl" />
                  </>
                )}
              </div>
            )
          })}
        </div>

        {/* Footer */}
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center gap-8 text-sm text-base-content/70">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-primary" />
              <span>Cancel anytime</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-primary" />
              <span>Secure payment</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-primary" />
              <span>No ads ever</span>
            </div>
          </div>
          
          <Link href="/" className="link link-primary text-sm">
            ← Back to Home
          </Link>
        </div>

      </div>
    </div>
  )
}