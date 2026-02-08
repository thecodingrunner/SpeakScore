'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth, useClerk } from '@clerk/nextjs';
import { Check, Star, Sparkles, TrendingUp, Zap } from 'lucide-react';
import { PRICING_PLANS } from '@/lib/payment-flows';

const PricingSection = () => {
  return (
    <div id="pricing" className="py-24 px-4 lg:px-8 bg-gradient-to-b from-base-100 to-base-200">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Simple, Transparent Pricing</span>
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">
            Start Free,{' '}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Upgrade When Ready
            </span>
          </h2>
          
          <p className="text-lg text-base-content/60 max-w-2xl mx-auto">
            Join thousands of learners mastering English pronunciation. No credit card required to start.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
          {PRICING_PLANS.map((plan) => (
            <PricingCard
              key={plan.id}
              id={plan.id}
              name={plan.name}
              price={plan.price}
              priceId={plan.priceId ?? null}
              billingCycle={plan.period || 'monthly'}
              description={getDescription(plan)}
              features={plan.features}
              ctaText={getCtaText(plan)}
              ctaVariant={getCtaVariant(plan)}
              popular={plan.popular}
              badge={plan.badge}
              badgeColor={getBadgeColor(plan)}
              savings={plan.discount || null}
            />
          ))}
        </div>

        {/* All Plans Include */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-base-100 rounded-2xl shadow-lg p-8 border border-base-300">
            <h3 className="text-2xl font-bold text-center text-base-content mb-6">
              All Plans Include
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              {['Progress tracking', 'No ads ever', 'Mobile & desktop access'].map((feature, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <Check className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-base text-base-content">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Money-back guarantee */}
        <p className="text-center text-sm text-base-content/60 mt-8">
          14-day money-back guarantee on all paid plans
        </p>

      </div>
    </div>
  );
};

// Helper functions to derive properties from plan data
const getDescription = (plan: typeof PRICING_PLANS[0]) => {
  if (plan.type === 'free') return 'Perfect for getting started';
  if (plan.id === 'premium-annual') return 'All Premium Monthly features';
  return 'Unlock your full learning potential';
};

const getCtaText = (plan: typeof PRICING_PLANS[0]) => {
  if (plan.type === 'free') return 'Start Free';
  if (plan.id === 'premium-annual') return 'Get Annual Plan';
  return 'Start Monthly Plan';
};

const getCtaVariant = (plan: typeof PRICING_PLANS[0]): 'primary' | 'secondary' | 'outline' => {
  if (plan.type === 'free') return 'outline';
  if (plan.id === 'premium-annual') return 'secondary';
  return 'primary';
};

const getBadgeColor = (plan: typeof PRICING_PLANS[0]) => {
  if (plan.type === 'free') return 'neutral';
  return 'primary';
};

// Individual Pricing Card Component
interface PricingCardProps {
  id: string;
  name: string;
  price: number;
  priceId: string | null;
  billingCycle: 'monthly' | 'annual' | 'month' | 'year';
  description: string;
  features: string[];
  ctaText: string;
  ctaVariant: 'primary' | 'secondary' | 'outline';
  popular?: boolean;
  badge?: string;
  badgeColor?: string;
  savings?: string | null;
}

const PricingCard = ({
  id,
  name,
  price,
  priceId,
  billingCycle,
  description,
  features,
  ctaText,
  ctaVariant,
  popular = false,
  badge,
  badgeColor = 'primary',
  savings
}: PricingCardProps) => {
  const isPopular = popular;
  const isFree = price === 0;
  const { isSignedIn } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { openSignUp } = useClerk();

  const handleFreePlanClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isSignedIn) {
      router.push('/practice');
    } else {
      router.push('/sign-up');
    }
  };

  const handlePaidPlanClick = async () => {
    if (!isSignedIn) {
      openSignUp({
        redirectUrl: `/?plan=${id}`
      });
      return;
    }

    try {
      const res = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId: priceId,
          planId: id,
          planType: 'subscription',
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Checkout failed');
      }

      window.location.href = data.url;
    } catch (err) {
      console.error(err);
      alert('Something went wrong starting checkout');
    }
  };

  // useEffect(() => {
  //   const plan = searchParams.get('plan');
  //   if (!plan || !isSignedIn || plan !== id) return;

  //   const startCheckout = async () => {
  //     const res = await fetch('/api/create-checkout', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({ plan, priceId })
  //     });

  //     const data = await res.json();
  //     if (res.ok) {
  //       window.location.href = data.url;
  //     }
  //   };

  //   startCheckout();
  // }, [isSignedIn, searchParams, id, priceId]);

  useEffect(() => {
    const plan = searchParams.get('plan');
    
    console.log('🔍 Checking card:', {
      cardId: id,
      planParam: plan,
      isSignedIn,
      matches: plan === id
    });
    
    if (!plan || !isSignedIn || plan !== id) return;
  
    console.log('✅ Starting checkout for:', id);
    
    const startCheckout = async () => {
      const res = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          priceId,
          planId: plan,
          planType: plan.includes('annual') ? 'subscription' : 'subscription'
        })
      });
  
      const data = await res.json();
      if (res.ok) {
        window.location.href = data.url;
      }
    };
  
    startCheckout();
  }, [isSignedIn, searchParams, id, priceId]);
  
  // Normalize billing cycle display
  const displayCycle = billingCycle === 'month' ? 'mo' : billingCycle === 'year' ? 'year' : billingCycle === 'monthly' ? 'mo' : 'year';
  
  return (
    <div id='pricing' className={`relative bg-base-100 rounded-2xl shadow-xl border-2 overflow-hidden transition-all duration-300 hover:shadow-2xl ${
      isPopular 
        ? 'border-primary/50 ring-2 ring-primary shadow-primary/20 transform scale-105' 
        : 'border-base-300 hover:border-primary/30'
    }`}>
      
      {/* Popular Badge */}
      {popular && (
        <div className="absolute top-0 right-0 bg-primary text-primary-content px-4 py-1 rounded-bl-lg flex items-center gap-2">
          <Star className="w-4 h-4 fill-current" />
          <span className="text-sm font-bold">{badge || 'Most Popular'}</span>
        </div>
      )}

      {badge && !popular && (
        <div className="absolute top-4 right-4">
          <span className={`badge badge-${badgeColor} badge-lg`}>{badge}</span>
        </div>
      )}

      <div className="p-8 h-full flex flex-col">
        
        {/* Header */}
        <div className="mb-6">
          <h3 className={`text-2xl font-bold mb-2 ${isPopular ? 'text-primary' : 'text-base-content'}`}>
            {name}
          </h3>
          
          <div className="flex items-baseline gap-2 mb-3">
            {isFree ? (
              <span className="text-5xl font-black bg-gradient-to-r from-success to-info bg-clip-text text-transparent">
                Free
              </span>
            ) : (
              <>
                <span className="text-5xl font-black text-base-content">
                  £{price}
                </span>
                <span className="text-base-content/60">
                  /{displayCycle}
                </span>
              </>
            )}
          </div>

          {savings && (
            <div className="mb-2">
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-success/10 border border-success/20 rounded-full text-success text-sm font-semibold">
                <TrendingUp className="w-4 h-4" />
                {savings}
              </span>
            </div>
          )}
          
          <p className="text-sm text-base-content/70">{description}</p>
        </div>

        {/* Features */}
        <ul className="space-y-3 mb-8">
          {features.map((feature, idx) => (
            <li key={idx} className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-success/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check className="w-3 h-3 text-success" />
              </div>
              <span className="text-sm text-base-content/80">{feature}</span>
            </li>
          ))}
        </ul>

        <div className="mt-auto">
          {/* CTA Button */}
          <button 
            onClick={isFree ? handleFreePlanClick : handlePaidPlanClick}
            className={`btn btn-${ctaVariant} btn-block btn-lg ${
              isPopular ? 'shadow-lg shadow-primary/30' : ''
            }`}
          >
            {ctaText}
          </button>
        </div>

        {isFree && (
          <p className="text-xs text-center text-base-content/60 mt-4">
            No credit card required
          </p>
        )}
      </div>

      {/* Decorative gradient for popular card */}
      {isPopular && (
        <>
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-2xl" />
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-secondary/10 rounded-full blur-2xl" />
        </>
      )}
    </div>
  );
};

export default PricingSection;