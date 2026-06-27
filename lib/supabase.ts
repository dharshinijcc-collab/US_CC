// lib/supabase.ts
// Browser-side Supabase client — only initialised when env vars are real values

import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

// Guard: only create client when real values are present (not placeholder / empty)
const isConfigured =
  supabaseUrl.startsWith('https://') &&
  supabaseAnonKey.length > 10;

export const supabase: SupabaseClient | null = isConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
