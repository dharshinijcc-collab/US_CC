import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/backend/services/supabase';
import { authenticate } from '@/backend/api/team';

function unauthorized() {
  return NextResponse.json({ status: 'error', message: 'Unauthorized' }, { status: 401 });
}

function noDb() {
  return NextResponse.json({ status: 'error', message: 'Database not configured' }, { status: 503 });
}

// GET /api/blog-authors
export async function getBlogAuthorsHandler(req: NextRequest) {
  try {
    if (!supabaseAdmin) return noDb();

    const { searchParams } = new URL(req.url);
    const all = searchParams.get('all') === 'true';

    let query = supabaseAdmin.from('blog_authors').select('*').order('name', { ascending: true });
    
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

// POST /api/blog-authors
export async function createBlogAuthorHandler(req: NextRequest) {
  if (!await authenticate(req)) return unauthorized();
  if (!supabaseAdmin) return noDb();

  try {
    const body = await req.json();
    if (!body.name || !body.role) {
      return NextResponse.json({ status: 'error', message: 'Name and Role are required' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('blog_authors')
      .insert({
        name: body.name,
        role: body.role,
        avatar_url: body.avatar_url || null,
        bio: body.bio || null,
        is_active: body.is_active ?? true
      })
      .select()
      .single();

    if (error) return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
    return NextResponse.json({ status: 'success', payload: data }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ status: 'error', message: err.message }, { status: 500 });
  }
}

// PUT /api/blog-authors
export async function updateBlogAuthorHandler(req: NextRequest) {
  if (!await authenticate(req)) return unauthorized();
  if (!supabaseAdmin) return noDb();

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ status: 'error', message: 'id is required' }, { status: 400 });

    const body = await req.json();
    const { data, error } = await supabaseAdmin
      .from('blog_authors')
      .update({
        name: body.name,
        role: body.role,
        avatar_url: body.avatar_url,
        bio: body.bio,
        is_active: body.is_active
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

// DELETE /api/blog-authors
export async function deleteBlogAuthorHandler(req: NextRequest) {
  if (!await authenticate(req)) return unauthorized();
  if (!supabaseAdmin) return noDb();

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ status: 'error', message: 'id is required' }, { status: 400 });

    const { error } = await supabaseAdmin
      .from('blog_authors')
      .delete()
      .eq('id', id);

    if (error) return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
    return NextResponse.json({ status: 'success', message: 'Author deleted successfully' });
  } catch (err: any) {
    return NextResponse.json({ status: 'error', message: err.message }, { status: 500 });
  }
}
