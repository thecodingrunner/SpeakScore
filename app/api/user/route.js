// app/api/user/route.ts
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { getUserByClerkId } from '@/lib/mongodb/users';

export async function GET() {
  try {
    const { userId } = await auth(); // ✅ Must await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // ✅ Use the helper function from users.ts
    const user = await getUserByClerkId(userId);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}