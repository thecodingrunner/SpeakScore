// app/components/ConversionBoostSections.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Check, Star, TrendingUp, Users, Zap, Shield, 
  Clock, Award, ChevronRight, Play, Quote, Mic, BarChart3, Volume2 
} from 'lucide-react';
import Image from 'next/image';

// 1. BEFORE/AFTER PRONUNCIATION COMPARISON SECTION
const BeforeAfterSection = () => {
  const comparisonData = {
    before: {
      accuracy: 62,
      problems: [
        { phoneme: "/r/ vs /l/", error: '"light" → "right"', status: "Confused" },
        { phoneme: "/th/ sounds", error: '"think" → "sink"', status: "Missing" },
        { phoneme: "Word stress", error: '"REcord" → "reCORD"', status: "Wrong" },
        { phoneme: "Silent vowels", error: '"desk-u" instead of "desk"', status: "Extra syllable" }
      ],
      score: "TOEIC Speaking: ~110"
    },
    after: {
      accuracy: 91,
      improvements: [
        { phoneme: "/r/ vs /l/", result: '✓ Correctly distinguished', status: "Fixed" },
        { phoneme: "/th/ sounds", result: '✓ Clear θ and ð sounds', status: "Mastered" },
        { phoneme: "Word stress", result: '✓ Natural stress patterns', status: "Improved" },
        { phoneme: "Silent vowels", result: '✓ Clean endings', status: "Corrected" }
      ],
      score: "TOEIC Speaking: ~150"
    }
  };

  return (
    <div className="py-20 px-4 lg:px-8 bg-base-100">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            See Your Pronunciation Improve
          </h2>
          <p className="text-lg opacity-70">
            Real progress after 2 weeks of daily practice
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Before */}
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body">
              <div className="badge badge-error mb-4 text-lg">Before SpeakScore</div>
              
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold">Pronunciation Accuracy</span>
                  <span className="text-2xl font-bold text-error">{comparisonData.before.accuracy}%</span>
                </div>
                <progress className="progress progress-error w-full" value={comparisonData.before.accuracy} max="100"></progress>
              </div>

              <div className="space-y-3">
                <h4 className="font-bold opacity-70">Common Problems:</h4>
                {comparisonData.before.problems.map((problem, idx) => (
                  <div key={idx} className="alert alert-error py-2">
                    <div className="flex-1">
                      <div className="font-semibold text-sm">{problem.phoneme}</div>
                      <div className="text-xs opacity-70">{problem.error}</div>
                    </div>
                    <div className="badge badge-sm">{problem.status}</div>
                  </div>
                ))}
              </div>

              <div className="divider"></div>
              <div className="text-center">
                <div className="text-sm opacity-70">Estimated Score</div>
                <div className="text-xl font-bold">{comparisonData.before.score}</div>
              </div>
            </div>
          </div>

          {/* After */}
          <div className="card bg-base-200 shadow-xl border-2 border-success">
            <div className="card-body">
              <div className="badge badge-success mb-4 text-lg">After 2 Weeks</div>
              
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold">Pronunciation Accuracy</span>
                  <span className="text-2xl font-bold text-success">{comparisonData.after.accuracy}%</span>
                </div>
                <progress className="progress progress-success w-full" value={comparisonData.after.accuracy} max="100"></progress>
              </div>

              <div className="space-y-3">
                <h4 className="font-bold opacity-70">Improvements:</h4>
                {comparisonData.after.improvements.map((improvement, idx) => (
                  <div key={idx} className="alert alert-success py-2">
                    <div className="flex-1">
                      <div className="font-semibold text-sm">{improvement.phoneme}</div>
                      <div className="text-xs opacity-70">{improvement.result}</div>
                    </div>
                    <div className="badge badge-success badge-sm">{improvement.status}</div>
                  </div>
                ))}
              </div>

              <div className="divider"></div>
              <div className="text-center">
                <div className="text-sm opacity-70">Estimated Score</div>
                <div className="text-xl font-bold text-success">{comparisonData.after.score}</div>
                <div className="badge badge-success badge-outline mt-2">+40 point improvement</div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-8">
          <Link href="/practice" className="btn btn-primary btn-lg">
            Start Your Improvement Journey
          </Link>
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
            See SpeakScore in Action
          </h2>
          <p className="text-lg opacity-70">
            Watch how AI catches and corrects your pronunciation mistakes
          </p>
        </div>

        <div className="card bg-base-200 shadow-2xl overflow-hidden">
          <figure className="relative aspect-video bg-gradient-to-br from-primary/20 to-secondary/20">
            {!showVideo ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer gap-4"
                   onClick={() => setShowVideo(true)}>
                <Mic className="w-16 h-16 text-primary opacity-50" />
                <button className="btn btn-circle btn-lg btn-primary">
                  <Play className="w-8 h-8" />
                </button>
                <div className="absolute bottom-4 left-4 badge badge-lg">
                  3:00 Demo Video
                </div>
                <div className="absolute top-4 right-4 badge badge-primary">
                  Live Pronunciation Analysis
                </div>
              </div>
            ) : (
              <div className="w-full h-full">
                <iframe
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                  title="SpeakScore Demo"
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
                <div className="stat-desc">Get started</div>
              </div>
              <div className="divider divider-horizontal"></div>
              <div className="stat place-items-center">
                <div className="stat-value text-secondary text-3xl">+35%</div>
                <div className="stat-desc">Avg accuracy gain</div>
              </div>
              <div className="divider divider-horizontal"></div>
              <div className="stat place-items-center">
                <div className="stat-value text-accent text-3xl">Free</div>
                <div className="stat-desc">5 sessions to try</div>
              </div>
            </div>
          </div>
        </div>

        {/* Demo Features */}
        <div className="grid md:grid-cols-3 gap-4 mt-8">
          <div className="card bg-base-300">
            <div className="card-body items-center text-center p-4">
              <Mic className="w-8 h-8 text-primary mb-2" />
              <h4 className="font-bold text-sm">Real-time Analysis</h4>
              <p className="text-xs opacity-70">Instant phoneme-level feedback</p>
            </div>
          </div>
          <div className="card bg-base-300">
            <div className="card-body items-center text-center p-4">
              <BarChart3 className="w-8 h-8 text-secondary mb-2" />
              <h4 className="font-bold text-sm">Progress Tracking</h4>
              <p className="text-xs opacity-70">See improvement over time</p>
            </div>
          </div>
          <div className="card bg-base-300">
            <div className="card-body items-center text-center p-4">
              <Volume2 className="w-8 h-8 text-accent mb-2" />
              <h4 className="font-bold text-sm">Natural Conversations</h4>
              <p className="text-xs opacity-70">AI responds like a real person</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const SuccessStoriesCarousel = () => {
  const stories = [
    {
      name: "Takeshi S.",
      role: "Software Engineer",
      company: "Rakuten",
      image: "👨‍💻",
      beforeScore: 72,
      afterScore: 94,
      timeframe: "3 weeks",
      quote: "My team meetings in English became so much easier. The /r/ and /l/ practice finally clicked after seeing the phoneme breakdowns. Now American colleagues compliment my pronunciation!",
      achievement: "Promoted to international team lead"
    },
    {
      name: "Aiko M.",
      role: "University Student",
      university: "Waseda University",
      image: "👩‍🎓",
      beforeScore: 68,
      afterScore: 89,
      timeframe: "1 month",
      quote: "TOEFL speaking score went from 18 to 24. The practice scenarios were exactly like the real test. Finally got accepted to my dream grad school in the US!",
      achievement: "Accepted to Stanford"
    },
    {
      name: "Hiroshi K.",
      role: "Business Analyst",
      company: "Toyota",
      image: "👔",
      beforeScore: 75,
      afterScore: 91,
      timeframe: "2 weeks",
      quote: "クライアントとの英語プレゼンが怖くなくなりました。Word stress practice helped me sound more confident and professional. Game changer for my career.",
      achievement: "Leading US expansion project"
    }
  ];

  return (
    <div className="py-20 px-4 lg:px-8 bg-base-200">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="badge badge-primary badge-lg mb-4">Success Stories</div>
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Real Results from Japanese Professionals & Students
          </h2>
          <p className="text-lg opacity-70">
            See how SpeakScore transformed their English communication
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {stories.map((story, idx) => (
            <div key={idx} className="card bg-base-100 shadow-xl">
              <div className="card-body">
                {/* Header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="avatar placeholder">
                    <div className="bg-neutral text-neutral-content rounded-full w-16 h-16 text-3xl">
                      {story.image}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{story.name}</h3>
                    <p className="text-sm opacity-70">{story.role}</p>
                    <p className="text-xs opacity-60">{story.company || story.university}</p>
                  </div>
                </div>

                {/* Score Improvement */}
                <div className="card bg-base-200 p-4 mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <div className="text-center flex-1">
                      <div className="text-xs opacity-70 mb-1">Before</div>
                      <div className="text-2xl font-bold text-error">{story.beforeScore}%</div>
                    </div>
                    <ChevronRight className="w-6 h-6 text-primary" />
                    <div className="text-center flex-1">
                      <div className="text-xs opacity-70 mb-1">After</div>
                      <div className="text-2xl font-bold text-success">{story.afterScore}%</div>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="badge badge-primary badge-sm">{story.timeframe}</div>
                  </div>
                </div>

                {/* Quote */}
                <Quote className="w-6 h-6 opacity-20 mb-2" />
                <p className="text-sm italic mb-4">"{story.quote}"</p>

                {/* Achievement */}
                <div className="alert alert-success py-2">
                  <Award className="w-4 h-4" />
                  <span className="text-xs font-semibold">{story.achievement}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-sm opacity-70 mb-4">Average improvement: +22 percentage points in accuracy</p>
          <Link href="/practice" className="btn btn-primary btn-lg">
            Start Your Success Story
          </Link>
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
          Ready to Perfect Your English Pronunciation?
        </h2>
        <p className="text-xl mb-8 opacity-90">
          Join 5,000+ Japanese speakers improving their pronunciation with AI
        </p>

        <div className="card bg-base-100 text-base-content shadow-2xl mb-8">
          <div className="card-body">
            <div className="flex flex-col md:flex-row gap-6 items-center justify-center">
              <div className="flex items-center gap-3">
                <Check className="w-6 h-6 text-success" />
                <span>5 free practice sessions</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-6 h-6 text-success" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-6 h-6 text-success" />
                <span>日本語サポート available</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
          <Link href="/practice" className="btn btn-accent btn-lg gap-2 shadow-xl">
            Start Free Practice Now
            <ChevronRight className="w-5 h-5" />
          </Link>
          <Link href="#pricing" className="btn btn-outline btn-lg text-primary-content border-primary-content hover:bg-primary-content hover:text-primary">
            See Pricing
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mt-8 text-sm">
          <div className="flex items-center justify-center gap-2 opacity-90">
            <Shield className="w-4 h-4" />
            <span>Cancel anytime</span>
          </div>
          <div className="flex items-center justify-center gap-2 opacity-90">
            <Zap className="w-4 h-4" />
            <span>Instant feedback</span>
          </div>
          <div className="flex items-center justify-center gap-2 opacity-90">
            <Award className="w-4 h-4" />
            <span>TOEIC/TOEFL ready</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// NEW: Pronunciation Challenge Interactive Demo
const InteractivePronunciationDemo = () => {
  const [selectedSound, setSelectedSound] = useState(0);
  
  const sounds = [
    {
      phoneme: "/r/ vs /l/",
      japanese: "日本語には区別がない",
      examples: ["right/light", "rock/lock", "pray/play"],
      tip: "Tongue touches roof for /l/, stays down for /r/",
      difficulty: "Very Hard"
    },
    {
      phoneme: "/th/ sounds (θ/ð)",
      japanese: "日本語にない音",
      examples: ["think", "that", "brother"],
      tip: "Tongue between teeth, blow air gently",
      difficulty: "Very Hard"
    },
    {
      phoneme: "Word Stress",
      japanese: "日本語は平坦なアクセント",
      examples: ["REcord vs reCORD", "PREsent vs preSENT"],
      tip: "English has strong stress on ONE syllable",
      difficulty: "Medium"
    }
  ];

  return (
    <div className="py-20 px-4 lg:px-8 bg-base-100">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Try Our Pronunciation Challenge
          </h2>
          <p className="text-lg opacity-70">
            See how SpeakScore detects your specific mistakes
          </p>
        </div>

        <div className="card bg-base-200 shadow-xl">
          <div className="card-body">
            {/* Tabs */}
            <div className="tabs tabs-boxed mb-6">
              {sounds.map((sound, idx) => (
                <a 
                  key={idx}
                  className={`tab ${selectedSound === idx ? 'tab-active' : ''}`}
                  onClick={() => setSelectedSound(idx)}
                >
                  {sound.phoneme}
                </a>
              ))}
            </div>

            {/* Content */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-bold mb-2 flex items-center gap-2">
                    <span>Japanese Context</span>
                    <div className={`badge ${
                      sounds[selectedSound].difficulty === 'Very Hard' ? 'badge-error' : 'badge-warning'
                    }`}>
                      {sounds[selectedSound].difficulty}
                    </div>
                  </h4>
                  <p className="text-sm opacity-70">{sounds[selectedSound].japanese}</p>
                </div>

                <div>
                  <h4 className="font-bold mb-2">Example Words</h4>
                  <div className="flex flex-wrap gap-2">
                    {sounds[selectedSound].examples.map((example, idx) => (
                      <div key={idx} className="badge badge-lg badge-outline">
                        {example}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="alert alert-info">
                  <Volume2 className="w-5 h-5" />
                  <span className="text-sm">{sounds[selectedSound].tip}</span>
                </div>
              </div>

              <div className="card bg-base-300">
                <div className="card-body items-center text-center">
                  <Mic className="w-16 h-16 text-primary mb-4" />
                  <h4 className="font-bold mb-2">Practice This Sound</h4>
                  <p className="text-sm opacity-70 mb-4">
                    Start a free session to get AI feedback on this phoneme
                  </p>
                  <Link href="/practice" className="btn btn-primary btn-sm">
                    Practice Now
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export {
  VideoDemoSection,
  BeforeAfterSection,
  SuccessStoriesCarousel,
  InteractivePronunciationDemo,
  FinalCTASectionWithGuarantee
}