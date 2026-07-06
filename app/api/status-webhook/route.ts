import { NextRequest } from 'next/server';
import { statusWebhookHandler } from '@/backend/api/status-webhook';

export async function POST(req: NextRequest) {
  return statusWebhookHandler(req);
}
