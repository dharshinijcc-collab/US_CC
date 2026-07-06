import { NextRequest } from 'next/server';
import {
  getOpenPositionsHandler,
  createOpenPositionHandler,
  updateOpenPositionHandler,
  deleteOpenPositionHandler
} from '@/backend/api/open-positions';

export async function GET(req: NextRequest) {
  return getOpenPositionsHandler(req);
}

export async function POST(req: NextRequest) {
  return createOpenPositionHandler(req);
}

export async function PUT(req: NextRequest) {
  return updateOpenPositionHandler(req);
}

export async function DELETE(req: NextRequest) {
  return deleteOpenPositionHandler(req);
}
