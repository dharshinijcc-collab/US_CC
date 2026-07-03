import { NextRequest } from 'next/server';
import { reorderTeamHandler } from '@/backend/api/team';

export async function POST(req: NextRequest) {
  return reorderTeamHandler(req);
}
