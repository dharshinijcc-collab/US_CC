// hooks/useAuth.ts
'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { User, Session } from '@supabase/supabase-js';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    if (!supabase) {
      // Fallback: Mock Auth mode (using localStorage)
      const savedSession = localStorage.getItem('cc_user_session');
      if (savedSession) {
        try {
          const parsed = JSON.parse(savedSession);
          if (parsed?.isLoggedIn) {
            setIsAuthenticated(true);
            setUser({
              id: 'mock-user-id',
              email: parsed.email,
              user_metadata: { full_name: parsed.name },
            } as any);
          }
        } catch {}
      }
      setLoading(false);
      return;
    }

    // Initialize from active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsAuthenticated(!!session);
      setLoading(false);
    });

    // Listen for auth events
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsAuthenticated(!!session);
      setLoading(false);

      if (event === 'SIGNED_OUT') {
        localStorage.removeItem('cc_user_session');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    if (!supabase) {
      localStorage.removeItem('cc_user_session');
      setIsAuthenticated(false);
      setUser(null);
      setSession(null);
      return;
    }
    await supabase.auth.signOut();
    localStorage.removeItem('cc_user_session');
    setIsAuthenticated(false);
    setUser(null);
    setSession(null);
  };

  return {
    user,
    session,
    loading,
    isAuthenticated,
    signOut,
  };
}
