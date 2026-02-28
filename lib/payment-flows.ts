// lib/payment-flows.ts
import type { PlanTier } from './plan-config'

export type PaymentFlowType = 'free' | 'one-time-guest' | 'subscription-auth';

export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  priceId?: string | null; // null for free plans
  type: 'free' | 'one-time' | 'subscription';
  period?: 'month' | 'year';
  tier: PlanTier;
  features: string[];
  popular?: boolean;
  badge?: string;
  discount?: string;
}

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    priceId: null,
    type: 'free',
    tier: 'free',
    features: [
      '5 lessons per week',
      'Access to 4 core scenarios',
      'Daily Drill & phoneme practice',
      'Basic pronunciation feedback',
      'Progress tracking',
    ],
    badge: 'Try Free',
  },
  {
    id: 'pro-monthly',
    name: 'Pro',
    price: 9.99,
    priceId: process.env.STRIPE_PRO_MONTHLY_PRICE_ID || null,
    type: 'subscription',
    period: 'month',
    tier: 'pro',
    popular: true,
    features: [
      '100 lessons per month',
      'All 11 scenarios unlocked',
      'TOEIC, Business, Interview, Phone',
      'Phoneme-level analysis',
      'Progress analytics dashboard',
      'Word stress & silent letters',
      'Achievement badges & streaks',
    ],
    badge: 'Most Popular',
  },
  {
    id: 'pro-annual',
    name: 'Pro Annual',
    price: 109,
    priceId: process.env.STRIPE_PRO_ANNUAL_PRICE_ID || null,
    type: 'subscription',
    period: 'year',
    tier: 'pro',
    discount: 'Save £10.88',
    features: [
      'Everything in Pro Monthly',
      '100 lessons per month',
      'All 11 scenarios unlocked',
      'Phoneme-level analysis',
      'Priority support',
      'Save ~9% vs monthly',
    ],
    badge: 'Best Value',
  },
  {
    id: 'premium-monthly',
    name: 'Premium',
    price: 14.49,
    priceId: process.env.STRIPE_PREMIUM_MONTHLY_PRICE_ID || null,
    type: 'subscription',
    period: 'month',
    tier: 'premium',
    features: [
      'Unlimited lessons',
      'All Pro features included',
      'Early access to AI Conversation Mode',
      'Priority email support',
      'Advanced progress analytics',
      'Japanese-specific pronunciation tips',
    ],
  },
  {
    id: 'premium-annual',
    name: 'Premium Annual',
    price: 149,
    priceId: process.env.STRIPE_PREMIUM_ANNUAL_PRICE_ID || null,
    type: 'subscription',
    period: 'year',
    tier: 'premium',
    discount: 'Save £25',
    features: [
      'Everything in Premium Monthly',
      'Unlimited lessons',
      'AI Conversation Mode (early access)',
      'Priority support in Japanese & English',
      'Custom practice scenarios',
      'Save ~14% vs monthly',
    ],
    badge: 'Best Value',
  },
];

// Student discount pricing (20% off)
export const STUDENT_DISCOUNT = {
  code: 'STUDENT20',
  percentOff: 20,
  requiresVerification: true,
  emailDomain: '.ac.jp', // Japanese university emails
};

// Determine which flow to use
export function getPaymentFlow(plan: PricingPlan): PaymentFlowType {
  if (plan.type === 'free') return 'free';
  if (plan.type === 'subscription') return 'subscription-auth';
  return 'one-time-guest';
}

// Helper to format price display
export function formatPrice(plan: PricingPlan): string {
  if (plan.price === 0) return 'Free';

  if (plan.period === 'year') {
    return `£${plan.price}/year`;
  }

  if (plan.period === 'month') {
    return `£${plan.price}/month`;
  }

  return `£${plan.price}`;
}

// Helper to get monthly equivalent for annual plan
export function getMonthlyEquivalent(plan: PricingPlan): number | null {
  if (plan.period === 'year') {
    return Math.round((plan.price / 12) * 100) / 100;
  }
  return null;
}

// Helper to calculate student pricing
export function getStudentPrice(plan: PricingPlan): number {
  if (plan.type === 'free') return 0;
  return Math.round(plan.price * (1 - STUDENT_DISCOUNT.percentOff / 100) * 100) / 100;
}

// When converting to Japanese market (Phase 2)
export const JPY_PRICING = {
  'pro-monthly': 1980,
  'pro-annual': 21800,
  'premium-monthly': 2980,
  'premium-annual': 29800,
};

// Helper to get price in different currencies
export function getPriceInCurrency(planId: string, currency: 'GBP' | 'JPY'): number {
  const plan = PRICING_PLANS.find(p => p.id === planId);
  if (!plan) return 0;

  if (currency === 'JPY') {
    return JPY_PRICING[planId as keyof typeof JPY_PRICING] || 0;
  }

  return plan.price;
}
