import { NextRequest } from 'next/server';
import { submitTalentHandler } from '@/server/api/submit-talent';

export async function POST(req: NextRequest) {
  return submitTalentHandler(req);
}
