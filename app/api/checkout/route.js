// import { auth } from '@clerk/nextjs'
// import { NextResponse } from 'next/server'
// import { createCheckoutSession, PRICING_PLANS } from '@/lib/payment-flows'
// import connectDB from '@/lib/mongodb'

// export async function POST(req) {
//   try {
//     const { userId } = auth()

//     if (!userId) {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
//     }

//     const { plan } = await req.json() // 'pro' or 'enterprise'

//     if (!['free', 'premium-monthly', 'premium-annual', 'premium'].includes(plan)) {
//       return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
//     }

//     await connectDB()
//     const user = await db.collection('users').findOne({ clerkId: userId });

//     if (!user) {
//       return NextResponse.json({ error: 'User not found' }, { status: 404 })
//     }

//     const priceId = PRICING_PLANS[plan].stripePriceId

//     if (!priceId) {
//       return NextResponse.json({ error: 'Price ID not configured' }, { status: 500 })
//     }

//     const session = await createCheckoutSession({
//       priceId,
//       customerId: user.stripeCustomerId,
//       customerEmail: user.email,
//       successUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
//       cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?canceled=true`,
//       metadata: {
//         userId: user.clerkId,
//         plan
//       }
//     })

//     return NextResponse.json({ url: session.url })
//   } catch (error) {
//     console.error('Checkout error:', error)
//     return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
//   }
// }