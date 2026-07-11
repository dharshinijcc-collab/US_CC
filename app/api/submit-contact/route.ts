import { NextRequest } from 'next/server';
import { submitContactHandler } from '@/server/api/submit-contact';

export async function POST(req: NextRequest) {
  return submitContactHandler(req);
}
