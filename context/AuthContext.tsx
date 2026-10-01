import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { authApi } from '@/services/api';
import type { User, SignUpPayload } from '@/services/types';

type AuthContextValue = {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  signUp: (data: SignUpPayload) => Promise<{ ok: boolean; error?: string }>;
  signOut: () => Promise<void>;
  updateProfile: (patch: Partial<User>) => Promise<{ ok: boolean; error?: string }>;
  refreshSession: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshSession = useCallback(async () => {
    const session = await authApi.getSession();
    setUser(session);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        await refreshSession();
      } finally {
        setIsLoading(false);
      }
    })();
  }, [refreshSession]);

  const signIn = useCallback(async (email: string, password: string) => {
    const res = await authApi.signIn({ email, password });
    if (!res.ok) return { ok: false, error: res.error };
    setUser(res.data.user);
    return { ok: true };
  }, []);

  const signUp = useCallback(async (data: SignUpPayload) => {
    const res = await authApi.signUp(data);
    if (!res.ok) return { ok: false, error: res.error };
    setUser(res.data.user);
    return { ok: true };
  }, []);

  const signOut = useCallback(async () => {
    await authApi.signOut();
    setUser(null);
  }, []);

  const updateProfile = useCallback(async (patch: Partial<User>) => {
    const res = await authApi.updateProfile(patch);
    if (!res.ok) return { ok: false, error: res.error };
    setUser(res.data);
    return { ok: true };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        signIn,
        signUp,
        signOut,
        updateProfile,
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
