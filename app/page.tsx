// Use absolute imports with @/ instead of relative paths
import { 
  BenefitsChecklistSection, 
  ComparisonSection, 
  FaqSection, 
  FeaturesGridSection, 
  FinalCTASection, 
  HeroSection, 
  HowItWorksSection, 
  Navbar, 
  PronounciationChallengesSection, 
  TestimonialsSection, 
  TrustBadgesSection 
} from '@/components/landing/LandingPageSections'

import { 
  BeforeAfterSection, 
  VideoDemoSection, 
  FinalCTASectionWithGuarantee, 
  SuccessStoriesCarousel, 
  InteractivePronunciationDemo 
} from '@/components/landing/LandingPageSectionsAdditional'

import Footer from '@/components/global/Footer'
// import { SmartPricingCard } from '@/components/landing/StripePricingSection'
import { PRICING_PLANS } from '@/lib/payment-flows'
import PricingSection from '@/components/landing/StripePricingSection'

export default function LandingPage() {
  return (
    <div className='min-h-screen'>
      <Navbar />

      {/* 1. HERO - First impression */}
      <HeroSection />
      
      {/* 2. FEATURES - What it does */}
      <FeaturesGridSection />
      
      {/* 3. HOW IT WORKS - Build understanding */}
      <HowItWorksSection />
      
      {/* 4. BENEFITS - Why it matters */}
      <BenefitsChecklistSection />
      
      {/* 5. PRICING - Clear path to purchase */}
      <PricingSection />
      
      {/* 6. FAQ - Remove objections */}
      <FaqSection />
      
      {/* 7. FINAL CTA - Last chance to convert */}
      <FinalCTASection />

      <Footer />
    </div>
  )
}