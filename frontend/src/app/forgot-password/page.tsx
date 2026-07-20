'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { authApi } from '../../lib/api';
import { Sparkles, Mail, Loader2, Check, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      await authApi.forgotPassword({ email });
      setSuccess('If an account exists with this email, we sent a password reset link.');
    } catch (err: any) {
      setError(err.message || 'Request failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative font-sans">
      <div className="absolute w-[40%] h-[40%] bg-indigo-900/10 rounded-full blur-[120px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-slate-900/40 backdrop-blur-md rounded-2xl border border-slate-800 p-8 shadow-2xl relative z-10"
      >
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <div className="bg-indigo-600 p-1.5 rounded-lg text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="font-display text-lg font-bold text-foreground">CVItAI</span>
          </Link>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Forgot Password</h1>
          <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">
            Enter your email and we'll send you instructions to reset your password.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-450 text-xs flex items-start gap-2.5">
            <Check className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{success}</span>
          </div>
        )}

        {!success && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-350 uppercase tracking-wider block">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl py-3 pl-11 pr-4 text-sm text-slate-100 placeholder:text-slate-600 outline-none transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 text-sm transition-all mt-6 shadow-lg shadow-indigo-600/20"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Send Reset Link'}
            </button>
          </form>
        )}

        <div className="mt-8 text-center text-xs text-slate-400">
          Back to{' '}
          <Link href="/login" className="text-indigo-400 hover:text-indigo-350 font-bold transition-colors">
            Login
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
