import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/backend/services/supabase';
import { authenticate } from '@/backend/api/team';

function unauthorized() {
  return NextResponse.json({ status: 'error', message: 'Unauthorized' }, { status: 401 });
}

function noDb() {
  return NextResponse.json({ status: 'error', message: 'Database not configured' }, { status: 503 });
}

// Helper to delete product logo/images from portfolio bucket if present
async function deleteProductLogo(imageUrl: string | null | undefined) {
  if (!imageUrl || !supabaseAdmin || !imageUrl.includes('/storage/v1/object/public/portfolio/')) return;
  try {
    const filename = imageUrl.split('/').pop();
    if (filename) {
      await supabaseAdmin.storage.from('portfolio').remove([filename]);
    }
  } catch (err) {
    console.error('Failed to clean up product logo:', err);
  }
}

// GET /api/partner-products
export async function getPartnerProductsHandler(req: NextRequest) {
  try {
    if (!supabaseAdmin) return noDb();

    const { searchParams } = new URL(req.url);
    const all = searchParams.get('all') === 'true';

    let query = supabaseAdmin.from('partner_products').select('*').order('display_order', { ascending: true });
    
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

// POST /api/partner-products
export async function createPartnerProductHandler(req: NextRequest) {
  if (!await authenticate(req)) return unauthorized();
  if (!supabaseAdmin) return noDb();

  try {
    const body = await req.json();
    if (!body.name || !body.tagline || !body.subtitle || !body.what_we_did) {
      return NextResponse.json({ status: 'error', message: 'Name, Tagline, Subtitle, and What We Did are required' }, { status: 400 });
    }

    // Get max display order
    const { data: maxData } = await supabaseAdmin
      .from('partner_products')
      .select('display_order')
      .order('display_order', { ascending: false })
      .limit(1);
    const maxOrder = maxData && maxData[0] ? maxData[0].display_order : 0;

    const { data, error } = await supabaseAdmin
      .from('partner_products')
      .insert({
        name: body.name,
        status_type: body.status_type || 'live',
        status_text: body.status_text || 'Live',
        status_subtext: body.status_subtext || null,
        tagline: body.tagline,
        subtitle: body.subtitle,
        stat_value: body.stat_value || '',
        stat_subtext: body.stat_subtext || '',
        what_we_did: body.what_we_did,
        industry: body.industry || '',
        duration: body.duration || '',
        team_size: body.team_size || '',
        tech_stack: body.tech_stack || [],
        features: body.features || [],
        gallery_images: body.gallery_images || [],
        website_url: body.website_url || null,
        logo_url: body.logo_url || null,
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

// PUT /api/partner-products
export async function updatePartnerProductHandler(req: NextRequest) {
  if (!await authenticate(req)) return unauthorized();
  if (!supabaseAdmin) return noDb();

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ status: 'error', message: 'id is required' }, { status: 400 });

    const body = await req.json();

    // Fetch existing product to manage logo replacements
    const { data: existing } = await supabaseAdmin
      .from('partner_products')
      .select('logo_url, gallery_images')
      .eq('id', id)
      .maybeSingle();

    if (existing && existing.logo_url && existing.logo_url !== body.logo_url) {
      await deleteProductLogo(existing.logo_url);
    }

    // Clean up gallery images if they were deleted from the array
    if (existing && Array.isArray(existing.gallery_images) && Array.isArray(body.gallery_images)) {
      const deletedImages = existing.gallery_images.filter((img: string) => !body.gallery_images.includes(img));
      for (const img of deletedImages) {
        await deleteProductLogo(img);
      }
    }

    const { data, error } = await supabaseAdmin
      .from('partner_products')
      .update({
        name: body.name,
        status_type: body.status_type,
        status_text: body.status_text,
        status_subtext: body.status_subtext,
        tagline: body.tagline,
        subtitle: body.subtitle,
        stat_value: body.stat_value,
        stat_subtext: body.stat_subtext,
        what_we_did: body.what_we_did,
        industry: body.industry,
        duration: body.duration,
        team_size: body.team_size,
        tech_stack: body.tech_stack,
        features: body.features,
        gallery_images: body.gallery_images,
        website_url: body.website_url,
        logo_url: body.logo_url,
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

// DELETE /api/partner-products
export async function deletePartnerProductHandler(req: NextRequest) {
  if (!await authenticate(req)) return unauthorized();
  if (!supabaseAdmin) return noDb();

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ status: 'error', message: 'id is required' }, { status: 400 });

    const { data: existing } = await supabaseAdmin
      .from('partner_products')
      .select('logo_url, gallery_images')
      .eq('id', id)
      .maybeSingle();

    if (existing && existing.logo_url) {
      await deleteProductLogo(existing.logo_url);
    }
    if (existing && Array.isArray(existing.gallery_images)) {
      for (const img of existing.gallery_images) {
        await deleteProductLogo(img);
      }
    }

    const { error } = await supabaseAdmin
      .from('partner_products')
      .delete()
      .eq('id', id);

    if (error) return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
    return NextResponse.json({ status: 'success', message: 'Product deleted successfully' });
  } catch (err: any) {
    return NextResponse.json({ status: 'error', message: err.message }, { status: 500 });
  }
}
