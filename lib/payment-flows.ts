// lib/payment-flows.ts
export type PaymentFlowType = 'free' | 'one-time-guest' | 'subscription-auth';

export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  priceId?: string | null; // null for free plans
  type: 'free' | 'one-time' | 'subscription';
  features: string[];
  popular?: boolean;
}

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    priceId: null,
    type: 'free',
    features: [
      '1 analysis per month',
      'Basic photo ranking',
      'Simple recommendations',
    ],
  },
  {
    id: 'basic',
    name: 'Basic',
    price: 9.99,
    priceId: 'price_1So4aTKD0NAaawPxXkJP4ZWF',
    type: 'one-time',
    features: [
      'Up to 10 photos',
      'AI photo analysis',
      'Top 6 selection',
      'Bio feedback',
      'PDF report',
    ],
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 19.99,
    priceId: 'prod_Tlboj4wXTaRL3c',
    type: 'one-time',
    popular: true,
    features: [
      'Up to 20 photos',
      'Everything in Basic',
      '5 AI bio rewrites',
      'Prompt improvements',
      'Priority support',
    ],
  },
  {
    id: 'pro',
    name: 'Pro Monthly',
    price: 29.99,
    priceId: 'prod_TlbpnCv0LHeKhq',
    type: 'subscription',
    features: [
      'Unlimited analyses',
      'All Premium features',
      'A/B testing',
      'Progress tracking',
      'Cancel anytime',
    ],
  },
];

// Determine which flow to use
export function getPaymentFlow(plan: PricingPlan): PaymentFlowType {
  if (plan.type === 'free') return 'free';
  if (plan.type === 'subscription') return 'subscription-auth';
  return 'one-time-guest';
}