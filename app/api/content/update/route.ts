import { NextRequest } from 'next/server';
import { updateContentHandler } from '@/backend/api/content';

export async function POST(req: NextRequest) {
  return updateContentHandler(req);
}
