import { NextRequest } from 'next/server';
import { getContentHandler } from '@/backend/api/content';

export async function GET(req: NextRequest) {
  return getContentHandler(req);
}
