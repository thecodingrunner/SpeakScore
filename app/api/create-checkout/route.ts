// app/api/create-checkout/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import Stripe from 'stripe';
import { getUserByClerkId, upsertUser } from '@/lib/mongodb/users';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// Server-side price ID lookup (env vars are safe here)
const PLAN_PRICE_IDS: Record<string, string | undefined> = {
  'pro-monthly': process.env.STRIPE_PRO_MONTHLY_PRICE_ID,
  'pro-annual': process.env.STRIPE_PRO_ANNUAL_PRICE_ID,
  'premium-monthly': process.env.STRIPE_PREMIUM_MONTHLY_PRICE_ID,
  'premium-annual': process.env.STRIPE_PREMIUM_ANNUAL_PRICE_ID,
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { planId, planType } = body;
    // priceId can be provided by client (legacy) or looked up server-side by planId
    const priceId: string = body.priceId || PLAN_PRICE_IDS[planId] || '';

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

    // Initialize metadata first
    const metadata: Record<string, string> = {
      planId,
      planType,
      clerkUserId: userId || 'guest',
    };

    const sessionConfig: Stripe.Checkout.SessionCreateParams = {
      mode: planType === 'subscription' ? 'subscription' : 'payment',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: successUrl,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/?canceled=true`,
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
      metadata, // ← Now it's defined
    };

    // Link to existing Stripe customer if user is authenticated
    if (userId) {
      // Get the full user object to access email
      const clerkUser = await currentUser();
      const dbUser = await getUserByClerkId(userId);
      
      // Get primary email from Clerk
      const userEmail = clerkUser?.emailAddresses.find(
        (email) => email.id === clerkUser.primaryEmailAddressId
      )?.emailAddress;

      console.log('👤 User info:', {
        clerkUserId: userId,
        email: userEmail,
        hasStripeCustomer: !!dbUser?.stripeCustomerId
      });

      if (!userEmail) {
        return NextResponse.json(
          { error: 'No email found for user' },
          { status: 400 }
        );
      }

      // Add email to metadata
      metadata.userEmail = userEmail;
      
      if (dbUser?.stripeCustomerId) {
        // Use existing Stripe customer
        sessionConfig.customer = dbUser.stripeCustomerId;
        console.log('✅ Using existing Stripe customer:', dbUser.stripeCustomerId);
      } else {
        // Pre-fill email for new customers
        sessionConfig.customer_email = userEmail;
        console.log('✅ Will create new Stripe customer with email:', userEmail);
      }
    }

    console.log('🚀 Creating Stripe session with config:', {
      mode: sessionConfig.mode,
      customer: sessionConfig.customer,
      customer_email: sessionConfig.customer_email,
      metadata: sessionConfig.metadata
    });

    const session = await stripe.checkout.sessions.create(sessionConfig);

    console.log('✅ Checkout session created:', session.id);

    return NextResponse.json({ url: session.url, sessionId: session.id });
  } catch (error: any) {
    console.error('❌ Checkout error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}