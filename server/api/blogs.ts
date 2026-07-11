import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/server/services/supabase';
import { authenticate } from '@/server/api/team';

// Fallback hardcoded posts (matching components/blogs.tsx defaults)
const DEFAULT_POSTS = [
  { 
    id: "1",
    slug: "future-of-ai-in-product-development", 
    title: "Future of AI in Product Development: Transforming Ideas into Reality", 
    excerpt: "Artificial Intelligence is no longer a distant concept, it is becoming an integral part of modern product development...", 
    content: "Artificial Intelligence is no longer a distant concept; it is becoming an integral part of modern product development. By leveraging advanced machine learning models and automated design tools, product managers and software engineers are now able to prototype, validate, and launch products at a fraction of the historical cost.",
    image_url: "https://api.builder.io/api/v1/image/assets/TEMP/619d6de9e020646158e731d3e6eddcb9e4853c43?width=866", 
    category: "Design", 
    author: "Ahmed Faraz", 
    read_time: "4 min read", 
    published_at: "2025-03-12T00:00:00Z"
  },
  { 
    id: "2",
    slug: "building-successful-mvp-guide", 
    title: "Building Successful MVP: A Complete Guide for Entrepreneurs", 
    excerpt: "Every successful product begins with a strong foundation, and for entrepreneurs, that foundation is the Minimum Viable Product...", 
    content: "Every successful product begins with a strong foundation, and for entrepreneurs, that foundation is the Minimum Viable Product (MVP). An MVP allows startup teams to validate their assumptions with real users in the shortest possible timeframe.",
    image_url: "https://api.builder.io/api/v1/image/assets/TEMP/c49c2c58d2b35635745b449e356e1f4aa7aa81ae?width=768", 
    category: "Startups", 
    author: "Moin Khan", 
    read_time: "3 min read", 
    published_at: "2025-03-10T00:00:00Z"
  },
  { 
    id: "3",
    slug: "digital-transformation-strategies", 
    title: "Digital Transformation Strategies for Modern Businesses", 
    excerpt: "Digital transformation is no longer an optional choice for modern businesses. It has become a necessary strategy to...", 
    content: "Digital transformation is no longer an optional choice for modern businesses. It has become a necessary strategy to remain competitive in today's fast-paced digital ecosystem. Successful transformation requires alignment across leadership, culture, and technology.",
    image_url: "https://api.builder.io/api/v1/image/assets/TEMP/661b1b9a40356d182f77b3eda1d92ba86a07c3c7?width=768", 
    category: "Development", 
    author: "Karthik Raja", 
    read_time: "3 min read", 
    published_at: "2025-03-05T00:00:00Z"
  },
  { 
    id: "4",
    slug: "user-experience-design-products", 
    title: "User Experience Design: Creating Products People Love", 
    excerpt: "User Experience design, often called UX design, focuses on creating products that are intuitive, enjoyable, and valuable...", 
    content: "User Experience design, often called UX design, focuses on creating products that are intuitive, enjoyable, and valuable for customers. Excellent UX starts by understanding your users' goals, behaviors, and pain points.",
    image_url: "https://api.builder.io/api/v1/image/assets/TEMP/b317b178070cf76a148f098ad009af443a72f32e?width=768", 
    category: "Business", 
    author: "Tulasi Divya", 
    read_time: "3 min read", 
    published_at: "2025-03-03T00:00:00Z"
  },
  { 
    id: "5",
    slug: "startup-funding-investment-landscape", 
    title: "Startup Funding: Navigating the Investment Landscape", 
    excerpt: "Essential security measures every development team should implement when building cloud-native applications.", 
    content: "Navigating the startup investment landscape can be a daunting process for founders. From bootstrapping and angel investors to venture capital and growth equity, understanding your options is critical.",
    image_url: "https://api.builder.io/api/v1/image/assets/TEMP/8e0f215cea43f513ca89c4fc651c0667f92b228c?width=768", 
    category: "Technology", 
    author: "Swathi", 
    read_time: "3 min read", 
    published_at: "2025-02-28T00:00:00Z"
  },
  { 
    id: "6",
    slug: "agile-development-methodologies", 
    title: "Agile Development Methodologies for Tech Teams", 
    excerpt: "Agile development has transformed the way tech teams plan, build, and deliver products. It emphasizes adaptability", 
    content: "Agile development has transformed the way modern engineering teams plan, build, and deliver products. By focusing on iterative releases, continuous collaboration, and feedback loops, teams can pivot quickly based on user feedback.",
    image_url: "https://api.builder.io/api/v1/image/assets/TEMP/42a1d7cbfe01347873491457c61af7fb2ef15e02?width=768", 
    category: "Startups", 
    author: "Vinitha", 
    read_time: "3 min read", 
    published_at: "2025-02-25T00:00:00Z"
  },
  { 
    id: "7",
    slug: "cloud-computing-business-infrastructure", 
    title: "Cloud Computing: Transforming Business Infrastructure", 
    excerpt: "Cloud computing has revolutionized the way businesses manage and scale their operations. It offers a flexible and cost...", 
    content: "Cloud computing has revolutionized the way businesses manage and scale their operations. By offloading infrastructure to platforms like AWS, Google Cloud, or Microsoft Azure, companies can deploy global applications in seconds.",
    image_url: "https://api.builder.io/api/v1/image/assets/TEMP/c430a08b59ba8f33dedaeae5575ebe15a7c1787c?width=720", 
    category: "Technology", 
    author: "Satheesh", 
    read_time: "3 min read", 
    published_at: "2025-03-01T00:00:00Z"
  },
  { 
    id: "8",
    slug: "data-driven-decision-making", 
    title: "Data-Driven Decision Making in Modern Business", 
    excerpt: "Data-driven decision making has become an essential approach in today's competitive business world. Organizations", 
    content: "Data-driven decision making has become an essential approach in today's competitive business world. Organizations that leverage analytics are far more likely to capture new customers and retain existing ones.",
    image_url: "https://api.builder.io/api/v1/image/assets/TEMP/1927313e9ac85e2b461af51eaed19e7daf76ce2d?width=768", 
    category: "Business", 
    author: "Mythrehe", 
    read_time: "3 min read", 
    published_at: "2025-02-28T00:00:00Z"
  }
];

function unauthorized() {
  return NextResponse.json({ status: 'error', message: 'Unauthorized' }, { status: 401 });
}

function noDb() {
  return NextResponse.json({ status: 'error', message: 'Database not configured' }, { status: 503 });
}

// Helper to delete blog cover from blogs storage bucket
async function deleteBlogCoverImage(imageUrl: string | null | undefined) {
  if (!imageUrl || !supabaseAdmin || !imageUrl.includes('/storage/v1/object/public/blogs/')) return;
  try {
    const filename = imageUrl.split('/').pop();
    if (filename) {
      const { error } = await supabaseAdmin.storage.from('blogs').remove([filename]);
      if (error) console.error('Failed to remove storage file:', error.message);
    }
  } catch (err) {
    console.error('Failed to clean up blog image:', err);
  }
}

// GET /api/blogs
export async function getBlogsHandler(req: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ status: 'success', payload: DEFAULT_POSTS });
    }

    const { searchParams } = new URL(req.url);
    const slug = searchParams.get('slug');

    if (slug) {
      const { data, error } = await supabaseAdmin
        .from('blogs')
        .select('*, author_details:blog_authors(*)')
        .eq('slug', slug)
        .maybeSingle();

      if (error) return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
      if (!data) return NextResponse.json({ status: 'error', message: 'Blog not found' }, { status: 404 });
      return NextResponse.json({ status: 'success', payload: data });
    }

    const { data, error } = await supabaseAdmin
      .from('blogs')
      .select('*, author_details:blog_authors(*)')
      .order('published_at', { ascending: false });

    if (error) {
      console.error('Error fetching blogs:', error);
      return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
    }

    return NextResponse.json({ status: 'success', payload: data || [] });
  } catch (err: any) {
    return NextResponse.json({ status: 'error', message: err.message }, { status: 500 });
  }
}

// POST /api/blogs
export async function createBlogHandler(req: NextRequest) {
  if (!await authenticate(req)) return unauthorized();
  if (!supabaseAdmin) return noDb();

  try {
    const body = await req.json();

    if (!body.slug || !body.title || !body.excerpt || !body.content) {
      return NextResponse.json(
        { status: 'error', message: 'slug, title, excerpt, and content are required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from('blogs')
      .insert({
        slug: body.slug,
        title: body.title,
        excerpt: body.excerpt,
        content: body.content,
        image_url: body.image_url || null,
        category: body.category || 'Technology',
        author: body.author || 'CrestCode Team',
        author_id: body.author_id || null,
        read_time: body.read_time || null,
        published_at: body.published_at || new Date().toISOString()
      })
      .select('*, author_details:blog_authors(*)')
      .single();

    if (error) return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
    return NextResponse.json({ status: 'success', payload: data }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ status: 'error', message: err.message }, { status: 500 });
  }
}

// PUT /api/blogs
export async function updateBlogHandler(req: NextRequest) {
  if (!await authenticate(req)) return unauthorized();
  if (!supabaseAdmin) return noDb();

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ status: 'error', message: 'id is required' }, { status: 400 });

    const body = await req.json();

    // Fetch existing post to check for image replacement
    const { data: existing } = await supabaseAdmin
      .from('blogs')
      .select('image_url')
      .eq('id', id)
      .maybeSingle();

    if (existing && existing.image_url && existing.image_url !== body.image_url) {
      await deleteBlogCoverImage(existing.image_url);
    }

    const { data, error } = await supabaseAdmin
      .from('blogs')
      .update({
        slug: body.slug,
        title: body.title,
        excerpt: body.excerpt,
        content: body.content,
        image_url: body.image_url,
        category: body.category,
        author: body.author,
        author_id: body.author_id,
        read_time: body.read_time,
        published_at: body.published_at
      })
      .eq('id', id)
      .select('*, author_details:blog_authors(*)')
      .single();

    if (error) return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
    return NextResponse.json({ status: 'success', payload: data });
  } catch (err: any) {
    return NextResponse.json({ status: 'error', message: err.message }, { status: 500 });
  }
}

// DELETE /api/blogs
export async function deleteBlogHandler(req: NextRequest) {
  if (!await authenticate(req)) return unauthorized();
  if (!supabaseAdmin) return noDb();

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ status: 'error', message: 'id is required' }, { status: 400 });

    // Fetch existing to clean cover image
    const { data: existing } = await supabaseAdmin
      .from('blogs')
      .select('image_url')
      .eq('id', id)
      .maybeSingle();

    if (existing && existing.image_url) {
      await deleteBlogCoverImage(existing.image_url);
    }

    const { error } = await supabaseAdmin
      .from('blogs')
      .delete()
      .eq('id', id);

    if (error) return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
    return NextResponse.json({ status: 'success', message: 'Blog deleted successfully' });
  } catch (err: any) {
    return NextResponse.json({ status: 'error', message: err.message }, { status: 500 });
  }
}
