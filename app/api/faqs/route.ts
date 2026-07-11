import { NextRequest } from 'next/server';
import {
  getFaqsHandler,
  createFaqHandler,
  updateFaqHandler,
  deleteFaqHandler
} from '@/server/api/faqs';

export async function GET(req: NextRequest) {
  return getFaqsHandler(req);
}

export async function POST(req: NextRequest) {
  return createFaqHandler(req);
}

export async function PUT(req: NextRequest) {
  return updateFaqHandler(req);
}

export async function DELETE(req: NextRequest) {
  return deleteFaqHandler(req);
}
