// Auth Context - Supabase Auth session management (Email OTP + Google OAuth)

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Session, User } from '@supabase/supabase-js';
import * as WebBrowser from 'expo-web-browser';
import { supabase } from '../supabase/client';
import { logger } from '../logging/logger';
import { getRateLimitStatus } from './otpRateLimiter';

WebBrowser.maybeCompleteAuthSession();

// Expo auth proxy URL (you must be logged into Expo: npx expo login)
const EXPO_AUTH_PROXY = 'https://auth.expo.io/@keyral/amrutam-app';

interface AuthContextValue {
  session: Session | null;
  user: User | null;
  patientId: string | null;
  userName: string | undefined;
  isLoading: boolean;
  isAuthenticated: boolean;
  signUp: (email: string, password: string, name: string) => Promise<{ error?: string }>;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signInWithGoogle: () => Promise<{ error?: string }>;
  sendEmailOtp: (email: string) => Promise<{ error?: string }>;
  verifyEmailOtp: (email: string, token: string, name?: string) => Promise<{ error?: string }>;
  updateProfile: (metadata: { full_name?: string }) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  otpCooldownSeconds: (identifier: string) => number;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      setSession(initialSession);
      setIsLoading(false);
    }).catch(() => setIsLoading(false));

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => subscription.unsubscribe();
  }, []);

  const sendEmailOtp = useCallback(async (email: string): Promise<{ error?: string }> => {
    try {
      const { error } = await supabase.auth.signInWithOtp({ email });
      if (error) throw error;
      return {};
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Failed to send OTP' };
    }
  }, []);

  const signUp = useCallback(async (email: string, password: string, name: string): Promise<{ error?: string }> => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: name } },
      });
      if (error) throw error;
      return {};
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Failed to sign up' };
    }
  }, []);

  const signIn = useCallback(async (email: string, password: string): Promise<{ error?: string }> => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      return {};
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Failed to sign in' };
    }
  }, []);

  const signInWithGoogle = useCallback(async (): Promise<{ error?: string }> => {
    try {
      // 1. Get OAuth URL from Supabase, redirect to Expo proxy
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: EXPO_AUTH_PROXY,
          skipBrowserRedirect: true,
        },
      });

      if (error) throw error;
      if (!data?.url) return { error: 'No OAuth URL received' };

      // 2. Open browser - proxy captures the redirect
      const result = await WebBrowser.openAuthSessionAsync(
        data.url,
        EXPO_AUTH_PROXY
      );

      if (result.type === 'success') {
        const url = result.url;

        // 3. Extract tokens from URL
        const urlObj = new URL(url);
        let params: URLSearchParams;

        if (urlObj.hash && urlObj.hash.includes('access_token')) {
          params = new URLSearchParams(urlObj.hash.substring(1));
        } else {
          params = new URLSearchParams(urlObj.search);
        }

        const accessToken = params.get('access_token');
        const refreshToken = params.get('refresh_token');

        if (accessToken && refreshToken) {
          const { error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });
          if (sessionError) throw sessionError;
          return {};
        }

        return { error: 'No tokens received' };
      } else if (result.type === 'cancel') {
        return { error: 'Sign in was cancelled' };
      }

      return { error: 'Sign in failed' };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Failed to sign in with Google' };
    }
  }, []);

  const verifyEmailOtp = useCallback(async (email: string, token: string, name?: string): Promise<{ error?: string }> => {
    try {
      // Try 'signup' type first (for new accounts)
      let { data, error } = await supabase.auth.verifyOtp({ email, token, type: 'signup' });
      
      // If that fails, try 'email' type (for existing accounts)
      if (error) {
        const result = await supabase.auth.verifyOtp({ email, token, type: 'email' });
        data = result.data;
        error = result.error;
      }

      if (error) {
        logger.error('Auth: verifyEmailOtp failed', { error: error.message });
        return { error: error.message };
      }

      if (data.session) setSession(data.session);
      
      // If a name was provided (new user from sign-up), save it to user_metadata
      if (name && data.user) {
        const { error: profileError } = await supabase.auth.updateUser({
          data: { full_name: name },
        });
        if (profileError) {
          logger.warn('Auth: failed to save name', { error: profileError.message });
        }
      }

      return {};
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Failed to verify OTP' };
    }
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setSession(null);
  }, []);

  const updateProfile = useCallback(async (metadata: { full_name?: string }): Promise<{ error?: string }> => {
    try {
      const { error } = await supabase.auth.updateUser({ data: metadata });
      if (error) return { error: error.message };
      return {};
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Failed to update profile' };
    }
  }, []);

  const userName = session?.user?.user_metadata?.full_name as string | undefined;

  const otpCooldownSeconds = useCallback((identifier: string): number => {
    const status = getRateLimitStatus(identifier);
    if (!status.nextAllowedAt) return 0;
    return Math.max(0, Math.ceil((status.nextAllowedAt - Date.now()) / 1000));
  }, []);

  const value: AuthContextValue = {
    session,
    user: session?.user ?? null,
    patientId: session?.user?.id ?? null,
    userName,
    isLoading,
    isAuthenticated: session !== null && session.user !== undefined,
    signIn,
    signUp,
    signInWithGoogle,
    sendEmailOtp,
    verifyEmailOtp,
    updateProfile,
    signOut,
    otpCooldownSeconds,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext(): AuthContextValue {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}
