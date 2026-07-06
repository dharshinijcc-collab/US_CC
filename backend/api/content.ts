import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '../services/supabase';
import jwt from 'jsonwebtoken';

const G_SECRET_KEY = process.env.G_SECRET_KEY;

async function verifyToken(req: NextRequest): Promise<boolean> {
  if (!G_SECRET_KEY) {
    console.error('Server configuration error: G_SECRET_KEY is missing');
    return false;
  }
  try {
    let token = req.cookies.get('admin-token')?.value || '';
    if (!token) {
      const authHeader = req.headers.get('Authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
      }
    }
    if (!token) return false;
    const decoded = jwt.verify(token, G_SECRET_KEY) as any;
    if (!decoded || !decoded.email) return false;

    // Direct check against admin_users table in Supabase
    if (!supabaseAdmin) return false;
    const { data, error } = await supabaseAdmin
      .from('admin_users')
      .select('id')
      .eq('email', decoded.email)
      .maybeSingle();

    if (error || !data) {
      console.warn(`Admin verification failed in content helper for email: ${decoded.email}`);
      return false;
    }
    return true;
  } catch (err) {
    console.error('JWT verification failed:', err);
    return false;
  }
}

export async function getContentHandler(req: NextRequest) {
  try {
    if (!supabaseAdmin) {
      console.warn('⚠️ Database client not configured. Falling back to local static config.json');
      const localConfig = require('@/shared/config.json');
      return NextResponse.json({ status: 'success', payload: localConfig });
    }

    const { data, error } = await supabaseAdmin
      .from('site_content')
      .select('payload')
      .eq('content_key', 'main_config')
      .eq('active', true)
      .maybeSingle();

    if (error) {
      console.error('Supabase error fetching content:', error);
      return NextResponse.json({ status: 'error', payload: error.message }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ status: 'error', payload: 'No content found' }, { status: 404 });
    }

    return NextResponse.json({ status: 'success', payload: data.payload });
  } catch (err: any) {
    console.error('get-content API error:', err);
    return NextResponse.json({ status: 'error', payload: err.message }, { status: 500 });
  }
}

export async function updateContentHandler(req: NextRequest) {
  try {
    // 1. Verify token
    if (!await verifyToken(req)) {
      return NextResponse.json({ status: 'error', payload: 'Unauthorized' }, { status: 401 });
    }

    const { payload } = await req.json();
    if (!payload) {
      return NextResponse.json({ status: 'error', payload: 'Missing payload' }, { status: 400 });
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ status: 'error', payload: 'Database client not configured.' }, { status: 503 });
    }

    // 2. Update Supabase site_content
    const { error } = await supabaseAdmin
      .from('site_content')
      .update({ payload })
      .eq('content_key', 'main_config');

    if (error) {
      console.error('Supabase error updating content:', error);
      return NextResponse.json({ status: 'error', payload: error.message }, { status: 500 });
    }

    return NextResponse.json({ status: 'success', payload: 'Content updated successfully' });
  } catch (err: any) {
    console.error('update-content API error:', err);
    return NextResponse.json({ status: 'error', payload: err.message }, { status: 500 });
  }
}
