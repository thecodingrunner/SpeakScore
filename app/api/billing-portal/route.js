import { auth } from '@clerk/nextjs'
import { NextResponse } from 'next/server'
import { createPortalSession } from '@/lib/stripe'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'

export async function POST() {
  try {
    const { userId } = auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()
    const user = await User.findOne({ clerkId: userId })

    if (!user || !user.stripeCustomerId) {
      return NextResponse.json(
        { error: 'No billing information found' },
        { status: 404 }
      )
    }

    const session = await createPortalSession(
      user.stripeCustomerId,
      `${process.env.NEXT_PUBLIC_APP_URL}/settings?tab=billing`
    )

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Billing portal error:', error)
    return NextResponse.json(
      { error: 'Failed to create billing portal session' },
      { status: 500 }
    )
  }
}