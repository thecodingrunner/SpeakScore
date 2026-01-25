// app/components/ConversionBoostSections.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Check, Star, TrendingUp, Users, Zap, Shield, 
  Clock, Award, ChevronRight, Play, Quote 
} from 'lucide-react';
import Image from 'next/image';
import HingeProfileMockup from './HingeProfileMockup'
import HingeProfileMockupAfter from './HingeProfileMockupAfter'

// 1. BEFORE/AFTER COMPARISON SECTION
const BeforeAfterSection = () => {
  return (
    <div className="py-20 px-4 lg:px-8 bg-base-100">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            See the Difference AI Makes
          </h2>
          <p className="text-lg opacity-70">
            Real profile transformations
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Before */}
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body items-center">
              <div className="badge badge-error mb-4">Before</div>
              <HingeProfileMockup />
              <div className="alert alert-error mt-4">
                <span className="text-sm">Low match rate: ~3 matches/week</span>
              </div>
            </div>
          </div>

          {/* After */}
          <div className="card bg-base-200 shadow-xl border-2 border-success">
            <div className="card-body items-center">
              <div className="badge badge-success mb-4">After AI Optimization</div>
              <HingeProfileMockupAfter />
              <div className="alert alert-success mt-4">
                <span className="text-sm">High match rate: ~15 matches/week</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const VideoDemoSection = () => {
  const [showVideo, setShowVideo] = useState(false);

  return (
    <div className="py-20 px-4 lg:px-8 bg-base-100">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            See ProfileAI in Action
          </h2>
          <p className="text-lg opacity-70">
            Watch how easy it is to transform your profile
          </p>
        </div>

        <div className="card bg-base-200 shadow-2xl overflow-hidden">
          <figure className="relative aspect-video bg-gradient-to-br from-primary/20 to-secondary/20">
            {!showVideo ? (
              <div className="absolute inset-0 flex items-center justify-center cursor-pointer"
                   onClick={() => setShowVideo(true)}>
                <button className="btn btn-circle btn-lg btn-primary">
                  <Play className="w-8 h-8" />
                </button>
                <div className="absolute bottom-4 left-4 badge badge-lg">
                  2:30 Demo Video
                </div>
              </div>
            ) : (
              <div className="w-full h-full">
                <iframe
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                  title="ProfileAI Demo"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            )}
          </figure>
          <div className="card-body">
            <div className="flex flex-wrap gap-4 justify-center">
              <div className="stat place-items-center">
                <div className="stat-value text-primary text-3xl">5 min</div>
                <div className="stat-desc">Complete analysis</div>
              </div>
              <div className="divider divider-horizontal"></div>
              <div className="stat place-items-center">
                <div className="stat-value text-secondary text-3xl">3x</div>
                <div className="stat-desc">More matches</div>
              </div>
              <div className="divider divider-horizontal"></div>
              <div className="stat place-items-center">
                <div className="stat-value text-accent text-3xl">$9.99</div>
                <div className="stat-desc">Get started</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const FinalCTASectionWithGuarantee = () => {
  return (
    <div className="py-20 px-4 lg:px-8 bg-gradient-to-br from-primary via-secondary to-accent text-primary-content">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl lg:text-5xl font-bold mb-6">
          Ready to 3x Your Matches?
        </h2>
        <p className="text-xl mb-8 opacity-90">
          Join 10,000+ successful daters who've transformed their profiles with AI
        </p>

        <div className="card bg-base-100 text-base-content shadow-2xl mb-8">
          <div className="card-body">
            <div className="flex flex-col md:flex-row gap-6 items-center justify-center">
              <div className="flex items-center gap-3">
                <Check className="w-6 h-6 text-success" />
                <span>5-minute analysis</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-6 h-6 text-success" />
                <span>No subscription required</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-6 h-6 text-success" />
                <span>Money-back guarantee</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
          <Link href="/analyze" className="btn btn-accent btn-lg gap-2 shadow-xl">
            Analyze My Profile Now
            <ChevronRight className="w-5 h-5" />
          </Link>
          <button className="btn btn-outline btn-lg text-primary-content border-primary-content hover:bg-primary-content hover:text-primary">
            See Pricing
          </button>
        </div>

        <div className="text-sm opacity-80">
          <Shield className="inline w-4 h-4 mr-2" />
          Secure payment • Your data is never stored • Cancel anytime
        </div>
      </div>
    </div>
  );
}

export {
  VideoDemoSection,
  BeforeAfterSection,
  FinalCTASectionWithGuarantee
}