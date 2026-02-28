'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

function slugify(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export default function NewBlogPostPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [publishMode, setPublishMode] = useState<'draft' | 'publish' | 'schedule'>('draft');
  const [scheduledAt, setScheduledAt] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  function handleTitleChange(value: string) {
    setTitle(value);
    setSlug(slugify(value));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const body: Record<string, unknown> = {
        title,
        slug,
        excerpt,
        content,
        tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
        published: publishMode === 'publish',
      };
      if (publishMode === 'schedule' && scheduledAt) {
        body.scheduledAt = new Date(scheduledAt).toISOString();
      }

      const res = await fetch('/api/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to create post');
      }

      router.push('/admin/blog');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-base-100 p-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin/blog" className="btn btn-ghost btn-sm">
            ← Back
          </Link>
          <h1 className="text-3xl font-extrabold text-base-content">New Post</h1>
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
              onChange={(e) => handleTitleChange(e.target.value)}
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
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
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
              placeholder="Short description shown in post list"
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
              placeholder="Write your post in Markdown..."
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
              placeholder="pronunciation, TOEIC, tips"
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
              {saving ? 'Saving…' : 'Create Post'}
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
