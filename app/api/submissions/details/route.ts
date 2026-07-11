import { NextRequest } from 'next/server';
import { getSubmissionDetailsHandler } from '@/server/api/submissions';

export async function GET(req: NextRequest) {
  return getSubmissionDetailsHandler(req);
}
