import { NextRequest } from 'next/server';
import { reorderTeamHandler } from '@/server/api/team';

export async function POST(req: NextRequest) {
  return reorderTeamHandler(req);
}
