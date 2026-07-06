import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '../services/supabase';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const G_SECRET_KEY = process.env.G_SECRET_KEY;

export async function adminLoginHandler(req: NextRequest) {
  try {
    if (!G_SECRET_KEY) {
      return NextResponse.json({ status: 'error', payload: 'G_SECRET_KEY configuration is missing on the server.' }, { status: 500 });
    }
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ status: 'error', payload: 'Missing email or password' }, { status: 400 });
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ status: 'error', payload: 'Database client not configured.' }, { status: 503 });
    }

    // 1. Fetch user from admin_users
    const { data, error } = await supabaseAdmin
      .from('admin_users')
      .select('id, email, password_hash')
      .eq('email', email)
      .maybeSingle();

    if (error) {
      console.error('Supabase error fetching admin:', error);
      return NextResponse.json({ status: 'error', payload: error.message }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ status: 'error', payload: 'Invalid email or password' }, { status: 400 });
    }

    // 2. Compare password using bcryptjs
    const isPasswordValid = await bcrypt.compare(password, data.password_hash);
    if (!isPasswordValid) {
      return NextResponse.json({ status: 'error', payload: 'Invalid email or password' }, { status: 400 });
    }

    // 3. Generate JWT access token
    const token = jwt.sign({ email: data.email }, G_SECRET_KEY, { expiresIn: '24h' });

    const response = NextResponse.json({
      status: 'success',
      payload: {
        user: { email: data.email, id: data.id }
      }
    });

    response.cookies.set('admin-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/'
    });

    return response;
  } catch (err: any) {
    console.error('admin-login API error:', err);
    return NextResponse.json({ status: 'error', payload: err.message }, { status: 500 });
  }
}
