const pricingPlans = [
    {
      id: 'free',
      name: 'Free',
      price: 0.00,
      priceId: "", // Stripe Price ID
      type: 'one-time',
    },
    {
      id: 'pro-monthly',
      name: 'Pro Monthly',
      price: 19.99,
      priceId: process.env.STRIPE_PRO_MONTHLY_PRICE_ID || "price_1StTVXGZ3N75STJN4u0w2v4X",
      type: 'one-time',
    },
    {
      id: 'pro-annual',
      name: 'Pro Annual',
      price: 200.00,
      priceId: process.env.STRIPE_PRO_ANNUAL_PRICE_ID || "price_1StTW2GZ3N75STJNYbyf7mwq",
      type: 'subscription',
    },
  ];