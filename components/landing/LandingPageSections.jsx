// app/components/LandingPage.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Check, Star, Camera, FileText, BarChart3, ArrowRight, Sparkles, Moon, Sun, Users, Zap, Award, TrendingUp, ChevronRight, Clock, Quote, Shield } from 'lucide-react';
import { SmartPricingCard } from './StripePricingSection';
import { PRICING_PLANS } from '@/lib/payment-flows';

const Navbar = () => {
    return (
      <div className="navbar bg-base-100 border-b border-base-300 px-4 lg:px-8 sticky top-0 z-40 backdrop-blur-lg bg-base-100/80">
        <div className="navbar-start">
          <div className="text-xl font-bold flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" />
            ProfileAI
          </div>
        </div>
        <div className="navbar-end gap-2">
          <Link href="#pricing" className="btn btn-ghost btn-sm">
            Pricing
          </Link>
          <Link href="/analyze" className="btn btn-primary btn-sm">
            Try Now
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
            <div className="badge badge-primary badge-lg mb-4">AI-Powered Analysis</div>
            <h1 className="text-5xl lg:text-6xl font-bold mb-6">
              Get 3x More Matches with Optimized Photos
            </h1>
            <p className="text-lg lg:text-xl mb-8 opacity-80">
              Professional dating profile analysis in 5 minutes. AI analyzes your photos, 
              scores attractiveness, and rewrites your bio for maximum appeal.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
              <Link href="/analyze" className="btn btn-primary btn-lg gap-2">
                Analyze My Profile
                <ArrowRight className="w-5 h-5" />
              </Link>
              <button className="btn btn-outline btn-lg">
                See Example
              </button>
            </div>
            <div className="flex items-center justify-center gap-6 text-sm opacity-70">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4" />
                5 min results
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4" />
                No signup required
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
          icon: <Camera className="w-6 h-6" />,
          title: "AI Photo Analysis",
          description: "Advanced facial recognition scores attractiveness and photo quality"
        },
        {
          icon: <Star className="w-6 h-6" />,
          title: "Smart Ranking",
          description: "Get your top 6 photos with strategic positioning advice"
        },
        {
          icon: <FileText className="w-6 h-6" />,
          title: "Bio Optimization",
          description: "AI-powered bio rewrites in multiple tones and styles"
        },
        {
          icon: <BarChart3 className="w-6 h-6" />,
          title: "Performance Scoring",
          description: "Predict your swipe appeal with research-backed insights"
        }
      ];

    return (
      <div className="py-20 px-4 lg:px-8 bg-base-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Everything You Need to Stand Out
            </h2>
            <p className="text-lg opacity-70 max-w-2xl mx-auto">
              Comprehensive AI analysis covering every aspect of your profile
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
        "AI-powered attractiveness scoring",
        "Emotion & confidence analysis",
        "Technical quality assessment",
        "Top 6 photo selection strategy",
        "Detailed cropping recommendations",
        "Bio sentiment analysis",
        "5+ AI-generated bio rewrites",
        "Prompt optimization",
        "Research-backed insights",
        "Professional PDF report",
        "Results in under 5 minutes",
        "99% cheaper than a coach"
      ];

    return (
      <div className="py-20 px-4 lg:px-8 bg-base-200">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              What's Included
            </h2>
            <p className="text-lg opacity-70">
              Professional insights that used to cost hundreds
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
              <div className="stat-title">Profiles Analyzed</div>
              <div className="stat-value text-primary">10k+</div>
            </div>
            <div className="stat place-items-center">
              <div className="stat-title">Avg Match Increase</div>
              <div className="stat-value text-secondary">3x</div>
            </div>
            <div className="stat place-items-center">
              <div className="stat-title">User Rating</div>
              <div className="stat-value">4.9/5</div>
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
        title: "Upload Your Photos",
        description: "Add 3-20 photos from your profile or camera roll",
        icon: <Users className="w-8 h-8" />,
        time: "30 seconds"
      },
      {
        number: 2,
        title: "AI Analysis",
        description: "Our AI scores attractiveness, emotions, and quality",
        icon: <Zap className="w-8 h-8" />,
        time: "2 minutes"
      },
      {
        number: 3,
        title: "Get Recommendations",
        description: "Receive detailed feedback and optimized bio rewrites",
        icon: <Award className="w-8 h-8" />,
        time: "Instant"
      },
      {
        number: 4,
        title: "Update & Match",
        description: "Apply changes and watch your matches increase",
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
              Get professional results in just 5 minutes
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
            <Link href="/analyze" className="btn btn-primary btn-lg gap-2">
              Start Now - It's Fast!
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
              Why AI Analysis?
            </h2>
            <p className="text-lg opacity-70">
              Compare traditional services vs our solution
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="table table-zebra">
              <thead>
                <tr>
                  <th>Service</th>
                  <th>Price</th>
                  <th>Time</th>
                  <th>Coverage</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Dating Coach</td>
                  <td>$200-500</td>
                  <td>2-4 weeks</td>
                  <td>Subjective</td>
                </tr>
                <tr>
                  <td>Photographer</td>
                  <td>$300-800</td>
                  <td>1-2 weeks</td>
                  <td>Photos only</td>
                </tr>
                <tr>
                  <td>Profile Writer</td>
                  <td>$100-300</td>
                  <td>3-7 days</td>
                  <td>Generic</td>
                </tr>
                <tr className="bg-primary/10">
                  <td className="font-bold">
                    <Star className="inline w-4 h-4 mr-2" />
                    Our AI Analysis
                  </td>
                  <td className="font-bold text-success">$9.99-29.99</td>
                  <td className="font-bold text-success">5 minutes</td>
                  <td className="font-bold text-success">Comprehensive</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="alert alert-info mt-8">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <span>Save 95% of the cost and get 100x faster results</span>
          </div>
        </div>
      </div>
    )
}

const TestimonialsSection = () => {
    const testimonials = [
      {
        name: "Sarah M.",
        age: 28,
        location: "NYC",
        rating: 5,
        image: "👩‍💼", // Replace with actual image
        quote: "Went from 2-3 matches a week to 15+. The AI's photo recommendations were spot-on. Worth every penny!",
        result: "5x more matches",
        verified: true
      },
      {
        name: "James K.",
        age: 32,
        location: "LA",
        rating: 5,
        image: "👨‍💻",
        quote: "I had no idea my profile was so bad. The bio rewrites alone made a huge difference. Now I actually get replies!",
        result: "3x response rate",
        verified: true
      },
      {
        name: "Emily R.",
        age: 26,
        location: "Chicago",
        rating: 5,
        image: "👩‍🎨",
        quote: "The cropping suggestions were game-changing. Changed my main photo based on the AI's advice and my matches doubled overnight.",
        result: "2x more matches",
        verified: true
      }
    ];
  
    return (
      <div className="py-20 px-4 lg:px-8 bg-base-200">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="badge badge-primary badge-lg mb-4">Trusted by 10,000+ Users</div>
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Real Results from Real People
            </h2>
            <div className="flex items-center justify-center gap-2 mb-2">
              {[1,2,3,4,5].map(i => (
                <Star key={i} className="w-5 h-5 fill-warning text-warning" />
              ))}
              <span className="font-bold ml-2">4.9/5</span>
              <span className="opacity-70">(2,847 reviews)</span>
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
            <p className="text-sm opacity-70 mb-4">Join thousands of successful daters</p>
            <Link href="/analyze" className="btn btn-primary">
              Get Your Results
            </Link>
          </div>
        </div>
      </div>
    );
}

const PricingSection = () => {

    const pricingPlans = [
        {
          name: "Basic",
          price: "9.99",
          period: "one-time",
          description: "Perfect for getting started",
          features: [
            "Up to 10 photos",
            "Attractiveness scoring",
            "Top 6 photo selection",
            "Bio analysis",
            "1 AI bio rewrite",
            "PDF report"
          ],
          cta: "Get Started",
          popular: false
        },
        {
          name: "Premium",
          price: "19.99",
          period: "one-time",
          description: "Most comprehensive analysis",
          features: [
            "Up to 20 photos",
            "Everything in Basic",
            "5 AI bio rewrites",
            "Prompt improvements",
            "Research insights",
            "Priority processing"
          ],
          cta: "Get Premium",
          popular: true
        },
        {
          name: "Pro Monthly",
          price: "29.99",
          period: "per month",
          description: "For continuous optimization",
          features: [
            "Unlimited analyses",
            "All Premium features",
            "Progress tracking",
            "A/B testing",
            "Analysis history",
            "Cancel anytime"
          ],
          cta: "Start Pro",
          popular: false
        }
      ];

      console.log(PRICING_PLANS);
      

    return (
      <div id="pricing" className="py-20 px-4 lg:px-8 bg-base-200">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Simple Pricing
            </h2>
            <p className="text-lg opacity-70">
              Choose the plan that fits your goals
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {PRICING_PLANS.map((plan, idx) => (
                <SmartPricingCard key={idx} plan={plan} />
            ))}
          </div>

          <div className="text-center mt-8 space-y-2">
            <p className="opacity-70">
              All plans include 100% satisfaction guarantee
            </p>
            <p className="text-sm opacity-60">
              Questions? <Link href="/contact" className="link link-primary">Contact us</Link>
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
                How does the AI analysis work?
              </div>
              <div className="collapse-content"> 
                <p className="opacity-70">Our AI uses facial recognition to analyze attractiveness, emotions, and photo quality. It then ranks your photos and provides detailed recommendations based on dating research.</p>
              </div>
            </div>
            
            <div className="collapse collapse-arrow join-item border border-base-300">
              <input type="radio" name="faq-accordion" /> 
              <div className="collapse-title text-lg font-medium">
                Is my data private and secure?
              </div>
              <div className="collapse-content"> 
                <p className="opacity-70">Yes! We delete all photos immediately after analysis. Your data is never stored or shared with third parties.</p>
              </div>
            </div>
            
            <div className="collapse collapse-arrow join-item border border-base-300">
              <input type="radio" name="faq-accordion" /> 
              <div className="collapse-title text-lg font-medium">
                Can I try before buying?
              </div>
              <div className="collapse-content"> 
                <p className="opacity-70">Absolutely! You can see an example report before purchasing. Our Basic plan is also very affordable at just $9.99.</p>
              </div>
            </div>

            <div className="collapse collapse-arrow join-item border border-base-300">
              <input type="radio" name="faq-accordion" /> 
              <div className="collapse-title text-lg font-medium">
                What apps does this work for?
              </div>
              <div className="collapse-content"> 
                <p className="opacity-70">Our analysis works for all dating apps: Tinder, Bumble, Hinge, Match, OkCupid, and more. The principles apply universally.</p>
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
            <h3 className="text-2xl font-bold mb-2">Your Privacy & Security</h3>
            <p className="opacity-70">We take your data seriously</p>
          </div>
  
          <div className="grid md:grid-cols-4 gap-6">
            <div className="card bg-base-100 shadow-sm">
              <div className="card-body items-center text-center p-6">
                <Shield className="w-8 h-8 text-success mb-2" />
                <h4 className="font-bold text-sm">Secure Processing</h4>
                <p className="text-xs opacity-70">Bank-level encryption</p>
              </div>
            </div>
  
            <div className="card bg-base-100 shadow-sm">
              <div className="card-body items-center text-center p-6">
                <Zap className="w-8 h-8 text-warning mb-2" />
                <h4 className="font-bold text-sm">Auto-Delete</h4>
                <p className="text-xs opacity-70">Photos deleted immediately</p>
              </div>
            </div>
  
            <div className="card bg-base-100 shadow-sm">
              <div className="card-body items-center text-center p-6">
                <Check className="w-8 h-8 text-success mb-2" />
                <h4 className="font-bold text-sm">No Storage</h4>
                <p className="text-xs opacity-70">We never save your data</p>
              </div>
            </div>
  
            <div className="card bg-base-100 shadow-sm">
              <div className="card-body items-center text-center p-6">
                <Award className="w-8 h-8 text-info mb-2" />
                <h4 className="font-bold text-sm">Money Back</h4>
                <p className="text-xs opacity-70">100% satisfaction guarantee</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
}

const UrgencySection = () => {
const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 45,
    seconds: 30
});

return (
    <div className="py-12 px-4 lg:px-8 bg-gradient-to-r from-primary to-secondary">
    <div className="max-w-4xl mx-auto">
        <div className="card bg-base-100 shadow-2xl">
        <div className="card-body items-center text-center">
            <div className="badge badge-error badge-lg mb-4">Limited Time Offer</div>
            <h3 className="card-title text-2xl lg:text-3xl mb-4">
            Get 50% Off Premium Analysis
            </h3>
            <p className="mb-6 opacity-70">
            First 100 users this month get our Premium plan for just $9.99
            </p>

            <div className="grid grid-flow-col gap-5 text-center auto-cols-max mb-6">
            <div className="flex flex-col p-2 bg-neutral rounded-box text-neutral-content">
                <span className="countdown font-mono text-4xl">
                <span style={{"--value": timeLeft.hours}}></span>
                </span>
                hours
            </div>
            <div className="flex flex-col p-2 bg-neutral rounded-box text-neutral-content">
                <span className="countdown font-mono text-4xl">
                <span style={{"--value": timeLeft.minutes}}></span>
                </span>
                min
            </div>
            <div className="flex flex-col p-2 bg-neutral rounded-box text-neutral-content">
                <span className="countdown font-mono text-4xl">
                <span style={{"--value": timeLeft.seconds}}></span>
                </span>
                sec
            </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/analyze" className="btn btn-primary btn-lg">
                Claim 50% Discount Now
            </Link>
            <div className="text-sm opacity-70 self-center">
                <span className="font-bold">87/100</span> spots claimed
            </div>
            </div>

            <div className="mt-4">
            <progress className="progress progress-primary w-64" value="87" max="100"></progress>
            </div>
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
            Ready to Transform Your Profile?
          </h2>
          <p className="text-lg lg:text-xl mb-8 opacity-90">
            Join thousands who've improved their dating success with AI
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/analyze" className="btn btn-accent btn-lg gap-2">
              Start Analysis Now
              <ArrowRight className="w-5 h-5" />
            </Link>
            <button className="btn btn-outline btn-lg text-primary-content border-primary-content hover:bg-primary-content hover:text-primary">
              View Example
            </button>
          </div>
          <p className="text-sm mt-6 opacity-80">
            No signup required • Instant results
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
    UrgencySection,
    FinalCTASection
}