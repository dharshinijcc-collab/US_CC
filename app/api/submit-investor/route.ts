import { NextRequest } from 'next/server';
import { submitInvestorHandler } from '@/server/api/submit-investor';

export async function POST(req: NextRequest) {
  return submitInvestorHandler(req);
}
