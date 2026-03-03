// app/api/blog/[slug]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { getPostBySlug, updatePost, deletePost } from '@/lib/mongodb/blog';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const post = await getPostBySlug(slug);
    if (!post || !post.published) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch post' }, { status: 500 });
  }
}

async function requireAdmin() {
  const user = await currentUser();
  const email = user?.emailAddresses[0]?.emailAddress;
  return email === process.env.ADMIN_EMAIL ? email : null;
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const email = await requireAdmin();
    if (!email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { slug } = await params;
    const body = await request.json();
    const { title, slug: newSlug, excerpt, content, tags, published, scheduledAt } = body;

    const existing = await getPostBySlug(slug);
    if (!existing) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const now = new Date();
    const scheduledDate = scheduledAt ? new Date(scheduledAt) : null;
    const isScheduled = scheduledDate && scheduledDate > now;

    const updates: Record<string, unknown> = {};
    if (title !== undefined) updates.title = title;
    if (newSlug !== undefined) updates.slug = newSlug;
    if (excerpt !== undefined) updates.excerpt = excerpt;
    if (content !== undefined) updates.content = content;
    if (tags !== undefined) updates.tags = tags;

    if (isScheduled) {
      updates.published = false;
      updates.publishedAt = null;
      updates.scheduledAt = scheduledDate;
    } else if (published !== undefined) {
      updates.published = published;
      updates.scheduledAt = null;
      if (published && !existing.publishedAt) {
        updates.publishedAt = now;
      }
    }

    await updatePost(slug, updates);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const email = await requireAdmin();
    if (!email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { slug } = await params;
    await deletePost(slug);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
  }
}
