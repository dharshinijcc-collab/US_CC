import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { supabaseAdmin } from '@/backend/services/supabase';
import type { TeamMemberInput, ReorderPayload } from '@/types/team';

const SECRET = process.env.G_SECRET_KEY || 'default_secret_key';

// ── Auth guard ──────────────────────────────────────────────
function authenticate(req: NextRequest): boolean {
  const auth = req.headers.get('authorization') || '';
  const token = auth.replace('Bearer ', '').trim();
  if (!token) return false;
  try {
    jwt.verify(token, SECRET);
    return true;
  } catch {
    return false;
  }
}

function unauthorized() {
  return NextResponse.json({ status: 'error', message: 'Unauthorized' }, { status: 401 });
}

function noDb() {
  return NextResponse.json({ status: 'error', message: 'Database not configured' }, { status: 503 });
}

// ── GET /api/team ───────────────────────────────────────────
// Public — returns all active members sorted by display_order
export async function getTeamHandler(_req: NextRequest) {
  try {
    if (!supabaseAdmin) {
      // Graceful fallback: return empty list when DB not configured locally
      return NextResponse.json({ status: 'success', payload: [] });
    }

    const { data, error } = await supabaseAdmin
      .from('team_members')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (error) {
      console.error('Error fetching team members:', error);
      return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
    }

    return NextResponse.json({ status: 'success', payload: data });
  } catch (err: any) {
    return NextResponse.json({ status: 'error', message: err.message }, { status: 500 });
  }
}

// ── GET /api/team?all=true ──────────────────────────────────
// Admin — returns ALL members including inactive (auth required)
export async function getAllTeamHandler(req: NextRequest) {
  if (!authenticate(req)) return unauthorized();
  if (!supabaseAdmin) return noDb();

  try {
    const { data, error } = await supabaseAdmin
      .from('team_members')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
    return NextResponse.json({ status: 'success', payload: data });
  } catch (err: any) {
    return NextResponse.json({ status: 'error', message: err.message }, { status: 500 });
  }
}

// ── POST /api/team ──────────────────────────────────────────
// Admin — create a new team member
export async function createTeamMemberHandler(req: NextRequest) {
  if (!authenticate(req)) return unauthorized();
  if (!supabaseAdmin) return noDb();

  try {
    const body: TeamMemberInput = await req.json();

    if (!body.name || !body.role || !body.category) {
      return NextResponse.json(
        { status: 'error', message: 'name, role, and category are required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from('team_members')
      .insert({
        name: body.name,
        role: body.role,
        bio: body.bio || null,
        image_url: body.image_url || null,
        category: body.category,
        display_order: body.display_order ?? 0,
        is_active: body.is_active ?? true,
      })
      .select()
      .single();

    if (error) return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
    return NextResponse.json({ status: 'success', payload: data }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ status: 'error', message: err.message }, { status: 500 });
  }
}

// ── PUT /api/team?id= ───────────────────────────────────────
// Admin — update an existing team member
export async function updateTeamMemberHandler(req: NextRequest) {
  if (!authenticate(req)) return unauthorized();
  if (!supabaseAdmin) return noDb();

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ status: 'error', message: 'id is required' }, { status: 400 });

    const body: Partial<TeamMemberInput> = await req.json();

    const { data, error } = await supabaseAdmin
      .from('team_members')
      .update(body)
      .eq('id', id)
      .select()
      .single();

    if (error) return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
    return NextResponse.json({ status: 'success', payload: data });
  } catch (err: any) {
    return NextResponse.json({ status: 'error', message: err.message }, { status: 500 });
  }
}

// ── DELETE /api/team?id= ────────────────────────────────────
// Admin — soft delete (is_active = false)
export async function deleteTeamMemberHandler(req: NextRequest) {
  if (!authenticate(req)) return unauthorized();
  if (!supabaseAdmin) return noDb();

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ status: 'error', message: 'id is required' }, { status: 400 });

    const { error } = await supabaseAdmin
      .from('team_members')
      .update({ is_active: false })
      .eq('id', id);

    if (error) return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
    return NextResponse.json({ status: 'success', message: 'Member deactivated' });
  } catch (err: any) {
    return NextResponse.json({ status: 'error', message: err.message }, { status: 500 });
  }
}

// ── POST /api/team/reorder ──────────────────────────────────
// Admin — batch update display_order for multiple members
export async function reorderTeamHandler(req: NextRequest) {
  if (!authenticate(req)) return unauthorized();
  if (!supabaseAdmin) return noDb();

  try {
    const { updates }: ReorderPayload = await req.json();
    if (!updates || !Array.isArray(updates)) {
      return NextResponse.json({ status: 'error', message: 'updates array is required' }, { status: 400 });
    }

    // Run all updates in parallel
    const results = await Promise.all(
      updates.map(({ id, display_order }) =>
        supabaseAdmin!
          .from('team_members')
          .update({ display_order })
          .eq('id', id)
      )
    );

    const failed = results.find((r) => r.error);
    if (failed?.error) {
      return NextResponse.json({ status: 'error', message: failed.error.message }, { status: 500 });
    }

    return NextResponse.json({ status: 'success', message: 'Order updated' });
  } catch (err: any) {
    return NextResponse.json({ status: 'error', message: err.message }, { status: 500 });
  }
}
