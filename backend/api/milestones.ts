import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/backend/services/supabase';
import { authenticate } from '@/backend/api/team';

function unauthorized() {
  return NextResponse.json({ status: 'error', message: 'Unauthorized' }, { status: 401 });
}

function noDb() {
  return NextResponse.json({ status: 'error', message: 'Database not configured' }, { status: 503 });
}

// Helper to delete milestone image from portfolio bucket if present
async function deleteMilestoneImage(imageUrl: string | null | undefined) {
  if (!imageUrl || !supabaseAdmin || !imageUrl.includes('/storage/v1/object/public/portfolio/')) return;
  try {
    const filename = imageUrl.split('/').pop();
    if (filename) {
      await supabaseAdmin.storage.from('portfolio').remove([filename]);
    }
  } catch (err) {
    console.error('Failed to clean up milestone image:', err);
  }
}

// GET /api/milestones
export async function getMilestonesHandler(req: NextRequest) {
  try {
    if (!supabaseAdmin) return noDb();

    const { data, error } = await supabaseAdmin
      .from('milestones')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
    return NextResponse.json({ status: 'success', payload: data || [] });
  } catch (err: any) {
    return NextResponse.json({ status: 'error', message: err.message }, { status: 500 });
  }
}

// POST /api/milestones
export async function createMilestoneHandler(req: NextRequest) {
  if (!await authenticate(req)) return unauthorized();
  if (!supabaseAdmin) return noDb();

  try {
    const body = await req.json();
    if (!body.year || !body.title || !body.description) {
      return NextResponse.json({ status: 'error', message: 'Year, Title, and Description are required' }, { status: 400 });
    }

    // Get max display order
    const { data: maxData } = await supabaseAdmin
      .from('milestones')
      .select('display_order')
      .order('display_order', { ascending: false })
      .limit(1);
    const maxOrder = maxData && maxData[0] ? maxData[0].display_order : 0;

    const { data, error } = await supabaseAdmin
      .from('milestones')
      .insert({
        year: body.year,
        title: body.title,
        description: body.description,
        image_url: body.image_url || null,
        display_order: body.display_order ?? (maxOrder + 1)
      })
      .select()
      .single();

    if (error) return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
    return NextResponse.json({ status: 'success', payload: data }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ status: 'error', message: err.message }, { status: 500 });
  }
}

// PUT /api/milestones
export async function updateMilestoneHandler(req: NextRequest) {
  if (!await authenticate(req)) return unauthorized();
  if (!supabaseAdmin) return noDb();

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ status: 'error', message: 'id is required' }, { status: 400 });

    const body = await req.json();

    // Fetch existing milestone to manage image replacements
    const { data: existing } = await supabaseAdmin
      .from('milestones')
      .select('image_url')
      .eq('id', id)
      .maybeSingle();

    if (existing && existing.image_url && existing.image_url !== body.image_url) {
      await deleteMilestoneImage(existing.image_url);
    }

    const { data, error } = await supabaseAdmin
      .from('milestones')
      .update({
        year: body.year,
        title: body.title,
        description: body.description,
        image_url: body.image_url,
        display_order: body.display_order
      })
      .eq('id', id)
      .select()
      .single();

    if (error) return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
    return NextResponse.json({ status: 'success', payload: data });
  } catch (err: any) {
    return NextResponse.json({ status: 'error', message: err.message }, { status: 500 });
  }
}

// DELETE /api/milestones
export async function deleteMilestoneHandler(req: NextRequest) {
  if (!await authenticate(req)) return unauthorized();
  if (!supabaseAdmin) return noDb();

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ status: 'error', message: 'id is required' }, { status: 400 });

    const { data: existing } = await supabaseAdmin
      .from('milestones')
      .select('image_url')
      .eq('id', id)
      .maybeSingle();

    if (existing && existing.image_url) {
      await deleteMilestoneImage(existing.image_url);
    }

    const { error } = await supabaseAdmin
      .from('milestones')
      .delete()
      .eq('id', id);

    if (error) return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
    return NextResponse.json({ status: 'success', message: 'Milestone deleted successfully' });
  } catch (err: any) {
    return NextResponse.json({ status: 'error', message: err.message }, { status: 500 });
  }
}
