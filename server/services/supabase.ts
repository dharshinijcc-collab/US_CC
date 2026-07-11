import { createClient } from '@supabase/supabase-js';

// Accept both Vercel naming (SUPABASE_URL / SUPABASE_SERVICE_KEY)
// and standard naming (NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY)
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.SUPABASE_URL ||
  '';

const supabaseServiceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_SERVICE_KEY ||
  '';

const isConfigured =
  supabaseUrl.startsWith('https://') &&
  supabaseServiceKey.length > 10;

if (!isConfigured) {
  console.warn('⚠️ Supabase URL or Service Key is missing. Running in fallback mode. Check SUPABASE_URL and SUPABASE_SERVICE_KEY in your environment variables.');
}

export const supabaseAdmin = isConfigured
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    })
  : null;
