'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { User } from '../types';
import { authApi, subscribeToUser, setCurrentUser } from '../lib/api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  logout: async () => {},
  refreshSession: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Listen to global API client user updates
  useEffect(() => {
    const unsubscribe = subscribeToUser((newUser) => {
      setUser(newUser);
    });
    return unsubscribe;
  }, []);

  const refreshSession = async () => {
    try {
      await authApi.refresh();
    } catch (err) {
      // Not logged in
      setCurrentUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshSession();
  }, []);

  // Protect Route Guarding logic
  useEffect(() => {
    if (loading) return;

    const publicPaths = [
      '/',
      '/login',
      '/register',
      '/verify-email',
      '/forgot-password',
      '/reset-password',
    ];
    
    const isPublicPath = publicPaths.includes(pathname || '');

    if (!user && !isPublicPath) {
      router.push('/login');
    } else if (user && (pathname === '/login' || pathname === '/register' || pathname === '/verify-email')) {
      router.push('/dashboard');
    }
  }, [user, loading, pathname, router]);

  const logout = async () => {
    try {
      await authApi.logout();
      router.push('/');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout, refreshSession }}>
      {children}
    </AuthContext.Provider>
  );
};
