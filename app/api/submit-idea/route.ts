import { NextRequest } from 'next/server';
import { submitIdeaHandler } from '@/server/api/submit-idea';

export async function POST(req: NextRequest) {
  return submitIdeaHandler(req);
}
