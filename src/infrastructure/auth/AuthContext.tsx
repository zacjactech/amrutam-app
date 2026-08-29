// Auth Context - Supabase Auth session management (Email OTP)

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../supabase/client';
import { logger } from '../logging/logger';
import { checkRateLimit, recordSend, getRateLimitStatus } from './otpRateLimiter';

interface AuthContextValue {
  session: Session | null;
  user: User | null;
  patientId: string | null;
  userName: string | undefined;
  isLoading: boolean;
  isAuthenticated: boolean;
  signInWithEmail: (email: string) => Promise<{ error?: string }>;
  verifyOtp: (email: string, token: string, name?: string) => Promise<{ error?: string }>;
  updateProfile: (metadata: { full_name?: string }) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  /** Seconds until next OTP send is allowed (0 if ready) */
  otpCooldownSeconds: (identifier: string) => number;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      setSession(initialSession);
      setIsLoading(false);
      logger.info('Auth: initial session loaded', {
        hasSession: initialSession !== null,
        userId: initialSession?.user?.id,
      });
    }).catch((error) => {
      logger.error('Auth: failed to get initial session', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      setIsLoading(false);
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      logger.info('Auth: session changed', {
        event: _event,
        hasSession: newSession !== null,
        userId: newSession?.user?.id,
      });
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signInWithEmail = useCallback(async (email: string): Promise<{ error?: string }> => {
    try {
      // Check rate limit before sending
      const rateLimit = checkRateLimit(email);
      if (!rateLimit.allowed) {
        logger.warn('Auth: signInWithEmail rate limited', {
          email,
          cooldownSeconds: rateLimit.cooldownSeconds,
          sendsThisHour: rateLimit.sendsThisHour,
        });
        return { error: rateLimit.message };
      }

      const { error } = await supabase.auth.signInWithOtp({
        email,
      });

      if (error) {
        logger.error('Auth: signInWithEmail failed', { error: error.message });
        return { error: error.message };
      }

      // Record the successful send for rate limiting
      recordSend(email);

      logger.info('Auth: OTP sent successfully', { email });
      return {};
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to send OTP';
      logger.error('Auth: signInWithEmail exception', { error: message });
      return { error: message };
    }
  }, []);

  const verifyOtp = useCallback(async (email: string, token: string, name?: string): Promise<{ error?: string }> => {
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token,
        type: 'email',
      });

      if (error) {
        logger.error('Auth: verifyOtp failed', { error: error.message });
        return { error: error.message };
      }

      if (data.session) {
        setSession(data.session);
      }

      // If a name was provided (new user from sign-up), save it to user_metadata
      if (name && data.user) {
        const { error: profileError } = await supabase.auth.updateUser({
          data: { full_name: name },
        });

        if (profileError) {
          logger.warn('Auth: failed to save name to user_metadata', {
            error: profileError.message,
          });
        } else {
          logger.info('Auth: saved name to user_metadata', { name });
        }
      }

      logger.info('Auth: OTP verified successfully', { userId: data.user?.id });
      return {};
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to verify OTP';
      logger.error('Auth: verifyOtp exception', { error: message });
      return { error: message };
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      await supabase.auth.signOut();
      setSession(null);
      logger.info('Auth: signed out successfully');
    } catch (error) {
      logger.error('Auth: signOut failed', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }, []);

  const updateProfile = useCallback(async (metadata: { full_name?: string }): Promise<{ error?: string }> => {
    try {
      const { error } = await supabase.auth.updateUser({ data: metadata });

      if (error) {
        logger.error('Auth: updateProfile failed', { error: error.message });
        return { error: error.message };
      }

      logger.info('Auth: profile updated', { metadata });
      return {};
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update profile';
      logger.error('Auth: updateProfile exception', { error: message });
      return { error: message };
    }
  }, []);

  const userName = session?.user?.user_metadata?.full_name as string | undefined;

  const otpCooldownSeconds = useCallback((identifier: string): number => {
    const status = getRateLimitStatus(identifier);
    if (!status.nextAllowedAt) return 0;
    const remaining = Math.max(0, Math.ceil((status.nextAllowedAt - Date.now()) / 1000));
    return remaining;
  }, []);

  const value: AuthContextValue = {
    session,
    user: session?.user ?? null,
    patientId: session?.user?.id ?? null,
    userName,
    isLoading,
    isAuthenticated: session !== null && session.user !== undefined,
    signInWithEmail,
    verifyOtp,
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
