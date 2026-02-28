export type PlanTier = 'free' | 'pro' | 'premium'

export const PLAN_TIER_MAP: Record<string, PlanTier> = {
  'free': 'free',
  'pro-monthly': 'pro',
  'pro-annual': 'pro',
  'premium-monthly': 'premium',
  'premium-annual': 'premium',
}

export const SCENARIO_TIERS: Record<string, PlanTier> = {
  daily_drill: 'free',
  phoneme_r_vs_l: 'free',
  phoneme_th_sounds: 'free',
  phoneme_f_vs_h: 'free',
  phoneme_v_vs_b: 'pro',
  phoneme_word_stress: 'pro',
  phoneme_silent_letters: 'pro',
  toeic: 'pro',
  business: 'pro',
  interview: 'pro',
  phone: 'pro',
}

export const LESSON_LIMITS: Record<PlanTier, { period: 'week' | 'month' | null; max: number | null }> = {
  free: { period: 'week', max: 5 },
  pro: { period: 'month', max: 100 },
  premium: { period: null, max: null },
}

export function getTierFromPlan(plan: string): PlanTier {
  return PLAN_TIER_MAP[plan] ?? 'free'
}
