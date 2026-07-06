import { NextRequest } from 'next/server';
import {
  getBlogAuthorsHandler,
  createBlogAuthorHandler,
  updateBlogAuthorHandler,
  deleteBlogAuthorHandler
} from '@/backend/api/blog-authors';

export async function GET(req: NextRequest) {
  return getBlogAuthorsHandler(req);
}

export async function POST(req: NextRequest) {
  return createBlogAuthorHandler(req);
}

export async function PUT(req: NextRequest) {
  return updateBlogAuthorHandler(req);
}

export async function DELETE(req: NextRequest) {
  return deleteBlogAuthorHandler(req);
}
