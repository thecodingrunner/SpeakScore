// lib/payment-flows.ts
export type PaymentFlowType = 'free' | 'one-time-guest' | 'subscription-auth';

export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  priceId?: string | null; // null for free plans
  type: 'free' | 'one-time' | 'subscription';
  period?: 'month' | 'year';
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
    features: [
      '20 practice lessons per month',
      // 'Basic conversation practice',
      // 'Simple accuracy scoring',
      'Access to 5 lesson scenarios',
      'Basic pronunciation feedback',
    ],
    badge: 'Try Free',
  },
  {
    id: 'premium-monthly',
    name: 'Premium',
    price: 20,
    priceId: process.env.STRIPE_PRO_MONTHLY_PRICE_ID || "price_1StTVXGZ3N75STJN4u0w2v4X",
    type: 'subscription',
    period: 'month',
    popular: true,
    features: [
      'Unlimited practice sessions',
      'Detailed phoneme-level analysis',
      'All scenarios unlocked (TOEIC, Business, Interviews)',
      'Progress analytics dashboard',
      'Japanese-specific pronunciation tips',
      'Spaced repetition recommendations',
      'Weekly email progress reports',
      '/r/ vs /l/ detection & practice',
      '/th/ sound training',
      'Word stress analysis',
      'Fluency & rhythm feedback',
      'Achievement badges & streaks',
    ],
    badge: 'Most Popular',
  },
  {
    id: 'premium-annual',
    name: 'Premium Annual',
    price: 199,
    priceId: process.env.STRIPE_PRO_ANNUAL_PRICE_ID || "price_1StTW2GZ3N75STJNYbyf7mwq",
    type: 'one-time',
    period: 'year',
    discount: 'Save 17%',
    features: [
      'All Premium Monthly features',
      'Priority support in Japanese & English',
      'Early access to new features',
      'TOEIC/TOEFL score prediction tool',
      'Advanced progress analytics',
      'Custom practice scenarios',
      'Mouth position video guides',
      '17% savings vs monthly (£40/year saved)',
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