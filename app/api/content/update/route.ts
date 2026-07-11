import { NextRequest } from 'next/server';
import { updateContentHandler } from '@/server/api/content';

export async function POST(req: NextRequest) {
  return updateContentHandler(req);
}
