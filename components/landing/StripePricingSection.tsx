// components/SmartPricingCard.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, SignUpButton } from '@clerk/nextjs';
import { PricingPlan, getPaymentFlow } from '@/lib/payment-flows';

interface SmartPricingCardProps {
  plan: PricingPlan;
}

export function SmartPricingCard({ plan }: SmartPricingCardProps) {

  console.log(plan);


  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const flow = getPaymentFlow(plan);

  const handlePurchase = async () => {
    setLoading(true);

    try {
      switch (flow) {
        case 'free':
          // Free tier - just sign up
          if (isSignedIn) {
            router.push('/dashboard');
          }
          // If not signed in, SignUpButton will handle it
          break;

        case 'one-time-guest':
          // Guest checkout - no auth required
          await handleGuestCheckout();
          break;

        case 'subscription-auth':
          // Subscription - require auth first
          if (isSignedIn) {
            await handleAuthenticatedCheckout();
          } else {
            // Store intent and redirect to sign-up
            sessionStorage.setItem('checkout_intent', JSON.stringify(plan));
            // SignUpButton will handle redirect
          }
          break;
      }
    } catch (error) {
      console.error('Purchase error:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGuestCheckout = async () => {
    const response = await fetch('/api/create-checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        priceId: plan.priceId,
        planId: plan.id,
        planType: plan.type,
      }),
    });

    const { url } = await response.json();
    if (url) window.location.href = url;
  };

  const handleAuthenticatedCheckout = async () => {
    const response = await fetch('/api/create-checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        priceId: plan.priceId,
        planId: plan.id,
        planType: plan.type,
      }),
    });

    const { url, requireAuth } = await response.json();
    
    if (requireAuth) {
      alert('Please sign in to subscribe');
      return;
    }
    
    if (url) window.location.href = url;
  };

  // Render appropriate CTA based on flow
  const renderCTA = () => {
    if (loading) {
      return (
        <button className="btn btn-primary btn-block" disabled>
          <span className="loading loading-spinner"></span>
        </button>
      );
    }

    switch (flow) {
      case 'free':
        return isSignedIn ? (
          <button onClick={handlePurchase} className="btn btn-outline btn-block">
            Go to Dashboard
          </button>
        ) : (
          <SignUpButton mode="modal">
            <button className="btn btn-outline btn-block">
              Start Free
            </button>
          </SignUpButton>
        );

      case 'one-time-guest':
        return (
          <button onClick={handlePurchase} className="btn btn-primary btn-block">
            Get {plan.name}
          </button>
        );

      case 'subscription-auth':
        return isSignedIn ? (
          <button onClick={handlePurchase} className="btn btn-primary btn-block">
            Subscribe to {plan.name}
          </button>
        ) : (
          <SignUpButton 
            mode="modal"
            // signInForceRedirectUrl={`/checkout?plan=${plan.id}`}
          >
            <button className="btn btn-primary btn-block">
              Sign Up & Subscribe
            </button>
          </SignUpButton>
        );
    }
  };

  return (
    <div className={`card bg-base-100 shadow-xl ${plan.popular ? 'ring-2 ring-primary' : ''}`}>
      <div className="card-body">
        {plan.popular && <div className="badge badge-primary">Most Popular</div>}
        
        <h3 className="card-title">{plan.name}</h3>
        
        <div className="text-4xl font-bold">
          {plan.price === 0 ? 'Free' : `$${plan.price}`}
          {plan.type === 'subscription' && <span className="text-lg">/mo</span>}
        </div>

        <ul className="space-y-2 my-4">
          {plan.features.map((feature, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="text-success">✓</span>
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>

        {renderCTA()}

        {/* Flow indicator (for debugging - remove in production) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="text-xs opacity-50 mt-2">
            Flow: {flow}
          </div>
        )}
      </div>
    </div>
  );
}