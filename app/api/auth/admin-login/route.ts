import { NextRequest } from 'next/server';
import { adminLoginHandler } from '@/server/api/auth';

export async function POST(req: NextRequest) {
  return adminLoginHandler(req);
}
