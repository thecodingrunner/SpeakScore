// app/api/verify-payment/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getUserByEmail, getUserByStripeCustomerId } from '@/lib/mongodb/users';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  try {
    const { sessionId } = await req.json();

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    console.log("Session: ", session);

    if (session.payment_status !== 'paid') {
      return NextResponse.json({ hasAccess: false }, { status: 403 });
    }

    // Find user by email or customer ID
    let user = await getUserByStripeCustomerId(session.customer as string);

    console.log("User: ", user);
    
    
    if (!user && session.customer_email) {
      user = await getUserByEmail(session.customer_email);
    }

    if (!user || (user.creditsRemaining !== -1 && user.creditsRemaining <= 0)) {
      return NextResponse.json({ hasAccess: false }, { status: 403 });
    }

    return NextResponse.json({
      hasAccess: true,
      user: {
        email: user.email,
        plan: user.plan,
        credits: user.creditsRemaining,
      },
    });
  } catch (error: any) {
    console.error('Verification error:', error);
    return NextResponse.json({ hasAccess: false }, { status: 500 });
  }
}