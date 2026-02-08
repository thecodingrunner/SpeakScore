// app/api/webhooks/stripe/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { headers } from 'next/headers';
import { upsertUser } from '@/lib/mongodb/users';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const headersList = await headers();
    const signature = headersList.get('stripe-signature');

    if (!signature) {
      console.error('❌ No stripe-signature header found');
      return NextResponse.json({ error: 'No signature' }, { status: 400 });
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
      console.error('❌ Webhook signature verification failed:', err.message);
      return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
    }

    console.log('✅ Webhook received:', event.type);

    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;

      case 'customer.subscription.updated':
        await handleSubscriptionUpdate(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;

      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('❌ Webhook handler error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const { planId, planType, clerkUserId, userEmail  } = session.metadata || {};
  // const email = session.customer_details?.email;

  const email = userEmail || session.customer_details?.email;

  console.log('📦 Checkout session metadata:', {
    planId,
    planType,
    clerkUserId,
    email,
    subscriptionId: session.subscription
  });

  if (!email) {
    console.error('❌ No email found in session');
    return;
  }

  // Determine credits based on plan
  let credits = 0;
  if (planType === 'one-time') {
    credits = planId === 'basic' ? 5 : 50;
  } else if (planType === 'subscription') {
    credits = -1; // Unlimited
  }

  const userData = {
    clerkId: clerkUserId !== 'guest' ? clerkUserId : undefined,
    stripeCustomerId: session.customer as string,
    plan: planId || 'free',
    creditsRemaining: credits,
    subscriptionId: session.subscription as string | undefined,
    subscriptionStatus: planType === 'subscription' ? 'active' : undefined,
    isGuest: clerkUserId === 'guest',
  };

  console.log('💾 Upserting user with data:', userData);

  await upsertUser(
    { email },
    userData
  );

  console.log(`✅ User created/updated for ${email} with plan: ${planId}`);
}

async function handleSubscriptionUpdate(subscription: Stripe.Subscription) {
  console.log('🔄 Subscription update:', {
    id: subscription.id,
    status: subscription.status,
    customer: subscription.customer
  });

  await upsertUser(
    { stripeCustomerId: subscription.customer as string },
    {
      subscriptionStatus: subscription.status,
      creditsRemaining: subscription.status === 'active' ? -1 : 0,
    }
  );

  console.log(`✅ Subscription updated: ${subscription.id} - Status: ${subscription.status}`);
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  console.log('🗑️ Subscription deleted:', subscription.id);

  await upsertUser(
    { stripeCustomerId: subscription.customer as string },
    {
      subscriptionStatus: 'canceled',
      creditsRemaining: 0,
      plan: 'free',
    }
  );

  console.log(`✅ Subscription canceled: ${subscription.id}`);
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  console.log('💰 Invoice payment succeeded:', {
    id: invoice.id,
    customer: invoice.customer,
    amount: invoice.amount_paid
  });

  await upsertUser(
    { stripeCustomerId: invoice.customer as string },
    {
      creditsRemaining: -1,
      subscriptionStatus: 'active',
    }
  );

  console.log(`✅ Invoice paid: ${invoice.id}`);
}