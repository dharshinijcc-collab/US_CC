-- ============================================================
-- Blogs Table Migration & Seeding
-- Run this in your Supabase SQL Editor
-- ============================================================

CREATE TABLE IF NOT EXISTS public.blogs (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug            text NOT NULL UNIQUE,
  title           text NOT NULL,
  excerpt         text NOT NULL,
  content         text NOT NULL,
  image_url       text,
  category        text NOT NULL DEFAULT 'Technology',
  author          text NOT NULL,
  read_time       text NOT NULL DEFAULT '3 min read',
  published_at    timestamptz NOT NULL DEFAULT now(),
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

-- Auto-update updated_at on every row change
CREATE OR REPLACE FUNCTION public.handle_blogs_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  new.updated_at = now();
  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS set_blogs_updated_at ON public.blogs;
CREATE TRIGGER set_blogs_updated_at
  BEFORE UPDATE ON public.blogs
  FOR EACH ROW EXECUTE FUNCTION public.handle_blogs_updated_at();

-- Row Level Security
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;

-- Public: anyone can read blogs
DROP POLICY IF EXISTS "Public can read blogs" ON public.blogs;
CREATE POLICY "Public can read blogs"
  ON public.blogs FOR SELECT
  USING (true);

-- Service role full access
DROP POLICY IF EXISTS "Service role full access for blogs" ON public.blogs;
CREATE POLICY "Service role full access for blogs"
  ON public.blogs FOR ALL
  USING (true)
  WITH CHECK (true);

-- Seed initial blogs (from BLOG_CONFIG.posts)
INSERT INTO public.blogs (slug, title, excerpt, content, image_url, category, author, read_time)
VALUES
  (
    'future-of-ai-in-product-development',
    'Future of AI in Product Development: Transforming Ideas into Reality',
    'Artificial Intelligence is no longer a distant concept, it is becoming an integral part of modern product development...',
    'Artificial Intelligence is no longer a distant concept; it is becoming an integral part of modern product development. By leveraging advanced machine learning models and automated design tools, product managers and software engineers are now able to prototype, validate, and launch products at a fraction of the historical cost. This article dives deep into the emerging trends, benefits, and practical tools shaping the future of product creation.',
    'https://api.builder.io/api/v1/image/assets/TEMP/619d6de9e020646158e731d3e6eddcb9e4853c43?width=866',
    'Design',
    'Ahmed Faraz',
    '4 min read'
  ),
  (
    'building-successful-mvp-guide',
    'Building Successful MVP: A Complete Guide for Entrepreneurs',
    'Every successful product begins with a strong foundation, and for entrepreneurs, that foundation is the Minimum Viable Product...',
    'Every successful product begins with a strong foundation, and for entrepreneurs, that foundation is the Minimum Viable Product (MVP). An MVP allows startup teams to validate their assumptions with real users in the shortest possible timeframe. In this guide, we outline the exact steps to define your core value proposition, prioritize features, build lean prototypes, and gather actionable feedback to guide your scaling strategy.',
    'https://api.builder.io/api/v1/image/assets/TEMP/c49c2c58d2b35635745b449e356e1f4aa7aa81ae?width=768',
    'Startups',
    'Moin Khan',
    '3 min read'
  ),
  (
    'digital-transformation-strategies',
    'Digital Transformation Strategies for Modern Businesses',
    'Digital transformation is no longer an optional choice for modern businesses. It has become a necessary strategy to...',
    'Digital transformation is no longer an optional choice for modern businesses. It has become a necessary strategy to remain competitive in today''s fast-paced digital ecosystem. Successful transformation requires alignment across leadership, culture, and technology. This article shares key framework strategies, successful case studies, and common pitfalls to avoid when digitizing legacy operations.',
    'https://api.builder.io/api/v1/image/assets/TEMP/661b1b9a40356d182f77b3eda1d92ba86a07c3c7?width=768',
    'Development',
    'Karthik Raja',
    '3 min read'
  ),
  (
    'user-experience-design-products',
    'User Experience Design: Creating Products People Love',
    'User Experience design, often called UX design, focuses on creating products that are intuitive, enjoyable, and valuable...',
    'User Experience design, often called UX design, focuses on creating products that are intuitive, enjoyable, and valuable for customers. Excellent UX starts by understanding your users'' goals, behaviors, and pain points. In this piece, we explore the principles of user-centered design, the role of rapid wireframing and interactive prototypes, and how to conduct effective usability tests.',
    'https://api.builder.io/api/v1/image/assets/TEMP/b317b178070cf76a148f098ad009af443a72f32e?width=768',
    'Business',
    'Tulasi Divya',
    '3 min read'
  ),
  (
    'startup-funding-investment-landscape',
    'Startup Funding: Navigating the Investment Landscape',
    'Essential security measures every development team should implement when building cloud-native applications.',
    'Navigating the startup investment landscape can be a daunting process for founders. From bootstrapping and angel investors to venture capital and growth equity, understanding your options is critical. We discuss how to prepare your pitch deck, calculate valuations, negotiate terms, and find the right capital partners that align with your long-term vision.',
    'https://api.builder.io/api/v1/image/assets/TEMP/8e0f215cea43f513ca89c4fc651c0667f92b228c?width=768',
    'Technology',
    'Swathi',
    '3 min read'
  ),
  (
    'agile-development-methodologies-tech',
    'Agile Development Methodologies for Tech Teams',
    'Agile development has transformed the way tech teams plan, build, and deliver products. It emphasizes adaptability',
    'Agile development has transformed the way modern engineering teams plan, build, and deliver products. By focusing on iterative releases, continuous collaboration, and feedback loops, teams can pivot quickly based on user feedback. This post outlines Scrum and Kanban practices, sprint planning secrets, and tips for maintaining high velocity.',
    'https://api.builder.io/api/v1/image/assets/TEMP/42a1d7cbfe01347873491457c61af7fb2ef15e02?width=768',
    'Startups',
    'Vinitha',
    '3 min read'
  ),
  (
    'cloud-computing-business-infrastructure',
    'Cloud Computing: Transforming Business Infrastructure',
    'Cloud computing has revolutionized the way businesses manage and scale their operations. It offers a flexible and cost...',
    'Cloud computing has revolutionized the way businesses manage and scale their operations. By offloading infrastructure to platforms like AWS, Google Cloud, or Microsoft Azure, companies can deploy global applications in seconds. We explore containerization, serverless architectures, and strategies to optimize your cloud costs.',
    'https://api.builder.io/api/v1/image/assets/TEMP/c430a08b59ba8f33dedaeae5575ebe15a7c1787c?width=720',
    'Technology',
    'Satheesh',
    '3 min read'
  ),
  (
    'data-driven-decision-making',
    'Data-Driven Decision Making in Modern Business',
    'Data-driven decision making has become an essential approach in today''s competitive business world. Organizations',
    'Data-driven decision making has become an essential approach in today''s competitive business world. Organizations that leverage analytics are far more likely to capture new customers and retain existing ones. We discuss how to establish key metrics, build custom analytics pipelines, and foster a data-first culture inside your startup.',
    'https://api.builder.io/api/v1/image/assets/TEMP/1927313e9ac85e2b461af51eaed19e7daf76ce2d?width=768',
    'Business',
    'Mythrehe',
    '3 min read'
  )
ON CONFLICT (slug) DO NOTHING;
