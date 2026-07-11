import { NextRequest } from 'next/server';
import {
  getTeamHandler,
  getAllTeamHandler,
  createTeamMemberHandler,
  updateTeamMemberHandler,
  deleteTeamMemberHandler,
} from '@/server/api/team';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  // ?all=true returns all members including inactive (admin only)
  if (searchParams.get('all') === 'true') {
    return getAllTeamHandler(req);
  }
  return getTeamHandler(req);
}

export async function POST(req: NextRequest) {
  return createTeamMemberHandler(req);
}

export async function PUT(req: NextRequest) {
  return updateTeamMemberHandler(req);
}

export async function DELETE(req: NextRequest) {
  return deleteTeamMemberHandler(req);
}
