// app/components/LandingPage.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Check, Star, Mic, BarChart3, ArrowRight, Sparkles, Moon, Sun, Users, Zap, Award, TrendingUp, ChevronRight, Clock, Quote, Shield, Volume2, Target, Brain, Trophy, MessageCircle } from 'lucide-react';
import { SmartPricingCard } from './StripePricingSection';
import { PRICING_PLANS } from '@/lib/payment-flows';

const Navbar = () => {
    return (
      <div className="navbar bg-base-100 border-b border-base-300 px-4 lg:px-8 sticky top-0 z-40 backdrop-blur-lg bg-base-100/80">
        <div className="navbar-start">
          <div className="text-xl font-bold flex items-center gap-2">
            <Mic className="w-6 h-6 text-primary" />
            SpeakScore
          </div>
        </div>
        <div className="navbar-end gap-2">
          <Link href="#pricing" className="btn btn-ghost btn-sm">
            Pricing
          </Link>
          <Link href="/practice" className="btn btn-primary btn-sm">
            Start Practicing
          </Link>
        </div>
      </div>
    )
}

const HeroSection = () => {
    return (
      <div className="hero min-h-[80vh] bg-base-200">
        <div className="hero-content text-center max-w-5xl px-4">
          <div className="max-w-3xl">
            <div className="badge badge-primary badge-lg mb-4">AI-Powered English Pronunciation Coach</div>
            <h1 className="text-5xl lg:text-6xl font-bold mb-6">
              Perfect Your English Pronunciation with AI
            </h1>
            <p className="text-lg lg:text-xl mb-8 opacity-80">
              The only pronunciation coach designed for Japanese speakers. Get phoneme-level 
              feedback on /r/ vs /l/, /th/ sounds, and word stress—AI that actually understands 
              your Japanese→English challenges.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
              <Link href="/practice" className="btn btn-primary btn-lg gap-2">
                Try Free Practice Session
                <ArrowRight className="w-5 h-5" />
              </Link>
              <button className="btn btn-outline btn-lg">
                Watch Demo
              </button>
            </div>
            <div className="flex items-center justify-center gap-6 text-sm opacity-70">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4" />
                5 free sessions
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4" />
                No credit card
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4" />
                日本語サポート
              </div>
            </div>
          </div>
        </div>
      </div>
    )
}

const FeaturesGridSection = () => {

    const features = [
        {
          icon: <Mic className="w-6 h-6" />,
          title: "Japanese-Specific Analysis",
          description: "Detects /r/ vs /l/, /th/ sounds, and other phonemes Japanese speakers struggle with"
        },
        {
          icon: <MessageCircle className="w-6 h-6" />,
          title: "AI Conversation Practice",
          description: "TOEIC scenarios, business meetings, job interviews—practice what you actually need"
        },
        {
          icon: <BarChart3 className="w-6 h-6" />,
          title: "Progress Tracking",
          description: "Watch your pronunciation improve with detailed analytics and accuracy graphs"
        },
        {
          icon: <Target className="w-6 h-6" />,
          title: "Spaced Repetition",
          description: "Focus on your problem sounds with smart practice scheduling"
        }
      ];

    return (
      <div className="py-20 px-4 lg:px-8 bg-base-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Built for Japanese English Learners
            </h2>
            <p className="text-lg opacity-70 max-w-2xl mx-auto">
              Unlike ChatGPT, we remember your progress and understand your specific challenges
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, idx) => (
              <div key={idx} className="card bg-base-200 shadow-xl">
                <div className="card-body items-center text-center">
                  <div className="p-3 bg-primary/20 rounded-lg text-primary mb-3">
                    {feature.icon}
                  </div>
                  <h3 className="card-title text-lg">{feature.title}</h3>
                  <p className="text-sm opacity-70">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
}

const BenefitsChecklistSection = () => {

    const benefits = [
        "Phoneme-level pronunciation scoring",
        "/r/ vs /l/ detection and practice",
        "/th/ (θ/ð) sound training",
        "Word stress pattern analysis",
        "Silent vowel correction",
        "Fluency and rhythm feedback",
        "TOEIC/TOEFL speaking scenarios",
        "Business English practice",
        "Job interview preparation",
        "Daily practice streaks (連続日数)",
        "Achievement badges (達成バッジ)",
        "Progress analytics dashboard",
        "Japanese UI & support",
        "99% cheaper than English conversation schools"
      ];

    return (
      <div className="py-20 px-4 lg:px-8 bg-base-200">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Everything You Need to Master English Pronunciation
            </h2>
            <p className="text-lg opacity-70">
              Professional coaching that used to cost ¥20,000/month at Eikaiwa schools
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {benefits.map((benefit, idx) => (
              <div key={idx} className="flex items-start gap-3 p-4 bg-base-100 rounded-lg">
                <div className="badge badge-success badge-sm mt-1">
                  <Check className="w-3 h-3" />
                </div>
                <span className="font-medium">{benefit}</span>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="stats stats-vertical lg:stats-horizontal shadow w-full mt-12">
            <div className="stat place-items-center">
              <div className="stat-title">Practice Sessions</div>
              <div className="stat-value text-primary">50k+</div>
            </div>
            <div className="stat place-items-center">
              <div className="stat-title">Avg Accuracy Gain</div>
              <div className="stat-value text-secondary">+35%</div>
            </div>
            <div className="stat place-items-center">
              <div className="stat-title">User Rating</div>
              <div className="stat-value">4.8/5</div>
            </div>
          </div>
        </div>
      </div>
    )
}

const HowItWorksSection = () => {
    const steps = [
      {
        number: 1,
        title: "Choose Your Scenario",
        description: "TOEIC test, business meeting, job interview, or free conversation",
        icon: <MessageCircle className="w-8 h-8" />,
        time: "10 seconds"
      },
      {
        number: 2,
        title: "Practice Speaking",
        description: "AI conversation partner responds naturally to your English",
        icon: <Mic className="w-8 h-8" />,
        time: "5-10 minutes"
      },
      {
        number: 3,
        title: "Get Detailed Feedback",
        description: "Phoneme-level scores, error patterns, and pronunciation tips",
        icon: <BarChart3 className="w-8 h-8" />,
        time: "Instant"
      },
      {
        number: 4,
        title: "Track Progress",
        description: "Watch your accuracy improve day by day with streaks and badges",
        icon: <TrendingUp className="w-8 h-8" />,
        time: "Ongoing"
      }
    ];
  
    return (
      <div className="py-20 px-4 lg:px-8 bg-base-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-lg opacity-70">
              Start improving your pronunciation in just 5 minutes
            </p>
          </div>
  
          <div className="grid md:grid-cols-4 gap-8">
            {steps.map((step, idx) => (
              <div key={idx} className="relative">
                {idx < steps.length - 1 && (
                  <div className="hidden md:block absolute top-16 left-1/2 w-full h-0.5 bg-primary/20 -z-10">
                    <ChevronRight className="absolute right-0 top-1/2 -translate-y-1/2 w-6 h-6 text-primary" />
                  </div>
                )}
                
                <div className="card bg-base-200 shadow-lg hover:shadow-xl transition-shadow">
                  <div className="card-body items-center text-center">
                    <div className="avatar placeholder mb-4">
                      <div className="bg-primary text-primary-content rounded-full w-16 h-16 ring ring-primary ring-offset-base-100 ring-offset-2">
                        <span className="text-2xl font-bold">{step.number}</span>
                      </div>
                    </div>
                    
                    <div className="text-primary mb-3">
                      {step.icon}
                    </div>
                    
                    <h3 className="card-title text-lg mb-2">{step.title}</h3>
                    <p className="text-sm opacity-70 mb-3">{step.description}</p>
                    
                    <div className="badge badge-outline gap-2">
                      <Clock className="w-3 h-3" />
                      {step.time}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
  
          <div className="text-center mt-12">
            <Link href="/practice" className="btn btn-primary btn-lg gap-2">
              Start Free Practice Now
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

const ComparisonSection = () => {
    return (
      <div className="py-20 px-4 lg:px-8 bg-base-100">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Why SpeakScore vs Traditional Methods?
            </h2>
            <p className="text-lg opacity-70">
              Compare our AI coach to traditional English learning options
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="table table-zebra">
              <thead>
                <tr>
                  <th>Method</th>
                  <th>Price (Monthly)</th>
                  <th>Pronunciation Focus</th>
                  <th>Progress Tracking</th>
                  <th>Availability</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Eikaiwa Schools</td>
                  <td>¥10,000-20,000</td>
                  <td>Generic</td>
                  <td>Manual</td>
                  <td>Fixed schedule</td>
                </tr>
                <tr>
                  <td>Online Tutors</td>
                  <td>¥3,000-12,000</td>
                  <td>Teacher-dependent</td>
                  <td>None</td>
                  <td>Booking required</td>
                </tr>
                <tr>
                  <td>ChatGPT</td>
                  <td>$20 (~¥3,000)</td>
                  <td>No pronunciation</td>
                  <td>No memory</td>
                  <td>24/7</td>
                </tr>
                <tr>
                  <td>Duolingo</td>
                  <td>¥1,200</td>
                  <td>Basic only</td>
                  <td>Simple streaks</td>
                  <td>24/7</td>
                </tr>
                <tr className="bg-primary/10">
                  <td className="font-bold">
                    <Star className="inline w-4 h-4 mr-2" />
                    SpeakScore
                  </td>
                  <td className="font-bold text-success">£20 (~¥3,800)</td>
                  <td className="font-bold text-success">Japanese-specific</td>
                  <td className="font-bold text-success">Full analytics</td>
                  <td className="font-bold text-success">24/7</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="alert alert-info mt-8">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <span>85% cheaper than Eikaiwa schools with better pronunciation tracking</span>
          </div>
        </div>
      </div>
    )
}

const TestimonialsSection = () => {
    const testimonials = [
      {
        name: "Yuki T.",
        age: 28,
        location: "Tokyo",
        rating: 5,
        image: "👩‍💼",
        quote: "Finally fixed my /r/ and /l/ problem! The AI detected exactly when I was saying 'light' instead of 'right'. My TOEIC speaking score improved by 30 points.",
        result: "TOEIC +30 points",
        verified: true
      },
      {
        name: "Kenji M.",
        age: 32,
        location: "Osaka",
        rating: 5,
        image: "👨‍💻",
        quote: "ビジネス英語の発音が自信持てるようになりました。Meeting scenarios helped me prepare for real presentations. Much better than my old conversation school.",
        result: "Promoted at work",
        verified: true
      },
      {
        name: "Sakura I.",
        age: 24,
        location: "Yokohama",
        rating: 5,
        image: "👩‍🎓",
        quote: "Preparing for study abroad in the US. The /th/ sound practice is amazing—I can finally say 'think' and 'thank' correctly! My American friends noticed the difference.",
        result: "Study abroad ready",
        verified: true
      }
    ];
  
    return (
      <div className="py-20 px-4 lg:px-8 bg-base-200">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="badge badge-primary badge-lg mb-4">Trusted by 5,000+ Japanese Learners</div>
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Real Results from Japanese English Learners
            </h2>
            <div className="flex items-center justify-center gap-2 mb-2">
              {[1,2,3,4,5].map(i => (
                <Star key={i} className="w-5 h-5 fill-warning text-warning" />
              ))}
              <span className="font-bold ml-2">4.8/5</span>
              <span className="opacity-70">(1,247 reviews)</span>
            </div>
          </div>
  
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, idx) => (
              <div key={idx} className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="avatar placeholder">
                      <div className="bg-neutral text-neutral-content rounded-full w-12 h-12 text-2xl">
                        {testimonial.image}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold">{testimonial.name}</h3>
                        {testimonial.verified && (
                          <div className="badge badge-success badge-sm gap-1">
                            <Check className="w-3 h-3" />
                            Verified
                          </div>
                        )}
                      </div>
                      <p className="text-sm opacity-60">{testimonial.age}, {testimonial.location}</p>
                    </div>
                  </div>
  
                  <div className="flex gap-1 mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-warning text-warning" />
                    ))}
                  </div>
  
                  <Quote className="w-6 h-6 opacity-20 mb-2" />
                  <p className="text-sm italic mb-4">"{testimonial.quote}"</p>
  
                  <div className="badge badge-primary badge-outline">
                    {testimonial.result}
                  </div>
                </div>
              </div>
            ))}
          </div>
  
          <div className="text-center mt-12">
            <p className="text-sm opacity-70 mb-4">Join thousands of successful English learners</p>
            <Link href="/practice" className="btn btn-primary">
              Start Your Journey
            </Link>
          </div>
        </div>
      </div>
    );
}

const PricingSection = () => {

    return (
      <div id="pricing" className="py-20 px-4 lg:px-8 bg-base-200">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Simple, Affordable Pricing
            </h2>
            <p className="text-lg opacity-70">
              Less than one conversation lesson at an Eikaiwa school
            </p>
          </div>

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {PRICING_PLANS.map((plan, idx) => (
                <SmartPricingCard key={idx} plan={plan} />
            ))}
          </div>

          <div className="text-center mt-8 space-y-2">
            <p className="opacity-70">
              🎓 Students: 20% off with Japanese university email (.ac.jp)
            </p>
            <p className="text-sm opacity-60">
              Questions? <Link href="/contact" className="link link-primary">お問い合わせ (Contact us)</Link>
            </p>
          </div>
        </div>
      </div>
    )
}

const FaqSection = () => {
    return (
      <div className="py-20 px-4 lg:px-8 bg-base-100">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="join join-vertical w-full">
            <div className="collapse collapse-arrow join-item border border-base-300">
              <input type="radio" name="faq-accordion" defaultChecked /> 
              <div className="collapse-title text-lg font-medium">
                How does SpeakScore understand Japanese pronunciation challenges?
              </div>
              <div className="collapse-content"> 
                <p className="opacity-70">Our AI uses Azure's pronunciation assessment specifically calibrated for Japanese→English learners. It detects common issues like /r/ vs /l/ confusion, /th/ sounds, and silent vowel additions that Japanese speakers struggle with.</p>
              </div>
            </div>
            
            <div className="collapse collapse-arrow join-item border border-base-300">
              <input type="radio" name="faq-accordion" /> 
              <div className="collapse-title text-lg font-medium">
                Can I use SpeakScore to prepare for TOEIC/TOEFL?
              </div>
              <div className="collapse-content"> 
                <p className="opacity-70">Yes! We have dedicated TOEIC speaking test scenarios and TOEFL preparation conversations. Practice with realistic test formats and get feedback on pronunciation, fluency, and accuracy.</p>
              </div>
            </div>
            
            <div className="collapse collapse-arrow join-item border border-base-300">
              <input type="radio" name="faq-accordion" /> 
              <div className="collapse-title text-lg font-medium">
                Is the interface available in Japanese?
              </div>
              <div className="collapse-content"> 
                <p className="opacity-70">Currently the interface is in English (we're building for English-speaking Japanese learners first). Japanese UI will launch in Month 2. Support is available in both English and Japanese now.</p>
              </div>
            </div>

            <div className="collapse collapse-arrow join-item border border-base-300">
              <input type="radio" name="faq-accordion" /> 
              <div className="collapse-title text-lg font-medium">
                How is this different from ChatGPT for pronunciation practice?
              </div>
              <div className="collapse-content"> 
                <p className="opacity-70">ChatGPT doesn't track your progress, can't analyze pronunciation at the phoneme level, and doesn't remember your specific error patterns. SpeakScore remembers everything and focuses on YOUR Japanese→English challenges with detailed scoring.</p>
              </div>
            </div>

            <div className="collapse collapse-arrow join-item border border-base-300">
              <input type="radio" name="faq-accordion" /> 
              <div className="collapse-title text-lg font-medium">
                Can I cancel anytime?
              </div>
              <div className="collapse-content"> 
                <p className="opacity-70">Absolutely! No contracts, no commitments. Cancel your subscription anytime from your account settings. You'll keep access until the end of your billing period.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
}

const TrustBadgesSection = () => {
    return (
      <div className="py-16 px-4 lg:px-8 bg-base-200">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-2">Why Japanese Learners Choose Us</h3>
            <p className="opacity-70">Designed specifically for your success</p>
          </div>
  
          <div className="grid md:grid-cols-4 gap-6">
            <div className="card bg-base-100 shadow-sm">
              <div className="card-body items-center text-center p-6">
                <Target className="w-8 h-8 text-success mb-2" />
                <h4 className="font-bold text-sm">Japanese-Specific</h4>
                <p className="text-xs opacity-70">Built for your phoneme challenges</p>
              </div>
            </div>
  
            <div className="card bg-base-100 shadow-sm">
              <div className="card-body items-center text-center p-6">
                <Brain className="w-8 h-8 text-primary mb-2" />
                <h4 className="font-bold text-sm">Remembers You</h4>
                <p className="text-xs opacity-70">Tracks your unique patterns</p>
              </div>
            </div>
  
            <div className="card bg-base-100 shadow-sm">
              <div className="card-body items-center text-center p-6">
                <Trophy className="w-8 h-8 text-warning mb-2" />
                <h4 className="font-bold text-sm">TOEIC/TOEFL Ready</h4>
                <p className="text-xs opacity-70">Test-specific scenarios</p>
              </div>
            </div>
  
            <div className="card bg-base-100 shadow-sm">
              <div className="card-body items-center text-center p-6">
                <Shield className="w-8 h-8 text-info mb-2" />
                <h4 className="font-bold text-sm">日本語サポート</h4>
                <p className="text-xs opacity-70">Japanese language support</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
}

const PronounciationChallengesSection = () => {
    const challenges = [
      { sound: "/r/ vs /l/", example: "right vs light, rock vs lock", difficulty: "Very Hard" },
      { sound: "/th/ sounds", example: "think, that, this", difficulty: "Very Hard" },
      { sound: "/f/ vs /h/", example: "fan vs hand, feel vs heel", difficulty: "Hard" },
      { sound: "/v/ vs /b/", example: "vote vs boat, very vs berry", difficulty: "Hard" },
      { sound: "Silent vowels", example: "desk not desk-u, test not test-o", difficulty: "Medium" },
      { sound: "Word stress", example: "REcord vs reCORD", difficulty: "Medium" }
    ];
  
    return (
      <div className="py-20 px-4 lg:px-8 bg-base-100">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Pronunciation Challenges for Japanese Speakers
            </h2>
            <p className="text-lg opacity-70">
              We understand your specific struggles—and we fix them
            </p>
          </div>
  
          <div className="grid md:grid-cols-2 gap-4">
            {challenges.map((challenge, idx) => (
              <div key={idx} className="card bg-base-200 shadow-md">
                <div className="card-body">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="card-title text-lg">{challenge.sound}</h3>
                      <p className="text-sm opacity-70 mt-1">
                        Examples: <span className="font-mono">{challenge.example}</span>
                      </p>
                    </div>
                    <div className={`badge ${
                      challenge.difficulty === 'Very Hard' ? 'badge-error' : 
                      challenge.difficulty === 'Hard' ? 'badge-warning' : 
                      'badge-info'
                    }`}>
                      {challenge.difficulty}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
  
          <div className="alert alert-success mt-8">
            <Volume2 className="w-6 h-6" />
            <div>
              <h4 className="font-bold">SpeakScore detects and scores ALL of these</h4>
              <p className="text-sm">Get phoneme-level feedback on every challenging sound</p>
            </div>
          </div>
        </div>
      </div>
    );
}

const FinalCTASection = () => {
    return (
      <div className="py-20 px-4 lg:px-8 bg-primary text-primary-content">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl lg:text-5xl font-bold mb-6">
            Ready to Perfect Your English Pronunciation?
          </h2>
          <p className="text-lg lg:text-xl mb-8 opacity-90">
            Join thousands of Japanese speakers improving their English with AI
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/practice" className="btn btn-accent btn-lg gap-2">
              Start Free Practice
              <ArrowRight className="w-5 h-5" />
            </Link>
            <button className="btn btn-outline btn-lg text-primary-content border-primary-content hover:bg-primary-content hover:text-primary">
              Watch Demo
            </button>
          </div>
          <p className="text-sm mt-6 opacity-80">
            5 free sessions • No credit card required • 日本語サポートあり
          </p>
        </div>
      </div>
    )
}

export {
    Navbar,
    HeroSection,
    FeaturesGridSection,
    BenefitsChecklistSection,
    HowItWorksSection,
    ComparisonSection,
    TestimonialsSection,
    PricingSection,
    FaqSection,
    TrustBadgesSection,
    PronounciationChallengesSection,
    FinalCTASection
}