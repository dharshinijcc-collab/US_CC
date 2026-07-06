import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/backend/services/supabase';
import { authenticate } from '@/backend/api/team';
import crypto from 'crypto';

// Helper to verify admin token
async function verifyAdmin(req: NextRequest): Promise<boolean> {
  return authenticate(req);
}

export async function POST(req: NextRequest) {
  try {
    // 1. Verify admin token
    if (!await verifyAdmin(req)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File;
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // 2. Validate file size (max 8MB for portfolio images)
    if (file.size > 8 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size exceeds 8MB limit' }, { status: 400 });
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
    const uniqueName = `portfolio-${crypto.randomUUID()}.${ext}`;

    // 5. Upload to Supabase Storage portfolio bucket
    const { error: uploadError } = await supabaseAdmin.storage
      .from('portfolio')
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
      .from('portfolio')
      .getPublicUrl(uniqueName);

    const publicUrl = publicUrlData?.publicUrl || '';
    
    return NextResponse.json({ status: 'success', url: publicUrl, filename: uniqueName });
  } catch (err: any) {
    console.error('API upload error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
