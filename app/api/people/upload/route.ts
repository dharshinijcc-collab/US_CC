import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { supabaseAdmin } from '@/backend/services/supabase';
import crypto from 'crypto';

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
      console.warn(`Admin verification failed in people upload helper for email: ${decoded.email}`);
      return false;
    }
    return true;
  } catch (err) {
    console.error('JWT verification failed:', err);
    return false;
  }
}

export async function POST(req: NextRequest) {
  try {
    // 1. Verify token
    if (!await verifyToken(req)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database client not configured.' }, { status: 503 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file || file.size === 0) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // 2. Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size exceeds 5MB limit' }, { status: 400 });
    }

    // 3. Validate MIME type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type. Only JPEG, PNG, WEBP, GIF, and SVG are allowed.' }, { status: 400 });
    }

    // 4. Generate unique name
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const ext = file.name.split('.').pop() || 'png';
    const uniqueName = `avatar-${crypto.randomUUID()}.${ext}`;

    // 5. Upload to Supabase Storage avatars bucket
    const { error: uploadError } = await supabaseAdmin.storage
      .from('avatars')
      .upload(uniqueName, buffer, {
        contentType: file.type,
        upsert: true
      });

    if (uploadError) {
      console.error('Supabase Storage upload error:', uploadError);
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    // 6. Get public URL
    const { data: publicUrlData } = supabaseAdmin.storage
      .from('avatars')
      .getPublicUrl(uniqueName);

    const publicUrl = publicUrlData?.publicUrl || '';
    
    return NextResponse.json({ status: 'success', url: publicUrl, filename: uniqueName });
  } catch (err: any) {
    console.error('API upload error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
