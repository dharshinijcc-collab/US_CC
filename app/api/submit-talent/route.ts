import { NextRequest } from 'next/server';
import { submitTalentHandler } from '@/backend/api/submit-talent';

export async function POST(req: NextRequest) {
  return submitTalentHandler(req);
}
