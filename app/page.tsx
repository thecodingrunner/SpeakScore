// app/page.tsx (or wherever your landing page lives)
import {
  Navbar,
  HeroSection,
  SocialProofBar,
  FeaturesGridSection,
  HowItWorksSection,
  BenefitsChecklistSection,
  ComparisonSection,
  TestimonialsSection,
  FaqSection,
  TrustBadgesSection,
  PronounciationChallengesSection,
  BeforeAfterSection,
  FinalCTASection,
} from '@/components/landing/LandingPageSectionsNew';

import Footer from '@/components/global/Footer';
import PricingSection from '@/components/landing/StripePricingSection';
import Link from 'next/link';
import { getAllPosts } from '@/lib/mongodb/blog';

async function BlogTeaserSection() {
  let posts: Awaited<ReturnType<typeof getAllPosts>> = [];
  try {
    posts = (await getAllPosts(true)).slice(0, 3);
  } catch {
    return null;
  }

  if (posts.length === 0) return null;

  return (
    <section className="py-16 bg-base-200/50">
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-extrabold text-base-content mb-2">
            From the <span className="text-primary">Blog</span>
          </h2>
          <p className="text-base-content/55">Tips and insights to boost your English</p>
        </div>

        <div className="grid md:grid-cols-3 gap-5 mb-8">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="card bg-base-100 border border-base-content/5 hover:border-primary/25 hover:shadow-md transition-all"
            >
              <div className="card-body p-5">
                <p className="text-xs text-base-content/40 mb-1">
                  {post.publishedAt
                    ? new Date(post.publishedAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })
                    : ''}
                </p>
                <h3 className="font-bold text-base-content text-sm leading-snug mb-2">
                  {post.title}
                </h3>
                {post.excerpt && (
                  <p className="text-xs text-base-content/55 line-clamp-3">{post.excerpt}</p>
                )}
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center">
          <Link href="/blog" className="btn btn-outline btn-primary btn-sm">
            View all posts →
          </Link>
        </div>
      </div>
    </section>
  );
}

export default async function LandingPage() {
  return (
    <div className="min-h-screen bg-base-100">
      <Navbar />

      {/* 1. HERO — First impression with Koko mascot */}
      <HeroSection />

      {/* 2. SOCIAL PROOF — Instant credibility strip */}
      <SocialProofBar />

      {/* 3. FEATURES — What makes us special */}
      <FeaturesGridSection />

      {/* 4. PRONUNCIATION CHALLENGES — Show we understand the pain */}
      <PronounciationChallengesSection />

      {/* 5. HOW IT WORKS — Build understanding */}
      <HowItWorksSection />

      {/* 6. BEFORE/AFTER — Visual proof of results */}
      <BeforeAfterSection />

      {/* 7. TESTIMONIALS — Social proof from real learners */}
      <TestimonialsSection />

      {/* 8. COMPARISON — Why us vs alternatives */}
      <ComparisonSection />

      {/* 9. TRUST BADGES — Quick reassurance strip */}
      <TrustBadgesSection />

      {/* 10. PRICING — Clear path to purchase */}
      <PricingSection />

      {/* 11. FAQ — Remove objections */}
      <FaqSection />

      {/* 12. BLOG TEASER — Latest posts */}
      <BlogTeaserSection />

      {/* 13. FINAL CTA — Last chance to convert */}
      <FinalCTASection />

      <Footer />
    </div>
  );
}