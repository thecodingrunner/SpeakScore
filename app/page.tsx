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

export default function LandingPage() {
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

      {/* 12. FINAL CTA — Last chance to convert */}
      <FinalCTASection />

      <Footer />
    </div>
  );
}