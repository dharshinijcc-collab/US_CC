import { NextRequest } from 'next/server';
import {
  getPartnerProductsHandler,
  createPartnerProductHandler,
  updatePartnerProductHandler,
  deletePartnerProductHandler
} from '@/server/api/partner-products';

export async function GET(req: NextRequest) {
  return getPartnerProductsHandler(req);
}

export async function POST(req: NextRequest) {
  return createPartnerProductHandler(req);
}

export async function PUT(req: NextRequest) {
  return updatePartnerProductHandler(req);
}

export async function DELETE(req: NextRequest) {
  return deletePartnerProductHandler(req);
}
