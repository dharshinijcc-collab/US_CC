import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const G_SECRET_KEY = process.env.G_SECRET_KEY;

export async function GET(req: NextRequest) {
  try {
    if (!G_SECRET_KEY) {
      return NextResponse.json({ status: 'error', payload: 'G_SECRET_KEY is not configured on the server.' }, { status: 500 });
    }
    const token = req.cookies.get('admin-token')?.value;
    
    if (!token) {
      return NextResponse.json({ status: 'error', payload: 'Not authenticated' }, { status: 401 });
    }
    
    const decoded = jwt.verify(token, G_SECRET_KEY);
    return NextResponse.json({ status: 'success', authenticated: true, user: decoded, payload: decoded });
  } catch (err: any) {
    return NextResponse.json({ status: 'error', payload: 'Invalid or expired session' }, { status: 401 });
  }
}
