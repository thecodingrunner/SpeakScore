// app/api/create-checkout/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import Stripe from 'stripe';
import { getUserByClerkId, upsertUser } from '@/lib/mongodb/users';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  try {
    const { priceId, planId, planType } = await req.json();

        // 🔍 DEBUG: Log what we received
        console.log('📦 Received checkout request:', {
            priceId,
            planId,
            planType,
          });
        
    const { userId } = await auth();

    if (!priceId || !planId || !planType) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    // Subscriptions require auth
    if (planType === 'subscription' && !userId) {
      return NextResponse.json(
        { error: 'Auth required', requireAuth: true },
        { status: 401 }
      );
    }

    const successUrl = planType === 'subscription'
      ? `${process.env.NEXT_PUBLIC_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`
      : `${process.env.NEXT_PUBLIC_URL}/analyze?session_id={CHECKOUT_SESSION_ID}`;

    const sessionConfig: Stripe.Checkout.SessionCreateParams = {
      mode: planType === 'subscription' ? 'subscription' : 'payment',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: successUrl,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/?canceled=true`,
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
      metadata: {
        planId,
        planType,
        clerkUserId: userId || 'guest',
      },
    };

    // Link to existing Stripe customer if user is authenticated
    if (userId) {
      const user = await getUserByClerkId(userId);
      
      if (user?.stripeCustomerId) {
        sessionConfig.customer = user.stripeCustomerId;
      } else {
        // Will be created in webhook
        sessionConfig.customer_email = undefined;
      }
    }

    const session = await stripe.checkout.sessions.create(sessionConfig);

    return NextResponse.json({ url: session.url, sessionId: session.id });
  } catch (error: any) {
    console.error('Checkout error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}