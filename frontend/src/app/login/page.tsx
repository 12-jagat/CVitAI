'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../components/AuthProvider';
import { authApi } from '../../lib/api';
import { Sparkles, Mail, Lock, ArrowRight, Loader2, Chrome, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useGoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';

function LoginContent() {
  const { refreshSession } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setError(null);
    setLoading(true);

    try {
      await authApi.login({ email, password });
      router.push('/dashboard');
    } catch (err: any) {
      if (err.message && err.message.includes('not verified')) {
        // Redirect to email verification page
        router.push(`/verify-email?email=${encodeURIComponent(email)}`);
      } else {
        setError(err.message || 'Login failed. Please check credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setError(null);
      setGoogleLoading(true);
      try {
        await authApi.googleLogin(tokenResponse.access_token);
        router.push('/dashboard');
      } catch (err: any) {
        setError(err.message || 'Google login failed.');
      } finally {
        setGoogleLoading(false);
      }
    },
    onError: () => {
      setError('Google login failed.');
      setGoogleLoading(false);
    }
  });

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative font-sans">
      {/* Background radial glow */}
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
            <span className="font-display text-lg font-bold text-white">ResumeIQ AI</span>
          </Link>
          <h1 className="text-2xl font-bold text-white tracking-tight">Welcome Back</h1>
          <p className="text-slate-400 text-xs mt-1.5">Sign in to manage and edit your resumes</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-start gap-2.5 animate-shake">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

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
                suppressHydrationWarning
                className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl py-3 pl-11 pr-4 text-sm text-slate-100 placeholder:text-slate-600 outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-350 uppercase tracking-wider block">Password</label>
              <Link href="/forgot-password" className="text-xs text-indigo-400 hover:text-indigo-350 transition-colors">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                suppressHydrationWarning
                className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl py-3 pl-11 pr-4 text-sm text-slate-100 placeholder:text-slate-600 outline-none transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 text-sm transition-all mt-6 shadow-lg shadow-indigo-600/20"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Sign In <ArrowRight className="w-4 h-4" /></>}
          </button>
        </form>

        <div className="relative my-6 text-center">
          <hr className="border-slate-800" />
          <span className="bg-[#0b101c] px-3 text-[11px] text-slate-500 font-bold uppercase tracking-wider absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            Or continue with
          </span>
        </div>

        <button
          onClick={() => handleGoogleLogin()}
          disabled={googleLoading}
          className="w-full bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 disabled:opacity-50 text-slate-200 font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2.5 text-sm transition-all"
        >
          {googleLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Chrome className="w-4 h-4 text-indigo-400" />}
          Google Account
        </button>

        <div className="mt-8 text-center text-xs text-slate-400">
          New to ResumeIQ?{' '}
          <Link href="/register" className="text-indigo-400 hover:text-indigo-350 font-bold transition-colors">
            Create Account
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <GoogleOAuthProvider clientId="622898372384-usgp397k4gup5p04p2b205alj3add0a7.apps.googleusercontent.com">
      <LoginContent />
    </GoogleOAuthProvider>
  );
}
