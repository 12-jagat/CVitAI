'use client';

import React, { useEffect, useState, useRef, useTransition } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '../../../components/AuthProvider';
import ThemeToggle from '../../../components/ThemeToggle';
import { resumeApi, aiApi } from '../../../lib/api';
import { Resume, Experience, Education, Skill, Project, Certification, Language, Achievement, Review, JobMatchResults } from '../../../types';
import { ResumeTemplateSelector } from '../../../components/ResumeTemplates';
import { 
  ArrowLeft, 
  Sparkles, 
  Download, 
  Eye, 
  Search, 
  AlertCircle, 
  Loader2, 
  Check, 
  Plus, 
  Trash2, 
  ChevronDown, 
  ChevronUp, 
  Maximize2,
  FileText,
  AlignLeft,
  Briefcase,
  GraduationCap,
  Hammer,
  Kanban,
  Award,
  Globe2,
  Trophy,
  Save,
  BrainCircuit,
  Settings,
  Grid
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Imports for client-side DOCX export
import { Document as DocxDocument, Packer, Paragraph as DocxParagraph, TextRun as DocxTextRun, HeadingLevel, AlignmentType } from 'docx';

export default function BuilderPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  // Resume states
  const [resume, setResume] = useState<Resume | null>(null);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'error'>('saved');
  const [activeSection, setActiveSection] = useState<string>('personalInfo');
  const [zoom, setZoom] = useState<number>(100);
  const [fontStyle, setFontStyle] = useState('sans');
  const [fontSize, setFontSize] = useState('md');
  const [textColor, setTextColor] = useState('plum');

  // AI states
  const [aiActiveTab, setAiActiveTab] = useState<'none' | 'review' | 'match'>('none');
  const [reviewLoading, setReviewLoading] = useState(false);
  const [latestReview, setLatestReview] = useState<Review | null>(null);
  const [jobDescription, setJobDescription] = useState('');
  const [matchLoading, setMatchLoading] = useState(false);
  const [matchResults, setMatchResults] = useState<JobMatchResults | null>(null);
  const [bulletLoading, setBulletLoading] = useState<string | null>(null);

  // Refs for auto-saving
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const resumeRef = useRef<HTMLDivElement | null>(null);

  // Fetch resume on init
  useEffect(() => {
    const fetchResumeData = async () => {
      try {
        setLoading(true);
        const data = await resumeApi.getById(id);
        if (data.success && data.resume) {
          setResume(data.resume);
        }
      } catch (err: any) {
        console.error('Failed to load resume:', err);
        router.push('/dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchResumeData();
  }, [id, router]);

  // Fetch reviews for resume
  useEffect(() => {
    if (resume) {
      const fetchReviews = async () => {
        try {
          const data = await aiApi.getReviews(resume._id);
          if (data.success && data.reviews && data.reviews.length > 0) {
            setLatestReview(data.reviews[0]);
          }
        } catch (err) {
          // Fail silently for review logs
        }
      };
      fetchReviews();
    }
  }, [resume?._id]);

  // Trigger auto-save
  const triggerAutoSave = (updatedResume: Resume) => {
    setSaveStatus('saving');
    
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(async () => {
      try {
        await resumeApi.update(updatedResume._id, updatedResume);
        setSaveStatus('saved');
      } catch (err) {
        setSaveStatus('error');
      }
    }, 1500); // Save after 1.5 seconds of idle input
  };

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  const updateResumeField = (section: keyof Resume, value: any) => {
    if (!resume) return;

    const updated = {
      ...resume,
      [section]: value,
    };
    setResume(updated);
    triggerAutoSave(updated);
  };

  const updatePersonalInfoField = (field: string, value: any) => {
    if (!resume) return;
    
    const updated = {
      ...resume,
      personalInfo: {
        ...resume.personalInfo,
        [field]: value,
      },
    };
    setResume(updated);
    triggerAutoSave(updated);
  };

  // List field updater utilities
  const addListItem = (section: 'experience' | 'education' | 'skills' | 'projects' | 'certifications' | 'languages' | 'achievements', defaultItem: any) => {
    if (!resume) return;
    const list = [...(resume[section] || []), defaultItem];
    updateResumeField(section, list);
  };

  const updateListItem = (section: 'experience' | 'education' | 'skills' | 'projects' | 'certifications' | 'languages' | 'achievements', index: number, field: string, value: any) => {
    if (!resume) return;
    const list = [...(resume[section] || [])];
    list[index] = {
      ...list[index],
      [field]: value,
    };
    updateResumeField(section, list);
  };

  const removeListItem = (section: 'experience' | 'education' | 'skills' | 'projects' | 'certifications' | 'languages' | 'achievements', index: number) => {
    if (!resume) return;
    const list = [...(resume[section] || [])].filter((_, i) => i !== index);
    updateResumeField(section, list);
  };

  // AI Review trigger
  const runAIsScan = async () => {
    if (!resume) return;
    try {
      setReviewLoading(true);
      setAiActiveTab('review');
      const data = await aiApi.review(resume._id);
      if (data.success && data.review) {
        setLatestReview(data.review);
      }
    } catch (err: any) {
      alert(err.message || 'ATS Review failed.');
    } finally {
      setReviewLoading(false);
    }
  };

  // Job Match trigger
  const runJobMatch = async () => {
    if (!resume || !jobDescription.trim()) return;
    try {
      setMatchLoading(true);
      setAiActiveTab('match');
      const data = await aiApi.matchJob(resume._id, jobDescription);
      if (data.success && data.matchResults) {
        setMatchResults(data.matchResults);
      }
    } catch (err: any) {
      alert(err.message || 'Job match analysis failed.');
    } finally {
      setMatchLoading(false);
    }
  };

  // Auto-rewrite bullet point trigger
  const handleImproveBullet = async (expIndex: number) => {
    if (!resume || !resume.experience[expIndex]?.description) return;
    const exp = resume.experience[expIndex];
    const bullets = exp.description.split('\n').filter(Boolean);

    try {
      setBulletLoading(`exp-${expIndex}`);
      const data = await aiApi.improveBullets(bullets, resume.personalInfo.jobTitle);
      if (data.success && data.improvedBullets) {
        updateListItem('experience', expIndex, 'description', data.improvedBullets.join('\n'));
      }
    } catch (err: any) {
      alert(err.message || 'Bullet point rewrite failed.');
    } finally {
      setBulletLoading(null);
    }
  };

  // Client PDF print trigger
  const printPdf = () => {
    window.print();
  };

  // Client Word DOCX exporter
  const exportWord = async () => {
    if (!resume) return;

    try {
      const doc = new DocxDocument({
        sections: [
          {
            properties: {},
            children: [
              new DocxParagraph({
                text: `${resume.personalInfo.firstName || ''} ${resume.personalInfo.lastName || ''}`.trim() || 'Name',
                heading: HeadingLevel.HEADING_1,
                alignment: AlignmentType.CENTER,
              }),
              new DocxParagraph({
                text: resume.personalInfo.jobTitle || 'Job Title',
                alignment: AlignmentType.CENTER,
              }),
              new DocxParagraph({
                text: `${resume.personalInfo.email || ''} | ${resume.personalInfo.phone || ''} | ${resume.personalInfo.location || ''}`,
                alignment: AlignmentType.CENTER,
              }),
              new DocxParagraph({
                text: '',
              }),
              new DocxParagraph({
                text: 'SUMMARY',
                heading: HeadingLevel.HEADING_2,
              }),
              new DocxParagraph({
                text: resume.summary || 'Summary details go here.',
              }),
              new DocxParagraph({
                text: '',
              }),
              new DocxParagraph({
                text: 'EXPERIENCE',
                heading: HeadingLevel.HEADING_2,
              }),
              ...resume.experience.flatMap((exp) => [
                new DocxParagraph({
                  children: [
                    new DocxTextRun({ text: `${exp.position} - ${exp.company}`, bold: true }),
                  ],
                }),
                new DocxParagraph({
                  text: `${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}`,
                }),
                new DocxParagraph({
                  text: exp.description,
                }),
              ]),
              new DocxParagraph({
                text: '',
              }),
              new DocxParagraph({
                text: 'EDUCATION',
                heading: HeadingLevel.HEADING_2,
              }),
              ...resume.education.flatMap((edu) => [
                new DocxParagraph({
                  children: [
                    new DocxTextRun({ text: `${edu.degree} in ${edu.fieldOfStudy}`, bold: true }),
                  ],
                }),
                new DocxParagraph({
                  text: `${edu.school} (${edu.startDate} - ${edu.endDate})`,
                }),
              ]),
            ],
          },
        ],
      });

      const blob = await Packer.toBlob(doc);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${resume.title.replace(/\s+/g, '_')}.docx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      alert('Word document generation failed.');
    }
  };

  if (loading || !resume) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
      </div>
    );
  }

  // Accordion Section Config
  const sections = [
    { id: 'personalInfo', name: 'Personal Details', icon: <FileText className="w-4 h-4" /> },
    { id: 'summary', name: 'Summary', icon: <AlignLeft className="w-4 h-4" /> },
    { id: 'experience', name: 'Work History', icon: <Briefcase className="w-4 h-4" /> },
    { id: 'education', name: 'Education', icon: <GraduationCap className="w-4 h-4" /> },
    { id: 'skills', name: 'Expertise / Skills', icon: <Hammer className="w-4 h-4" /> },
    { id: 'projects', name: 'Projects', icon: <Kanban className="w-4 h-4" /> },
    { id: 'certifications', name: 'Credentials', icon: <Award className="w-4 h-4" /> },
    { id: 'languages', name: 'Languages', icon: <Globe2 className="w-4 h-4" /> },
    { id: 'achievements', name: 'Awards', icon: <Trophy className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans overflow-hidden">
      {/* Top Navbar */}
      <nav className="glass border-b border-slate-900 px-6 py-3.5 flex items-center justify-between no-print shrink-0 relative z-30">
        <div className="flex items-center gap-4">
          <Link 
            href="/dashboard" 
            className="p-2 rounded-lg hover:bg-pink-100 text-slate-700 hover:text-pink-600 transition-all"
            title="Back to Dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="flex flex-col text-left">
            <input 
              type="text" 
              value={resume.title}
              onChange={(e) => updateResumeField('title', e.target.value)}
              className="bg-transparent border-b border-transparent focus:border-pink-500 font-bold text-sm text-slate-100 px-0.5 outline-none tracking-tight"
            />
            {/* Auto-save status logs */}
            <span className="text-[10px] text-slate-600 mt-0.5 font-medium flex items-center gap-1.5 select-none">
              {saveStatus === 'saved' && <><Check className="w-3.5 h-3.5 text-emerald-600" /> Changes saved</>}
              {saveStatus === 'saving' && <><Loader2 className="w-3.5 h-3.5 text-pink-600 animate-spin" /> Saving changes...</>}
              {saveStatus === 'error' && <><AlertCircle className="w-3.5 h-3.5 text-rose-600" /> Save failed</>}
            </span>
          </div>
        </div>

        {/* Template Selectors & Zoom Bar */}
        <div className="flex items-center gap-3">
          <select 
            value={resume.templateId}
            onChange={(e) => updateResumeField('templateId', e.target.value)}
            className="bg-slate-900 border border-slate-800 focus:border-indigo-500 text-slate-200 text-xs font-semibold py-1.5 px-3 rounded-lg outline-none cursor-pointer"
          >
            <optgroup label="Modern Layouts">
              <option value="modern-indigo">Modern Indigo</option>
              <option value="modern-rose">Modern Rose</option>
              <option value="modern-emerald">Modern Emerald</option>
              <option value="modern-amber">Modern Amber</option>
              <option value="modern-slate">Modern Slate</option>
            </optgroup>
            <optgroup label="Minimal Layouts">
              <option value="minimal-indigo">Minimal Indigo</option>
              <option value="minimal-rose">Minimal Rose</option>
              <option value="minimal-emerald">Minimal Emerald</option>
              <option value="minimal-amber">Minimal Amber</option>
              <option value="minimal-slate">Minimal Slate</option>
            </optgroup>
            <optgroup label="Developer Layouts">
              <option value="tech-indigo">Developer Indigo</option>
              <option value="tech-rose">Developer Rose</option>
              <option value="tech-emerald">Developer Emerald</option>
              <option value="tech-amber">Developer Amber</option>
              <option value="tech-slate">Developer Slate</option>
            </optgroup>
            <optgroup label="Classic Layouts">
              <option value="elegant-indigo">Classic Indigo</option>
              <option value="elegant-rose">Classic Rose</option>
              <option value="elegant-emerald">Classic Emerald</option>
              <option value="elegant-amber">Classic Amber</option>
              <option value="elegant-slate">Classic Slate</option>
            </optgroup>
          </select>

          {/* Font Selector */}
          <select 
            value={fontStyle}
            onChange={(e) => setFontStyle(e.target.value)}
            className="bg-slate-900 border border-slate-800 focus:border-indigo-500 text-slate-200 text-xs font-semibold py-1.5 px-3 rounded-lg outline-none cursor-pointer"
            title="Font Style"
          >
            <option value="sans">Sans-Serif (Inter)</option>
            <option value="serif">Serif (Lora)</option>
            <option value="mono">Monospace (Code)</option>
          </select>

          {/* Size Selector */}
          <select 
            value={fontSize}
            onChange={(e) => setFontSize(e.target.value)}
            className="bg-slate-900 border border-slate-800 focus:border-indigo-500 text-slate-200 text-xs font-semibold py-1.5 px-3 rounded-lg outline-none cursor-pointer"
            title="Font Size"
          >
            <option value="sm">Small Text</option>
            <option value="md">Medium Text</option>
            <option value="lg">Large Text</option>
          </select>

          {/* Text Color Selector */}
          <select 
            value={textColor}
            onChange={(e) => setTextColor(e.target.value)}
            className="bg-slate-900 border border-slate-800 focus:border-indigo-500 text-slate-200 text-xs font-semibold py-1.5 px-3 rounded-lg outline-none cursor-pointer"
            title="Text Color"
          >
            <option value="plum">Deep Plum (Preferred)</option>
            <option value="charcoal">Charcoal Black</option>
            <option value="slate">Slate Gray</option>
            <option value="navy">Corporate Navy</option>
          </select>

          <button 
            onClick={runAIsScan}
            className="bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 font-semibold py-1.5 px-3.5 rounded-lg text-xs flex items-center gap-1.5 transition-all"
          >
            <Search className="w-3.5 h-3.5 text-pink-600" /> ATS Scan
          </button>

          <button 
            onClick={() => setAiActiveTab(aiActiveTab === 'match' ? 'none' : 'match')}
            className="bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 font-semibold py-1.5 px-3.5 rounded-lg text-xs flex items-center gap-1.5 transition-all"
          >
            <BrainCircuit className="w-3.5 h-3.5 text-pink-600" /> Job Match
          </button>

          <button 
            onClick={printPdf}
            className="bg-pink-600 hover:bg-pink-500 text-white font-bold py-1.5 px-4 rounded-lg text-xs flex items-center gap-1.5 shadow-lg shadow-pink-200/50 transition-all"
          >
            <Download className="w-3.5 h-3.5" /> PDF
          </button>

          <button 
            onClick={exportWord}
            className="bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 font-semibold py-1.5 px-3.5 rounded-lg text-xs flex items-center gap-1.5 transition-all"
          >
            <FileText className="w-3.5 h-3.5 text-pink-600" /> DOCX
          </button>
          
          <ThemeToggle />
        </div>
      </nav>

      {/* Main Builder Grid */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* Left Input Sidebar */}
        <div className="w-[45%] border-r border-slate-900 bg-slate-950/40 p-6 flex flex-col justify-between overflow-y-auto no-scrollbar no-print shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <Settings className="w-4 h-4 text-slate-500" />
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Resume Builder Sections</span>
            </div>

            {/* Collapsible Accordion sections */}
            <div className="space-y-3">
              {sections.map((sect) => (
                <div key={sect.id} className="rounded-xl border border-slate-900 overflow-hidden bg-slate-900/10">
                  <button
                    onClick={() => setActiveSection(activeSection === sect.id ? '' : sect.id)}
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-900/35 transition-all"
                  >
                    <span className="flex items-center gap-3 text-xs md:text-sm font-bold text-slate-200">
                      <span className="text-slate-550">{sect.icon}</span>
                      {sect.name}
                    </span>
                    {activeSection === sect.id ? <ChevronUp className="w-4 h-4 text-slate-550" /> : <ChevronDown className="w-4 h-4 text-slate-550" />}
                  </button>

                  <AnimatePresence>
                    {activeSection === sect.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.18 }}
                      >
                        <div className="p-5 border-t border-slate-950 bg-slate-950/20 text-left space-y-4">
                          
                          {/* Personal Info fields */}
                          {sect.id === 'personalInfo' && (
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-500 uppercase">First Name</label>
                                <input 
                                  type="text" 
                                  value={resume.personalInfo.firstName}
                                  onChange={(e) => updatePersonalInfoField('firstName', e.target.value)}
                                  className="w-full bg-slate-950 border border-slate-900 focus:border-indigo-500 rounded-lg py-2 px-3.5 text-xs text-slate-100 placeholder:text-slate-650 outline-none"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-500 uppercase">Last Name</label>
                                <input 
                                  type="text" 
                                  value={resume.personalInfo.lastName}
                                  onChange={(e) => updatePersonalInfoField('lastName', e.target.value)}
                                  className="w-full bg-slate-950 border border-slate-900 focus:border-indigo-500 rounded-lg py-2 px-3.5 text-xs text-slate-100 placeholder:text-slate-650 outline-none"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-500 uppercase">Email</label>
                                <input 
                                  type="email" 
                                  value={resume.personalInfo.email}
                                  onChange={(e) => updatePersonalInfoField('email', e.target.value)}
                                  className="w-full bg-slate-950 border border-slate-900 focus:border-indigo-500 rounded-lg py-2 px-3.5 text-xs text-slate-100 placeholder:text-slate-650 outline-none"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-500 uppercase">Phone</label>
                                <input 
                                  type="text" 
                                  value={resume.personalInfo.phone}
                                  onChange={(e) => updatePersonalInfoField('phone', e.target.value)}
                                  className="w-full bg-slate-950 border border-slate-900 focus:border-indigo-500 rounded-lg py-2 px-3.5 text-xs text-slate-100 placeholder:text-slate-650 outline-none"
                                />
                              </div>
                              <div className="space-y-1 col-span-2">
                                <label className="text-[10px] font-bold text-slate-500 uppercase">Job Title</label>
                                <input 
                                  type="text" 
                                  value={resume.personalInfo.jobTitle}
                                  onChange={(e) => updatePersonalInfoField('jobTitle', e.target.value)}
                                  className="w-full bg-slate-950 border border-slate-900 focus:border-indigo-500 rounded-lg py-2 px-3.5 text-xs text-slate-100 placeholder:text-slate-650 outline-none"
                                />
                              </div>
                              <div className="space-y-1 col-span-2">
                                <label className="text-[10px] font-bold text-slate-500 uppercase">Location</label>
                                <input 
                                  type="text" 
                                  value={resume.personalInfo.location}
                                  onChange={(e) => updatePersonalInfoField('location', e.target.value)}
                                  className="w-full bg-slate-950 border border-slate-900 focus:border-indigo-500 rounded-lg py-2 px-3.5 text-xs text-slate-100 placeholder:text-slate-655 outline-none"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-500 uppercase">Website</label>
                                <input 
                                  type="text" 
                                  value={resume.personalInfo.website}
                                  onChange={(e) => updatePersonalInfoField('website', e.target.value)}
                                  className="w-full bg-slate-950 border border-slate-900 focus:border-indigo-500 rounded-lg py-2 px-3.5 text-xs text-slate-100 placeholder:text-slate-655 outline-none"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-500 uppercase">GitHub</label>
                                <input 
                                  type="text" 
                                  value={resume.personalInfo.github}
                                  onChange={(e) => updatePersonalInfoField('github', e.target.value)}
                                  className="w-full bg-slate-950 border border-slate-900 focus:border-indigo-500 rounded-lg py-2 px-3.5 text-xs text-slate-100 placeholder:text-slate-655 outline-none"
                                />
                              </div>
                            </div>
                          )}

                          {/* Summary fields */}
                          {sect.id === 'summary' && (
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-slate-500 uppercase">Professional Summary</label>
                              <textarea 
                                value={resume.summary}
                                rows={5}
                                onChange={(e) => updateResumeField('summary', e.target.value)}
                                className="w-full bg-slate-950 border border-slate-900 focus:border-indigo-500 rounded-lg p-3 text-xs text-slate-100 placeholder:text-slate-650 outline-none resize-none leading-relaxed"
                                placeholder="Describe your career goals, accomplishments, and value..."
                              />
                            </div>
                          )}

                          {/* Experience list */}
                          {sect.id === 'experience' && (
                            <div className="space-y-6">
                              {resume.experience.map((exp, expIdx) => (
                                <div key={exp._id || expIdx} className="p-4 rounded-xl border border-slate-900 relative bg-slate-950/25 space-y-4">
                                  <button 
                                    onClick={() => removeListItem('experience', expIdx)}
                                    className="absolute top-3 right-3 text-slate-500 hover:text-rose-400 p-1 rounded-lg hover:bg-slate-900 transition-all"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>

                                  <div className="grid grid-cols-2 gap-4 text-left">
                                    <div className="space-y-1">
                                      <label className="text-[9px] font-bold text-slate-500 uppercase">Company</label>
                                      <input 
                                        type="text" 
                                        value={exp.company}
                                        onChange={(e) => updateListItem('experience', expIdx, 'company', e.target.value)}
                                        className="w-full bg-slate-950 border border-slate-900 focus:border-indigo-500 rounded-lg py-1.5 px-3 text-xs text-slate-100 outline-none"
                                      />
                                    </div>
                                    <div className="space-y-1">
                                      <label className="text-[9px] font-bold text-slate-500 uppercase">Position</label>
                                      <input 
                                        type="text" 
                                        value={exp.position}
                                        onChange={(e) => updateListItem('experience', expIdx, 'position', e.target.value)}
                                        className="w-full bg-slate-950 border border-slate-900 focus:border-indigo-500 rounded-lg py-1.5 px-3 text-xs text-slate-100 outline-none"
                                      />
                                    </div>
                                    <div className="space-y-1">
                                      <label className="text-[9px] font-bold text-slate-500 uppercase">Start Date</label>
                                      <input 
                                        type="text" 
                                        value={exp.startDate}
                                        onChange={(e) => updateListItem('experience', expIdx, 'startDate', e.target.value)}
                                        className="w-full bg-slate-950 border border-slate-900 focus:border-indigo-500 rounded-lg py-1.5 px-3 text-xs text-slate-100 outline-none"
                                        placeholder="MM/YYYY"
                                      />
                                    </div>
                                    <div className="space-y-1">
                                      <label className="text-[9px] font-bold text-slate-500 uppercase">End Date</label>
                                      <input 
                                        type="text" 
                                        value={exp.endDate}
                                        onChange={(e) => updateListItem('experience', expIdx, 'endDate', e.target.value)}
                                        disabled={exp.current}
                                        className="w-full bg-slate-950 border border-slate-900 focus:border-indigo-500 disabled:opacity-40 rounded-lg py-1.5 px-3 text-xs text-slate-100 outline-none"
                                        placeholder="MM/YYYY"
                                      />
                                    </div>
                                    
                                    <div className="col-span-2 flex items-center gap-2">
                                      <input 
                                        type="checkbox" 
                                        id={`curr-${expIdx}`}
                                        checked={exp.current}
                                        onChange={(e) => updateListItem('experience', expIdx, 'current', e.target.checked)}
                                        className="rounded border-slate-800 bg-slate-950 accent-indigo-600"
                                      />
                                      <label htmlFor={`curr-${expIdx}`} className="text-[10px] font-bold text-slate-400 select-none cursor-pointer">I currently work here</label>
                                    </div>

                                    <div className="col-span-2 space-y-1">
                                      <div className="flex justify-between items-baseline mb-1">
                                        <label className="text-[9px] font-bold text-slate-500 uppercase">Responsibilities & Achievements</label>
                                        
                                        <button
                                          onClick={() => handleImproveBullet(expIdx)}
                                          disabled={bulletLoading === `exp-${expIdx}`}
                                          className="text-[9px] font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 uppercase transition-all"
                                        >
                                          {bulletLoading === `exp-${expIdx}` ? (
                                            <><Loader2 className="w-2.5 h-2.5 animate-spin" /> Rewriting...</>
                                          ) : (
                                            <><Sparkles className="w-2.5 h-2.5" /> Gemini Rewrite</>
                                          )}
                                        </button>
                                      </div>
                                      <textarea 
                                        value={exp.description}
                                        rows={4}
                                        onChange={(e) => updateListItem('experience', expIdx, 'description', e.target.value)}
                                        className="w-full bg-slate-950 border border-slate-900 focus:border-indigo-500 rounded-lg p-2.5 text-xs text-slate-100 outline-none resize-none font-mono"
                                        placeholder="- Engineered microservices using Nest.js and Node.js&#10;- Reduced API response latencies by 30%"
                                      />
                                    </div>
                                  </div>
                                </div>
                              ))}
                              
                              <button
                                onClick={() => addListItem('experience', { company: '', position: '', startDate: '', endDate: '', current: false, description: '' })}
                                className="w-full py-2.5 bg-slate-900 border border-slate-850 hover:border-slate-800 text-slate-300 font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 transition-all"
                              >
                                <Plus className="w-3.5 h-3.5" /> Add Work Experience
                              </button>
                            </div>
                          )}

                          {/* Education list */}
                          {sect.id === 'education' && (
                            <div className="space-y-6">
                              {resume.education.map((edu, eduIdx) => (
                                <div key={edu._id || eduIdx} className="p-4 rounded-xl border border-slate-900 relative bg-slate-950/25 space-y-4">
                                  <button 
                                    onClick={() => removeListItem('education', eduIdx)}
                                    className="absolute top-3 right-3 text-slate-500 hover:text-rose-400 p-1 rounded-lg hover:bg-slate-900 transition-all"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>

                                  <div className="grid grid-cols-2 gap-4 text-left">
                                    <div className="space-y-1">
                                      <label className="text-[9px] font-bold text-slate-500 uppercase">School / Institution</label>
                                      <input 
                                        type="text" 
                                        value={edu.school}
                                        onChange={(e) => updateListItem('education', eduIdx, 'school', e.target.value)}
                                        className="w-full bg-slate-950 border border-slate-900 focus:border-indigo-500 rounded-lg py-1.5 px-3 text-xs text-slate-100 outline-none"
                                      />
                                    </div>
                                    <div className="space-y-1">
                                      <label className="text-[9px] font-bold text-slate-500 uppercase">Degree</label>
                                      <input 
                                        type="text" 
                                        value={edu.degree}
                                        onChange={(e) => updateListItem('education', eduIdx, 'degree', e.target.value)}
                                        className="w-full bg-slate-950 border border-slate-900 focus:border-indigo-500 rounded-lg py-1.5 px-3 text-xs text-slate-100 outline-none"
                                        placeholder="Bachelor of Science"
                                      />
                                    </div>
                                    <div className="space-y-1">
                                      <label className="text-[9px] font-bold text-slate-500 uppercase">Field of Study</label>
                                      <input 
                                        type="text" 
                                        value={edu.fieldOfStudy}
                                        onChange={(e) => updateListItem('education', eduIdx, 'fieldOfStudy', e.target.value)}
                                        className="w-full bg-slate-950 border border-slate-900 focus:border-indigo-500 rounded-lg py-1.5 px-3 text-xs text-slate-100 outline-none"
                                        placeholder="Computer Science"
                                      />
                                    </div>
                                    <div className="space-y-1">
                                      <label className="text-[9px] font-bold text-slate-500 uppercase">GPA</label>
                                      <input 
                                        type="text" 
                                        value={edu.gpa}
                                        onChange={(e) => updateListItem('education', eduIdx, 'gpa', e.target.value)}
                                        className="w-full bg-slate-950 border border-slate-900 focus:border-indigo-500 rounded-lg py-1.5 px-3 text-xs text-slate-100 outline-none"
                                        placeholder="3.8 / 4.0"
                                      />
                                    </div>
                                    <div className="space-y-1">
                                      <label className="text-[9px] font-bold text-slate-500 uppercase">Start Date</label>
                                      <input 
                                        type="text" 
                                        value={edu.startDate}
                                        onChange={(e) => updateListItem('education', eduIdx, 'startDate', e.target.value)}
                                        className="w-full bg-slate-950 border border-slate-900 focus:border-indigo-500 rounded-lg py-1.5 px-3 text-xs text-slate-100 outline-none"
                                        placeholder="YYYY"
                                      />
                                    </div>
                                    <div className="space-y-1">
                                      <label className="text-[9px] font-bold text-slate-500 uppercase">End Date</label>
                                      <input 
                                        type="text" 
                                        value={edu.endDate}
                                        onChange={(e) => updateListItem('education', eduIdx, 'endDate', e.target.value)}
                                        className="w-full bg-slate-950 border border-slate-900 focus:border-indigo-500 rounded-lg py-1.5 px-3 text-xs text-slate-100 outline-none"
                                        placeholder="YYYY"
                                      />
                                    </div>
                                  </div>
                                </div>
                              ))}
                              
                              <button
                                onClick={() => addListItem('education', { school: '', degree: '', fieldOfStudy: '', startDate: '', endDate: '', current: false })}
                                className="w-full py-2.5 bg-slate-900 border border-slate-850 hover:border-slate-800 text-slate-300 font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 transition-all"
                              >
                                <Plus className="w-3.5 h-3.5" /> Add Academic Credential
                              </button>
                            </div>
                          )}

                          {/* Skills lists */}
                          {sect.id === 'skills' && (
                            <div className="space-y-4">
                              <div className="flex flex-wrap gap-2 mb-2">
                                {resume.skills.map((skill, skIdx) => (
                                  <div 
                                    key={skill._id || skIdx}
                                    className="bg-slate-900 border border-slate-800 rounded-lg py-1.5 pl-3 pr-2 flex items-center gap-2 text-xs"
                                  >
                                    <span>{skill.name}</span>
                                    <button 
                                      onClick={() => removeListItem('skills', skIdx)}
                                      className="text-slate-500 hover:text-rose-450 p-0.5 rounded transition-all"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </button>
                                  </div>
                                ))}
                              </div>

                              <div className="flex gap-2">
                                <input 
                                  type="text" 
                                  id="new-skill-input"
                                  placeholder="e.g. React, Docker, SQL"
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                      const input = e.currentTarget;
                                      if (input.value.trim()) {
                                        addListItem('skills', { name: input.value.trim(), level: 'Expert' });
                                        input.value = '';
                                      }
                                    }
                                  }}
                                  className="w-full bg-slate-950 border border-slate-900 focus:border-indigo-500 rounded-lg py-2 px-3 text-xs text-slate-100 outline-none"
                                />
                                <button 
                                  onClick={() => {
                                    const input = document.getElementById('new-skill-input') as HTMLInputElement;
                                    if (input && input.value.trim()) {
                                      addListItem('skills', { name: input.value.trim(), level: 'Expert' });
                                      input.value = '';
                                    }
                                  }}
                                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded-lg text-xs shrink-0 transition-all"
                                >
                                  Add
                                </button>
                              </div>
                            </div>
                           )}

                          {/* Projects list */}
                          {sect.id === 'projects' && (
                            <div className="space-y-6">
                              {resume.projects && resume.projects.map((proj, projIdx) => (
                                <div key={proj._id || projIdx} className="p-4 rounded-xl border border-slate-900 relative bg-slate-950/25 space-y-4">
                                  <button 
                                    onClick={() => removeListItem('projects', projIdx)}
                                    className="absolute top-3 right-3 text-slate-500 hover:text-rose-400 p-1 rounded-lg hover:bg-slate-900 transition-all"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>

                                  <div className="grid grid-cols-2 gap-4 text-left">
                                    <div className="col-span-2 space-y-1">
                                      <label className="text-[9px] font-bold text-slate-500 uppercase">Project Name</label>
                                      <input 
                                        type="text" 
                                        value={proj.name}
                                        onChange={(e) => updateListItem('projects', projIdx, 'name', e.target.value)}
                                        className="w-full bg-slate-950 border border-slate-900 focus:border-indigo-500 rounded-lg py-1.5 px-3 text-xs text-slate-100 outline-none"
                                      />
                                    </div>
                                    <div className="space-y-1">
                                      <label className="text-[9px] font-bold text-slate-500 uppercase">Role / Position</label>
                                      <input 
                                        type="text" 
                                        value={proj.role || ''}
                                        onChange={(e) => updateListItem('projects', projIdx, 'role', e.target.value)}
                                        className="w-full bg-slate-950 border border-slate-900 focus:border-indigo-500 rounded-lg py-1.5 px-3 text-xs text-slate-100 outline-none"
                                      />
                                    </div>
                                    <div className="space-y-1">
                                      <label className="text-[9px] font-bold text-slate-500 uppercase">Technologies (comma separated)</label>
                                      <input 
                                        type="text" 
                                        value={proj.technologies ? proj.technologies.join(', ') : ''}
                                        onChange={(e) => updateListItem('projects', projIdx, 'technologies', e.target.value.split(',').map(s => s.trim()))}
                                        className="w-full bg-slate-950 border border-slate-900 focus:border-indigo-500 rounded-lg py-1.5 px-3 text-xs text-slate-100 outline-none"
                                        placeholder="React, node, swift"
                                      />
                                    </div>
                                    <div className="col-span-2 space-y-1">
                                      <label className="text-[9px] font-bold text-slate-500 uppercase">Description</label>
                                      <textarea 
                                        value={proj.description}
                                        rows={3}
                                        onChange={(e) => updateListItem('projects', projIdx, 'description', e.target.value)}
                                        className="w-full bg-slate-950 border border-slate-900 focus:border-indigo-500 rounded-lg p-2.5 text-xs text-slate-100 outline-none resize-none font-mono"
                                      />
                                    </div>
                                  </div>
                                </div>
                              ))}
                              
                              <button
                                onClick={() => addListItem('projects', { name: '', role: '', description: '', technologies: [] })}
                                className="w-full py-2.5 bg-slate-900 border border-slate-850 hover:border-slate-800 text-slate-300 font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 transition-all"
                              >
                                <Plus className="w-3.5 h-3.5" /> Add Project
                              </button>
                            </div>
                          )}

                          {/* Certifications list */}
                          {sect.id === 'certifications' && (
                            <div className="space-y-6">
                              {resume.certifications && resume.certifications.map((cert, certIdx) => (
                                <div key={cert._id || certIdx} className="p-4 rounded-xl border border-slate-900 relative bg-slate-950/25 space-y-4">
                                  <button 
                                    onClick={() => removeListItem('certifications', certIdx)}
                                    className="absolute top-3 right-3 text-slate-500 hover:text-rose-400 p-1 rounded-lg hover:bg-slate-900 transition-all"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>

                                  <div className="grid grid-cols-2 gap-4 text-left">
                                    <div className="space-y-1">
                                      <label className="text-[9px] font-bold text-slate-500 uppercase">Certificate Name</label>
                                      <input 
                                        type="text" 
                                        value={cert.name}
                                        onChange={(e) => updateListItem('certifications', certIdx, 'name', e.target.value)}
                                        className="w-full bg-slate-950 border border-slate-900 focus:border-indigo-500 rounded-lg py-1.5 px-3 text-xs text-slate-100 outline-none"
                                      />
                                    </div>
                                    <div className="space-y-1">
                                      <label className="text-[9px] font-bold text-slate-500 uppercase">Issuing Organization</label>
                                      <input 
                                        type="text" 
                                        value={cert.issuer}
                                        onChange={(e) => updateListItem('certifications', certIdx, 'issuer', e.target.value)}
                                        className="w-full bg-slate-950 border border-slate-900 focus:border-indigo-500 rounded-lg py-1.5 px-3 text-xs text-slate-100 outline-none"
                                      />
                                    </div>
                                    <div className="space-y-1">
                                      <label className="text-[9px] font-bold text-slate-500 uppercase">Issue Date</label>
                                      <input 
                                        type="text" 
                                        value={cert.issueDate || ''}
                                        onChange={(e) => updateListItem('certifications', certIdx, 'issueDate', e.target.value)}
                                        className="w-full bg-slate-950 border border-slate-900 focus:border-indigo-500 rounded-lg py-1.5 px-3 text-xs text-slate-100 outline-none"
                                        placeholder="MM/YYYY"
                                      />
                                    </div>
                                  </div>
                                </div>
                              ))}
                              
                              <button
                                onClick={() => addListItem('certifications', { name: '', issuer: '', issueDate: '' })}
                                className="w-full py-2.5 bg-slate-900 border border-slate-850 hover:border-slate-800 text-slate-300 font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 transition-all"
                              >
                                <Plus className="w-3.5 h-3.5" /> Add Credential / Certification
                              </button>
                            </div>
                          )}

                          {/* Languages list */}
                          {sect.id === 'languages' && (
                            <div className="space-y-6">
                              {resume.languages && resume.languages.map((lang, langIdx) => (
                                <div key={lang._id || langIdx} className="p-4 rounded-xl border border-slate-900 relative bg-slate-950/25 space-y-4">
                                  <button 
                                    onClick={() => removeListItem('languages', langIdx)}
                                    className="absolute top-3 right-3 text-slate-500 hover:text-rose-455 p-1 rounded-lg hover:bg-slate-900 transition-all"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>

                                  <div className="grid grid-cols-2 gap-4 text-left">
                                    <div className="space-y-1">
                                      <label className="text-[9px] font-bold text-slate-500 uppercase">Language</label>
                                      <input 
                                        type="text" 
                                        value={lang.name}
                                        onChange={(e) => updateListItem('languages', langIdx, 'name', e.target.value)}
                                        className="w-full bg-slate-950 border border-slate-900 focus:border-indigo-500 rounded-lg py-1.5 px-3 text-xs text-slate-100 outline-none"
                                      />
                                    </div>
                                    <div className="space-y-1">
                                      <label className="text-[9px] font-bold text-slate-500 uppercase">Proficiency</label>
                                      <input 
                                        type="text" 
                                        value={lang.proficiency}
                                        onChange={(e) => updateListItem('languages', langIdx, 'proficiency', e.target.value)}
                                        className="w-full bg-slate-950 border border-slate-900 focus:border-indigo-500 rounded-lg py-1.5 px-3 text-xs text-slate-100 outline-none"
                                        placeholder="Native, Fluent, Conversational"
                                      />
                                    </div>
                                  </div>
                                </div>
                              ))}
                              
                              <button
                                onClick={() => addListItem('languages', { name: '', proficiency: '' })}
                                className="w-full py-2.5 bg-slate-900 border border-slate-850 hover:border-slate-800 text-slate-300 font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 transition-all"
                              >
                                <Plus className="w-3.5 h-3.5" /> Add Language
                              </button>
                            </div>
                          )}

                          {/* Achievements list */}
                          {sect.id === 'achievements' && (
                            <div className="space-y-6">
                              {resume.achievements && resume.achievements.map((ach, achIdx) => (
                                <div key={ach._id || achIdx} className="p-4 rounded-xl border border-slate-900 relative bg-slate-950/25 space-y-4">
                                  <button 
                                    onClick={() => removeListItem('achievements', achIdx)}
                                    className="absolute top-3 right-3 text-slate-500 hover:text-rose-455 p-1 rounded-lg hover:bg-slate-900 transition-all"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>

                                  <div className="grid grid-cols-2 gap-4 text-left">
                                    <div className="col-span-2 space-y-1">
                                      <label className="text-[9px] font-bold text-slate-500 uppercase">Award / Achievement Title</label>
                                      <input 
                                        type="text" 
                                        value={ach.title}
                                        onChange={(e) => updateListItem('achievements', achIdx, 'title', e.target.value)}
                                        className="w-full bg-slate-950 border border-slate-900 focus:border-indigo-500 rounded-lg py-1.5 px-3 text-xs text-slate-100 outline-none"
                                      />
                                    </div>
                                    <div className="col-span-2 space-y-1">
                                      <label className="text-[9px] font-bold text-slate-500 uppercase">Description</label>
                                      <textarea 
                                        value={ach.description || ''}
                                        rows={3}
                                        onChange={(e) => updateListItem('achievements', achIdx, 'description', e.target.value)}
                                        className="w-full bg-slate-950 border border-slate-900 focus:border-indigo-500 rounded-lg p-2.5 text-xs text-slate-100 outline-none resize-none font-mono"
                                      />
                                    </div>
                                  </div>
                                </div>
                              ))}
                              
                              <button
                                onClick={() => addListItem('achievements', { title: '', description: '' })}
                                className="w-full py-2.5 bg-slate-900 border border-slate-850 hover:border-slate-800 text-slate-300 font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 transition-all"
                              >
                                <Plus className="w-3.5 h-3.5" /> Add Award / Achievement
                              </button>
                            </div>
                          )}
                          
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Center Canvas Preview */}
        <div className="flex-1 bg-slate-900/10 p-8 overflow-y-auto no-scrollbar flex items-start justify-center relative no-print">
          <div 
            ref={resumeRef} 
            className="origin-top transition-transform duration-200"
            style={{ transform: `scale(${zoom / 100})` }}
          >
            <ResumeTemplateSelector id={resume.templateId} data={resume} fontStyle={fontStyle} fontSize={fontSize} textColor={textColor} />
          </div>

          {/* Zoom & Reset Floating panel */}
          <div className="absolute bottom-6 right-6 bg-slate-950/80 border border-slate-850 px-3 py-1.5 rounded-full flex items-center gap-3 text-xs z-10 font-bold select-none">
            <button onClick={() => setZoom(Math.max(50, zoom - 10))} className="hover:text-indigo-400 p-1 font-mono">-</button>
            <span className="font-mono text-[10px]">{zoom}%</span>
            <button onClick={() => setZoom(Math.min(150, zoom + 10))} className="hover:text-indigo-400 p-1 font-mono">+</button>
            <span className="text-slate-800">|</span>
            <button onClick={() => setZoom(100)} className="text-[10px] hover:text-indigo-400">Reset</button>
          </div>
        </div>

        {/* Collapsible Right Sidebar for AI reports */}
        <AnimatePresence>
          {aiActiveTab !== 'none' && (
            <motion.div 
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 380, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.22 }}
              className="border-l border-slate-900 bg-slate-950/90 w-[380px] h-full flex flex-col justify-between shrink-0 no-print overflow-y-auto no-scrollbar"
            >
              <div className="p-6 space-y-6">
                
                {/* Header operations */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
                    {aiActiveTab === 'review' ? 'ATS Feedback Report' : 'Job Match Tailoring'}
                  </span>
                  <button 
                    onClick={() => setAiActiveTab('none')}
                    className="text-slate-500 hover:text-white text-xs font-bold py-1 px-2 rounded hover:bg-slate-900 transition-all"
                  >
                    Close
                  </button>
                </div>

                {/* ATS Review panel */}
                {aiActiveTab === 'review' && (
                  <div className="space-y-6 text-left">
                    {reviewLoading ? (
                      <div className="py-20 flex flex-col items-center justify-center gap-4 text-slate-400 text-xs">
                        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
                        <span>Analyzing resume with Gemini AI...</span>
                      </div>
                    ) : latestReview ? (
                      <div className="space-y-6">
                        {/* Overall Score */}
                        <div className="flex items-center justify-between p-4 bg-slate-900/60 rounded-xl border border-slate-850">
                          <div>
                            <div className="text-[10px] font-bold text-slate-500 uppercase">ATS SCORE</div>
                            <div className="text-3xl font-extrabold text-white mt-1">{latestReview.atsScore}/100</div>
                          </div>
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-extrabold ${
                            latestReview.atsScore >= 80 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                          }`}>
                            {latestReview.atsScore >= 80 ? 'A+' : 'B'}
                          </div>
                        </div>

                        {/* Recruiter feedback */}
                        <div className="space-y-2">
                          <h4 className="text-xs font-bold text-white uppercase tracking-wider">Recruiter Review</h4>
                          <p className="text-xs leading-relaxed text-slate-450 bg-slate-950 p-3 rounded-lg border border-slate-900">{latestReview.recruiterFeedback}</p>
                        </div>

                        {/* Missing Skills */}
                        {latestReview.missingSkills && latestReview.missingSkills.length > 0 && (
                          <div className="space-y-2">
                            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Suggested Industry Skills</h4>
                            <div className="flex flex-wrap gap-1.5">
                              {latestReview.missingSkills.map((sk, idx) => (
                                <span key={idx} className="bg-rose-500/10 border border-rose-500/20 text-rose-450 text-[10px] font-bold px-2 py-0.5 rounded">
                                  + {sk}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Key Improvements suggestions */}
                        {latestReview.suggestions && latestReview.suggestions.length > 0 && (
                          <div className="space-y-3">
                            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Actionable Steps</h4>
                            <motion.div 
                              initial="hidden"
                              animate="show"
                              variants={{
                                hidden: { opacity: 0 },
                                show: {
                                  opacity: 1,
                                  transition: {
                                    staggerChildren: 0.15
                                  }
                                }
                              }}
                              className="space-y-3"
                            >
                              {latestReview.suggestions.map((sug, idx) => {
                                const parts = sug.split('**');
                                return (
                                  <motion.div 
                                    key={idx}
                                    variants={{
                                      hidden: { opacity: 0, y: -20, rotateX: -12 },
                                      show: { 
                                        opacity: 1, 
                                        y: 0, 
                                        rotateX: 0,
                                        transition: { 
                                          type: "spring", 
                                          stiffness: 90, 
                                          damping: 14 
                                        } 
                                      }
                                    }}
                                    className="p-3 bg-slate-900/60 dark:bg-slate-900/40 rounded-xl border border-slate-800/80 flex items-start gap-3 shadow-sm hover:border-pink-500/25 transition-colors transform-gpu"
                                    style={{ transformOrigin: "top center" }}
                                  >
                                    <div className="w-5 h-5 rounded-full bg-pink-500/10 dark:bg-pink-500/20 text-pink-600 dark:text-pink-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5 border border-pink-500/20">
                                      {idx + 1}
                                    </div>
                                    <p className="text-[11px] text-slate-400 leading-relaxed text-left">
                                      {parts.map((part, pIdx) => {
                                        if (pIdx % 2 === 1) {
                                          return <strong key={pIdx} className="text-pink-600 dark:text-pink-400 font-bold">{part}</strong>;
                                        }
                                        return part;
                                      })}
                                    </p>
                                  </motion.div>
                                );
                              })}
                            </motion.div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-20 text-xs text-slate-500">
                        No review history. Click "ATS Scan" at the top to analyze.
                      </div>
                    )}
                  </div>
                )}

                {/* Job description Match Panel */}
                {aiActiveTab === 'match' && (
                  <div className="space-y-6 text-left">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Paste Job Description</label>
                      <textarea
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                        rows={6}
                        placeholder="Paste the full job description details here..."
                        className="w-full bg-slate-950 border border-slate-900 focus:border-indigo-500 rounded-xl p-3 text-xs text-slate-100 outline-none resize-none leading-relaxed"
                      />
                      <button
                        onClick={runJobMatch}
                        disabled={matchLoading || !jobDescription.trim()}
                        className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-indigo-600/20"
                      >
                        {matchLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Compare Resume'}
                      </button>
                    </div>

                    {matchResults && (
                      <div className="space-y-5 border-t border-slate-900 pt-5">
                        <div className="flex items-center justify-between p-4 bg-slate-900/60 rounded-xl border border-slate-850">
                          <div>
                            <div className="text-[10px] font-bold text-slate-500 uppercase">MATCH SCORE</div>
                            <div className="text-2xl font-extrabold text-white mt-1">{matchResults.matchPercentage}% Matching</div>
                          </div>
                        </div>

                        {matchResults.missingKeywords && matchResults.missingKeywords.length > 0 && (
                          <div className="space-y-2">
                            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Missing JD Keywords</h4>
                            <div className="flex flex-wrap gap-1.5">
                              {matchResults.missingKeywords.map((kw, idx) => (
                                <span key={idx} className="bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-mono px-2 py-0.5 rounded">
                                  {kw}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="space-y-2">
                          <h4 className="text-xs font-bold text-white uppercase tracking-wider">Tailoring Suggestions</h4>
                          <p className="text-xs leading-relaxed text-slate-450 bg-slate-950 p-3 rounded-lg border border-slate-900">{matchResults.suggestions}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
      
      {/* Visual media print container */}
      <div className="hidden print:block absolute inset-0 z-50 bg-white">
        <ResumeTemplateSelector id={resume.templateId} data={resume} fontStyle={fontStyle} fontSize={fontSize} textColor={textColor} />
      </div>
    </div>
  );
}
