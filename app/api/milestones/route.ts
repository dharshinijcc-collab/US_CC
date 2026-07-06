import { NextRequest } from 'next/server';
import {
  getMilestonesHandler,
  createMilestoneHandler,
  updateMilestoneHandler,
  deleteMilestoneHandler
} from '@/backend/api/milestones';

export async function GET(req: NextRequest) {
  return getMilestonesHandler(req);
}

export async function POST(req: NextRequest) {
  return createMilestoneHandler(req);
}

export async function PUT(req: NextRequest) {
  return updateMilestoneHandler(req);
}

export async function DELETE(req: NextRequest) {
  return deleteMilestoneHandler(req);
}
