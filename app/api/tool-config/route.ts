import { NextRequest } from 'next/server';
import { getToolConfigHandler, updateToolConfigHandler } from '@/backend/api/tool-config';

export async function GET(req: NextRequest) {
  return getToolConfigHandler(req);
}

export async function POST(req: NextRequest) {
  return updateToolConfigHandler(req);
}
