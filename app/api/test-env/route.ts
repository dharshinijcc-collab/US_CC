import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'SET' : 'MISSING',
    supabaseUrlAlt: process.env.SUPABASE_URL ? 'SET' : 'MISSING',
    serviceKey: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'SET' : 'MISSING',
    serviceKeyAlt: process.env.SUPABASE_SERVICE_KEY ? 'SET' : 'MISSING',
    secretKey: process.env.G_SECRET_KEY ? 'SET' : 'MISSING',
    urlPreview: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 30),
    keyPreview: process.env.SUPABASE_SERVICE_ROLE_KEY?.substring(0, 30),
  });
}
