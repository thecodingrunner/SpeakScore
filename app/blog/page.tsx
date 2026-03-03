// app/blog/page.tsx
import Link from 'next/link';
import { getAllPosts } from '@/lib/mongodb/blog';
import { Navbar } from '@/components/landing/LandingPageSectionsNew';
import Footer from '@/components/global/Footer';
import { Calendar, Tag } from 'lucide-react';
import { BlogReadMoreLink } from '@/components/blog/BlogAnalytics';

export const metadata = {
  title: 'Blog | SpeakScore',
  description: 'Tips, guides, and insights for Japanese English learners.',
};

export const revalidate = 60;

export default async function BlogPage() {
  const posts = await getAllPosts(true);

  return (
    <div className="min-h-screen bg-base-100">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-base-content mb-3">
            Speak<span className="text-primary">Score</span> Blog
          </h1>
          <p className="text-base-content/60 text-lg">
            Tips, guides, and insights for Japanese English learners
          </p>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-20 text-base-content/40">
            <p className="text-xl">No posts yet — check back soon!</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {posts.map((post) => (
              <article
                key={post.slug}
                className="card bg-base-200 border border-base-content/5 hover:border-primary/20 transition-colors"
              >
                <div className="card-body">
                  <div className="flex flex-wrap items-center gap-3 text-xs text-base-content/45 mb-2">
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

                  <h2 className="card-title text-xl font-bold text-base-content">
                    {post.title}
                  </h2>

                  {post.excerpt && (
                    <p className="text-base-content/65 text-sm leading-relaxed">
                      {post.excerpt}
                    </p>
                  )}

                  <div className="card-actions mt-3">
                    <BlogReadMoreLink slug={post.slug} title={post.title} />
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
