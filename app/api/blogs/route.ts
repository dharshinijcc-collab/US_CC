import { NextRequest } from 'next/server';
import {
  getBlogsHandler,
  createBlogHandler,
  updateBlogHandler,
  deleteBlogHandler,
} from '@/server/api/blogs';

export async function GET(req: NextRequest) {
  return getBlogsHandler(req);
}

export async function POST(req: NextRequest) {
  return createBlogHandler(req);
}

export async function PUT(req: NextRequest) {
  return updateBlogHandler(req);
}

export async function DELETE(req: NextRequest) {
  return deleteBlogHandler(req);
}
