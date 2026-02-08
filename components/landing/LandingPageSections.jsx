// app/components/LandingPage.tsx
'use client';

import Link from 'next/link';
import { Check, Star, Mic, BarChart3, ArrowRight, Sparkles, Moon, Sun, Users, Zap, Award, TrendingUp, ChevronRight, Clock, Quote, Shield, Volume2, Target, Brain, Trophy, MessageCircle } from 'lucide-react';
import { useAuth, SignInButton } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react';

const Navbar = () => {
  const { isSignedIn } = useAuth()
  const router = useRouter()

  const handleStartPracticing = () => {
    if (isSignedIn) {
      router.push('/practice')
    }
    // If not signed in, the SignInButton will handle it
  }

  return (
    <div className="navbar bg-base-100/80 backdrop-blur-lg border-b border-base-300 px-4 lg:px-8 sticky top-0 z-40">
      <div className="navbar-start">
        <Link href="/" className="text-xl font-bold flex items-center gap-2">
          <div className="p-2 bg-gradient-to-br from-primary to-secondary rounded-lg">
            <Mic className="w-5 h-5 text-neutral-content" />
          </div>
          <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            SpeakScore
          </span>
        </Link>
      </div>
      <div className="navbar-end gap-2">
        <Link href="#pricing" className="btn btn-ghost btn-sm">
          Pricing
        </Link>
        {isSignedIn ? (
          <Link href="/practice" className="btn btn-primary btn-sm text-neutral-content">
            Start Practicing
          </Link>
        ) : (
          <SignInButton mode="modal">
            <button className="btn btn-primary btn-sm text-neutral-content">
              Start Practicing
            </button>
          </SignInButton>
        )}
      </div>
    </div>
  )
}

const HeroSection = () => {
  const canvasRef = useRef(null)

  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    const updateTheme = () => {
      setIsDarkMode(
        document.documentElement.getAttribute('data-theme') === 'dark'
      )
    }
  
    updateTheme()
  
    const observer = new MutationObserver(updateTheme)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    })
  
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    let animationFrameId
    let bars = []

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio
      canvas.height = canvas.offsetHeight * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
      
      // Reinitialize bars on resize
      initBars()
    }

    // Initialize bars
    const initBars = () => {
      const barCount = Math.floor(canvas.offsetWidth / 20) // Bar every 8px
      bars = []
      
      for (let i = 0; i < barCount; i++) {
        bars.push({
          x: i * 20,
          height: Math.random() * 500 + 50,
          targetHeight: Math.random() * 500 + 50,
          speed: Math.random() * 0.1 + 0.05,
          phase: Math.random() * Math.PI * 2
        })
      }
    }

    // Get theme colors
    const getThemeColors = () => {
      // const style = getComputedStyle(document.documentElement)
      // const primary = style.getPropertyValue('--p').trim()
      // const secondary = style.getPropertyValue('--s').trim()
      // const accent = style.getPropertyValue('--a').trim()
      
      return {
        primary: isDarkMode ? "#1C4E80" : "#FF6266",
        secondary:  isDarkMode ? "#1C4E80" : "#FF6266",
        accent:  isDarkMode ? "#1C4E80" : "#FF6266"
      }
    }

    // Animation loop
    const animate = () => {
      const colors = getThemeColors()
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight)

      const centerY = canvas.offsetHeight / 2

      bars.forEach((bar, index) => {
        // Smooth transition to target height
        const diff = bar.targetHeight - bar.height
        bar.height += diff * bar.speed

        // Change target occasionally
        if (Math.abs(diff) < 1) {
          bar.targetHeight = Math.random() * 500 + 50
        }

        // Add wave effect
        const wave = Math.sin(Date.now() * 0.002 + bar.phase) * 20

        // Color gradient based on position
        const colorIndex = (index / bars.length)
        let color
        if (colorIndex < 0.33) {
          color = colors.primary
        } else if (colorIndex < 0.66) {
          color = colors.secondary
        } else {
          color = colors.accent
        }

        // Draw bar with gradient
        const gradient = ctx.createLinearGradient(
          bar.x, 
          centerY - (bar.height + wave) / 2, 
          bar.x, 
          centerY + (bar.height + wave) / 2
        )
        
        gradient.addColorStop(0, color.replace(')', ', 0.2)').replace('hsl', 'hsla'))
        gradient.addColorStop(0.5, color.replace(')', ', 1)').replace('hsl', 'hsla'))
        gradient.addColorStop(1, color.replace(')', ', 0.2)').replace('hsl', 'hsla'))

        ctx.fillStyle = gradient
        ctx.fillRect(
          bar.x,
          centerY - (bar.height + wave) / 2,
          12,
          bar.height + wave
        )

        // Add glow effect
        ctx.shadowBlur = 15
        ctx.shadowColor = color
        ctx.fillRect(
          bar.x,
          centerY - (bar.height + wave) / 2,
          16,
          bar.height + wave
        )
        ctx.shadowBlur = 0
      })

      animationFrameId = requestAnimationFrame(animate)
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)
    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      cancelAnimationFrame(animationFrameId)
    }
  }, [isDarkMode])

  return (
    <div className="relative min-h-[85vh] bg-base-100 overflow-hidden flex items-center justify-center">
      {/* Canvas Audio Visualization */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full opacity-20 pointer-events-none"
      />

      {/* Very subtle decorative elements */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative text-center max-w-5xl px-4 py-20 mx-auto z-10">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">AI-Powered English Pronunciation Coach</span>
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
            <span className="text-primary">
              Perfect Your English Pronunciation with AI
            </span>
          </h1>
          
          <p className="text-lg lg:text-xl mb-8 text-base-content/70 max-w-2xl mx-auto">
            The only pronunciation coach designed for Japanese speakers. Get phoneme-level 
            feedback on /r/ vs /l/, /th/ sounds, and word stress—AI that actually understands 
            your Japanese→English challenges.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link href="/practice" className="btn btn-primary btn-lg gap-2 shadow-lg shadow-primary/30">
              Try Free Practice Session
              <ArrowRight className="w-5 h-5" />
            </Link>
            <button className="btn btn-outline btn-lg">
              Watch Demo
            </button>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-base-content/60">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-success/20 flex items-center justify-center">
                <Check className="w-3 h-3 text-success" />
              </div>
              <span>5 free sessions</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-success/20 flex items-center justify-center">
                <Check className="w-3 h-3 text-success" />
              </div>
              <span>No credit card</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-success/20 flex items-center justify-center">
                <Check className="w-3 h-3 text-success" />
              </div>
              <span>日本語サポート</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// const HeroSection = () => {
//   const canvasRef = useRef(null)

//   useEffect(() => {
//     const canvas = canvasRef.current
//     if (!canvas) return

//     const ctx = canvas.getContext('2d')
//     let animationFrameId
//     let time = 0

//     // Set canvas size
//     const resizeCanvas = () => {
//       const rect = canvas.getBoundingClientRect()
//       canvas.width = rect.width
//       canvas.height = rect.height
//     }

//     // Get theme colors
//     const getThemeColors = () => {
//       const style = getComputedStyle(document.documentElement)
//       // const primary = style.getPropertyValue('--p').trim()
//       // const secondary = style.getPropertyValue('--s').trim()
//       // const accent = style.getPropertyValue('--a').trim()
      
//       // Fallback colors if CSS variables aren't available
//       return {
//         primary: 'hsl(262, 80%, 50%)',
//         secondary: 'hsl(180, 80%, 50%)',
//         accent: 'hsl(330, 80%, 50%)'
//       }
//     }

//     // Draw a flowing wave
//     const drawWave = (offset, amplitude, frequency, speed, color, lineWidth, opacity) => {
//       const centerY = canvas.height / 2
      
//       ctx.beginPath()
//       ctx.strokeStyle = color.replace(')', `, ${opacity})`).replace('hsl', 'hsla')
//       ctx.lineWidth = lineWidth
//       ctx.lineCap = 'round'
//       ctx.lineJoin = 'round'
//       ctx.shadowBlur = 20
//       ctx.shadowColor = color.replace(')', `, ${opacity * 0.6})`).replace('hsl', 'hsla')

//       for (let x = 0; x <= canvas.width; x += 3) {
//         const y = centerY + 
//           Math.sin((x * frequency + time * speed + offset)) * amplitude +
//           Math.sin((x * frequency * 2 + time * speed * 1.5 + offset)) * (amplitude * 0.5) +
//           Math.sin((x * frequency * 0.5 + time * speed * 0.8 + offset * 2)) * (amplitude * 0.3)
        
//         if (x === 0) {
//           ctx.moveTo(x, y)
//         } else {
//           ctx.lineTo(x, y)
//         }
//       }

//       ctx.stroke()
//       ctx.shadowBlur = 0
//     }

//     // Animation loop
//     const animate = () => {
//       if (!canvas.width || !canvas.height) return
      
//       ctx.clearRect(0, 0, canvas.width, canvas.height)
//       const colors = getThemeColors()

//       // Multiple layers of waves with different parameters
//       // Primary color waves
//       drawWave(0, 40, 0.01, 2, colors.primary, 3, 0.5)
//       drawWave(1, 35, 0.012, 2.2, colors.primary, 2.5, 0.4)
//       drawWave(2, 30, 0.008, 1.8, colors.primary, 2, 0.3)
      
//       // Secondary color waves
//       drawWave(3, 45, 0.009, 2.5, colors.secondary, 3.5, 0.55)
//       drawWave(4, 38, 0.011, 2.3, colors.secondary, 2.8, 0.45)
//       drawWave(5, 32, 0.0095, 2.1, colors.secondary, 2.3, 0.35)
      
//       // Accent color waves
//       drawWave(6, 42, 0.0105, 2.4, colors.accent, 3.2, 0.5)
//       drawWave(7, 36, 0.0085, 2.6, colors.accent, 2.6, 0.4)
//       drawWave(8, 28, 0.013, 2, colors.accent, 2.2, 0.32)

//       // Additional subtle waves for depth
//       drawWave(9, 25, 0.014, 1.9, colors.primary, 1.8, 0.25)
//       drawWave(10, 48, 0.007, 2.7, colors.secondary, 1.5, 0.22)
//       drawWave(11, 33, 0.0092, 2.35, colors.accent, 2, 0.28)

//       time += 0.02
//       animationFrameId = requestAnimationFrame(animate)
//     }

//     // Initialize
//     resizeCanvas()
//     window.addEventListener('resize', resizeCanvas)
    
//     // Check for reduced motion preference
//     const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
//     if (!prefersReducedMotion) {
//       // Start animation after a brief delay to ensure canvas is ready
//       setTimeout(() => {
//         animate()
//       }, 100)
//     }

//     return () => {
//       window.removeEventListener('resize', resizeCanvas)
//       if (animationFrameId) {
//         cancelAnimationFrame(animationFrameId)
//       }
//     }
//   }, [])

//   return (
//     <div className="relative min-h-[85vh] bg-base-100 overflow-hidden flex items-center justify-center">
//       {/* Canvas Audio Visualization */}
//       <canvas
//         ref={canvasRef}
//         className="absolute inset-0 w-full h-full pointer-events-none"
//         style={{ opacity: 1, mixBlendMode: 'screen' }}
//       />

//       {/* Very subtle decorative elements */}
//       <div className="absolute inset-0 opacity-5 pointer-events-none">
//         <div className="absolute top-20 left-10 w-72 h-72 bg-primary rounded-full blur-3xl"></div>
//         <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary rounded-full blur-3xl"></div>
//         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent rounded-full blur-3xl"></div>
//       </div>
      
//       <div className="relative text-center max-w-5xl px-4 py-20 mx-auto z-10">
//         <div className="max-w-3xl mx-auto">
//           <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full mb-6">
//             <Sparkles className="w-4 h-4 text-primary" />
//             <span className="text-sm font-medium text-primary">AI-Powered English Pronunciation Coach</span>
//           </div>
          
//           <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
//             <span className="text-primary">
//               Perfect Your English Pronunciation with AI
//             </span>
//           </h1>
          
//           <p className="text-lg lg:text-xl mb-8 text-base-content/70 max-w-2xl mx-auto">
//             The only pronunciation coach designed for Japanese speakers. Get phoneme-level 
//             feedback on /r/ vs /l/, /th/ sounds, and word stress—AI that actually understands 
//             your Japanese→English challenges.
//           </p>
          
//           <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
//             <Link href="/practice" className="btn btn-primary btn-lg gap-2 shadow-lg shadow-primary/30">
//               Try Free Practice Session
//               <ArrowRight className="w-5 h-5" />
//             </Link>
//             <button className="btn btn-outline btn-lg">
//               Watch Demo
//             </button>
//           </div>
          
//           <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-base-content/60">
//             <div className="flex items-center gap-2">
//               <div className="w-5 h-5 rounded-full bg-success/20 flex items-center justify-center">
//                 <Check className="w-3 h-3 text-success" />
//               </div>
//               <span>5 free sessions</span>
//             </div>
//             <div className="flex items-center gap-2">
//               <div className="w-5 h-5 rounded-full bg-success/20 flex items-center justify-center">
//                 <Check className="w-3 h-3 text-success" />
//               </div>
//               <span>No credit card</span>
//             </div>
//             <div className="flex items-center gap-2">
//               <div className="w-5 h-5 rounded-full bg-success/20 flex items-center justify-center">
//                 <Check className="w-3 h-3 text-success" />
//               </div>
//               <span>日本語サポート</span>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

const FeaturesGridSection = () => {
    const features = [
        {
          icon: <Mic className="w-6 h-6" />,
          title: "Japanese-Specific Analysis",
          description: "Detects /r/ vs /l/, /th/ sounds, and other phonemes Japanese speakers struggle with",
          color: "primary"
        },
        {
          icon: <MessageCircle className="w-6 h-6" />,
          title: "AI Conversation Practice",
          description: "TOEIC scenarios, business meetings, job interviews—practice what you actually need",
          color: "secondary"
        },
        {
          icon: <BarChart3 className="w-6 h-6" />,
          title: "Progress Tracking",
          description: "Watch your pronunciation improve with detailed analytics and accuracy graphs",
          color: "accent"
        },
        {
          icon: <Target className="w-6 h-6" />,
          title: "Spaced Repetition",
          description: "Focus on your problem sounds with smart practice scheduling",
          color: "info"
        }
      ];

    return (
      <div className="py-24 px-4 lg:px-8 bg-base-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">
              Built for{' '}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Japanese English Learners
              </span>
            </h2>
            <p className="text-lg text-base-content/60 max-w-2xl mx-auto">
              Unlike ChatGPT, we remember your progress and understand your specific challenges
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, idx) => (
              <div key={idx} className="group card bg-base-200 border border-base-300 hover:border-primary/50 shadow-sm hover:shadow-xl hover:shadow-primary/10 transition-all duration-300">
                <div className="card-body items-center text-center p-6">
                  <div className={`p-4 bg-${feature.color}/10 border border-${feature.color}/20 rounded-xl text-${feature.color} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    {feature.icon}
                  </div>
                  <h3 className="card-title text-lg mb-2">{feature.title}</h3>
                  <p className="text-sm text-base-content/60">{feature.description}</p>
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
      <div className="py-24 px-4 lg:px-8 bg-gradient-to-b from-base-100 to-base-200">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">
              Everything You Need to Master{' '}
              <span className="bg-gradient-to-r from-accent to-secondary bg-clip-text text-transparent">
                English Pronunciation
              </span>
            </h2>
            <p className="text-lg text-base-content/60">
              Professional coaching that used to cost ¥20,000/month at Eikaiwa schools
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-12">
            {benefits.map((benefit, idx) => (
              <div key={idx} className="flex items-start gap-3 p-5 bg-base-100 border border-base-300 rounded-xl hover:border-success/50 transition-colors duration-300">
                <div className="w-6 h-6 rounded-full bg-success/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-4 h-4 text-success" />
                </div>
                <span className="font-medium text-base-content/80">{benefit}</span>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="card bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
              <div className="card-body items-center text-center">
                <div className="text-5xl font-bold text-primary mb-2">50k+</div>
                <div className="text-sm text-base-content/60 font-medium">Practice Sessions</div>
              </div>
            </div>
            <div className="card bg-gradient-to-br from-secondary/10 to-secondary/5 border border-secondary/20">
              <div className="card-body items-center text-center">
                <div className="text-5xl font-bold text-secondary mb-2">+35%</div>
                <div className="text-sm text-base-content/60 font-medium">Avg Accuracy Gain</div>
              </div>
            </div>
            <div className="card bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20">
              <div className="card-body items-center text-center">
                <div className="flex items-center gap-1 mb-2">
                  <span className="text-5xl font-bold text-accent">4.8</span>
                  <Star className="w-6 h-6 fill-warning text-warning" />
                </div>
                <div className="text-sm text-base-content/60 font-medium">User Rating</div>
              </div>
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
      time: "10 seconds",
      color: "primary",
      bgClass: "bg-primary/10",
      borderClass: "border-primary/30",
      textClass: "text-primary"
    },
    {
      number: 2,
      title: "Practice Speaking",
      description: "AI conversation partner responds naturally to your English",
      icon: <Mic className="w-8 h-8" />,
      time: "5-10 minutes",
      color: "secondary",
      bgClass: "bg-secondary/10",
      borderClass: "border-secondary/30",
      textClass: "text-secondary"
    },
    {
      number: 3,
      title: "Get Detailed Feedback",
      description: "Phoneme-level scores, error patterns, and pronunciation tips",
      icon: <BarChart3 className="w-8 h-8" />,
      time: "Instant",
      color: "accent",
      bgClass: "bg-accent/10",
      borderClass: "border-accent/30",
      textClass: "text-accent"
    },
    {
      number: 4,
      title: "Track Progress",
      description: "Watch your accuracy improve day by day with streaks and badges",
      icon: <TrendingUp className="w-8 h-8" />,
      time: "Ongoing",
      color: "info",
      bgClass: "bg-info/10",
      borderClass: "border-info/30",
      textClass: "text-info"
    }
  ];

  return (
    <div className="py-24 px-4 lg:px-8 bg-base-200">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">
            How It Works
          </h2>
          <p className="text-lg text-base-content/60">
            Start improving your pronunciation in just 5 minutes
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          {steps.map((step, idx) => (
            <div key={idx} className="relative">
              {idx < steps.length - 1 && (
                <div className={`hidden md:block absolute top-16 left-1/2 w-full h-0.5 ${step.bgClass} -z-10`}>
                  <ChevronRight className={`absolute right-0 top-1/2 -translate-y-1/2 w-6 h-6 ${step.textClass}`} />
                </div>
              )}
              
              <div className={`card bg-base-100 border-2 ${step.borderClass} hover:shadow-xl transition-all duration-300`}>
                <div className="card-body items-center text-center p-6">
                  <div className={`relative w-20 h-20 mb-4 ${step.bgClass} rounded-full flex items-center justify-center border-2 ${step.borderClass}`}>
                    <span className={`text-3xl font-bold ${step.textClass}`}>{step.number}</span>
                  </div>
                  
                  <div className={step.textClass + " mb-3"}>
                    {step.icon}
                  </div>
                  
                  <h3 className="card-title text-lg mb-2">{step.title}</h3>
                  <p className="text-sm text-base-content/60 mb-4">{step.description}</p>
                  
                  <div className={`badge badge-outline ${step.borderClass} ${step.textClass} gap-2`}>
                    <Clock className="w-3 h-3" />
                    {step.time}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/practice" className="btn btn-primary btn-lg gap-2 shadow-lg shadow-primary/30">
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
      <div className="py-24 px-4 lg:px-8 bg-base-100">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">
              Why SpeakScore vs{' '}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Traditional Methods?
              </span>
            </h2>
            <p className="text-lg text-base-content/60">
              Compare our AI coach to traditional English learning options
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr className="border-b border-base-300">
                  <th className="bg-base-200">Method</th>
                  <th className="bg-base-200">Price (Monthly)</th>
                  <th className="bg-base-200">Pronunciation Focus</th>
                  <th className="bg-base-200">Progress Tracking</th>
                  <th className="bg-base-200">Availability</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-base-300 hover:bg-base-200/50 transition-colors">
                  <td className="font-medium">Eikaiwa Schools</td>
                  <td>¥10,000-20,000</td>
                  <td><span className="badge badge-ghost">Generic</span></td>
                  <td><span className="badge badge-ghost">Manual</span></td>
                  <td><span className="badge badge-ghost">Fixed schedule</span></td>
                </tr>
                <tr className="border-b border-base-300 hover:bg-base-200/50 transition-colors">
                  <td className="font-medium">Online Tutors</td>
                  <td>¥3,000-12,000</td>
                  <td><span className="badge badge-ghost">Teacher-dependent</span></td>
                  <td><span className="badge badge-ghost">None</span></td>
                  <td><span className="badge badge-ghost">Booking required</span></td>
                </tr>
                <tr className="border-b border-base-300 hover:bg-base-200/50 transition-colors">
                  <td className="font-medium">ChatGPT</td>
                  <td>$20 (~¥3,000)</td>
                  <td><span className="badge badge-ghost">No pronunciation</span></td>
                  <td><span className="badge badge-ghost">No memory</span></td>
                  <td><span className="badge badge-success">24/7</span></td>
                </tr>
                <tr className="border-b border-base-300 hover:bg-base-200/50 transition-colors">
                  <td className="font-medium">Duolingo</td>
                  <td>¥1,200</td>
                  <td><span className="badge badge-ghost">Basic only</span></td>
                  <td><span className="badge badge-ghost">Simple streaks</span></td>
                  <td><span className="badge badge-success">24/7</span></td>
                </tr>
                <tr className="bg-gradient-to-r from-primary/5 to-secondary/5 border-2 border-primary/30">
                  <td className="font-bold">
                    <div className="flex items-center gap-2">
                      <Star className="w-5 h-5 text-primary fill-primary" />
                      SpeakScore
                    </div>
                  </td>
                  <td className="font-bold text-success">£20 (~¥3,800)</td>
                  <td><span className="badge badge-success">Japanese-specific</span></td>
                  <td><span className="badge badge-success">Full analytics</span></td>
                  <td><span className="badge badge-success">24/7</span></td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="alert bg-info/10 border border-info/30 mt-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-info/20 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5 text-info" />
              </div>
              <span className="text-base-content/80">85% cheaper than Eikaiwa schools with better pronunciation tracking</span>
            </div>
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
      <div className="py-24 px-4 lg:px-8 bg-gradient-to-b from-base-200 to-base-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-success/10 border border-success/20 rounded-full mb-4">
              <Users className="w-4 h-4 text-success" />
              <span className="text-sm font-medium text-success">Trusted by 5,000+ Japanese Learners</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Real Results from{' '}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Japanese English Learners
              </span>
            </h2>
            <div className="flex items-center justify-center gap-2 mb-2">
              {[1,2,3,4,5].map(i => (
                <Star key={i} className="w-6 h-6 fill-warning text-warning" />
              ))}
              <span className="font-bold text-2xl ml-2">4.8</span>
              <span className="text-base-content/60">(1,247 reviews)</span>
            </div>
          </div>
  
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, idx) => (
              <div key={idx} className="card bg-base-100 border border-base-300 hover:border-primary/50 shadow-lg hover:shadow-xl hover:shadow-primary/10 transition-all duration-300">
                <div className="card-body p-6">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="avatar placeholder">
                      <div className="bg-gradient-to-br from-primary to-secondary rounded-full w-14 h-14 text-2xl flex items-center justify-center">
                        {testimonial.image}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-base-content">{testimonial.name}</h3>
                        {testimonial.verified && (
                          <div className="badge badge-success badge-sm gap-1">
                            <Check className="w-3 h-3" />
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-base-content/60">{testimonial.age}, {testimonial.location}</p>
                    </div>
                  </div>
  
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-warning text-warning" />
                    ))}
                  </div>
  
                  <Quote className="w-6 h-6 text-primary/20 mb-2" />
                  <p className="text-sm text-base-content/70 mb-4 italic leading-relaxed">"{testimonial.quote}"</p>
  
                  <div className="badge badge-primary badge-outline">
                    <Trophy className="w-3 h-3 mr-1" />
                    {testimonial.result}
                  </div>
                </div>
              </div>
            ))}
          </div>
  
          <div className="text-center mt-12">
            <p className="text-base-content/60 mb-4">Join thousands of successful English learners</p>
            <Link href="/practice" className="btn btn-primary shadow-lg shadow-primary/30">
              Start Your Journey
            </Link>
          </div>
        </div>
      </div>
    );
}

// const PricingSection = () => {
//     return (
//       <div id="pricing" className="py-24 px-4 lg:px-8 bg-base-200">
//         <div className="max-w-7xl mx-auto">
//           <div className="text-center mb-16">
//             <h2 className="text-4xl lg:text-5xl font-bold mb-4">
//               Simple,{' '}
//               <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
//                 Affordable Pricing
//               </span>
//             </h2>
//             <p className="text-lg text-base-content/60">
//               Less than one conversation lesson at an Eikaiwa school
//             </p>
//           </div>

//           <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8 max-w-6xl mx-auto">
//             {PRICING_PLANS.map((plan, idx) => (
//                 <SmartPricingCard key={idx} plan={plan} />
//             ))}
//           </div>

//           <div className="text-center mt-12 space-y-3">
//             <div className="inline-flex items-center gap-2 px-4 py-2 bg-warning/10 border border-warning/20 rounded-full">
//               <Award className="w-4 h-4 text-warning" />
//               <span className="text-sm font-medium text-base-content/80">
//                 Students: 20% off with Japanese university email (.ac.jp)
//               </span>
//             </div>
//             <p className="text-sm text-base-content/60">
//               Questions? <Link href="/contact" className="link link-primary">お問い合わせ (Contact us)</Link>
//             </p>
//           </div>
//         </div>
//       </div>
//     )
// }

const FaqSection = () => {
    return (
      <div className="py-24 px-4 lg:px-8 bg-base-100">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-base-content/60">
              Everything you need to know about SpeakScore
            </p>
          </div>

          <div className="join join-vertical w-full space-y-2">
            <div className="collapse collapse-arrow bg-base-200 border border-base-300 rounded-xl">
              <input type="radio" name="faq-accordion" defaultChecked /> 
              <div className="collapse-title text-lg font-medium">
                How does SpeakScore understand Japanese pronunciation challenges?
              </div>
              <div className="collapse-content"> 
                <p className="text-base-content/70">Our AI uses Azure's pronunciation assessment specifically calibrated for Japanese→English learners. It detects common issues like /r/ vs /l/ confusion, /th/ sounds, and silent vowel additions that Japanese speakers struggle with.</p>
              </div>
            </div>
            
            <div className="collapse collapse-arrow bg-base-200 border border-base-300 rounded-xl">
              <input type="radio" name="faq-accordion" /> 
              <div className="collapse-title text-lg font-medium">
                Can I use SpeakScore to prepare for TOEIC/TOEFL?
              </div>
              <div className="collapse-content"> 
                <p className="text-base-content/70">Yes! We have dedicated TOEIC speaking test scenarios and TOEFL preparation conversations. Practice with realistic test formats and get feedback on pronunciation, fluency, and accuracy.</p>
              </div>
            </div>
            
            <div className="collapse collapse-arrow bg-base-200 border border-base-300 rounded-xl">
              <input type="radio" name="faq-accordion" /> 
              <div className="collapse-title text-lg font-medium">
                Is the interface available in Japanese?
              </div>
              <div className="collapse-content"> 
                <p className="text-base-content/70">Currently the interface is in English (we're building for English-speaking Japanese learners first). Japanese UI will launch in Month 2. Support is available in both English and Japanese now.</p>
              </div>
            </div>

            <div className="collapse collapse-arrow bg-base-200 border border-base-300 rounded-xl">
              <input type="radio" name="faq-accordion" /> 
              <div className="collapse-title text-lg font-medium">
                How is this different from ChatGPT for pronunciation practice?
              </div>
              <div className="collapse-content"> 
                <p className="text-base-content/70">ChatGPT doesn't track your progress, can't analyze pronunciation at the phoneme level, and doesn't remember your specific error patterns. SpeakScore remembers everything and focuses on YOUR Japanese→English challenges with detailed scoring.</p>
              </div>
            </div>

            <div className="collapse collapse-arrow bg-base-200 border border-base-300 rounded-xl">
              <input type="radio" name="faq-accordion" /> 
              <div className="collapse-title text-lg font-medium">
                Can I cancel anytime?
              </div>
              <div className="collapse-content"> 
                <p className="text-base-content/70">Absolutely! No contracts, no commitments. Cancel your subscription anytime from your account settings. You'll keep access until the end of your billing period.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
}

const TrustBadgesSection = () => {
    const badges = [
      { icon: Target, title: "Japanese-Specific", subtitle: "Built for your phoneme challenges", color: "success" },
      { icon: Brain, title: "Remembers You", subtitle: "Tracks your unique patterns", color: "primary" },
      { icon: Trophy, title: "TOEIC/TOEFL Ready", subtitle: "Test-specific scenarios", color: "warning" },
      { icon: Shield, title: "日本語サポート", subtitle: "Japanese language support", color: "info" }
    ];

    return (
      <div className="py-20 px-4 lg:px-8 bg-gradient-to-b from-base-200 to-base-100">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-2">Why Japanese Learners Choose Us</h3>
            <p className="text-base-content/60">Designed specifically for your success</p>
          </div>
  
          <div className="grid md:grid-cols-4 gap-6">
            {badges.map((badge, idx) => (
              <div key={idx} className={`card bg-base-100 border border-${badge.color}/30 hover:border-${badge.color}/50 shadow-sm hover:shadow-lg hover:shadow-${badge.color}/10 transition-all duration-300`}>
                <div className="card-body items-center text-center p-6">
                  <div className={`w-14 h-14 rounded-full bg-${badge.color}/10 flex items-center justify-center mb-3`}>
                    <badge.icon className={`w-7 h-7 text-${badge.color}`} />
                  </div>
                  <h4 className="font-bold text-base mb-1">{badge.title}</h4>
                  <p className="text-xs text-base-content/60">{badge.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
}

const PronounciationChallengesSection = () => {
    const challenges = [
      { sound: "/r/ vs /l/", example: "right vs light, rock vs lock", difficulty: "Very Hard", color: "error" },
      { sound: "/th/ sounds", example: "think, that, this", difficulty: "Very Hard", color: "error" },
      { sound: "/f/ vs /h/", example: "fan vs hand, feel vs heel", difficulty: "Hard", color: "warning" },
      { sound: "/v/ vs /b/", example: "vote vs boat, very vs berry", difficulty: "Hard", color: "warning" },
      { sound: "Silent vowels", example: "desk not desk-u, test not test-o", difficulty: "Medium", color: "info" },
      { sound: "Word stress", example: "REcord vs reCORD", difficulty: "Medium", color: "info" }
    ];
  
    return (
      <div className="py-24 px-4 lg:px-8 bg-base-100">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">
              Pronunciation Challenges for{' '}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Japanese Speakers
              </span>
            </h2>
            <p className="text-lg text-base-content/60">
              We understand your specific struggles—and we fix them
            </p>
          </div>
  
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            {challenges.map((challenge, idx) => (
              <div key={idx} className={`card bg-base-200 border border-${challenge.color}/30 hover:border-${challenge.color}/50 shadow-md hover:shadow-lg transition-all duration-300`}>
                <div className="card-body p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="card-title text-lg">{challenge.sound}</h3>
                    <div className={`badge badge-${challenge.color} badge-sm`}>
                      {challenge.difficulty}
                    </div>
                  </div>
                  <p className="text-sm text-base-content/60">
                    Examples: <span className="font-mono text-base-content/80">{challenge.example}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
  
          <div className="alert bg-success/10 border border-success/30">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center flex-shrink-0">
                <Volume2 className="w-5 h-5 text-success" />
              </div>
              <div>
                <h4 className="font-bold text-base-content mb-1">SpeakScore detects and scores ALL of these</h4>
                <p className="text-sm text-base-content/70">Get phoneme-level feedback on every challenging sound</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
}

const FinalCTASection = () => {
  return (
    <div className="relative py-24 px-4 lg:px-8 overflow-hidden bg-base-200">
      {/* Subtle decorative elements instead of heavy gradients */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative max-w-4xl mx-auto text-center">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Join 5,000+ Learners</span>
          </div>
        </div>
        
        <h2 className="text-4xl lg:text-6xl font-bold mb-6">
          Ready to Perfect Your{' '}
          <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            English Pronunciation?
          </span>
        </h2>
        
        <p className="text-lg lg:text-2xl mb-10 text-base-content/70 max-w-2xl mx-auto">
          Join thousands of Japanese speakers improving their English with AI
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Link href="/practice" className="btn btn-primary btn-lg gap-2 shadow-lg shadow-primary/30">
            Start Free Practice
            <ArrowRight className="w-5 h-5" />
          </Link>
          <button className="btn btn-outline btn-lg">
            Watch Demo
          </button>
        </div>
        
        <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-base-content/60">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-success/20 flex items-center justify-center">
              <Check className="w-4 h-4 text-success" />
            </div>
            <span>5 free sessions</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-success/20 flex items-center justify-center">
              <Check className="w-4 h-4 text-success" />
            </div>
            <span>No credit card required</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-success/20 flex items-center justify-center">
              <Check className="w-4 h-4 text-success" />
            </div>
            <span>日本語サポートあり</span>
          </div>
        </div>
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