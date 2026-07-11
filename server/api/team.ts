import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { supabaseAdmin } from '@/server/services/supabase';
import type { TeamMemberInput, ReorderPayload } from '@/types/team';

const SECRET = process.env.G_SECRET_KEY;

// ── Auth guard ──────────────────────────────────────────────
export async function authenticate(req: NextRequest): Promise<boolean> {
  if (!SECRET) {
    console.error('Server configuration error: G_SECRET_KEY is missing');
    return false;
  }
  let token = req.cookies.get('admin-token')?.value || '';
  if (!token) {
    const auth = req.headers.get('authorization') || '';
    token = auth.replace('Bearer ', '').trim();
  }
  if (!token) return false;
  try {
    const decoded = jwt.verify(token, SECRET) as any;
    if (!decoded || !decoded.email) return false;

    // Direct check against admin_users table in Supabase
    if (!supabaseAdmin) return false;
    const { data, error } = await supabaseAdmin
      .from('admin_users')
      .select('id')
      .eq('email', decoded.email)
      .maybeSingle();

    if (error || !data) {
      console.warn(`Admin verification failed in team handler for email: ${decoded.email}`);
      return false;
    }
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

// Helper to delete avatar image from Supabase Storage
async function deleteAvatarFromStorage(imageUrl: string | null | undefined) {
  if (!imageUrl || !supabaseAdmin || !imageUrl.includes('/storage/v1/object/public/avatars/')) return;
  try {
    const filename = imageUrl.split('/').pop();
    if (filename) {
      const { error } = await supabaseAdmin.storage
        .from('avatars')
        .remove([filename]);
      if (error) {
        console.error('Error deleting old avatar from storage:', error);
      } else {
        console.log('Successfully deleted old avatar from storage:', filename);
      }
    }
  } catch (err) {
    console.error('Error in deleteAvatarFromStorage:', err);
  }
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
  if (!await authenticate(req)) return unauthorized();
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
  if (!await authenticate(req)) return unauthorized();
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
  if (!await authenticate(req)) return unauthorized();
  if (!supabaseAdmin) return noDb();

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ status: 'error', message: 'id is required' }, { status: 400 });

    const body: Partial<TeamMemberInput> = await req.json();

    // Storage cleanup: If image_url is changing, delete the old one from storage
    if (body.image_url !== undefined) {
      const { data: currentMember } = await supabaseAdmin
        .from('team_members')
        .select('image_url')
        .eq('id', id)
        .maybeSingle();
      
      if (currentMember && currentMember.image_url && currentMember.image_url !== body.image_url) {
        await deleteAvatarFromStorage(currentMember.image_url);
      }
    }

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
// Admin — soft delete or permanent delete
export async function deleteTeamMemberHandler(req: NextRequest) {
  if (!await authenticate(req)) return unauthorized();
  if (!supabaseAdmin) return noDb();

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const permanent = searchParams.get('permanent') === 'true';

    if (!id) return NextResponse.json({ status: 'error', message: 'id is required' }, { status: 400 });

    // Fetch member details first for storage cleanup if needed
    const { data: currentMember } = await supabaseAdmin
      .from('team_members')
      .select('image_url')
      .eq('id', id)
      .maybeSingle();

    if (permanent) {
      // 1. Delete image from storage
      if (currentMember?.image_url) {
        await deleteAvatarFromStorage(currentMember.image_url);
      }

      // 2. Hard delete from database
      const { error } = await supabaseAdmin
        .from('team_members')
        .delete()
        .eq('id', id);

      if (error) return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
      return NextResponse.json({ status: 'success', message: 'Member permanently deleted' });
    } else {
      // Soft delete: deactivate member
      const { error } = await supabaseAdmin
        .from('team_members')
        .update({ is_active: false })
        .eq('id', id);

      if (error) return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
      return NextResponse.json({ status: 'success', message: 'Member deactivated' });
    }
  } catch (err: any) {
    return NextResponse.json({ status: 'error', message: err.message }, { status: 500 });
  }
}

// ── POST /api/team/reorder ──────────────────────────────────
// Admin — batch update display_order for multiple members
export async function reorderTeamHandler(req: NextRequest) {
  if (!await authenticate(req)) return unauthorized();
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
