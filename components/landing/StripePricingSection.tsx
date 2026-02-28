'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth, useClerk } from '@clerk/nextjs';
import { Check, Star, Flame, Crown, Zap } from 'lucide-react';
import { Mascot } from '@/components/global/Mascot';

type BillingCycle = 'monthly' | 'annual';

/* ── Plan definitions ──────────────────────────────────────────── */
interface PlanDef {
  id: string;
  name: string;
  monthlyPrice: number;
  annualPrice: number;
  features: string[];
  popular?: boolean;
  icon: React.ReactNode;
  annualSavings: string;
}

const PLANS: PlanDef[] = [
  {
    id: 'free',
    name: 'Free',
    monthlyPrice: 0,
    annualPrice: 0,
    icon: <Zap className="w-5 h-5 text-success" />,
    annualSavings: '',
    features: [
      '5 lessons per week',
      'Daily Drill + 3 phoneme scenarios',
      'Basic pronunciation feedback',
      'Progress tracking',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    monthlyPrice: 9.99,
    annualPrice: 109,
    popular: true,
    icon: <Star className="w-5 h-5 text-primary" />,
    annualSavings: 'Save £10.88',
    features: [
      '100 lessons per month',
      'All 11 scenarios unlocked',
      'TOEIC, Business, Interview & Phone',
      'Detailed phoneme-level analysis',
      'Progress analytics dashboard',
      'Word stress & silent letters',
      'Achievement badges & streaks',
    ],
  },
  {
    id: 'premium',
    name: 'Premium',
    monthlyPrice: 14.49,
    annualPrice: 149,
    icon: <Crown className="w-5 h-5 text-warning" />,
    annualSavings: 'Save £25',
    features: [
      'Unlimited lessons',
      'Everything in Pro',
      'Early access: AI Conversation Mode',
      'Priority support (EN & JP)',
      'Advanced analytics',
      'Japanese-specific tips',
    ],
  },
];

/* ── Pricing Section ───────────────────────────────────────────── */
const PricingSection = () => {
  const [billing, setBilling] = useState<BillingCycle>('monthly');

  return (
    <div id="pricing" className="py-20 px-4 lg:px-8 bg-base-200/50 bg-dots-pattern">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex justify-center mb-4">
            <Mascot size={72} expression="happy" className="drop-shadow-sm" />
          </div>
          <h2 className="text-3xl lg:text-4xl font-extrabold mb-3 text-base-content">
            Simple, <span className="text-primary">Friendly Pricing</span>
          </h2>
          <p className="text-base text-base-content/55 max-w-lg mx-auto mb-8">
            Less than one Eikaiwa lesson. Start free, upgrade when you&apos;re ready.
          </p>

          {/* Billing toggle */}
          <div className="inline-flex items-center gap-1 bg-base-100 border border-base-content/8 rounded-full p-1">
            <button
              onClick={() => setBilling('monthly')}
              className={`px-5 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                billing === 'monthly'
                  ? 'bg-primary text-primary-content shadow-sm'
                  : 'text-base-content/55 hover:text-base-content'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBilling('annual')}
              className={`px-5 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 flex items-center gap-1.5 ${
                billing === 'annual'
                  ? 'bg-primary text-primary-content shadow-sm'
                  : 'text-base-content/55 hover:text-base-content'
              }`}
            >
              Annual
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                billing === 'annual'
                  ? 'bg-primary-content/20 text-primary-content'
                  : 'bg-success/15 text-success'
              }`}>
                Save
              </span>
            </button>
          </div>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12">
          {PLANS.map(plan => (
            <PricingCard key={plan.id} plan={plan} billing={billing} />
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

/* ── Pricing Card ──────────────────────────────────────────────── */
function PricingCard({ plan, billing }: { plan: PlanDef; billing: BillingCycle }) {
  const isFree = plan.monthlyPrice === 0;
  const { isSignedIn } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { openSignUp } = useClerk();

  const planId = isFree ? 'free' : (billing === 'monthly' ? `${plan.id}-monthly` : `${plan.id}-annual`);
  const displayPrice = billing === 'monthly' ? plan.monthlyPrice : plan.annualPrice;
  const savings = billing === 'annual' ? plan.annualSavings : null;

  // Auto-start checkout if redirected after sign-up
  useEffect(() => {
    if (isFree) return;
    const planParam = searchParams.get('plan');
    if (!planParam || !isSignedIn || planParam !== planId) return;
    startCheckout(planId);
  }, [isSignedIn, searchParams]);

  const startCheckout = async (pid: string) => {
    try {
      const res = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId: pid, planType: 'subscription' }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Checkout failed');
      window.location.href = data.url;
    } catch (err) {
      console.error(err);
      alert('Something went wrong starting checkout');
    }
  };

  const handleClick = () => {
    if (isFree) {
      router.push(isSignedIn ? '/practice' : '/sign-up');
      return;
    }
    if (!isSignedIn) {
      openSignUp({ redirectUrl: `/?plan=${planId}` });
      return;
    }
    startCheckout(planId);
  };

  return (
    <div
      className={`relative card bg-base-100 overflow-hidden transition-all duration-300 hover:-translate-y-1 ${
        plan.popular
          ? 'border-2 border-primary/40 card-glow shadow-xl shadow-primary/10 sm:scale-105 z-10'
          : 'border border-base-content/8 card-glow'
      }`}
    >
      {/* Popular ribbon */}
      {plan.popular && (
        <div className="absolute top-0 right-0 bg-primary text-primary-content px-4 py-1 rounded-bl-2xl flex items-center gap-1.5 text-xs font-bold">
          <Star className="w-3 h-3 fill-current" /> Most Popular
        </div>
      )}

      <div className="card-body p-6 flex flex-col h-full">
        {/* Header */}
        <div className="mb-5">
          <div className="flex items-center gap-2 mb-2">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${plan.popular ? 'bg-primary/10' : 'bg-base-200'}`}>
              {plan.icon}
            </div>
            <h3 className={`text-lg font-extrabold ${plan.popular ? 'text-primary' : 'text-base-content'}`}>
              {plan.name}
            </h3>
          </div>

          <div className="flex items-baseline gap-1.5 mb-2">
            {isFree ? (
              <span className="text-4xl font-black text-success">Free</span>
            ) : (
              <>
                <span className="text-4xl font-black text-base-content">£{displayPrice}</span>
                <span className="text-sm text-base-content/45">/{billing === 'monthly' ? 'mo' : 'year'}</span>
              </>
            )}
          </div>

          {savings && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-success/10 border border-success/15 rounded-full text-success text-xs font-bold">
              <Flame className="w-3 h-3" /> {savings}
            </span>
          )}
        </div>

        {/* Features */}
        <ul className="space-y-2.5 mb-6 flex-1">
          {plan.features.map((f, i) => (
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
          onClick={handleClick}
          className={`btn btn-block ${
            isFree ? 'btn-outline' :
            plan.popular ? 'btn-primary shadow-md shadow-primary/20' :
            'btn-secondary'
          }`}
        >
          {isFree ? 'Start Free' : billing === 'monthly' ? 'Start Monthly Plan' : 'Get Annual Plan'}
        </button>

        {isFree && (
          <p className="text-[10px] text-center text-base-content/40 mt-3">No credit card required</p>
        )}
      </div>
    </div>
  );
}

export default PricingSection;
