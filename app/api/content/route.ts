import { NextRequest } from 'next/server';
import { getContentHandler } from '@/server/api/content';

export async function GET(req: NextRequest) {
  return getContentHandler(req);
}
