import { NextRequest } from 'next/server';
import { adminLoginHandler } from '@/backend/api/auth';

export async function POST(req: NextRequest) {
  return adminLoginHandler(req);
}
