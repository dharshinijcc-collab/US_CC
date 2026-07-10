import { NextRequest } from 'next/server';
import { getSubmissionDetailsHandler } from '@/backend/api/submissions';

export async function GET(req: NextRequest) {
  return getSubmissionDetailsHandler(req);
}
