'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../components/AuthProvider';
import { 
  Sparkles, 
  ArrowRight, 
  FileText, 
  CheckCircle, 
  Search, 
  Cpu, 
  Layers, 
  Award, 
  Download, 
  ChevronDown, 
  ChevronUp, 
  Star,
  Zap,
  Menu,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LandingPage() {
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const features = [
    {
      icon: <Layers className="w-6 h-6 text-indigo-400" />,
      title: "Interactive Builder",
      description: "Build resumes in real-time with visual templates. Drag-and-drop sections to create custom structures effortlessly."
    },
    {
      icon: <Cpu className="w-6 h-6 text-emerald-400" />,
      title: "Gemini AI Engine",
      description: "Generate structured, professional bullet points using the STAR method tailored specifically for your industry."
    },
    {
      icon: <Search className="w-6 h-6 text-violet-400" />,
      title: "ATS Optimization Scan",
      description: "Scan your resume against modern ATS algorithms. Find missing keywords, compute scores, and bypass barriers."
    },
    {
      icon: <Sparkles className="w-6 h-6 text-amber-400" />,
      title: "Job Matching & Tailoring",
      description: "Paste a target job description and compare it side-by-side. Get instant instructions to align your qualifications."
    },
    {
      icon: <FileText className="w-6 h-6 text-sky-400" />,
      title: "Seamless PDF/Word Export",
      description: "Download vector-clean PDFs directly from your browser print layout, or export editable Word DOCX files in seconds."
    },
    {
      icon: <Award className="w-6 h-6 text-rose-400" />,
      title: "Direct AI Parser",
      description: "Have an old resume? Upload it directly. Our parser reads PDFs/DOCX files and structures them instantly into editor sections."
    }
  ];

  const pricing = [
    {
      name: "Starter",
      price: "Free",
      description: "Test the waters and create a basic professional resume.",
      features: [
        "1 Resume Editor Draft",
        "Standard Minimalist Template",
        "Browser Print PDF Export",
        "Standard ATS Scanning (Basic Score)",
      ],
      cta: "Get Started",
      popular: false,
      href: "/register"
    },
    {
      name: "Professional",
      price: "$19",
      period: "/month",
      description: "Our most popular tier. Unlock full Gemini AI potential.",
      features: [
        "Unlimited Resumes",
        "Access to All 4 Premium Templates",
        "Gemini AI Bullet Point Improvement",
        "Complete Recruiter AI Review Report",
        "Job Description Matching Analysis",
        "PDF & Word DOCX Exports",
      ],
      cta: "Upgrade Now",
      popular: true,
      href: "/register"
    },
    {
      name: "Executive",
      price: "$39",
      period: "/month",
      description: "For elite candidates seeking maximum performance.",
      features: [
        "Everything in Professional",
        "Unlimited PDF/Word Resume Imports",
        "Unlimited Job Description Scans",
        "1-on-1 AI Mock Interview Suggestion",
        "Priority Gemini AI Node Compute",
      ],
      cta: "Go Unlimited",
      popular: false,
      href: "/register"
    }
  ];

  const faqs = [
    {
      q: "What is CVItAI?",
      a: "CVItAI is an advanced career platform that combines a live, template-driven resume editor with Google Gemini AI to analyze your text, score it against modern ATS databases, and help you tailor your resume directly to job descriptions."
    },
    {
      q: "How does the AI Resume Reviewer work?",
      a: "Our AI model acts as an automated recruiter. It analyzes your experience descriptions, finds grammar issues, flags missing industry skills, and suggests highly optimized, result-driven bullet points using metrics and action verbs."
    },
    {
      q: "Can I import an existing PDF or Word resume?",
      a: "Yes! If you upload your current resume in PDF or DOCX format, our parser will instantly extract the text, segment it into personal details, work history, education, and skills, and auto-populate the editor."
    },
    {
      q: "How does Job Description Matching work?",
      a: "By pasting a job description next to your resume, CVItAI compares the keywords, required tech stacks, and educational criteria, computing a match percentage and pointing out exactly which terms are missing."
    },
    {
      q: "Is there a limit on PDF/Word exports?",
      a: "Free users can export their resumes using standard browser printing. Premium accounts can generate customized PDF downloads and fully structured DOCX exports without limits."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 overflow-x-hidden font-sans relative">
      {/* Background glow effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-900/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[20%] right-[-10%] w-[45%] h-[45%] bg-blue-900/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[15%] w-[40%] h-[40%] bg-violet-900/15 rounded-full blur-[130px] pointer-events-none" />

      {/* Header */}
      <nav className="sticky top-0 z-50 glass-premium border-b border-slate-800/80 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg text-white">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="font-display text-xl font-bold tracking-tight text-white">
              CVItAI
            </span>
          </Link>

          {/* Desktop Nav links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#features" className="hover:text-indigo-400 transition-colors">Features</a>
            <a href="#pricing" className="hover:text-indigo-400 transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-indigo-400 transition-colors">FAQ</a>
            {user ? (
              <Link href="/dashboard" className="hover:text-indigo-400 transition-colors">Dashboard</Link>
            ) : (
              <Link href="/login" className="hover:text-indigo-400 transition-colors">Login</Link>
            )}
          </div>

          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <Link 
                href="/dashboard" 
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2 px-5 rounded-lg flex items-center gap-2 text-sm transition-all"
              >
                Dashboard <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <Link 
                href="/register" 
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2 px-5 rounded-lg flex items-center gap-2 text-sm transition-all"
              >
                Create Account <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>

          {/* Mobile menu triggers */}
          <div className="md:hidden">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-slate-300 hover:text-white p-1"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile nav drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden absolute top-[72px] left-0 w-full bg-slate-900 border-b border-slate-800 p-6 z-40 flex flex-col gap-4"
          >
            <a 
              href="#features" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-slate-300 hover:text-white font-medium py-1"
            >
              Features
            </a>
            <a 
              href="#pricing" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-slate-300 hover:text-white font-medium py-1"
            >
              Pricing
            </a>
            <a 
              href="#faq" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-slate-300 hover:text-white font-medium py-1"
            >
              FAQ
            </a>
            <hr className="border-slate-800" />
            {user ? (
              <Link 
                href="/dashboard" 
                onClick={() => setMobileMenuOpen(false)}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2 px-4 rounded-lg text-center flex items-center justify-center gap-2 text-sm"
              >
                Dashboard <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <>
                <Link 
                  href="/login" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-slate-300 hover:text-white font-medium text-center py-2"
                >
                  Login
                </Link>
                <Link 
                  href="/register" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2 px-4 rounded-lg text-center flex items-center justify-center gap-2 text-sm"
                >
                  Create Account <ArrowRight className="w-4 h-4" />
                </Link>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative px-6 py-20 md:py-32 max-w-7xl mx-auto flex flex-col items-center text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full glass border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-6"
        >
          <Sparkles className="w-3.5 h-3.5 animate-pulse" /> Driven by Google Gemini 2.5 AI
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl md:text-7xl font-display font-extrabold tracking-tight leading-[1.1] mb-6 max-w-4xl text-gradient"
        >
          Optimize Your Resume.<br />Land Your Dream Job.
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl text-slate-400 max-w-2xl mb-10 leading-relaxed"
        >
          Create ATS-optimized resumes with our premium real-time editor. Access Gemini-powered scorecards, bullet point tailoring, and custom templates built for high conversion.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center gap-4 mb-20"
        >
          {user ? (
            <Link 
              href="/dashboard" 
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 px-8 rounded-xl flex items-center gap-2 shadow-lg shadow-indigo-600/35 text-base transition-all scale-105 hover:scale-108"
            >
              Go to Dashboard <ArrowRight className="w-5 h-5" />
            </Link>
          ) : (
            <>
              <Link 
                href="/register" 
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 px-8 rounded-xl flex items-center gap-2 shadow-lg shadow-indigo-600/35 text-base transition-all scale-105 hover:scale-108"
              >
                Build Your Resume <ArrowRight className="w-5 h-5" />
              </Link>
              <Link 
                href="/login" 
                className="glass hover:bg-slate-800/80 text-white font-semibold py-4 px-8 rounded-xl text-base transition-all"
              >
                Explore Features
              </Link>
            </>
          )}
        </motion.div>

        {/* Dashboard Preview Mockup */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="w-full max-w-5xl rounded-2xl glass-premium p-3 border border-slate-800/80 shadow-2xl shadow-indigo-950/20 relative"
        >
          <div className="absolute inset-0 bg-indigo-500/10 rounded-2xl blur-3xl pointer-events-none z-0" />
          <div className="bg-slate-900/90 rounded-xl overflow-hidden border border-slate-800/60 z-10 relative">
            {/* Header controls bar */}
            <div className="flex items-center justify-between px-4 py-3 bg-slate-950/60 border-b border-slate-800/60">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-rose-500 rounded-full" />
                <span className="w-3 h-3 bg-amber-500 rounded-full" />
                <span className="w-3 h-3 bg-emerald-500 rounded-full" />
              </div>
              <div className="text-xs text-slate-500 font-mono select-none">cvitai-builder-preview.tsx</div>
              <div className="w-10" />
            </div>
            
            {/* Mock Builder layout grid */}
            <div className="grid grid-cols-12 min-h-[400px]">
              {/* Left input control mock */}
              <div className="col-span-4 border-r border-slate-800/60 bg-slate-900/40 p-4 text-left hidden md:block">
                <div className="h-6 bg-slate-800/60 rounded-md w-3/4 mb-6 animate-pulse" />
                <div className="space-y-4">
                  {[1, 2, 3].map((idx) => (
                    <div key={idx} className="p-3 bg-slate-950/30 rounded-lg border border-slate-800/30 space-y-2">
                      <div className="h-3 bg-slate-800/80 rounded w-1/3" />
                      <div className="h-2 bg-slate-800/40 rounded w-2/3" />
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Right preview sheet mock */}
              <div className="col-span-12 md:col-span-8 bg-slate-950/30 p-6 flex flex-col justify-between">
                <div className="space-y-6 text-left">
                  <div className="space-y-2">
                    <div className="h-8 bg-indigo-500/20 rounded w-1/3" />
                    <div className="h-3 bg-slate-800 rounded w-1/2" />
                  </div>
                  <hr className="border-slate-800/60" />
                  <div className="space-y-3">
                    <div className="h-4 bg-slate-800 rounded w-1/4" />
                    <div className="h-2 bg-slate-800/60 rounded w-full" />
                    <div className="h-2 bg-slate-800/60 rounded w-full" />
                    <div className="h-2 bg-slate-800/60 rounded w-5/6" />
                  </div>
                </div>
                
                {/* Floating AI metrics panel */}
                <div className="mt-8 flex justify-end">
                  <div className="glass p-3 rounded-xl border-indigo-500/35 flex items-center gap-4 animate-bounce">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm">
                      89%
                    </div>
                    <div className="text-left">
                      <div className="text-xs font-semibold text-white">ATS Compatibility Match</div>
                      <div className="text-[10px] text-slate-400">Excellent keyword density detected</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 md:py-32 px-6 max-w-7xl mx-auto border-t border-slate-900">
        <div className="text-center mb-16 md:mb-24">
          <h2 className="text-3xl md:text-5xl font-display font-extrabold tracking-tight text-white mb-4">
            Engineered for Fast Conversion
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Our resume workbench provides state-of-the-art resources optimized to bypass automated filters and stand out to hiring directors.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feat, idx) => (
            <motion.div 
              key={idx}
              whileHover={{ y: -5 }}
              className="glass p-8 rounded-2xl flex flex-col justify-between border-slate-800/60 hover:border-indigo-500/20 hover:bg-slate-900/30 transition-all group"
            >
              <div>
                <div className="mb-6 bg-slate-950 p-3.5 rounded-xl inline-block border border-slate-800/60 group-hover:border-indigo-500/25 transition-all">
                  {feat.icon}
                </div>
                <h3 className="text-xl font-bold font-display text-white mb-3">{feat.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{feat.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 md:py-32 px-6 max-w-7xl mx-auto border-t border-slate-900">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-display font-extrabold tracking-tight text-white mb-4">
            Job Seekers Excel with CVItAI
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            See how professionals are upgrading their scorecards and securing roles.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              quote: "The Job Match feature is a lifesaver. I modified my developer resume to match three different target positions, and landed interviews for all of them.",
              author: "Elena Rostova",
              role: "Senior Frontend Engineer",
              company: "Stripe",
              stars: 5
            },
            {
              quote: "Uploading my old resume parsed it instantly. The suggestions Gemini made to optimize my bullet points transformed my career summary completely.",
              author: "Marcus Vance",
              role: "Product Manager",
              company: "Meta",
              stars: 5
            },
            {
              quote: "I was skeptical about the ATS scan, but after adding missing keywords suggested by the reviewer, my scorecard went from 62 to 91. Next week I start my new role!",
              author: "Siddharth Mehta",
              role: "Data Scientist",
              company: "Snowflake",
              stars: 5
            }
          ].map((t, idx) => (
            <div key={idx} className="glass p-8 rounded-2xl flex flex-col justify-between border-slate-850">
              <div className="space-y-4">
                <div className="flex gap-1">
                  {[...Array(t.stars)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
                </div>
                <p className="text-slate-300 italic text-sm leading-relaxed">"{t.quote}"</p>
              </div>
              <div className="mt-6 pt-6 border-t border-slate-900 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-600/35 text-indigo-300 flex items-center justify-center font-bold text-sm">
                  {t.author.charAt(0)}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">{t.author}</h4>
                  <p className="text-[11px] text-slate-400">{t.role} @ <span className="text-indigo-400">{t.company}</span></p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 md:py-32 px-6 max-w-7xl mx-auto border-t border-slate-900">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-display font-extrabold tracking-tight text-white mb-4">
            Transparent pricing for any stage
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            Choose the plan that suits your goals. Cancel any time.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {pricing.map((tier, idx) => (
            <div 
              key={idx}
              className={`rounded-2xl p-8 flex flex-col justify-between border relative transition-all ${
                tier.popular 
                  ? 'bg-slate-900/60 border-indigo-500 shadow-xl shadow-indigo-950/20 scale-102 z-10' 
                  : 'glass border-slate-800/80 hover:border-slate-700/80'
              }`}
            >
              {tier.popular && (
                <span className="absolute top-4 right-4 bg-indigo-600 text-white text-[10px] font-bold uppercase tracking-wider py-1 px-3 rounded-full flex items-center gap-1">
                  <Zap className="w-3 h-3 fill-white" /> Popular
                </span>
              )}
              
              <div>
                <h3 className="text-lg font-bold font-display text-white mb-2">{tier.name}</h3>
                <p className="text-slate-400 text-xs mb-6 min-h-[36px]">{tier.description}</p>
                <div className="flex items-baseline gap-1 mb-8">
                  <span className="text-4xl font-extrabold text-white">{tier.price}</span>
                  {tier.period && <span className="text-slate-400 text-sm font-medium">{tier.period}</span>}
                </div>
                
                <hr className="border-slate-800/80 mb-8" />
                
                <ul className="space-y-4 mb-8">
                  {tier.features.map((feat, fidx) => (
                    <li key={fidx} className="flex items-start gap-2.5 text-xs text-slate-350">
                      <CheckCircle className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Link 
                href={tier.href}
                className={`w-full py-3 px-4 rounded-xl text-center text-sm font-bold transition-all block ${
                  tier.popular 
                    ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20' 
                    : 'glass hover:bg-slate-800 text-white'
                }`}
              >
                {tier.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 md:py-32 px-6 max-w-4xl mx-auto border-t border-slate-900">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-display font-extrabold tracking-tight text-white mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-400">
            Everything you need to know about our resume platform.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div 
              key={idx} 
              className="rounded-xl border border-slate-850 bg-slate-900/30 overflow-hidden"
            >
              <button
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-900/50 transition-all"
              >
                <span className="font-bold text-sm md:text-base text-white">{faq.q}</span>
                {activeFaq === idx ? <ChevronUp className="w-5 h-5 text-indigo-400" /> : <ChevronDown className="w-5 h-5 text-slate-500" />}
              </button>
              
              <AnimatePresence>
                {activeFaq === idx && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="px-6 pb-6 text-xs md:text-sm text-slate-450 leading-relaxed border-t border-slate-900 pt-4 bg-slate-950/20">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-900/80 px-6 py-12 bg-slate-950 relative">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-1.5 rounded-lg text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="font-display font-bold text-base text-white">CVItAI</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-8 text-xs text-slate-400 font-medium">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
            <span className="text-slate-800">|</span>
            <span className="text-slate-500">© 2026 CVItAI. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
