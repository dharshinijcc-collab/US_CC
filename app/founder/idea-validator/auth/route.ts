import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';

const signupSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

function getAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  const isConfigured =
    supabaseUrl &&
    supabaseUrl.startsWith('https://') &&
    !supabaseUrl.includes('your-supabase-project-url') &&
    serviceKey &&
    !serviceKey.includes('your-supabase-service-role-key');

  if (!isConfigured) return null;
  return createClient(supabaseUrl!, serviceKey!);
}

// ── POST /founder/idea-validator/auth?action=signup|login ───────────────────
export async function POST(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const action = searchParams.get('action');
    const body = await req.json();

    const admin = getAdminClient();
    if (!admin) {
      return NextResponse.json({ error: 'Auth service not configured.' }, { status: 503 });
    }

    // ── SIGN UP ──────────────────────────────────────────────────────────────
    if (action === 'signup') {
      const parsed = signupSchema.safeParse(body);
      if (!parsed.success) {
        return NextResponse.json({ error: 'Invalid input.', details: parsed.error.format() }, { status: 400 });
      }

      const { name, email, password } = parsed.data;

      // Use admin.createUser so the account is immediately confirmed — no email verification loop
      const { data, error } = await admin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,           // ← pre-confirmed, no email link needed
        user_metadata: { full_name: name },
      });

      if (error) {
        // If user already exists, tell them to log in
        if (
          error.message.toLowerCase().includes('already registered') ||
          error.message.toLowerCase().includes('already been registered') ||
          error.message.toLowerCase().includes('user already exists') ||
          error.status === 422
        ) {
          return NextResponse.json({ error: 'already_exists' }, { status: 409 });
        }
        return NextResponse.json({ error: error.message }, { status: 400 });
      }

      // Now sign the newly created user in to get a real session token
      const { data: sessionData, error: signInError } = await admin.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError || !sessionData.session) {
        return NextResponse.json({ error: 'Account created but could not sign in automatically. Please log in.' }, { status: 500 });
      }

      return NextResponse.json({
        access_token: sessionData.session.access_token,
        refresh_token: sessionData.session.refresh_token,
        user: { id: data.user?.id, email, name },
      });

    // ── LOG IN ───────────────────────────────────────────────────────────────
    } else if (action === 'login') {
      const parsed = loginSchema.safeParse(body);
      if (!parsed.success) {
        return NextResponse.json({ error: 'Invalid input.', details: parsed.error.format() }, { status: 400 });
      }

      const { email, password } = parsed.data;

      const { data, error } = await admin.auth.signInWithPassword({ email, password });

      if (error) {
        if (error.message.toLowerCase().includes('email not confirmed')) {
          return NextResponse.json({ error: 'email_not_confirmed' }, { status: 403 });
        }
        return NextResponse.json({ error: 'invalid_credentials' }, { status: 401 });
      }

      if (!data.session) {
        return NextResponse.json({ error: 'invalid_credentials' }, { status: 401 });
      }

      return NextResponse.json({
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
        user: { id: data.user?.id, email },
      });

    } else {
      return NextResponse.json({ error: 'Unknown action. Use ?action=signup or ?action=login' }, { status: 400 });
    }

  } catch (err: any) {
    console.error('❌ Auth API error:', err);
    return NextResponse.json({ error: 'Internal server error', message: err.message }, { status: 500 });
  }
}
