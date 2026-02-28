'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

function slugify(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export default function EditBlogPostPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;

  const [title, setTitle] = useState('');
  const [newSlug, setNewSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [publishMode, setPublishMode] = useState<'draft' | 'publish' | 'schedule'>('draft');
  const [scheduledAt, setScheduledAt] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchPost() {
      try {
        // Fetch from admin-level (unpublished posts included) via direct API
        const res = await fetch(`/api/blog/admin/${slug}`);
        if (!res.ok) throw new Error('Post not found');
        const post = await res.json();
        setTitle(post.title);
        setNewSlug(post.slug);
        setExcerpt(post.excerpt || '');
        setContent(post.content || '');
        setTags((post.tags || []).join(', '));
        if (post.published) {
          setPublishMode('publish');
        } else if (post.scheduledAt) {
          setPublishMode('schedule');
          const d = new Date(post.scheduledAt);
          // datetime-local expects "YYYY-MM-DDTHH:mm"
          setScheduledAt(d.toISOString().slice(0, 16));
        } else {
          setPublishMode('draft');
        }
      } catch {
        setError('Failed to load post');
      } finally {
        setLoading(false);
      }
    }
    fetchPost();
  }, [slug]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const body: Record<string, unknown> = {
        title,
        slug: newSlug,
        excerpt,
        content,
        tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
        published: publishMode === 'publish',
      };
      if (publishMode === 'schedule' && scheduledAt) {
        body.scheduledAt = new Date(scheduledAt).toISOString();
      }

      const res = await fetch(`/api/blog/${slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to update post');
      }

      router.push('/admin/blog');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-base-100 flex items-center justify-center">
        <span className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100 p-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin/blog" className="btn btn-ghost btn-sm">
            ← Back
          </Link>
          <h1 className="text-3xl font-extrabold text-base-content">Edit Post</h1>
        </div>

        {error && (
          <div className="alert alert-error mb-6">
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Title *</span>
            </label>
            <input
              type="text"
              className="input input-bordered"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Slug</span>
            </label>
            <input
              type="text"
              className="input input-bordered font-mono text-sm"
              value={newSlug}
              onChange={(e) => setNewSlug(e.target.value)}
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Excerpt</span>
            </label>
            <textarea
              className="textarea textarea-bordered h-20"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Content (Markdown) *</span>
            </label>
            <textarea
              className="textarea textarea-bordered h-80 font-mono text-sm"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Tags (comma-separated)</span>
            </label>
            <input
              type="text"
              className="input input-bordered"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Publish Status</span>
            </label>
            <div className="flex flex-col gap-2">
              {(['draft', 'publish', 'schedule'] as const).map((mode) => (
                <label key={mode} className="label cursor-pointer justify-start gap-3">
                  <input
                    type="radio"
                    className="radio radio-primary"
                    name="publishMode"
                    value={mode}
                    checked={publishMode === mode}
                    onChange={() => setPublishMode(mode)}
                  />
                  <span className="label-text">
                    {mode === 'draft' && 'Draft'}
                    {mode === 'publish' && 'Publish Now'}
                    {mode === 'schedule' && 'Schedule'}
                  </span>
                </label>
              ))}
            </div>
            {publishMode === 'schedule' && (
              <input
                type="datetime-local"
                className="input input-bordered mt-2"
                value={scheduledAt}
                onChange={(e) => setScheduledAt(e.target.value)}
                required
              />
            )}
          </div>

          <div className="flex gap-3 mt-2">
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? <span className="loading loading-spinner loading-sm" /> : null}
              {saving ? 'Saving…' : 'Save Changes'}
            </button>
            <Link href="/admin/blog" className="btn btn-ghost">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
