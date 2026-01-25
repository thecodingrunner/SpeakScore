import Link from 'next/link'
import { ArrowRight, Check, Zap, Shield, Rocket } from 'lucide-react'
import { BenefitsChecklistSection, ComparisonSection, FaqSection, FeaturesGridSection, FinalCTASection, HeroSection, HowItWorksSection, Navbar, PricingSection, TestimonialsSection, TrustBadgesSection, UrgencySection } from '../components/landing/LandingPageSections'
import { BeforeAfterSection, VideoDemoSection, FinalCTASectionWithGuarantee } from '../components/landing/LandingPageSectionsAdditional';
import Footer from '../components/global/Footer';
import { SmartPricingCard } from '@/components/landing/StripePricingSection';
import { PRICING_PLANS } from '@/lib/payment-flows';

export default function LandingPage() {

  return (
    <div className='min-h-screen'>

      <Navbar />

      {/* Awareness */}
      <HeroSection />
      <FeaturesGridSection />
      <BenefitsChecklistSection />
      
      {/* Interest */}
      <HowItWorksSection />
      
      {/* Desire */}
      <BeforeAfterSection />
      <ComparisonSection />
      
      {/* Trust */}
      <TestimonialsSection />
      <VideoDemoSection />
      
      {/* Decision - CRITICAL ZONE */}
      <PricingSection />
      {/* <SmartPricingCard plan={PRICING_PLANS[1]} /> */}
      <FaqSection />
      
      {/* Conversion */}
      <TrustBadgesSection />
      <UrgencySection />
      <FinalCTASection />

      <Footer />

    </div>
  )
}