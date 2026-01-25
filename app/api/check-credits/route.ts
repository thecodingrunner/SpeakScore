// app/api/check-credits/route.ts
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import clientPromise from '@/lib/db';

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ hasCredits: false }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db('your-database-name');
    
    const user = await db.collection('users').findOne({ clerkId: userId });

    const hasCredits = user && (
      user.creditsRemaining === -1 || // Unlimited
      user.creditsRemaining > 0
    );

    return NextResponse.json({ 
      hasCredits,
      credits: user?.creditsRemaining || 0 
    });
  } catch (error) {
    return NextResponse.json({ hasCredits: false }, { status: 500 });
  }
}