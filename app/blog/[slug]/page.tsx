// app/blog/[slug]/page.tsx
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Link from 'next/link';
import { getPostBySlug, getAllPosts } from '@/lib/mongodb/blog';
import { Navbar } from '@/components/landing/LandingPageSectionsNew';
import Footer from '@/components/global/Footer';
import { Calendar, Tag, ArrowLeft } from 'lucide-react';
import { BlogPostViewTracker } from '@/components/blog/BlogAnalytics';

export const revalidate = 60;

export async function generateStaticParams() {
  const posts = await getAllPosts(true);
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);
  if (!post || !post.published) return {};
  return {
    title: `${post.title} | SpeakScore Blog`,
    description: post.excerpt || undefined,
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = await getPostBySlug(params.slug);
  if (!post || !post.published) notFound();

  return (
    <div className="min-h-screen bg-base-100">
      <BlogPostViewTracker slug={post.slug} title={post.title} />
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 py-16">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-sm text-base-content/50 hover:text-primary mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Blog
        </Link>

        <article>
          <header className="mb-8">
            <div className="flex flex-wrap items-center gap-3 text-xs text-base-content/45 mb-4">
              {post.publishedAt && (
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(post.publishedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              )}
              {post.tags.length > 0 && (
                <span className="flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5" />
                  {post.tags.join(', ')}
                </span>
              )}
            </div>

            <h1 className="text-4xl font-extrabold text-base-content leading-tight mb-4">
              {post.title}
            </h1>

            {post.excerpt && (
              <p className="text-lg text-base-content/60 leading-relaxed">
                {post.excerpt}
              </p>
            )}
          </header>

          <div className="divider" />

          <div className="prose prose-base max-w-none text-base-content/85 prose-headings:text-base-content prose-a:text-primary prose-strong:text-base-content prose-code:text-primary prose-pre:bg-base-200 prose-blockquote:border-primary">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {post.content}
            </ReactMarkdown>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
