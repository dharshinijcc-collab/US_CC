import { NextRequest } from 'next/server';
import { addSubmissionNoteHandler } from '@/server/api/submissions';

export async function POST(req: NextRequest) {
  return addSubmissionNoteHandler(req);
}
