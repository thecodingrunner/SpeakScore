'use client'

import Link from 'next/link'
import { useUser } from '@clerk/nextjs'
import { Check, Crown } from 'lucide-react'
import { useState } from 'react'

export default function PricingPage() {
  const { user, isLoaded } = useUser()
  const [loading, setLoading] = useState(null)

  const handleCheckout = async (plan) => {
    if (!isLoaded || !user) {
      window.location.href = '/sign-up'
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
      name: 'Free',
      price: '$0',
      description: 'Perfect for trying out',
      features: [
        'Up to 3 projects',
        'Basic analytics',
        'Email support',
        '1 team member'
      ],
      cta: 'Get Started',
      plan: null,
      highlighted: false
    },
    {
      name: 'Pro',
      price: '$29',
      description: 'For professionals',
      features: [
        'Unlimited projects',
        'Advanced analytics',
        'Priority support',
        'Up to 5 team members',
        'Custom integrations'
      ],
      cta: 'Upgrade to Pro',
      plan: 'pro',
      highlighted: true
    },
    {
      name: 'Enterprise',
      price: '$99',
      description: 'For teams',
      features: [
        'Everything in Pro',
        'Unlimited team members',
        '24/7 phone support',
        'Custom contracts',
        'Dedicated account manager'
      ],
      cta: 'Upgrade to Enterprise',
      plan: 'enterprise',
      highlighted: false
    }
  ]

  return (
    <div className="min-h-screen bg-base-100">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4">Choose Your Plan</h1>
          <p className="text-xl text-base-content/70">
            Select the perfect plan for your needs
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, idx) => (
            <div
              key={idx}
              className={`card bg-base-100 shadow-xl ${
                plan.highlighted ? 'ring-2 ring-primary scale-105' : ''
              }`}
            >
              <div className="card-body">
                {plan.highlighted && (
                  <div className="badge badge-primary mb-2">Most Popular</div>
                )}
                <h3 className="card-title text-2xl">{plan.name}</h3>
                <div className="text-4xl font-bold my-4">
                  {plan.price}
                  <span className="text-lg font-normal text-base-content/60">/month</span>
                </div>
                <p className="text-base-content/70 mb-6">{plan.description}</p>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, featureIdx) => (
                    <li key={featureIdx} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {plan.plan ? (
                  <button
                    onClick={() => handleCheckout(plan.plan)}
                    disabled={loading === plan.plan}
                    className={`btn ${
                      plan.highlighted ? 'btn-primary' : 'btn-outline'
                    } btn-block`}
                  >
                    {loading === plan.plan ? (
                      <span className="loading loading-spinner"></span>
                    ) : (
                      plan.cta
                    )}
                  </button>
                ) : (
                  <Link href="/sign-up" className="btn btn-outline btn-block">
                    {plan.cta}
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}