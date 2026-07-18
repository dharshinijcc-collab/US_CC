// lib/supabase.ts
// Browser-side Supabase client — only initialised when env vars are real values

import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Accept both Vercel naming (SUPABASE_URL / SUPABASE_ANON_KEY)
// and standard naming (NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY)
const supabaseUrl =
  ((import.meta as any).env && (import.meta as any).env.VITE_SUPABASE_URL) ||
  ((import.meta as any).env && (import.meta as any).env.NEXT_PUBLIC_SUPABASE_URL) ||
  (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_SUPABASE_URL) ||
  (typeof process !== 'undefined' && process.env?.SUPABASE_URL) ||
  '';
const supabaseAnonKey =
  ((import.meta as any).env && (import.meta as any).env.VITE_SUPABASE_ANON_KEY) ||
  ((import.meta as any).env && (import.meta as any).env.NEXT_PUBLIC_SUPABASE_ANON_KEY) ||
  (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_SUPABASE_ANON_KEY) ||
  (typeof process !== 'undefined' && process.env?.SUPABASE_ANON_KEY) ||
  '';

// Guard: only create client when real values are present (not placeholder / empty)
const isConfigured =
  supabaseUrl.startsWith('https://') &&
  supabaseAnonKey.length > 10;

export const supabase: SupabaseClient | null = isConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;
