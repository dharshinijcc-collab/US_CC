import { NextRequest } from 'next/server';
import { updateSubmissionHandler } from '@/backend/api/submissions';

export async function POST(req: NextRequest) {
  return updateSubmissionHandler(req);
}
