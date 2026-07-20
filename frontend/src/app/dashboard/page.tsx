'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../components/AuthProvider';
import ThemeToggle from '../../components/ThemeToggle';
import { resumeApi, aiApi } from '../../lib/api';
import { 
  Sparkles, 
  Plus, 
  Upload, 
  Trash2, 
  Copy, 
  Edit3, 
  FileText, 
  LogOut, 
  Calendar, 
  Loader2, 
  AlertCircle, 
  BrainCircuit, 
  TrendingUp, 
  ClipboardList 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function DashboardPage() {
  const { user, logout, loading: authLoading } = useAuth();
  const router = useRouter();

  const [resumes, setResumes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [importing, setImporting] = useState(false);
  const [importLogs, setImportLogs] = useState<string>('');
  const [creating, setCreating] = useState(false);
  const [actionId, setActionId] = useState<string | null>(null);

  const fetchResumes = async () => {
    try {
      setLoading(true);
      const data = await resumeApi.getAll();
      setResumes(data.resumes || []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch resumes.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/login');
      } else {
        fetchResumes();
      }
    }
  }, [user, authLoading, router]);

  const handleCreateResume = async () => {
    try {
      setCreating(true);
      setError(null);
      const data = await resumeApi.create({ title: 'My Resume', templateId: 'modern' });
      if (data.success && data.resume) {
        router.push(`/builder/${data.resume._id}`);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create resume.');
      setCreating(false);
    }
  };

  const handleImportResume = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setImporting(true);
      setError(null);
      setImportLogs('Reading document...');
      
      const formData = new FormData();
      formData.append('file', file);
      
      setTimeout(() => setImportLogs('Extracting text with parser...'), 800);
      setTimeout(() => setImportLogs('Running Google Gemini AI structure engine...'), 1600);
      setTimeout(() => setImportLogs('Populating resume data model...'), 3000);

      const data = await resumeApi.import(formData);
      
      if (data.success && data.resume) {
        setImportLogs('Complete! Opening builder...');
        setTimeout(() => {
          router.push(`/builder/${data.resume._id}`);
        }, 800);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to parse resume file.');
      setImporting(false);
    }
  };

  const handleDuplicate = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    try {
      setActionId(id);
      const data = await resumeApi.duplicate(id);
      if (data.success) {
        await fetchResumes();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to duplicate resume.');
    } finally {
      setActionId(null);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (!window.confirm('Are you sure you want to delete this resume? All associated review histories will be lost.')) return;
    
    try {
      setActionId(id);
      const data = await resumeApi.delete(id);
      if (data.success) {
        setResumes(resumes.filter((r) => r._id !== id));
      }
    } catch (err: any) {
      setError(err.message || 'Failed to delete resume.');
    } finally {
      setActionId(null);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-20">
      {/* Background radial glow */}
      <div className="absolute top-0 right-0 w-[30%] h-[30%] bg-indigo-900/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Top Navbar */}
      <nav className="glass border-b border-slate-900 px-6 py-4 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg text-white">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="font-display text-xl font-bold tracking-tight text-slate-100">
              CVItAI
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2.5">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full border border-slate-800" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-indigo-600/35 text-indigo-300 flex items-center justify-center font-bold text-xs">
                  {user?.name.charAt(0).toUpperCase()}
                </div>
              )}
              <span className="hidden sm:inline text-xs font-semibold text-slate-650">{user?.name}</span>
            </div>

            <ThemeToggle />

            <button 
              onClick={logout}
              className="p-2 rounded-lg hover:bg-pink-50 hover:text-pink-600 text-slate-700 transition-all"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-10 relative z-10">
        {/* Header section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-2xl md:text-3xl font-display font-extrabold text-slate-100 tracking-tight">Your Resumes</h1>
            <p className="text-slate-650 text-xs md:text-sm mt-1 font-medium">Create a new professional document, or import an existing PDF/Word file.</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <label className="bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 font-semibold py-2.5 px-4 rounded-xl flex items-center gap-2 text-xs transition-all cursor-pointer select-none">
              <Upload className="w-4 h-4 text-indigo-400" />
              Import PDF / Word
              <input 
                type="file" 
                accept=".pdf,.docx,.doc" 
                className="hidden" 
                onChange={handleImportResume} 
                disabled={importing}
              />
            </label>

            <button 
              onClick={handleCreateResume}
              disabled={creating}
              className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold py-2.5 px-5 rounded-xl flex items-center gap-2 text-xs shadow-lg shadow-indigo-600/25 transition-all"
            >
              {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              New Blank Resume
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-8 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Importing overlay logger */}
        <AnimatePresence>
          {importing && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-8 p-6 rounded-2xl glass border-indigo-500/25 bg-slate-900/50 flex flex-col md:flex-row items-center gap-4 justify-between"
            >
              <div className="flex items-center gap-4 text-left w-full">
                <div className="bg-indigo-600/20 p-3 rounded-xl border border-indigo-500/20">
                  <BrainCircuit className="w-6 h-6 text-indigo-400 animate-pulse" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-100 uppercase tracking-wider">AI Resume Import Engine Active</div>
                  <div className="text-[11px] text-slate-600 mt-1 font-mono">{importLogs}</div>
                </div>
              </div>
              <div className="shrink-0 flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
                <span className="text-[10px] font-mono text-slate-450 uppercase tracking-widest">Parsing...</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Overview Dashboard Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          <div className="glass p-5 rounded-2xl border-slate-900/80 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/15">
              <FileText className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <div className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Created Drafts</div>
              <div className="text-lg font-extrabold text-slate-100 mt-0.5">{resumes.length} Resumes</div>
            </div>
          </div>

          <div className="glass p-5 rounded-2xl border-slate-900/80 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-violet-500/10 border border-violet-500/15">
              <BrainCircuit className="w-5 h-5 text-pink-600" />
            </div>
            <div>
              <div className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">ATS Reviews</div>
              <div className="text-lg font-extrabold text-slate-100 mt-0.5">Gemini Active</div>
            </div>
          </div>

          <div className="glass p-5 rounded-2xl border-slate-900/80 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/15">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <div className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Average ATS Score</div>
              <div className="text-lg font-extrabold text-slate-100 mt-0.5">Bypass Optimized</div>
            </div>
          </div>
        </div>

        {/* Resumes Lists grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((s) => (
              <div key={s} className="h-44 bg-slate-900/20 border border-slate-900 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : resumes.length === 0 ? (
          <div className="glass py-16 px-6 text-center rounded-2xl border-slate-900 flex flex-col items-center max-w-2xl mx-auto mt-6">
            <div className="bg-slate-950 p-4 rounded-full border border-slate-900 text-slate-500 mb-4">
              <ClipboardList className="w-8 h-8" />
            </div>
            <h3 className="font-bold font-display text-slate-100 text-base">No Resumes Found</h3>
            <p className="text-slate-650 text-xs mt-1 max-w-sm mx-auto leading-relaxed">
              Create a new blank resume or upload an existing PDF/DOCX to let Gemini structure it for you.
            </p>
            <button 
              onClick={handleCreateResume}
              className="mt-6 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-5 rounded-xl text-xs transition-all shadow-md shadow-indigo-600/20"
            >
              Get Started
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resumes.map((res) => (
              <Link 
                href={`/builder/${res._id}`}
                key={res._id}
                className="group border border-slate-800 bg-slate-900/30 hover:bg-slate-900/40 rounded-2xl p-6 flex flex-col justify-between hover:border-slate-700 hover:shadow-lg transition-all"
              >
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <div className="bg-indigo-600/10 border border-indigo-500/15 p-3 rounded-xl inline-block text-indigo-400 group-hover:bg-indigo-600/20 transition-all shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    
                    {/* Action buttons */}
                    <div className="flex items-center gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => handleDuplicate(res._id, e)}
                        disabled={actionId === res._id}
                        className="p-2 rounded-lg hover:bg-slate-850 text-slate-400 hover:text-slate-200 transition-all shrink-0"
                        title="Duplicate"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => handleDelete(res._id, e)}
                        disabled={actionId === res._id}
                        className="p-2 rounded-lg hover:bg-slate-850 text-slate-400 hover:text-rose-450 transition-all shrink-0"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <h3 className="font-bold text-sm md:text-base text-slate-100 mt-4 tracking-tight group-hover:text-pink-600 transition-colors line-clamp-1">
                    {res.title}
                  </h3>
                  <div className="text-[10px] font-bold text-slate-600 mt-1 uppercase tracking-wider">
                    Template: {res.templateId}
                  </div>
                </div>

                <div className="border-t border-pink-100 mt-6 pt-4 flex items-center justify-between text-[10px] text-slate-600 font-medium">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(res.updatedAt).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                  <span className="text-pink-600 flex items-center gap-1 font-bold group-hover:translate-x-0.5 transition-transform">
                    Edit <Edit3 className="w-3 h-3" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
