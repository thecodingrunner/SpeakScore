// components/landing/LandingPageSections.tsx
'use client';

import Link from 'next/link';
import {
  Check, Star, Mic, BarChart3, ArrowRight, Sparkles,
  Users, Zap, Award, TrendingUp, ChevronRight, Clock,
  Quote, Shield, Volume2, Target, Brain, Trophy,
  MessageCircle, Play, BookOpen, Flame, Heart
} from 'lucide-react';
import { useAuth, SignInButton } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Mascot, MascotMini, SakuraPetal } from '@/components/global/Mascot';
import { useTranslations } from 'next-intl';
import { usePostHog } from 'posthog-js/react';

/* ═══════════════════════════════════════════════════════════════
   NAVBAR — Warm, friendly, with Koko mini mascot as logo
   ═══════════════════════════════════════════════════════════════ */
const Navbar = () => {
  const { isSignedIn } = useAuth();
  const router = useRouter();
  const t = useTranslations('landing');
  const posthog = usePostHog();

  return (
    <div className="navbar bg-base-100/90 backdrop-blur-xl border-b border-primary/10 px-4 lg:px-8 sticky top-0 z-40">
      <div className="navbar-start">
        <Link href="/" className="flex items-center gap-2.5 group">
          <MascotMini size={36} className="group-hover:animate-bounce-gentle transition-transform" />
          <span className="text-xl font-extrabold text-base-content">
            Speak<span className="text-primary">Score</span>
          </span>
        </Link>
      </div>
      <div className="navbar-end gap-2">
        <Link
          href="#pricing"
          className="btn btn-ghost btn-sm text-base-content/70 hover:text-primary"
          onClick={() => posthog?.capture('pricing_link_clicked', { location: 'navbar' })}
        >
          {t('nav.pricing')}
        </Link>
        {isSignedIn ? (
          <Link
            href="/practice"
            className="btn btn-primary btn-sm shadow-md shadow-primary/20"
            onClick={() => posthog?.capture('cta_clicked', { location: 'navbar' })}
          >
            {t('nav.startPracticing')}
          </Link>
        ) : (
          <SignInButton mode="modal">
            <button
              className="btn btn-primary btn-sm shadow-md shadow-primary/20"
              onClick={() => posthog?.capture('cta_clicked', { location: 'navbar' })}
            >
              {t('nav.startPracticing')}
            </button>
          </SignInButton>
        )}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   HERO — Warm, inviting, mascot-centered first impression
   Sakura petals, dot pattern background, no cold canvas anim
   ═══════════════════════════════════════════════════════════════ */
const HeroSection = () => {
  const t = useTranslations('landing');
  const posthog = usePostHog();
  return (
    <div className="relative min-h-[88vh] overflow-hidden flex items-center justify-center bg-sakura-gradient">
      {/* Dot pattern overlay */}
      <div className="absolute inset-0 bg-dots-pattern opacity-40 pointer-events-none" />

      {/* Floating sakura petals */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[14, 18, 22, 16, 20, 12].map((size, i) => (
          <SakuraPetal
            key={i}
            size={size}
            className="absolute opacity-30"
          />
        ))}
        <div className="absolute top-[10%] left-[8%] animate-float opacity-20">
          <SakuraPetal size={18} />
        </div>
        <div className="absolute top-[20%] right-[12%] animate-float-slow opacity-25" style={{ animationDelay: '1s' }}>
          <SakuraPetal size={14} />
        </div>
        <div className="absolute bottom-[30%] left-[15%] animate-float opacity-15" style={{ animationDelay: '2s' }}>
          <SakuraPetal size={20} />
        </div>
        <div className="absolute top-[60%] right-[20%] animate-float-slow opacity-20" style={{ animationDelay: '0.5s' }}>
          <SakuraPetal size={16} />
        </div>
        <div className="absolute bottom-[15%] right-[8%] animate-float opacity-25" style={{ animationDelay: '3s' }}>
          <SakuraPetal size={12} />
        </div>
      </div>

      {/* Soft decorative blobs */}
      <div className="absolute top-20 -left-20 w-80 h-80 bg-primary/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-secondary/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-60 h-60 bg-accent/6 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 text-center max-w-4xl px-4 py-16 mx-auto">
        {/* Mascot hero */}
        <div className="mb-6 flex justify-center">
          <div className="relative">
            <Mascot size={140} expression="waving" className="animate-float drop-shadow-lg" />
            {/* Speech bubble */}
            <div className="absolute -top-2 -right-14 sm:-right-16 bg-base-100 rounded-2xl rounded-bl-sm px-3 sm:px-4 py-2 shadow-lg border border-primary/15 animate-bounce-gentle whitespace-nowrap" style={{ animationDelay: '0.5s' }}>
              <span className="text-sm font-bold text-primary">{t('hero.speechBubble')}</span>
            </div>
          </div>
        </div>

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full mb-6">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm font-semibold text-primary">{t('hero.badge')}</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-5 leading-[1.1] text-base-content">
          {t('hero.titleStart')}{' '}
          <span className="text-primary relative">
            {t('hero.titleHighlight')}
            <svg className="absolute -bottom-2 left-0 w-full h-3" viewBox="0 0 200 12" fill="none" preserveAspectRatio="none">
              <path d="M2 8 Q50 2 100 7 Q150 12 198 4" stroke="oklch(var(--p) / 0.4)" strokeWidth="3" strokeLinecap="round" fill="none" />
            </svg>
          </span>
          <br />
          <span className="text-base-content/80 text-3xl sm:text-4xl lg:text-5xl">{t('hero.titleEnd')}</span>
        </h1>

        <p className="text-base sm:text-lg lg:text-xl mb-8 text-base-content/60 max-w-2xl mx-auto leading-relaxed">
          {t('hero.subtitle')}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
          <Link
            href="/practice"
            className="btn btn-primary btn-lg gap-2 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all"
            onClick={() => posthog?.capture('cta_clicked', { location: 'hero' })}
          >
            {t('hero.cta1')}
            <ArrowRight className="w-5 h-5" />
          </Link>
          <button
            className="btn btn-ghost btn-lg border-2 border-base-content/10 hover:border-primary/30 gap-2"
            onClick={() => posthog?.capture('demo_clicked', { location: 'hero' })}
          >
            <Play className="w-4 h-4" />
            {t('hero.watchDemo')}
          </button>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-5 text-sm text-base-content/50">
          {[
            t('hero.check1'),
            t('hero.check2'),
            t('hero.check3'),
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-success/15 flex items-center justify-center">
                <Check className="w-3 h-3 text-success" />
              </div>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   SOCIAL PROOF BAR — Quick trust strip below hero
   ═══════════════════════════════════════════════════════════════ */
const SocialProofBar = () => {
  const t = useTranslations('landing');
  return (
    <div className="bg-base-200/80 border-y border-base-content/5 py-5 px-4">
      <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-center gap-4 lg:gap-8 text-sm text-base-content/50">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-primary" />
          <span><strong className="text-base-content">5,000+</strong> {t('social.learners')}</span>
        </div>
        <div className="flex items-center gap-1.5">
          {[1,2,3,4,5].map(i => <Star key={i} className="w-3.5 h-3.5 fill-warning text-warning" />)}
          <span className="ml-1"><strong className="text-base-content">4.8</strong> {t('social.rating')}</span>
        </div>
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-success" />
          <span><strong className="text-base-content">+35%</strong> {t('social.accuracyGain')}</span>
        </div>
        <div className="flex items-center gap-2">
          <Flame className="w-4 h-4 text-accent" />
          <span><strong className="text-base-content">50k+</strong> {t('social.sessionsCompleted')}</span>
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   FEATURES — Clean card grid with warm colors
   ═══════════════════════════════════════════════════════════════ */
const FeaturesGridSection = () => {
  const t = useTranslations('landing');
  const features = [
    { icon: <Mic className="w-6 h-6" />, title: t('features.f1title'), description: t('features.f1desc'), color: 'primary' },
    { icon: <MessageCircle className="w-6 h-6" />, title: t('features.f2title'), description: t('features.f2desc'), color: 'secondary' },
    { icon: <BarChart3 className="w-6 h-6" />, title: t('features.f3title'), description: t('features.f3desc'), color: 'accent' },
    { icon: <Target className="w-6 h-6" />, title: t('features.f4title'), description: t('features.f4desc'), color: 'info' },
  ];

  return (
    <div className="py-20 px-4 lg:px-8 bg-base-100">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <div className="flex justify-center mb-4">
            <Mascot size={72} expression="excited" className="drop-shadow-sm" />
          </div>
          <h2 className="text-3xl lg:text-4xl font-extrabold mb-3 text-base-content">
            {t('features.titleStart')}{' '}
            <span className="text-primary">{t('features.titleHighlight')}</span>
          </h2>
          <p className="text-base text-base-content/55 max-w-xl mx-auto">
            {t('features.subtitle')}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f, idx) => (
            <div
              key={idx}
              className="group card bg-base-100 border border-base-content/8 card-glow hover:border-primary/20 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="card-body items-center text-center p-6">
                <div className={`p-3.5 bg-${f.color}/10 border border-${f.color}/15 rounded-2xl text-${f.color} mb-3 group-hover:scale-110 transition-transform duration-300`}>
                  {f.icon}
                </div>
                <h3 className="font-bold text-base mb-1.5">{f.title}</h3>
                <p className="text-sm text-base-content/55 leading-relaxed">{f.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   PRONUNCIATION CHALLENGES — Visual, interactive-feeling
   ═══════════════════════════════════════════════════════════════ */
const PronounciationChallengesSection = () => {
  const t = useTranslations('landing');
  const challenges = [
    { sound: t('challenges.c1sound'), example: t('challenges.c1example'), difficulty: t('challenges.c1difficulty'), color: 'error', emoji: '😤' },
    { sound: t('challenges.c2sound'), example: t('challenges.c2example'), difficulty: t('challenges.c2difficulty'), color: 'error', emoji: '😬' },
    { sound: t('challenges.c3sound'), example: t('challenges.c3example'), difficulty: t('challenges.c3difficulty'), color: 'warning', emoji: '🤔' },
    { sound: t('challenges.c4sound'), example: t('challenges.c4example'), difficulty: t('challenges.c4difficulty'), color: 'warning', emoji: '😅' },
    { sound: t('challenges.c5sound'), example: t('challenges.c5example'), difficulty: t('challenges.c5difficulty'), color: 'info', emoji: '💡' },
    { sound: t('challenges.c6sound'), example: t('challenges.c6example'), difficulty: t('challenges.c6difficulty'), color: 'info', emoji: '🎯' },
  ];

  return (
    <div className="py-20 px-4 lg:px-8 bg-base-200/50 bg-dots-pattern">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <div className="flex justify-center mb-4">
            <Mascot size={72} expression="thinking" className="drop-shadow-sm" />
          </div>
          <h2 className="text-3xl lg:text-4xl font-extrabold mb-3 text-base-content">
            {t('challenges.titleStart')} <span className="text-primary">{t('challenges.titleHighlight')}</span> {t('challenges.titleEnd')}
          </h2>
          <p className="text-base text-base-content/55 max-w-lg mx-auto">
            {t('challenges.subtitle')}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {challenges.map((c, idx) => (
            <div
              key={idx}
              className="card bg-base-100 border border-base-content/8 card-glow hover:border-primary/20 transition-all duration-300 hover:-translate-y-0.5"
            >
              <div className="card-body p-5">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{c.emoji}</span>
                    <h3 className="font-bold text-base">{c.sound}</h3>
                  </div>
                  <div className={`badge badge-${c.color} badge-sm font-semibold`}>
                    {c.difficulty}
                  </div>
                </div>
                <p className="text-sm text-base-content/55">
                  <span className="font-mono text-xs bg-base-200 px-2 py-0.5 rounded-lg">{c.example}</span>
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="card bg-success/8 border border-success/20">
          <div className="card-body flex-row items-center gap-4 p-5">
            <div className="w-10 h-10 rounded-full bg-success/15 flex items-center justify-center flex-shrink-0">
              <Volume2 className="w-5 h-5 text-success" />
            </div>
            <div>
              <h4 className="font-bold text-base-content text-sm">{t('challenges.detectTitle')}</h4>
              <p className="text-xs text-base-content/55">{t('challenges.detectSubtitle')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   HOW IT WORKS — Friendly step-by-step with mascot
   ═══════════════════════════════════════════════════════════════ */
const HowItWorksSection = () => {
  const t = useTranslations('landing');
  const posthog = usePostHog();
  const steps = [
    { num: 1, title: t('howItWorks.s1title'), desc: t('howItWorks.s1desc'), icon: <BookOpen className="w-6 h-6" />, time: t('howItWorks.s1time') },
    { num: 2, title: t('howItWorks.s2title'), desc: t('howItWorks.s2desc'), icon: <Mic className="w-6 h-6" />, time: t('howItWorks.s2time') },
    { num: 3, title: t('howItWorks.s3title'), desc: t('howItWorks.s3desc'), icon: <BarChart3 className="w-6 h-6" />, time: t('howItWorks.s3time') },
    { num: 4, title: t('howItWorks.s4title'), desc: t('howItWorks.s4desc'), icon: <TrendingUp className="w-6 h-6" />, time: t('howItWorks.s4time') },
  ];

  return (
    <div className="py-20 px-4 lg:px-8 bg-base-100">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl lg:text-4xl font-extrabold mb-3 text-base-content">
            {t('howItWorks.title')}
          </h2>
          <p className="text-base text-base-content/55">
            {t('howItWorks.subtitle')}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {steps.map((s, idx) => (
            <div key={idx} className="relative group">
              {/* Connecting line between cards */}
              {idx < steps.length - 1 && (
                <div className="hidden lg:block absolute top-14 left-[calc(50%+2rem)] w-[calc(100%-4rem)] h-px bg-gradient-to-r from-primary/20 to-primary/5 z-0" />
              )}

              <div className="card bg-base-100 border border-base-content/8 card-glow hover:border-primary/20 transition-all duration-300 relative z-10">
                <div className="card-body items-center text-center p-5">
                  {/* Step number bubble */}
                  <div className="relative mb-3">
                    <div className="w-14 h-14 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center">
                      <span className="text-2xl font-extrabold text-primary">{s.num}</span>
                    </div>
                  </div>

                  <div className="text-primary mb-2">{s.icon}</div>
                  <h3 className="font-bold text-sm mb-1">{s.title}</h3>
                  <p className="text-xs text-base-content/55 mb-3 leading-relaxed">{s.desc}</p>

                  <div className="badge badge-ghost badge-sm gap-1.5 text-base-content/50">
                    <Clock className="w-3 h-3" />
                    {s.time}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/practice"
            className="btn btn-primary btn-md gap-2 shadow-md shadow-primary/20"
            onClick={() => posthog?.capture('cta_clicked', { location: 'how_it_works' })}
          >
            {t('howItWorks.cta')}
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   BEFORE / AFTER — Visual progress showcase
   ═══════════════════════════════════════════════════════════════ */
const BeforeAfterSection = () => {
  const t = useTranslations('landing');
  const before = [
    { phoneme: '/r/ vs /l/', error: '"light" → "right"', status: t('beforeAfter.confused') },
    { phoneme: '/th/ sounds', error: '"think" → "sink"', status: t('beforeAfter.missing') },
    { phoneme: 'Word stress', error: '"REcord" → "reCORD"', status: t('beforeAfter.wrong') },
  ];
  const after = [
    { phoneme: '/r/ vs /l/', result: '✓ Correctly distinguished', status: t('beforeAfter.fixed') },
    { phoneme: '/th/ sounds', result: '✓ Clear θ and ð sounds', status: t('beforeAfter.mastered') },
    { phoneme: 'Word stress', result: '✓ Natural stress patterns', status: t('beforeAfter.improved') },
  ];

  return (
    <div className="py-20 px-4 lg:px-8 bg-base-200/50">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl lg:text-4xl font-extrabold mb-3 text-base-content">
            {t('beforeAfter.titleStart')} <span className="text-primary">{t('beforeAfter.titleHighlight')}</span>
          </h2>
          <p className="text-base text-base-content/55">{t('beforeAfter.subtitle')}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Before */}
          <div className="card bg-base-100 border border-error/15 card-glow">
            <div className="card-body p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="badge badge-error gap-1.5 font-semibold">{t('beforeAfter.before')}</div>
                <span className="text-3xl font-extrabold text-error">62%</span>
              </div>
              <progress className="progress progress-error w-full mb-4 h-2.5" value={62} max={100} />
              <div className="space-y-2.5">
                {before.map((b, i) => (
                  <div key={i} className="flex items-center justify-between bg-error/5 rounded-xl px-4 py-2.5 border border-error/10">
                    <div>
                      <span className="font-semibold text-sm">{b.phoneme}</span>
                      <span className="text-xs text-base-content/50 ml-2">{b.error}</span>
                    </div>
                    <span className="badge badge-error badge-sm badge-outline">{b.status}</span>
                  </div>
                ))}
              </div>
              <div className="text-center mt-4 text-sm text-base-content/50">{t('beforeAfter.toeicBefore')}</div>
            </div>
          </div>

          {/* After */}
          <div className="card bg-base-100 border-2 border-success/30 card-glow relative overflow-hidden">
            <div className="absolute top-3 right-3">
              <Mascot size={48} expression="cheering" className="opacity-30" />
            </div>
            <div className="card-body p-6 relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="badge badge-success gap-1.5 font-semibold">{t('beforeAfter.afterLabel')}</div>
                <span className="text-3xl font-extrabold text-success">91%</span>
              </div>
              <progress className="progress progress-success w-full mb-4 h-2.5" value={91} max={100} />
              <div className="space-y-2.5">
                {after.map((a, i) => (
                  <div key={i} className="flex items-center justify-between bg-success/5 rounded-xl px-4 py-2.5 border border-success/10">
                    <div>
                      <span className="font-semibold text-sm">{a.phoneme}</span>
                      <span className="text-xs text-base-content/50 ml-2">{a.result}</span>
                    </div>
                    <span className="badge badge-success badge-sm">{a.status}</span>
                  </div>
                ))}
              </div>
              <div className="text-center mt-4">
                <div className="text-sm text-base-content/50">{t('beforeAfter.toeicAfter')}</div>
                <div className="badge badge-success badge-outline mt-1 font-semibold">{t('beforeAfter.improvement')}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   BENEFITS CHECKLIST — Clean, warm grid
   ═══════════════════════════════════════════════════════════════ */
const BenefitsChecklistSection = () => {
  const t = useTranslations('landing');
  const benefits = [
    t('benefits.b1'), t('benefits.b2'), t('benefits.b3'),
    t('benefits.b4'), t('benefits.b5'), t('benefits.b6'),
    t('benefits.b7'), t('benefits.b8'), t('benefits.b9'),
    t('benefits.b10'), t('benefits.b11'), t('benefits.b12'),
  ];

  return (
    <div className="py-20 px-4 lg:px-8 bg-base-100">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl lg:text-4xl font-extrabold mb-3 text-base-content">
            {t('benefits.titleStart')}{' '}
            <span className="text-primary">{t('benefits.titleHighlight')}</span>
          </h2>
          <p className="text-base text-base-content/55">
            {t('benefits.subtitle')}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-12">
          {benefits.map((b, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 px-4 py-3.5 bg-base-100 border border-base-content/6 rounded-2xl hover:border-primary/20 hover:bg-primary/3 transition-all duration-200"
            >
              <div className="w-5 h-5 rounded-full bg-success/15 flex items-center justify-center flex-shrink-0">
                <Check className="w-3 h-3 text-success" />
              </div>
              <span className="text-sm font-medium text-base-content/75">{b}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   COMPARISON TABLE — Warm, less sterile
   ═══════════════════════════════════════════════════════════════ */
const ComparisonSection = () => {
  const t = useTranslations('landing');
  const competitors = [
    { name: 'Eikaiwa Schools', price: '¥10,000–20,000', pronunciation: 'Generic', tracking: 'Manual', availability: 'Fixed schedule' },
    { name: 'Online Tutors', price: '¥3,000–12,000', pronunciation: 'Teacher-dependent', tracking: 'None', availability: 'Booking required' },
    { name: 'ChatGPT', price: '~¥3,000', pronunciation: 'No pronunciation', tracking: 'No memory', availability: '24/7' },
    { name: 'Duolingo', price: '¥1,200', pronunciation: 'Basic only', tracking: 'Simple streaks', availability: '24/7' },
  ];

  return (
    <div className="py-20 px-4 lg:px-8 bg-base-200/50">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl lg:text-4xl font-extrabold mb-3 text-base-content">
            {t('comparison.titleStart')} <span className="text-primary">{t('comparison.titleHighlight')}</span>{t('comparison.titleEnd')}
          </h2>
          <p className="text-base text-base-content/55">
            {t('comparison.subtitle')}
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="table table-zebra bg-base-100 rounded-2xl overflow-hidden border border-base-content/6">
            <thead>
              <tr className="text-xs uppercase text-base-content/50 bg-base-200/80">
                <th>{t('comparison.colMethod')}</th>
                <th>{t('comparison.colPrice')}</th>
                <th>{t('comparison.colPronunciation')}</th>
                <th>{t('comparison.colTracking')}</th>
                <th>{t('comparison.colAvailability')}</th>
              </tr>
            </thead>
            <tbody>
              {competitors.map((c, i) => (
                <tr key={i} className="text-sm">
                  <td className="font-semibold">{c.name}</td>
                  <td>{c.price}</td>
                  <td><span className="badge badge-ghost badge-sm">{c.pronunciation}</span></td>
                  <td><span className="badge badge-ghost badge-sm">{c.tracking}</span></td>
                  <td><span className={`badge badge-sm ${c.availability === '24/7' ? 'badge-success' : 'badge-ghost'}`}>{c.availability}</span></td>
                </tr>
              ))}
              {/* SpeakScore row — highlighted */}
              <tr className="bg-primary/5 border-t-2 border-primary/20 text-sm">
                <td className="font-extrabold">
                  <span className="flex items-center gap-2">
                    <MascotMini size={20} />
                    SpeakScore
                  </span>
                </td>
                <td className="font-bold text-success">£20 (~¥3,800)</td>
                <td><span className="badge badge-success badge-sm font-semibold">Japanese-specific</span></td>
                <td><span className="badge badge-success badge-sm font-semibold">Full analytics</span></td>
                <td><span className="badge badge-success badge-sm font-semibold">24/7</span></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="card bg-primary/5 border border-primary/15 mt-6">
          <div className="card-body flex-row items-center gap-3 p-4">
            <Sparkles className="w-5 h-5 text-primary flex-shrink-0" />
            <span className="text-sm text-base-content/70">{t('comparison.footer')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   TESTIMONIALS — Warm cards, personal feel
   ═══════════════════════════════════════════════════════════════ */
const TestimonialsSection = () => {
  const t = useTranslations('landing');
  const testimonials = [
    { name: 'Yuki T.', age: 28, location: 'Tokyo', rating: 5, emoji: '👩‍💼', quote: t('testimonials.t1quote'), result: t('testimonials.t1result') },
    { name: 'Kenji M.', age: 32, location: 'Osaka', rating: 5, emoji: '👨‍💻', quote: t('testimonials.t2quote'), result: t('testimonials.t2result') },
    { name: 'Sakura I.', age: 24, location: 'Yokohama', rating: 5, emoji: '👩‍🎓', quote: t('testimonials.t3quote'), result: t('testimonials.t3result') },
  ];

  return (
    <div className="py-20 px-4 lg:px-8 bg-base-100">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-success/8 border border-success/15 rounded-full mb-4">
            <Heart className="w-4 h-4 text-success" />
            <span className="text-sm font-semibold text-success">{t('testimonials.lovedBadge')}</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-extrabold mb-3 text-base-content">
            {t('testimonials.titleStart')} <span className="text-primary">{t('testimonials.titleHighlight')}</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="card bg-base-100 border border-base-content/8 card-glow hover:border-primary/20 transition-all duration-300"
            >
              <div className="card-body p-6">
                {/* Avatar + name */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/15 flex items-center justify-center text-xl">
                    {t.emoji}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-sm">{t.name}</h3>
                      <div className="badge badge-success badge-xs"><Check className="w-2.5 h-2.5" /></div>
                    </div>
                    <p className="text-xs text-base-content/45">{t.age}, {t.location}</p>
                  </div>
                </div>

                {/* Stars */}
                <div className="flex gap-0.5 mb-3">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-warning text-warning" />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-sm text-base-content/65 italic leading-relaxed mb-4">"{t.quote}"</p>

                {/* Result badge */}
                <div className="badge badge-primary badge-outline gap-1.5 text-xs font-semibold">
                  <Trophy className="w-3 h-3" />
                  {t.result}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   FAQ — Clean accordion
   ═══════════════════════════════════════════════════════════════ */
const FaqSection = () => {
  const t = useTranslations('landing');
  const posthog = usePostHog();
  const faqs = [
    { q: t('faq.q1'), a: t('faq.a1') },
    { q: t('faq.q2'), a: t('faq.a2') },
    { q: t('faq.q3'), a: t('faq.a3') },
    { q: t('faq.q4'), a: t('faq.a4') },
    { q: t('faq.q5'), a: t('faq.a5') },
  ];

  return (
    <div className="py-20 px-4 lg:px-8 bg-base-100">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-14">
          <div className="flex justify-center mb-4">
            <Mascot size={64} expression="thinking" className="drop-shadow-sm" />
          </div>
          <h2 className="text-3xl lg:text-4xl font-extrabold mb-3 text-base-content">
            {t('faq.title')}
          </h2>
          <p className="text-base text-base-content/55">
            {t('faq.subtitle')}
          </p>
        </div>

        <div className="space-y-2.5">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="collapse collapse-arrow bg-base-100 border border-base-content/8 rounded-2xl hover:border-primary/15 transition-colors"
            >
              <input
                type="radio"
                name="faq-accordion"
                defaultChecked={idx === 0}
                onChange={() => posthog?.capture('faq_opened', { question: faq.q })}
              />
              <div className="collapse-title font-bold text-sm pr-10">
                {faq.q}
              </div>
              <div className="collapse-content">
                <p className="text-sm text-base-content/60 leading-relaxed pt-0">{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   TRUST BADGES — Why us strip
   ═══════════════════════════════════════════════════════════════ */
const TrustBadgesSection = () => {
  const t = useTranslations('landing');
  const badges = [
    { icon: Target, title: t('trust.b1title'), subtitle: t('trust.b1subtitle'), color: 'primary' },
    { icon: Brain, title: t('trust.b2title'), subtitle: t('trust.b2subtitle'), color: 'secondary' },
    { icon: Trophy, title: t('trust.b3title'), subtitle: t('trust.b3subtitle'), color: 'accent' },
    { icon: Shield, title: t('trust.b4title'), subtitle: t('trust.b4subtitle'), color: 'info' },
  ];

  return (
    <div className="py-16 px-4 lg:px-8 bg-sakura-gradient">
      <div className="max-w-5xl mx-auto">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {badges.map((b, idx) => (
            <div key={idx} className="card bg-base-100/80 backdrop-blur-sm border border-base-content/6 card-glow">
              <div className="card-body items-center text-center p-5">
                <div className={`w-12 h-12 rounded-full bg-${b.color}/10 flex items-center justify-center mb-2`}>
                  <b.icon className={`w-6 h-6 text-${b.color}`} />
                </div>
                <h4 className="font-bold text-sm">{b.title}</h4>
                <p className="text-xs text-base-content/50">{b.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   FINAL CTA — Warm, encouraging closing
   ═══════════════════════════════════════════════════════════════ */
const FinalCTASection = () => {
  const t = useTranslations('landing');
  const posthog = usePostHog();
  return (
    <div className="relative py-20 px-4 lg:px-8 overflow-hidden bg-sakura-gradient">
      <div className="absolute inset-0 bg-dots-pattern opacity-30 pointer-events-none" />

      {/* Blobs */}
      <div className="absolute top-0 left-1/4 w-80 h-80 bg-primary/6 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-secondary/6 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-3xl mx-auto text-center">
        <div className="flex justify-center mb-6">
          <Mascot size={100} expression="cheering" className="drop-shadow-lg animate-bounce-gentle" />
        </div>

        <h2 className="text-3xl lg:text-5xl font-extrabold mb-4 text-base-content">
          {t('finalCta.titleStart')}{' '}
          <span className="text-primary">{t('finalCta.titleHighlight')}</span>
        </h2>

        <p className="text-base lg:text-lg mb-8 text-base-content/55 max-w-xl mx-auto">
          {t('finalCta.subtitle')}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
          <Link
            href="/practice"
            className="btn btn-primary btn-lg gap-2 shadow-lg shadow-primary/25"
            onClick={() => posthog?.capture('cta_clicked', { location: 'final_cta' })}
          >
            {t('finalCta.cta1')}
            <ArrowRight className="w-5 h-5" />
          </Link>
          <button
            className="btn btn-ghost btn-lg border-2 border-base-content/10 hover:border-primary/30 gap-2"
            onClick={() => posthog?.capture('demo_clicked', { location: 'final_cta' })}
          >
            <Play className="w-4 h-4" />
            {t('finalCta.watchDemo')}
          </button>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-5 text-sm text-base-content/50">
          {[t('finalCta.check1'), t('finalCta.check2'), t('finalCta.check3')].map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-success/15 flex items-center justify-center">
                <Check className="w-3 h-3 text-success" />
              </div>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   PRICING SECTION — re-exported from StripePricingSection
   (Keeping the import pattern your page.tsx expects)
   ═══════════════════════════════════════════════════════════════ */
const PricingSection = () => null; // Placeholder — actual pricing comes from StripePricingSection

export {
  Navbar,
  HeroSection,
  SocialProofBar,
  FeaturesGridSection,
  BenefitsChecklistSection,
  HowItWorksSection,
  ComparisonSection,
  TestimonialsSection,
  PricingSection,
  FaqSection,
  TrustBadgesSection,
  PronounciationChallengesSection,
  BeforeAfterSection,
  FinalCTASection,
};