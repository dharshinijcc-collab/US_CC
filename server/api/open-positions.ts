import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/server/services/supabase';
import { authenticate } from '@/server/api/team';

function unauthorized() {
  return NextResponse.json({ status: 'error', message: 'Unauthorized' }, { status: 401 });
}

function noDb() {
  return NextResponse.json({ status: 'error', message: 'Database not configured' }, { status: 503 });
}

// GET /api/open-positions
export async function getOpenPositionsHandler(req: NextRequest) {
  try {
    if (!supabaseAdmin) return noDb();

    const { searchParams } = new URL(req.url);
    const all = searchParams.get('all') === 'true';

    let query = supabaseAdmin.from('open_positions').select('*').order('display_order', { ascending: true });
    
    if (!all) {
      query = query.eq('is_active', true);
    }

    const { data, error } = await query;
    if (error) return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
    return NextResponse.json({ status: 'success', payload: data || [] });
  } catch (err: any) {
    return NextResponse.json({ status: 'error', message: err.message }, { status: 500 });
  }
}

// POST /api/open-positions
export async function createOpenPositionHandler(req: NextRequest) {
  if (!await authenticate(req)) return unauthorized();
  if (!supabaseAdmin) return noDb();

  try {
    const body = await req.json();
    if (!body.title || !body.experience || !body.category) {
      return NextResponse.json({ status: 'error', message: 'Title, Experience, and Category are required' }, { status: 400 });
    }

    // Get max display order
    const { data: maxData } = await supabaseAdmin
      .from('open_positions')
      .select('display_order')
      .order('display_order', { ascending: false })
      .limit(1);
    const maxOrder = maxData && maxData[0] ? maxData[0].display_order : 0;

    const { data, error } = await supabaseAdmin
      .from('open_positions')
      .insert({
        title: body.title,
        location: body.location || 'Chennai, TN',
        type: body.type || 'Full Time',
        experience: body.experience,
        category: body.category,
        apply_link: body.apply_link || 'mailto:careers@crestcode.usa',
        application_email: body.application_email || 'careers@crestcode.usa',
        is_active: body.is_active ?? true,
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

// PUT /api/open-positions
export async function updateOpenPositionHandler(req: NextRequest) {
  if (!await authenticate(req)) return unauthorized();
  if (!supabaseAdmin) return noDb();

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ status: 'error', message: 'id is required' }, { status: 400 });

    const body = await req.json();
    const { data, error } = await supabaseAdmin
      .from('open_positions')
      .update({
        title: body.title,
        location: body.location,
        type: body.type,
        experience: body.experience,
        category: body.category,
        apply_link: body.apply_link,
        application_email: body.application_email,
        is_active: body.is_active,
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

// DELETE /api/open-positions
export async function deleteOpenPositionHandler(req: NextRequest) {
  if (!await authenticate(req)) return unauthorized();
  if (!supabaseAdmin) return noDb();

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ status: 'error', message: 'id is required' }, { status: 400 });

    const { error } = await supabaseAdmin
      .from('open_positions')
      .delete()
      .eq('id', id);

    if (error) return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
    return NextResponse.json({ status: 'success', message: 'Position deleted successfully' });
  } catch (err: any) {
    return NextResponse.json({ status: 'error', message: err.message }, { status: 500 });
  }
}
