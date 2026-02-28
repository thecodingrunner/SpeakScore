// app/api/cron/publish-scheduled/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { publishScheduledPosts } from '@/lib/mongodb/blog';

export async function GET(request: NextRequest) {
  const auth = request.headers.get('authorization');
  if (!process.env.CRON_SECRET || auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const count = await publishScheduledPosts();
    return NextResponse.json({ published: count });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to publish scheduled posts' }, { status: 500 });
  }
}
