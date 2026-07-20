'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../components/AuthProvider';
import ThemeToggle from '../components/ThemeToggle';
import { aiApi } from '../lib/api';
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
  X,
  Upload,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';

interface ResumeCardProps {
  avatar: string;
  name: string;
  role: string;
  icon1: string;
  job1Title: string;
  job1Dates: string;
  icon2: string;
  job2Title: string;
  job2Dates: string;
  educationTitle: string;
  educationDegree: string;
  skills: { name: string; value: number }[];
}

function ResumeCard({ 
  avatar, name, role, icon1, job1Title, job1Dates, icon2, job2Title, job2Dates, educationTitle, educationDegree, skills 
}: ResumeCardProps) {
  const [rotate, setRotate] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const box = card.getBoundingClientRect();
    const x = e.clientX - box.left - box.width / 2;
    const y = e.clientY - box.top - box.height / 2;
    const rotateX = -(y / (box.height / 2)) * 12;
    const rotateY = (x / (box.width / 2)) * 12;
    setRotate({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
  };

  return (
    <div 
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transformStyle: "preserve-3d",
        transform: `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
        transition: "transform 0.15s cubic-bezier(0.25, 1, 0.5, 1)"
      }}
      className="w-[300px] md:w-[340px] shrink-0 rounded-3xl p-4 border border-pink-200/50 shadow-2xl relative cursor-pointer bg-white/95 backdrop-blur-md select-none transform-gpu"
    >
      <div className="absolute inset-0 bg-pink-500/5 rounded-3xl blur-3xl pointer-events-none z-0" />
      
      <div className="relative rounded-2xl overflow-hidden z-10 bg-white p-5 border border-pink-100/80 shadow-sm text-left">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-pink-100 bg-pink-50 relative shrink-0">
              <Image 
                src={avatar} 
                alt={name}
                width={100}
                height={100}
                className="object-cover w-full h-full"
                unoptimized
              />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800 tracking-tight leading-none mb-0.5">{name}</h3>
              <p className="text-[9px] text-pink-600 font-semibold uppercase tracking-wider">{role}</p>
            </div>
          </div>
          <Sparkles className="w-5 h-5 text-pink-500 animate-pulse fill-pink-50" />
        </div>

        {/* Experience */}
        <div className="mb-4">
          <h4 className="text-[10px] font-bold text-slate-700 uppercase tracking-widest border-b border-pink-100 pb-1 mb-2">
            Experience
          </h4>
          <div className="space-y-3 relative pl-4 before:absolute before:left-1.5 before:top-1 before:bottom-1 before:w-[1.5px] before:bg-pink-100">
            {/* Job 1 */}
            <div className="relative">
              <span className="absolute -left-[21px] top-0.5 w-3.5 h-3.5 rounded-full bg-pink-50 border border-pink-200 flex items-center justify-center text-[7px] text-pink-600">{icon1}</span>
              <div className="font-semibold text-slate-800 text-[11px]">{job1Title}</div>
              <div className="text-[8px] text-pink-500 font-medium mb-0.5">{job1Dates}</div>
              <p className="text-[9px] text-slate-500 leading-normal">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </p>
            </div>
            {/* Job 2 */}
            <div className="relative">
              <span className="absolute -left-[21px] top-0.5 w-3.5 h-3.5 rounded-full bg-pink-50 border border-pink-200 flex items-center justify-center text-[7px] text-pink-600">{icon2}</span>
              <div className="font-semibold text-slate-800 text-[11px]">{job2Title}</div>
              <div className="text-[8px] text-pink-500 font-medium mb-0.5">{job2Dates}</div>
              <p className="text-[9px] text-slate-500 leading-normal">
                Sed ut perspiciatis unde omnis iste natus error sit.
              </p>
            </div>
          </div>
        </div>

        {/* Education */}
        <div className="mb-4">
          <h4 className="text-[10px] font-bold text-slate-700 uppercase tracking-widest border-b border-pink-100 pb-1 mb-2">
            Education
          </h4>
          <div className="pl-4 relative">
            <span className="absolute left-0 top-0.5 text-xs">🎓</span>
            <div className="font-semibold text-slate-800 text-[11px]">{educationTitle}</div>
            <div className="text-[9px] text-slate-500">{educationDegree}</div>
          </div>
        </div>

        {/* Skills */}
        <div>
          <h4 className="text-[10px] font-bold text-slate-700 uppercase tracking-widest border-b border-pink-100 pb-1 mb-2">
            Skills
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {skills.map((skill, index) => (
              <div key={index} className="space-y-0.5">
                <div className="text-[9px] font-semibold text-slate-700">{skill.name}</div>
                <div className="h-1 w-full bg-pink-50 rounded-full overflow-hidden border border-pink-100/50">
                  <div 
                    className="h-full bg-pink-500 rounded-full" 
                    style={{ width: `${skill.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LandingPage() {
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  
  const [guestLoading, setGuestLoading] = useState(false);
  const [guestLogs, setGuestLogs] = useState('');
  const [guestReview, setGuestReview] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);

  const handleGuestUpload = async (file: File) => {
    try {
      setGuestLoading(true);
      setShowModal(true);
      setGuestReview(null);
      setGuestLogs('Reading uploaded document...');

      const formData = new FormData();
      formData.append('file', file);

      setTimeout(() => setGuestLogs('Extracting text content with parser...'), 800);
      setTimeout(() => setGuestLogs('Aligning sections with Gemini AI structuring...'), 1600);
      setTimeout(() => setGuestLogs('Calculating ATS score metrics...'), 3200);

      const res = await aiApi.reviewGuest(formData);
      if (res.success && res.review) {
        setGuestReview(res.review);
      }
    } catch (err: any) {
      console.error(err);
      setGuestLogs(`Error: ${err.message || 'Failed to scan resume'}`);
    } finally {
      setGuestLoading(false);
    }
  };
  
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const xTranslation = useTransform(scrollYProgress, [0, 1], ["-20%", "10%"]);

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
      <nav className="sticky top-0 z-50 glass-premium border-b border-pink-200/50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-pink-600 p-2 rounded-lg text-white">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="font-display text-xl font-bold tracking-tight text-slate-100">
              CVItAI
            </span>
          </Link>

          {/* Desktop Nav links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-750">
            <a href="#features" className="hover:text-pink-600 transition-colors">Features</a>
            <a href="#pricing" className="hover:text-pink-600 transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-pink-600 transition-colors">FAQ</a>
            {user ? (
              <Link href="/dashboard" className="hover:text-pink-600 transition-colors">Dashboard</Link>
            ) : (
              <Link href="/login" className="hover:text-pink-600 transition-colors">Login</Link>
            )}
          </div>

          <div className="hidden md:flex items-center gap-4">
            <ThemeToggle />
            {user ? (
              <Link 
                href="/dashboard" 
                className="bg-pink-600 hover:bg-pink-500 text-white font-semibold py-2 px-5 rounded-lg flex items-center gap-2 text-sm transition-all"
              >
                Dashboard <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <Link 
                href="/register" 
                className="bg-pink-600 hover:bg-pink-500 text-white font-semibold py-2 px-5 rounded-lg flex items-center gap-2 text-sm transition-all shadow-md shadow-pink-200/50"
              >
                Create Account <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>

          {/* Mobile menu triggers */}
          <div className="md:hidden">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-slate-700 hover:text-pink-600 p-1"
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
            className="md:hidden absolute top-[72px] left-0 w-full bg-white/95 backdrop-blur-md border-b border-pink-200/50 p-6 z-40 flex flex-col gap-4 shadow-xl"
          >
            <a 
              href="#features" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-slate-750 hover:text-pink-600 font-bold py-1 transition-colors"
            >
              Features
            </a>
            <a 
              href="#pricing" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-slate-750 hover:text-pink-600 font-bold py-1 transition-colors"
            >
              Pricing
            </a>
            <a 
              href="#faq" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-slate-750 hover:text-pink-600 font-bold py-1 transition-colors"
            >
              FAQ
            </a>
            <hr className="border-pink-100" />
            {user ? (
              <Link 
                href="/dashboard" 
                onClick={() => setMobileMenuOpen(false)}
                className="bg-pink-600 hover:bg-pink-500 text-white font-bold py-2.5 px-4 rounded-xl text-center flex items-center justify-center gap-2 text-xs transition-all shadow-md shadow-pink-200/50"
              >
                Dashboard <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <>
                <Link 
                  href="/login" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-slate-750 hover:text-pink-600 font-bold text-center py-2 transition-colors"
                >
                  Login
                </Link>
                <Link 
                  href="/register" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="bg-pink-600 hover:bg-pink-500 text-white font-bold py-2.5 px-4 rounded-xl text-center flex items-center justify-center gap-2 text-xs transition-all shadow-md shadow-pink-200/50"
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
          className="flex items-center gap-2 px-3 py-1.5 rounded-full glass border-pink-200/50 text-pink-700 text-xs font-bold uppercase tracking-wider mb-6"
        >
          <Sparkles className="w-3.5 h-3.5 animate-pulse text-pink-500" /> Driven by Google Gemini 2.5 AI
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
          className="text-lg md:text-xl text-slate-650 max-w-2xl mb-10 leading-relaxed font-medium"
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
                className="glass hover:bg-pink-50 text-slate-700 font-semibold py-4 px-8 rounded-xl text-base transition-all border border-pink-200/50"
              >
                Explore Features
              </Link>
            </>
          )}
        </motion.div>

        {/* Direct Resume Uploader dropzone */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="w-full max-w-xl mx-auto mb-16 bg-slate-900/40 dark:bg-slate-900/20 backdrop-blur-md rounded-2xl border border-slate-800/80 p-6 flex flex-col items-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-pink-500/5 to-indigo-500/5 pointer-events-none" />
          
          <div className="w-12 h-12 rounded-full bg-pink-500/10 text-pink-600 dark:text-pink-400 flex items-center justify-center mb-4 border border-pink-500/20">
            <Upload className="w-6 h-6" />
          </div>

          <h3 className="font-display font-bold text-lg text-white mb-1">Direct ATS Scanner</h3>
          <p className="text-xs text-slate-400 mb-4 max-w-sm">
            Drag & drop your existing PDF or DOCX resume here to verify your current ATS score instantly.
          </p>

          <label className="w-full h-32 border-2 border-dashed border-slate-800 hover:border-pink-500/30 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-slate-900/20 transition-all select-none group relative">
            <input 
              type="file" 
              accept=".pdf,.docx,.doc" 
              className="hidden" 
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleGuestUpload(file);
              }}
            />
            <span className="text-xs font-semibold text-slate-350 group-hover:text-pink-400 transition-colors">
              Drop file here or browse files
            </span>
            <span className="text-[10px] text-slate-500 mt-1">
              Supports PDF and Word (DOCX) up to 5MB
            </span>
          </label>
        </motion.div>
        
        {/* Scroll Train of Interactive 3D Resumes */}
        <div ref={containerRef} className="w-full overflow-hidden py-12 relative mt-8">
          <div className="absolute inset-0 bg-pink-500/5 rounded-3xl blur-3xl pointer-events-none z-0" />
          <motion.div 
            style={{ x: xTranslation }} 
            className="flex gap-8 justify-start items-center w-[160%] md:w-[120%] select-none relative z-10 pl-[5%]"
          >
            {/* Card 1: Marketing Manager */}
            <ResumeCard 
              avatar="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150"
              name="Elena Rostova"
              role="Marketing Manager"
              icon1="💼"
              job1Title="Brand Lead @ Stripe"
              job1Dates="Aug 2023 - Present"
              icon2="📈"
              job2Title="Marketing Strategist"
              job2Dates="Jan 2021 - Aug 2023"
              educationTitle="University of California"
              educationDegree="Bachelor of Business Administration"
              skills={[
                { name: "Digital Marketing", value: 90 },
                { name: "Social Growth", value: 85 },
                { name: "Brand Strategy", value: 75 },
                { name: "SEO & SEM", value: 80 }
              ]}
            />

            {/* Card 2: Software Engineer */}
            <ResumeCard 
              avatar="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150"
              name="Marcus Vance"
              role="Software Engineer"
              icon1="💻"
              job1Title="Senior Engineer @ Meta"
              job1Dates="Mar 2022 - Present"
              icon2="⚙️"
              job2Title="Full Stack Developer"
              job2Dates="Jun 2019 - Feb 2022"
              educationTitle="Stanford University"
              educationDegree="B.S. in Computer Science"
              skills={[
                { name: "React & Next.js", value: 95 },
                { name: "Node.js & Go", value: 90 },
                { name: "System Architecture", value: 85 },
                { name: "Cloud Computing", value: 80 }
              ]}
            />

            {/* Card 3: Product Designer */}
            <ResumeCard 
              avatar="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"
              name="Sarah Jenkins"
              role="Product Designer"
              icon1="🎨"
              job1Title="UI/UX Designer @ Airbnb"
              job1Dates="Oct 2022 - Present"
              icon2="📐"
              job2Title="Product Illustrator"
              job2Dates="Sep 2020 - Sep 2022"
              educationTitle="Rhode Island School of Design"
              educationDegree="B.F.A. in Industrial Design"
              skills={[
                { name: "Figma & Design Systems", value: 98 },
                { name: "User Research", value: 85 },
                { name: "Prototyping", value: 90 },
                { name: "Interaction Design", value: 88 }
              ]}
            />
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 md:py-32 px-6 max-w-7xl mx-auto border-t border-slate-900">
        <div className="text-center mb-16 md:mb-24">
          <h2 className="text-3xl md:text-5xl font-display font-extrabold tracking-tight text-foreground mb-4">
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
                <h3 className="text-xl font-bold font-display text-foreground mb-3">{feat.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{feat.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 md:py-32 px-6 max-w-7xl mx-auto border-t border-slate-900">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-display font-extrabold tracking-tight text-foreground mb-4">
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
                  <h4 className="text-sm font-bold text-foreground">{t.author}</h4>
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
          <h2 className="text-3xl md:text-5xl font-display font-extrabold tracking-tight text-foreground mb-4">
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
                <h3 className="text-lg font-bold font-display text-foreground mb-2">{tier.name}</h3>
                <p className="text-slate-400 text-xs mb-6 min-h-[36px]">{tier.description}</p>
                <div className="flex items-baseline gap-1 mb-8">
                  <span className="text-4xl font-extrabold text-foreground">{tier.price}</span>
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
          <h2 className="text-3xl md:text-5xl font-display font-extrabold tracking-tight text-foreground mb-4">
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
                <span className="font-bold text-sm md:text-base text-foreground">{faq.q}</span>
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
            <span className="font-display font-bold text-base text-foreground">CVItAI</span>
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

      {/* ATS Check Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 overflow-hidden relative flex flex-col max-h-[85vh]"
            >
              <button 
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-all"
              >
                <X className="w-4 h-4" />
              </button>

              <h2 className="font-display font-extrabold text-xl text-white mb-6 tracking-tight text-left">
                ATS Analysis Report
              </h2>

              {guestLoading ? (
                <div className="flex-1 flex flex-col items-center justify-center py-12 space-y-4">
                  <Loader2 className="w-10 h-10 text-pink-500 animate-spin" />
                  <div className="text-sm font-bold text-white uppercase tracking-wider">AI Scan in Progress</div>
                  <div className="text-xs text-slate-400 font-mono animate-pulse">{guestLogs}</div>
                </div>
              ) : guestReview ? (
                <div className="flex-1 flex flex-col relative min-h-[350px]">
                  {/* Blurred Background Preview */}
                  <div className="flex-1 overflow-y-auto space-y-6 pr-1 filter blur-md select-none pointer-events-none opacity-25">
                    {/* Score circle */}
                    <div className="flex items-center gap-6 p-4 bg-slate-950/40 rounded-xl border border-slate-850">
                      <div className="relative w-20 h-20 shrink-0">
                        <svg className="w-full h-full transform -rotate-90">
                          <circle 
                            cx="40" 
                            cy="40" 
                            r="34" 
                            className="stroke-slate-850 fill-none" 
                            strokeWidth="6" 
                          />
                          <circle 
                            cx="40" 
                            cy="40" 
                            r="34" 
                            className="stroke-pink-500 fill-none" 
                            strokeWidth="6" 
                            strokeDasharray={2 * Math.PI * 34}
                            strokeDashoffset={2 * Math.PI * 34 * 0.3}
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center font-mono font-bold text-lg text-white">
                          85
                        </div>
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-white">ATS Optimization Match</h3>
                        <p className="text-xs text-slate-400 mt-1">
                          Your resume shows compliance with professional standard ATS filters.
                        </p>
                      </div>
                    </div>

                    {/* Feedback block */}
                    <div className="p-4 bg-slate-950/20 rounded-xl border border-slate-850 space-y-2">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Recruiter Verdict</h4>
                      <p className="text-xs text-slate-350 leading-relaxed">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                      </p>
                    </div>
                  </div>

                  {/* High Contrast Authentication Overlay */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-slate-900/60 rounded-2xl z-10">
                    <div className="w-12 h-12 rounded-full bg-pink-500/10 text-pink-500 flex items-center justify-center mb-4 border border-pink-500/20">
                      <Sparkles className="w-6 h-6 animate-pulse" />
                    </div>
                    
                    <h3 className="font-display font-extrabold text-lg text-white mb-2 tracking-tight">
                      Scorecard Ready to Unlock!
                    </h3>
                    
                    <p className="text-xs text-slate-300 leading-relaxed mb-6 max-w-sm">
                      We have extracted your resume details and calculated your ATS score. Register or log in to view your complete breakdown and 5-6 actionable improvements.
                    </p>

                    <div className="w-full flex flex-col gap-3">
                      <Link 
                        href="/register" 
                        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 text-xs transition-all shadow-lg shadow-indigo-650/25"
                      >
                        Create Free Account <ArrowRight className="w-4 h-4" />
                      </Link>
                      <Link 
                        href="/login" 
                        className="w-full bg-slate-950 hover:bg-slate-900 border border-slate-850 text-slate-200 font-semibold py-3 rounded-xl flex items-center justify-center text-xs transition-all"
                      >
                        Log In to Existing Account
                      </Link>
                    </div>

                    <p className="text-[10px] text-slate-500 mt-4">
                      Free membership includes 1 free resume review & 3 free resume creations.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-xs text-rose-450 text-center py-6">
                  {guestLogs || 'Unknown error occurred.'}
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
