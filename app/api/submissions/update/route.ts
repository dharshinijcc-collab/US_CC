import { NextRequest } from 'next/server';
import { updateSubmissionHandler } from '@/server/api/submissions';

export async function POST(req: NextRequest) {
  return updateSubmissionHandler(req);
}
