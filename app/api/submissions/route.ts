import { NextRequest } from 'next/server';
import { getSubmissionsHandler } from '@/server/api/submissions';

export async function GET(req: NextRequest) {
  return getSubmissionsHandler(req);
}
