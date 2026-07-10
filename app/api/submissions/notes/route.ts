import { NextRequest } from 'next/server';
import { addSubmissionNoteHandler } from '@/backend/api/submissions';

export async function POST(req: NextRequest) {
  return addSubmissionNoteHandler(req);
}
