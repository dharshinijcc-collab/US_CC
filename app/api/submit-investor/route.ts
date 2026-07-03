import { NextRequest } from 'next/server';
import { submitInvestorHandler } from '@/backend/api/submit-investor';

export async function POST(req: NextRequest) {
  return submitInvestorHandler(req);
}
