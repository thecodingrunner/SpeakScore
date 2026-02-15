// components/landing/StripePricingSection.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth, useClerk } from '@clerk/nextjs';
import { Check, Star, Sparkles, TrendingUp, Zap, Crown, Flame } from 'lucide-react';
import { PRICING_PLANS } from '@/lib/payment-flows';
import { Mascot, MascotMini } from '@/components/global/Mascot';

const PricingSection = () => {
  return (
    <div id="pricing" className="py-20 px-4 lg:px-8 bg-base-200/50 bg-dots-pattern">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <Mascot size={72} expression="happy" className="drop-shadow-sm" />
          </div>
          <h2 className="text-3xl lg:text-4xl font-extrabold mb-3 text-base-content">
            Simple, <span className="text-primary">Friendly Pricing</span>
          </h2>
          <p className="text-base text-base-content/55 max-w-lg mx-auto">
            Less than one Eikaiwa lesson. Start free, upgrade when you're ready.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12">
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
              savings={plan.discount || null}
            />
          ))}
        </div>

        {/* All Plans Include */}
        <div className="max-w-3xl mx-auto">
          <div className="card bg-base-100 border border-base-content/6 card-glow p-6">
            <h3 className="font-bold text-center text-sm text-base-content/50 uppercase tracking-wider mb-4">
              All Plans Include
            </h3>
            <div className="flex flex-wrap justify-center gap-6">
              {['Progress tracking', 'No ads ever', 'Mobile & desktop'].map((f, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-base-content/65">
                  <div className="w-4 h-4 rounded-full bg-primary/12 flex items-center justify-center">
                    <Check className="w-2.5 h-2.5 text-primary" />
                  </div>
                  {f}
                </div>
              ))}
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-base-content/40 mt-6">
          14-day money-back guarantee on all paid plans
        </p>
      </div>
    </div>
  );
};

// Helpers
const getDescription = (plan: typeof PRICING_PLANS[0]) => {
  if (plan.type === 'free') return 'Perfect for getting started';
  if (plan.id === 'premium-annual') return 'All Premium features, best value';
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

// Card
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
  savings?: string | null;
}

const PricingCard = ({
  id, name, price, priceId, billingCycle, description,
  features, ctaText, ctaVariant, popular = false, badge, savings,
}: PricingCardProps) => {
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
      openSignUp({ redirectUrl: `/?plan=${id}` });
      return;
    }
    try {
      const res = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId, planId: id, planType: 'subscription' }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Checkout failed');
      window.location.href = data.url;
    } catch (err) {
      console.error(err);
      alert('Something went wrong starting checkout');
    }
  };

  useEffect(() => {
    const plan = searchParams.get('plan');
    if (!plan || !isSignedIn || plan !== id) return;
    const startCheckout = async () => {
      const res = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId, planId: plan, planType: 'subscription' }),
      });
      const data = await res.json();
      if (res.ok) window.location.href = data.url;
    };
    startCheckout();
  }, [isSignedIn, searchParams, id, priceId]);

  const displayCycle = billingCycle === 'month' || billingCycle === 'monthly' ? 'mo' : 'year';

  return (
    <div
      className={`relative card bg-base-100 overflow-hidden transition-all duration-300 hover:-translate-y-1 ${
        popular
          ? 'border-2 border-primary/40 card-glow shadow-xl shadow-primary/10 sm:scale-105 z-10'
          : 'border border-base-content/8 card-glow'
      }`}
    >
      {/* Popular ribbon */}
      {popular && badge && (
        <div className="absolute top-0 right-0 bg-primary text-primary-content px-4 py-1 rounded-bl-2xl flex items-center gap-1.5 text-xs font-bold">
          <Crown className="w-3 h-3" />
          {badge}
        </div>
      )}

      {badge && !popular && (
        <div className="absolute top-3 right-3">
          <span className="badge badge-ghost badge-sm font-semibold">{badge}</span>
        </div>
      )}

      <div className="card-body p-6 flex flex-col h-full">
        {/* Header */}
        <div className="mb-5">
          <h3 className={`text-lg font-extrabold mb-2 ${popular ? 'text-primary' : 'text-base-content'}`}>
            {name}
          </h3>

          <div className="flex items-baseline gap-1.5 mb-2">
            {isFree ? (
              <span className="text-4xl font-black text-success">Free</span>
            ) : (
              <>
                <span className="text-4xl font-black text-base-content">£{price}</span>
                <span className="text-sm text-base-content/45">/{displayCycle}</span>
              </>
            )}
          </div>

          {savings && (
            <div className="mb-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-success/10 border border-success/15 rounded-full text-success text-xs font-bold">
                <Flame className="w-3 h-3" />
                {savings}
              </span>
            </div>
          )}

          <p className="text-xs text-base-content/50">{description}</p>
        </div>

        {/* Features */}
        <ul className="space-y-2.5 mb-6 flex-1">
          {features.map((f, i) => (
            <li key={i} className="flex items-start gap-2.5">
              <div className="w-4 h-4 rounded-full bg-success/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check className="w-2.5 h-2.5 text-success" />
              </div>
              <span className="text-xs text-base-content/65 leading-relaxed">{f}</span>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <button
          onClick={isFree ? handleFreePlanClick : handlePaidPlanClick}
          className={`btn btn-${ctaVariant} btn-block ${
            popular ? 'shadow-md shadow-primary/20' : ''
          }`}
        >
          {ctaText}
        </button>

        {isFree && (
          <p className="text-[10px] text-center text-base-content/40 mt-3">No credit card required</p>
        )}
      </div>
    </div>
  );
};

export default PricingSection;