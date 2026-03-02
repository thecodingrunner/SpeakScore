'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { usePostHog } from 'posthog-js/react';

/** Drop into blog/[slug]/page.tsx to fire blog_post_viewed on mount */
export function BlogPostViewTracker({ slug, title }: { slug: string; title: string }) {
  const posthog = usePostHog();
  useEffect(() => {
    posthog?.capture('blog_post_viewed', { slug, title });
  }, [slug, title, posthog]);
  return null;
}

/** Replacement for the "Read more" Link in blog/page.tsx */
export function BlogReadMoreLink({ slug, title }: { slug: string; title: string }) {
  const posthog = usePostHog();
  return (
    <Link
      href={`/blog/${slug}`}
      className="btn btn-primary btn-sm shadow-md shadow-primary/20"
      onClick={() => posthog?.capture('blog_post_clicked', { slug, title })}
    >
      Read more
    </Link>
  );
}
