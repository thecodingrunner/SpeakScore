const pricingPlans = [
    {
      id: 'basic',
      name: 'Basic',
      price: 9.99,
      priceId: process.env.STRIPE_BASIC_ONETIME_PRICE_ID, // Stripe Price ID
      type: 'one-time',
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 19.99,
      priceId: process.env.STRIPE_PREMIUM_ONETIME_PRICE_ID,
      type: 'one-time',
    },
    {
      id: 'pro',
      name: 'Pro Monthly',
      price: 29.99,
      priceId: process.env.STRIPE_PRO_MONTHLY_PRICE_ID,
      type: 'subscription',
    },
  ];