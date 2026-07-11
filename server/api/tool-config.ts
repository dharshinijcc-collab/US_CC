import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { supabaseAdmin } from '@/server/services/supabase';

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
      console.warn(`Admin verification failed in tool config helper for email: ${decoded.email}`);
      return false;
    }
    return true;
  } catch (err) {
    console.error('JWT verification failed:', err);
    return false;
  }
}

export async function getToolConfigHandler(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const key = searchParams.get('key');

    if (!supabaseAdmin) {
      return NextResponse.json({ status: 'error', payload: 'Database client not configured.' }, { status: 503 });
    }

    if (key) {
      const { data, error } = await supabaseAdmin
        .from('tool_configurations')
        .select('config')
        .eq('key', key)
        .maybeSingle();

      if (error) {
        console.error(`Error fetching tool config for key ${key}:`, error);
        return NextResponse.json({ status: 'error', payload: error.message }, { status: 500 });
      }

      if (!data) {
        return NextResponse.json({ status: 'error', payload: `No configuration found for key ${key}` }, { status: 404 });
      }

      return NextResponse.json({ status: 'success', payload: data.config });
    } else {
      // Get all configs
      const { data, error } = await supabaseAdmin
        .from('tool_configurations')
        .select('key, config');

      if (error) {
        console.error('Error fetching all tool configs:', error);
        return NextResponse.json({ status: 'error', payload: error.message }, { status: 500 });
      }

      const configs = (data || []).reduce((acc: any, item: any) => {
        acc[item.key] = item.config;
        return acc;
      }, {});

      return NextResponse.json({ status: 'success', payload: configs });
    }
  } catch (err: any) {
    console.error('get-tool-config API error:', err);
    return NextResponse.json({ status: 'error', payload: err.message }, { status: 500 });
  }
}

export async function updateToolConfigHandler(req: NextRequest) {
  try {
    // 1. Verify token
    if (!await verifyToken(req)) {
      return NextResponse.json({ status: 'error', payload: 'Unauthorized' }, { status: 401 });
    }

    const { key, config } = await req.json();
    if (!key || !config) {
      return NextResponse.json({ status: 'error', payload: 'Missing key or config payload' }, { status: 400 });
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ status: 'error', payload: 'Database client not configured.' }, { status: 503 });
    }

    // 2. Update Supabase tool_configurations
    const { error } = await supabaseAdmin
      .from('tool_configurations')
      .upsert({ key, config, updated_at: new Date().toISOString() }, { onConflict: 'key' });

    if (error) {
      console.error(`Error updating tool config for key ${key}:`, error);
      return NextResponse.json({ status: 'error', payload: error.message }, { status: 500 });
    }

    return NextResponse.json({ status: 'success', payload: `Tool configuration for key ${key} updated successfully` });
  } catch (err: any) {
    console.error('update-tool-config API error:', err);
    return NextResponse.json({ status: 'error', payload: err.message }, { status: 500 });
  }
}
